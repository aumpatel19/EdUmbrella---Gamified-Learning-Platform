import { supabase } from './supabaseClient';

class ApiService {

  // ============ AUTH ============

  async loginStudent(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    // Verify role is student
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, role, name, class')
      .eq('email', email)
      .eq('role', 'student')
      .single();

    if (profileError || !profile) throw new Error('Student account not found');
    return { message: 'Login successful', user: { id: profile.id, username: profile.email, name: profile.name, class: profile.class } };
  }

  async loginTeacher(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, role, name, class')
      .eq('email', email)
      .eq('role', 'teacher')
      .single();

    if (profileError || !profile) throw new Error('Teacher account not found');
    return { message: 'Login successful', user: { id: profile.id, username: profile.email, name: profile.name, class: profile.class } };
  }

  async signUp(email, password, name, role, studentClass) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, class: studentClass || '' },
      },
    });
    if (error) throw new Error(error.message);

    // The trigger creates the users row; update it with full details
    const authId = data.user?.id;
    if (authId) {
      const { error: upsertError } = await supabase.from('users').upsert({
        auth_id: authId,
        email,
        name,
        role,
        class: studentClass || '',
      }, { onConflict: 'email' });
      if (upsertError) {
        console.error('Failed to create user profile:', upsertError.message);
        // Don't throw — the auth account exists and the DB trigger may still
        // create the row asynchronously. Surface a warning instead.
        return { message: 'Account created (profile sync pending)', user: { name, email, role, class: studentClass }, profileSyncWarning: upsertError.message };
      }
    }
    return { message: 'Account created!', user: { name, email, role, class: studentClass } };
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  // ============ SUBJECTS ============

  async getSubjectsByClass(classLevel) {
    const { data, error } = await supabase
      .from('class_level_subjects')
      .select('display_order, subjects(id, name, description, icon, color)')
      .eq('class_level', classLevel)
      .order('display_order');
    if (error) throw new Error(error.message);
    return { subjects: data.map(r => r.subjects) };
  }

  async getLectures(classLevel, subjectId = null) {
    let query = supabase
      .from('lectures')
      .select('id, title, description, chapter_number, duration_minutes, display_order, subject_id, subjects(name, icon, color)')
      .eq('class_level', classLevel)
      .eq('is_active', true)
      .order('display_order');
    if (subjectId) query = query.eq('subject_id', subjectId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return { lectures: data };
  }

  async getLecturesBySubject(subjectId, classLevel) {
    const { data, error } = await supabase
      .from('lectures')
      .select('id, title, description, chapter_number, duration_minutes, display_order, subject_id, thumbnail_url, subjects(name, icon, color), lecture_videos(id, language, youtube_video_id, video_url, subtitle_urls, is_default)')
      .eq('subject_id', subjectId)
      .eq('class_level', classLevel)
      .eq('is_active', true)
      .order('display_order');
    if (error) throw new Error(error.message);
    return { lectures: data };
  }

  async markLectureWatched(lectureId, studentEmail) {
    const { data: student } = await supabase
      .from('users').select('id').eq('email', studentEmail).eq('role', 'student').single();
    if (!student) throw new Error('Student not found');

    const { error } = await supabase
      .from('student_lecture_progress')
      .upsert({ student_id: student.id, lecture_id: lectureId, completed: true, last_watched_at: new Date().toISOString() },
        { onConflict: 'student_id,lecture_id' });
    if (error) throw new Error(error.message);

    await this.awardXP(studentEmail, 'lecture', String(lectureId), 10);
    return { message: 'Lecture marked as watched' };
  }

  async getLectureProgress(studentEmail) {
    const { data: student } = await supabase
      .from('users').select('id').eq('email', studentEmail).eq('role', 'student').single();
    if (!student) return { completedIds: [] };

    const { data } = await supabase
      .from('student_lecture_progress')
      .select('lecture_id')
      .eq('student_id', student.id)
      .eq('completed', true);
    return { completedIds: (data || []).map(r => r.lecture_id) };
  }

  async getLectureCount(classLevel, subjectId) {
    const { count, error } = await supabase
      .from('lectures')
      .select('id', { count: 'exact', head: true })
      .eq('class_level', classLevel)
      .eq('subject_id', subjectId)
      .eq('is_active', true);
    if (error) return 0;
    return count || 0;
  }

  async getSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');
    if (error) throw new Error(error.message);
    return { subjects: data };
  }

  // ============ QUIZ CATEGORIES ============

  async getQuizCategories() {
    const { data, error } = await supabase
      .from('quiz_categories')
      .select('*, subjects(name, icon)')
      .order('name');
    if (error) throw new Error(error.message);
    return { categories: data.map(c => ({ ...c, subject_name: c.subjects?.name, subject_icon: c.subjects?.icon })) };
  }

  // ============ QUIZZES ============

  async getQuizzes(filters = {}) {
    let query = supabase
      .from('quizzes')
      .select(`
        *,
        subjects(name, icon, color),
        quiz_categories(name, icon),
        users(name)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters.subject_id) query = query.eq('subject_id', filters.subject_id);
    if (filters.category_id) query = query.eq('category_id', filters.category_id);
    if (filters.type && filters.type !== 'all') query = query.eq('quiz_type', filters.type);
    if (filters.class_level) query = query.eq('class_level', filters.class_level);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return {
      quizzes: data.map(q => ({
        ...q,
        subject_name: q.subjects?.name,
        subject_icon: q.subjects?.icon,
        subject_color: q.subjects?.color,
        category_name: q.quiz_categories?.name,
        category_icon: q.quiz_categories?.icon,
        teacher_name: q.users?.name,
      }))
    };
  }

  async getQuizDetails(quizId) {
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*, subjects(name, icon)')
      .eq('id', quizId)
      .eq('is_active', true)
      .single();
    if (quizError) throw new Error(quizError.message);

    const { data: questions, error: qError } = await supabase
      .from('quiz_questions')
      .select('id, question_text, question_type, correct_answer, options, explanation, points, order_index')
      .eq('quiz_id', quizId)
      .order('order_index');
    if (qError) throw new Error(qError.message);

    return {
      quiz: { ...quiz, subject_name: quiz.subjects?.name, subject_icon: quiz.subjects?.icon },
      questions
    };
  }

  // ============ QUIZ ATTEMPTS ============

  async getStudentProgress(email) {
    const { data: student, error: sError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .eq('role', 'student')
      .single();
    if (sError || !student) throw new Error('Student not found');

    const studentId = student.id;

    // Overall stats
    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('score, is_completed, time_spent_minutes')
      .eq('student_id', studentId);

    const completed = attempts?.filter(a => a.is_completed) || [];
    const overall_stats = {
      total_attempts: attempts?.length || 0,
      completed_quizzes: completed.length,
      average_score: completed.length ? completed.reduce((s, a) => s + Number(a.score), 0) / completed.length : 0,
      best_score: completed.length ? Math.max(...completed.map(a => Number(a.score))) : 0,
      total_time_spent: attempts?.reduce((s, a) => s + (a.time_spent_minutes || 0), 0) || 0,
    };

    // Subject progress
    const { data: subjects } = await supabase.from('subjects').select('*').order('name');
    const subject_progress = await Promise.all((subjects || []).map(async s => {
      const { data: quizzes } = await supabase.from('quizzes').select('id').eq('subject_id', s.id);
      const quizIds = quizzes?.map(q => q.id) || [];
      const { data: subAttempts } = quizIds.length
        ? await supabase.from('quiz_attempts').select('score, is_completed').eq('student_id', studentId).in('quiz_id', quizIds)
        : { data: [] };
      const subCompleted = subAttempts?.filter(a => a.is_completed) || [];
      return {
        ...s,
        total_quizzes: subAttempts?.length || 0,
        completed: subCompleted.length,
        average_score: subCompleted.length ? subCompleted.reduce((sum, a) => sum + Number(a.score), 0) / subCompleted.length : 0,
        best_score: subCompleted.length ? Math.max(...subCompleted.map(a => Number(a.score))) : 0,
      };
    }));

    // Recent attempts
    const { data: recent } = await supabase
      .from('quiz_attempts')
      .select('*, quizzes(title, difficulty, subjects(name, icon))')
      .eq('student_id', studentId)
      .eq('is_completed', true)
      .order('completed_at', { ascending: false })
      .limit(5);

    const recent_attempts = (recent || []).map(a => ({
      ...a,
      title: a.quizzes?.title,
      difficulty: a.quizzes?.difficulty,
      subject_name: a.quizzes?.subjects?.name,
      subject_icon: a.quizzes?.subjects?.icon,
    }));

    return { overall_stats, subject_progress, recent_attempts };
  }

  async startQuiz(quizId, studentEmail) {
    const { data: student } = await supabase
      .from('users').select('id').eq('email', studentEmail).eq('role', 'student').single();
    if (!student) throw new Error('Student not found');

    const { data: quiz } = await supabase
      .from('quizzes').select('total_questions, duration_minutes').eq('id', quizId).eq('is_active', true).single();
    if (!quiz) throw new Error('Quiz not found');

    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert({ quiz_id: quizId, student_id: student.id, total_questions: quiz.total_questions, started_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(error.message);

    return { attempt_id: attempt.id, message: 'Quiz started successfully', duration_minutes: quiz.duration_minutes };
  }

  async submitQuiz(attemptId, answers, timeSpentMinutes) {
    const { data: attempt } = await supabase
      .from('quiz_attempts').select('quiz_id, is_completed').eq('id', attemptId).single();
    if (!attempt) throw new Error('Attempt not found');
    if (attempt.is_completed) throw new Error('Quiz already submitted');

    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('id, correct_answer, points')
      .eq('quiz_id', attempt.quiz_id)
      .order('order_index');

    const totalPoints = questions.reduce((s, q) => s + q.points, 0);
    let earnedPoints = 0, correctAnswers = 0;
    for (const q of questions) {
      if (answers[String(q.id)] === q.correct_answer) {
        earnedPoints += q.points;
        correctAnswers++;
      }
    }
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 10000) / 100 : 0;

    const { data: updatedAttempt, error } = await supabase.from('quiz_attempts').update({
      score,
      correct_answers: correctAnswers,
      time_spent_minutes: timeSpentMinutes,
      completed_at: new Date().toISOString(),
      is_completed: true,
      answers,
    }).eq('id', attemptId).select('student_id, quizzes(difficulty)').single();
    if (error) throw new Error(error.message);

    // Award XP if passed (score >= 60%)
    if (score >= 60) {
      const { data: studentRow } = await supabase
        .from('users').select('email').eq('id', updatedAttempt.student_id).single();
      if (studentRow?.email) {
        const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[updatedAttempt.quizzes?.difficulty] || 1;
        const xpAmount = Math.round(50 * difficultyMultiplier);
        await this.awardXP(studentRow.email, 'quiz', String(attempt.quiz_id), xpAmount);
      }
    }

    return { score, correct_answers: correctAnswers, total_questions: questions.length, message: 'Quiz submitted successfully' };
  }

  // ============ GAMES ============

  async saveGameScore(studentEmail, gameName, scoreData) {
    const { data: student } = await supabase
      .from('users').select('id').eq('email', studentEmail).eq('role', 'student').single();
    if (!student) throw new Error('Student not found');

    // Lookup class_level and subject from quizzes table instead of hardcoded map
    const { data: gameQuiz } = await supabase
      .from('quizzes')
      .select('class_level, subjects(name)')
      .eq('game_component', gameName)
      .eq('quiz_type', 'game')
      .limit(1)
      .maybeSingle();

    const classLevel = gameQuiz?.class_level || null;
    const subjectName = gameQuiz?.subjects?.name || 'General';

    const { error } = await supabase.from('game_scores').insert({
      student_id: student.id,
      game_name: gameName,
      class_level: classLevel,
      subject_name: subjectName,
      score: scoreData.score || 0,
      level_reached: scoreData.level_reached || 1,
      time_played_minutes: scoreData.time_played_minutes || 0,
      completed: scoreData.completed || false,
      game_data: scoreData.game_data || {},
    });
    if (error) throw new Error(error.message);

    if (scoreData.completed) {
      await this.awardXP(studentEmail, 'game', gameName, 30);
    }

    return { message: 'Game score saved successfully', class_level: classLevel, subject: subjectName };
  }

  async getGameLeaderboard(gameName) {
    const { data, error } = await supabase
      .from('game_scores')
      .select('score, level_reached, time_played_minutes, played_at, users(name, email)')
      .eq('game_name', gameName)
      .order('score', { ascending: false })
      .order('level_reached', { ascending: false })
      .limit(10);
    if (error) throw new Error(error.message);

    return {
      leaderboard: data.map(e => ({
        score: e.score,
        level_reached: e.level_reached,
        time_played_minutes: e.time_played_minutes,
        played_at: e.played_at,
        student_name: e.users?.name,
        email: e.users?.email,
      }))
    };
  }

  // ============ DASHBOARDS ============

  async getStudentDashboard(email, fallbackClass = null) {
    const { data: student, error: studentError } = await supabase
      .from('users').select('id, name, email, class').eq('email', email).eq('role', 'student').maybeSingle();

    // New accounts may not have a users row yet (trigger pending or RLS blocked upsert).
    // Still load real subject/content data using the class we know from signup.
    if (studentError || !student) {
      console.warn('getStudentDashboard: user row not found for', email, studentError?.message);
      const cls = fallbackClass ? parseInt(fallbackClass) : null;

      // Load class content so quizzes/games tabs work
      let quizQuery = supabase
        .from('quizzes')
        .select('*, subjects(name, icon, color), quiz_categories(name, icon)')
        .eq('is_active', true);
      if (cls) quizQuery = quizQuery.eq('class_level', cls);
      const { data: classContent } = await quizQuery.order('quiz_type').order('title');

      const organized_content = {};
      for (const item of (classContent || [])) {
        const lvl = item.class_level;
        const sub = item.subjects?.name || 'General';
        if (!organized_content[lvl]) organized_content[lvl] = {};
        if (!organized_content[lvl][sub]) organized_content[lvl][sub] = { games: [], quizzes: [] };
        const mapped = { ...item, subject_name: sub, subject_icon: item.subjects?.icon, subject_color: item.subjects?.color, category_name: item.quiz_categories?.name };
        if (item.quiz_type === 'game') organized_content[lvl][sub].games.push(mapped);
        else organized_content[lvl][sub].quizzes.push(mapped);
      }

      // Load subjects with zero progress
      const { data: subjects } = await supabase.from('subjects').select('*').order('name');
      const subject_progress = await Promise.all((subjects || []).map(async s => {
        let q = supabase.from('quizzes').select('id').eq('subject_id', s.id).eq('is_active', true);
        if (cls) q = q.eq('class_level', cls);
        const { data: subQuizzes } = await q;
        const ids = subQuizzes?.map(q => q.id) || [];
        return {
          name: s.name, icon: s.icon, color: s.color,
          total_content: ids.length,
          completed_content: 0,
          average_score: 0,
        };
      }));

      return {
        student: { name: '', email, class: fallbackClass },
        overall_stats: { total_quiz_attempts: 0, completed_quizzes: 0, average_score: 0, best_score: 0, total_time_spent: 0 },
        organized_content,
        recent_activity: [],
        subject_progress,
        isNewAccount: true,
      };
    }

    const studentId = student.id;
    const studentClass = student.class ? parseInt(student.class) : null;

    // Overall stats
    const { data: attempts } = await supabase
      .from('quiz_attempts').select('score, is_completed, time_spent_minutes').eq('student_id', studentId);
    const completed = attempts?.filter(a => a.is_completed) || [];
    const overall_stats = {
      total_quiz_attempts: attempts?.length || 0,
      completed_quizzes: completed.length,
      average_score: completed.length ? completed.reduce((s, a) => s + Number(a.score), 0) / completed.length : 0,
      best_score: completed.length ? Math.max(...completed.map(a => Number(a.score))) : 0,
      total_time_spent: attempts?.reduce((s, a) => s + (a.time_spent_minutes || 0), 0) || 0,
    };

    // Class content
    let quizQuery = supabase
      .from('quizzes')
      .select('*, subjects(name, icon, color), quiz_categories(name, icon)')
      .eq('is_active', true);
    if (studentClass) quizQuery = quizQuery.eq('class_level', studentClass);
    const { data: classContent } = await quizQuery.order('quiz_type').order('title');

    // Organize by class level & subject
    const organized_content = {};
    for (const item of (classContent || [])) {
      const lvl = item.class_level;
      const sub = item.subjects?.name || 'General';
      if (!organized_content[lvl]) organized_content[lvl] = {};
      if (!organized_content[lvl][sub]) organized_content[lvl][sub] = { games: [], quizzes: [] };
      const mapped = { ...item, subject_name: sub, subject_icon: item.subjects?.icon, subject_color: item.subjects?.color, category_name: item.quiz_categories?.name };
      if (item.quiz_type === 'game') organized_content[lvl][sub].games.push(mapped);
      else organized_content[lvl][sub].quizzes.push(mapped);
    }

    // Recent activity
    const { data: recentQuizzes } = await supabase
      .from('quiz_attempts')
      .select('score, completed_at, quizzes(title, class_level, subjects(name, icon))')
      .eq('student_id', studentId).eq('is_completed', true)
      .order('completed_at', { ascending: false }).limit(5);

    const { data: recentGames } = await supabase
      .from('game_scores')
      .select('score, played_at, game_name, class_level, subject_name')
      .eq('student_id', studentId)
      .order('played_at', { ascending: false }).limit(5);

    const recent_activity = [
      ...(recentQuizzes || []).map(a => ({
        activity_type: 'quiz', score: a.score, activity_date: a.completed_at,
        activity_name: a.quizzes?.title, subject_name: a.quizzes?.subjects?.name,
        subject_icon: a.quizzes?.subjects?.icon, class_level: a.quizzes?.class_level
      })),
      ...(recentGames || []).map(g => ({
        activity_type: 'game', score: g.score, activity_date: g.played_at,
        activity_name: g.game_name, subject_name: g.subject_name,
        subject_icon: 'game', class_level: g.class_level
      }))
    ].sort((a, b) => new Date(b.activity_date) - new Date(a.activity_date)).slice(0, 10);

    // Subject progress
    const { data: subjects } = await supabase.from('subjects').select('*').order('name');
    const subject_progress = await Promise.all((subjects || []).map(async s => {
      let q = supabase.from('quizzes').select('id').eq('subject_id', s.id).eq('is_active', true);
      if (studentClass) q = q.eq('class_level', studentClass);
      const { data: subQuizzes } = await q;
      const ids = subQuizzes?.map(q => q.id) || [];
      const { data: subAttempts } = ids.length
        ? await supabase.from('quiz_attempts').select('score, is_completed').eq('student_id', studentId).in('quiz_id', ids)
        : { data: [] };
      const subComp = subAttempts?.filter(a => a.is_completed) || [];
      return {
        name: s.name, icon: s.icon, color: s.color,
        total_content: ids.length,
        completed_content: subComp.length,
        average_score: subComp.length ? subComp.reduce((sum, a) => sum + Number(a.score), 0) / subComp.length : 0,
      };
    }));

    return { student, overall_stats, organized_content, recent_activity, subject_progress };
  }

  // ============ LEADERBOARD ============

  async getLeaderboard(currentUser = null) {
    const { data: allUsers } = await supabase
      .from('users')
      .select('id, name, email, class, xp_points, level, current_streak')
      .eq('role', 'student')
      .order('xp_points', { ascending: false });

    const { data: quizAgg } = await supabase
      .from('quiz_attempts')
      .select('student_id, score, is_completed')
      .eq('is_completed', true);

    const { data: gameAgg } = await supabase
      .from('game_scores')
      .select('student_id, score');

    const quizMap = {};
    for (const a of (quizAgg || [])) {
      if (!quizMap[a.student_id]) quizMap[a.student_id] = { count: 0 };
      quizMap[a.student_id].count++;
    }
    const gameMap = {};
    for (const g of (gameAgg || [])) {
      if (!gameMap[g.student_id]) gameMap[g.student_id] = { count: 0 };
      gameMap[g.student_id].count++;
    }

    let leaderboard = (allUsers || []).map(u => ({
      id: u.id, name: u.name || u.email, email: u.email, class: u.class,
      total_xp: u.xp_points || 0,
      level: u.level || 1,
      streak: u.current_streak || 0,
      completed_quizzes: quizMap[u.id]?.count || 0,
      completed_games: gameMap[u.id]?.count || 0,
    }));

    // Inject current user if their DB row doesn't exist yet
    if (currentUser?.email && !leaderboard.some(u => u.email === currentUser.email)) {
      leaderboard.push({
        id: `new_${currentUser.email}`, name: currentUser.name || currentUser.email,
        email: currentUser.email, class: currentUser.class || '',
        total_xp: 0, level: 1, streak: 0, completed_quizzes: 0, completed_games: 0,
      });
    }

    return { leaderboard };
  }

  async getTeacherClasses(email) {
    const { data, error } = await supabase
      .from('users').select('class').eq('email', email).eq('role', 'teacher').single();
    if (error) throw new Error(error.message);
    return { classes: data?.class };
  }

  async getTeacherDashboard(email) {
    const { data: teacher } = await supabase
      .from('users').select('id, name, email, class').eq('email', email).eq('role', 'teacher').single();
    if (!teacher) throw new Error('Teacher not found');

    const teacherClasses = teacher.class ? teacher.class.split(',').map(c => c.trim()) : [];

    let studentsQuery = supabase.from('users').select('id, name, email, class').eq('role', 'student');
    if (teacherClasses.length) studentsQuery = studentsQuery.in('class', teacherClasses);
    const { data: students } = await studentsQuery;

    const studentIds = (students || []).map(s => s.id);

    // Student performance
    const student_performance = await Promise.all((students || []).map(async s => {
      const { data: attempts } = await supabase
        .from('quiz_attempts').select('score, is_completed').eq('student_id', s.id).eq('is_completed', true);
      const avg = attempts?.length ? Math.round(attempts.reduce((sum, a) => sum + Number(a.score), 0) / attempts.length) : 0;
      return { student_name: s.name || s.email, email: s.email, class: s.class, completed_quizzes: attempts?.length || 0, average_score: avg };
    }));

    // Quiz stats
    let quizzesQuery = supabase.from('quizzes').select('id, title, class_level, quiz_type, subjects(name)').eq('is_active', true);
    if (teacherClasses.length) quizzesQuery = quizzesQuery.in('class_level', teacherClasses);
    const { data: quizzes } = await quizzesQuery;

    const quiz_statistics = await Promise.all((quizzes || []).map(async q => {
      const { data: attempts } = await supabase.from('quiz_attempts').select('score, is_completed').eq('quiz_id', q.id);
      const completed = attempts?.filter(a => a.is_completed) || [];
      const avg = completed.length ? Math.round(completed.reduce((s, a) => s + Number(a.score), 0) / completed.length) : 0;
      return { title: q.title, subject_name: q.subjects?.name, class_level: q.class_level, quiz_type: q.quiz_type, total_attempts: attempts?.length || 0, completed_attempts: completed.length, average_score: avg };
    }));

    // Game performance
    let gameQuery = supabase.from('game_scores').select('game_name, class_level, subject_name, score, completed');
    if (studentIds.length) gameQuery = gameQuery.in('student_id', studentIds);
    const { data: gameScores } = await gameQuery;

    const gameMap = {};
    for (const g of (gameScores || [])) {
      const key = `${g.game_name}-${g.class_level}`;
      if (!gameMap[key]) gameMap[key] = { game_name: g.game_name, class_level: g.class_level, subject_name: g.subject_name, scores: [], completed: 0 };
      gameMap[key].scores.push(Number(g.score));
      if (g.completed) gameMap[key].completed++;
    }
    const game_performance = Object.values(gameMap).map(g => ({
      game_name: g.game_name, class_level: g.class_level, subject_name: g.subject_name,
      total_plays: g.scores.length, completed_games: g.completed,
      average_score: g.scores.length ? Math.round(g.scores.reduce((a, b) => a + b, 0) / g.scores.length) : 0,
    }));

    return { teacher, students: students || [], classes: teacherClasses, student_performance, quiz_statistics, game_performance };
  }

  // ============ TEACHER QUIZ API (kept for compatibility) ============

  async getTeacherQuizzes() {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, subjects(name), quiz_categories(name)')
      .eq('quiz_type', 'traditional')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return { quizzes: data };
  }

  async getQuizzesBySubject(subject) {
    const { data: subjectRow } = await supabase
      .from('subjects').select('id').eq('name', subject).single();
    if (!subjectRow) return { quizzes: [] };

    const { data, error } = await supabase
      .from('quizzes')
      .select('*, subjects(name), quiz_categories(name)')
      .eq('subject_id', subjectRow.id)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return { quizzes: data };
  }

  async createTeacherQuiz(quizData) {
    const { data, error } = await supabase
      .from('quizzes').insert(quizData).select().single();
    if (error) throw new Error(error.message);
    return { quiz: data };
  }

  async getTeacherQuizById(quizId) {
    const { data, error } = await supabase
      .from('quizzes').select('*, quiz_questions(*)').eq('id', quizId).single();
    if (error) throw new Error(error.message);
    return { quiz: data };
  }

  async updateTeacherQuiz(quizId, quizData) {
    const { data, error } = await supabase
      .from('quizzes').update(quizData).eq('id', quizId).select().single();
    if (error) throw new Error(error.message);
    return { quiz: data };
  }

  async deleteTeacherQuiz(quizId) {
    const { error } = await supabase.from('quizzes').delete().eq('id', quizId);
    if (error) throw new Error(error.message);
    return { message: 'Quiz deleted successfully' };
  }

  async sendQuizToStudents(quizId, studentClass) {
    const { error } = await supabase
      .from('quizzes').update({ class_level: parseInt(studentClass), is_active: true }).eq('id', quizId);
    if (error) throw new Error(error.message);
    return { message: 'Quiz sent to students' };
  }

  async addQuizQuestions(quizId, questions) {
    const rows = questions.map((q, i) => ({
      quiz_id: quizId,
      question_text: q.question_text,
      question_type: q.question_type || 'multiple_choice',
      correct_answer: q.correct_answer,
      options: q.options || [],
      explanation: q.explanation || '',
      points: q.points || 1,
      order_index: i,
    }));
    const { error } = await supabase.from('quiz_questions').insert(rows);
    if (error) throw new Error(error.message);
    return { message: 'Questions added', count: rows.length };
  }

  // ============ GAMIFICATION ============

  async awardXP(userEmail, sourceType, sourceId, baseAmount, multiplier = 1) {
    const xpAwarded = Math.round(baseAmount * multiplier);
    const { data: user } = await supabase
      .from('users').select('id, xp_points, level').eq('email', userEmail).single();
    if (!user) return null;

    const newXP = (user.xp_points || 0) + xpAwarded;
    const newLevel = Math.floor(newXP / 500) + 1;
    const leveledUp = newLevel > (user.level || 1);

    await supabase.from('xp_events').insert({
      user_id: user.id, source_type: sourceType, source_id: sourceId, xp_awarded: xpAwarded,
    });

    await supabase.from('users').update({ xp_points: newXP, level: newLevel }).eq('id', user.id);

    const newAchievements = await this.checkAchievements(userEmail);
    return { xp_awarded: xpAwarded, total_xp: newXP, level: newLevel, leveled_up: leveledUp, new_achievements: newAchievements };
  }

  async updateStreak(userEmail) {
    const { data: user } = await supabase
      .from('users').select('id, current_streak, longest_streak, last_activity_date').eq('email', userEmail).single();
    if (!user) return null;

    const today = new Date().toISOString().split('T')[0];
    const lastDate = user.last_activity_date;
    if (lastDate === today) return { streak: user.current_streak };

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = lastDate === yesterday ? (user.current_streak || 0) + 1 : 1;
    const longestStreak = Math.max(newStreak, user.longest_streak || 0);

    await supabase.from('users').update({
      current_streak: newStreak, longest_streak: longestStreak, last_activity_date: today,
    }).eq('id', user.id);

    if (newStreak > 1) {
      await this.awardXP(userEmail, 'streak', today, 5);
    }

    return { streak: newStreak, is_new_day: true };
  }

  async checkAchievements(userEmail) {
    const { data: user } = await supabase
      .from('users').select('id, xp_points, level, current_streak').eq('email', userEmail).single();
    if (!user) return [];

    const { data: allAchievements } = await supabase.from('achievements').select('*');
    const { data: userAchievements } = await supabase
      .from('user_achievements').select('achievement_id').eq('user_id', user.id);

    const earned = new Set((userAchievements || []).map(ua => ua.achievement_id));
    const newlyEarned = [];

    const { data: quizAttempts } = await supabase
      .from('quiz_attempts').select('id, quizzes(difficulty, subjects(name))')
      .eq('student_id', user.id).eq('is_completed', true);

    const { data: gameScores } = await supabase
      .from('game_scores').select('game_name, completed').eq('student_id', user.id);

    const { data: lectureProgress } = await supabase
      .from('student_lecture_progress').select('id').eq('student_id', user.id).eq('completed', true);

    const stats = {
      quiz_count: quizAttempts?.length || 0,
      games_completed: gameScores?.filter(g => g.completed).length || 0,
      lecture_count: lectureProgress?.length || 0,
      level: user.level || 1,
      streak: user.current_streak || 0,
    };

    for (const achievement of (allAchievements || [])) {
      if (earned.has(achievement.id)) continue;
      const c = achievement.criteria || {};
      let qualifies = false;

      if (c.quiz_count && stats.quiz_count >= c.quiz_count) qualifies = true;
      if (c.games_completed && stats.games_completed >= c.games_completed) qualifies = true;
      if (c.lecture_count && stats.lecture_count >= c.lecture_count) qualifies = true;
      if (c.level && stats.level >= c.level) qualifies = true;
      if (c.streak && stats.streak >= c.streak) qualifies = true;

      if (qualifies) {
        await supabase.from('user_achievements').insert({ user_id: user.id, achievement_id: achievement.id });
        await this.awardXP(userEmail, 'achievement', String(achievement.id), achievement.xp_reward || 50);
        newlyEarned.push(achievement);
      }
    }

    return newlyEarned;
  }

  async getUserAchievements(userEmail) {
    const { data: user } = await supabase.from('users').select('id').eq('email', userEmail).single();
    if (!user) return { achievements: [], earned: [] };

    const { data: all } = await supabase.from('achievements').select('*').order('tier');
    const { data: earned } = await supabase
      .from('user_achievements').select('achievement_id, earned_at').eq('user_id', user.id);

    const earnedMap = {};
    for (const e of (earned || [])) earnedMap[e.achievement_id] = e.earned_at;

    return {
      achievements: (all || []).map(a => ({ ...a, earned: !!earnedMap[a.id], earned_at: earnedMap[a.id] || null })),
    };
  }

  async getXPEvents(userEmail, limit = 20) {
    const { data: user } = await supabase.from('users').select('id').eq('email', userEmail).single();
    if (!user) return { events: [] };

    const { data } = await supabase
      .from('xp_events')
      .select('source_type, source_label, xp_awarded, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { events: data || [] };
  }

  // ============ PROFILE ============

  async getProfile(userEmail) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, class, role, phone, avatar, bio, xp_points, level, current_streak, longest_streak, created_at')
      .eq('email', userEmail)
      .single();
    if (error) throw new Error(error.message);
    return { profile: data };
  }

  async updateProfile(userEmail, updates) {
    const allowed = ['name', 'phone', 'class', 'avatar', 'bio'];
    const sanitized = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) sanitized[key] = updates[key];
    }
    const { data, error } = await supabase
      .from('users').update({ ...sanitized, updated_at: new Date().toISOString() })
      .eq('email', userEmail).select().single();
    if (error) throw new Error(error.message);
    return { profile: data };
  }

  // ============ CALENDAR ============

  async getCalendarEvents(classLevel, userEmail) {
    const { data: user } = await supabase.from('users').select('id').eq('email', userEmail).single();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .or(`user_id.eq.${user?.id},and(is_public.eq.true,class_level.eq.${classLevel})`)
      .gte('event_date', monthStart)
      .lte('event_date', monthEnd)
      .order('event_date');
    if (error) throw new Error(error.message);
    return { events: data || [] };
  }

  async createCalendarEvent(teacherEmail, eventData) {
    const { data: teacher } = await supabase.from('users').select('id').eq('email', teacherEmail).single();
    if (!teacher) throw new Error('Teacher not found');

    const { data, error } = await supabase.from('calendar_events').insert({
      ...eventData, created_by: teacher.id, is_public: true,
    }).select().single();
    if (error) throw new Error(error.message);
    return { event: data };
  }
}

export default new ApiService();
