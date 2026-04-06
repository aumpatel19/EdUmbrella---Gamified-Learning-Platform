import { supabase } from './supabaseClient';

class ApiService {

  // ============ AUTH ============

  async loginStudent(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  // ============ SUBJECTS ============

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

    const { error } = await supabase.from('quiz_attempts').update({
      score,
      correct_answers: correctAnswers,
      time_spent_minutes: timeSpentMinutes,
      completed_at: new Date().toISOString(),
      is_completed: true,
      answers,
    }).eq('id', attemptId);
    if (error) throw new Error(error.message);

    return { score, correct_answers: correctAnswers, total_questions: questions.length, message: 'Quiz submitted successfully' };
  }

  // ============ GAMES ============

  async saveGameScore(studentEmail, gameName, scoreData) {
    const { data: student } = await supabase
      .from('users').select('id').eq('email', studentEmail).eq('role', 'student').single();
    if (!student) throw new Error('Student not found');

    const gameMapping = {
      'pizza': { class_level: 6, subject: 'Mathematics' },
      'nutrition': { class_level: 6, subject: 'Science' },
      'photosynthesis': { class_level: 7, subject: 'Science' },
      'equation-unlock': { class_level: 8, subject: 'Mathematics' },
      'circuit': { class_level: 10, subject: 'Physics' },
    };
    const gameInfo = gameMapping[gameName] || { class_level: null, subject: 'General' };

    const { error } = await supabase.from('game_scores').insert({
      student_id: student.id,
      game_name: gameName,
      class_level: gameInfo.class_level,
      subject_name: gameInfo.subject,
      score: scoreData.score || 0,
      level_reached: scoreData.level_reached || 1,
      time_played_minutes: scoreData.time_played_minutes || 0,
      completed: scoreData.completed || false,
      game_data: scoreData.game_data || {},
    });
    if (error) throw new Error(error.message);

    return { message: 'Game score saved successfully', class_level: gameInfo.class_level, subject: gameInfo.subject };
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

  async getStudentDashboard(email) {
    const { data: student } = await supabase
      .from('users').select('id, name, email, class').eq('email', email).eq('role', 'student').single();
    if (!student) throw new Error('Student not found');

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

    return { teacher, students: students || [], classes: teacherClasses };
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
}

export default new ApiService();
