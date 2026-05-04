-- EdUmbrella v2 Migration
-- Run this in Supabase SQL Editor AFTER supabase_migration.sql

-- ============ MISSING SUBJECTS ============

INSERT INTO subjects (name, description, icon, color) VALUES
('Hindi', 'Hindi language and literature', 'hindi', 'from-pink-500 to-pink-700'),
('Social Science', 'History, Geography, Civics and Economics', 'social', 'from-amber-500 to-amber-700')
ON CONFLICT (name) DO NOTHING;

-- ============ CLASS-LEVEL SUBJECTS ============

CREATE TABLE IF NOT EXISTS public.class_level_subjects (
    id SERIAL PRIMARY KEY,
    class_level INT NOT NULL CHECK (class_level BETWEEN 6 AND 12),
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    UNIQUE(class_level, subject_id)
);

ALTER TABLE class_level_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read class_level_subjects" ON class_level_subjects FOR SELECT USING (true);

-- Classes 6-10: Math, Science, Social Science, English, Hindi
INSERT INTO class_level_subjects (class_level, subject_id, display_order)
SELECT cls, s.id, ord FROM (VALUES
  (6, 'Mathematics', 1), (6, 'Science', 2), (6, 'Social Science', 3), (6, 'English', 4), (6, 'Hindi', 5),
  (7, 'Mathematics', 1), (7, 'Science', 2), (7, 'Social Science', 3), (7, 'English', 4), (7, 'Hindi', 5),
  (8, 'Mathematics', 1), (8, 'Science', 2), (8, 'Social Science', 3), (8, 'English', 4), (8, 'Hindi', 5),
  (9, 'Mathematics', 1), (9, 'Science', 2), (9, 'Social Science', 3), (9, 'English', 4), (9, 'Hindi', 5),
  (10, 'Mathematics', 1), (10, 'Science', 2), (10, 'Social Science', 3), (10, 'English', 4), (10, 'Hindi', 5),
  -- Classes 11-12: Math, Physics, Chemistry, Biology, English
  (11, 'Mathematics', 1), (11, 'Physics', 2), (11, 'Chemistry', 3), (11, 'Biology', 4), (11, 'English', 5),
  (12, 'Mathematics', 1), (12, 'Physics', 2), (12, 'Chemistry', 3), (12, 'Biology', 4), (12, 'English', 5)
) AS t(cls, subj, ord)
JOIN subjects s ON s.name = t.subj
ON CONFLICT (class_level, subject_id) DO NOTHING;

-- ============ LECTURES ============

CREATE TABLE IF NOT EXISTS public.lectures (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    class_level INT NOT NULL CHECK (class_level BETWEEN 6 AND 12),
    chapter_no INT DEFAULT 1,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT DEFAULT 30,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_level, subject_id, chapter_no)
);

CREATE INDEX IF NOT EXISTS idx_lectures_class_subject ON lectures(class_level, subject_id);
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lectures" ON lectures FOR SELECT USING (is_active = true);

-- ============ LECTURE VIDEOS (multilingual) ============

CREATE TABLE IF NOT EXISTS public.lecture_videos (
    id SERIAL PRIMARY KEY,
    lecture_id INT NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    language VARCHAR(20) NOT NULL CHECK (language IN ('english','hindi','telugu','gujarati','kannada','tamil','marathi','bengali')),
    youtube_video_id VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE(lecture_id, language)
);

ALTER TABLE lecture_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lecture_videos" ON lecture_videos FOR SELECT USING (true);

-- ============ STUDENT LECTURE PROGRESS ============

CREATE TABLE IF NOT EXISTS public.student_lecture_progress (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lecture_id INT NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    watched_seconds INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, lecture_id)
);

CREATE INDEX IF NOT EXISTS idx_lecture_progress_student ON student_lecture_progress(student_id);
ALTER TABLE student_lecture_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own lecture progress" ON student_lecture_progress
    FOR ALL USING (student_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ============ GAMIFICATION COLUMNS ON USERS ============

ALTER TABLE users ADD COLUMN IF NOT EXISTS xp_points INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_streak INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS longest_streak INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_activity_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS level INT DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(10) DEFAULT '🎮';
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio VARCHAR(100);

-- ============ ACHIEVEMENTS ============

CREATE TABLE IF NOT EXISTS public.achievements (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '🏆',
    tier VARCHAR(20) CHECK (tier IN ('bronze','silver','gold','platinum','diamond')) DEFAULT 'bronze',
    rarity VARCHAR(20) CHECK (rarity IN ('common','rare','epic','legendary')) DEFAULT 'common',
    xp_reward INT DEFAULT 50,
    criteria JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read achievements" ON achievements FOR SELECT USING (true);

-- ============ USER ACHIEVEMENTS ============

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own achievements" ON user_achievements
    FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ============ XP EVENTS (audit log) ============

CREATE TABLE IF NOT EXISTS public.xp_events (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_type VARCHAR(30) CHECK (source_type IN ('lecture','quiz','game','streak','achievement','bonus')),
    source_id VARCHAR(50),
    source_label VARCHAR(255),
    xp_awarded INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_events_user ON xp_events(user_id, created_at DESC);
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students read own xp events" ON xp_events
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "Students insert own xp events" ON xp_events
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ============ CALENDAR EVENTS ============

CREATE TABLE IF NOT EXISTS public.calendar_events (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_level INT,
    event_type VARCHAR(30) CHECK (event_type IN ('quiz_due','lecture','assignment','exam','holiday','other')) DEFAULT 'other',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    related_id INT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_class ON calendar_events(class_level, event_date);
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students read own and class events" ON calendar_events
    FOR SELECT USING (
        user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
        OR (is_public = true AND class_level = (
            SELECT class::INT FROM users WHERE auth_id = auth.uid() LIMIT 1
        ))
    );
CREATE POLICY "Teachers insert calendar events" ON calendar_events
    FOR INSERT WITH CHECK (created_by IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ============ NEW GAME QUIZ CATEGORIES ============

INSERT INTO quiz_categories (name, subject_id, class_level, icon, color, description) VALUES
('Integer Battle', (SELECT id FROM subjects WHERE name = 'Mathematics'), 7, '⚔️', 'from-red-600 to-orange-600', 'Battle integers with math'),
('Cell Explorer', (SELECT id FROM subjects WHERE name = 'Science'), 8, '🔬', 'from-green-600 to-emerald-600', 'Explore cell biology'),
('Triangle Theorem', (SELECT id FROM subjects WHERE name = 'Mathematics'), 9, '📐', 'from-blue-600 to-indigo-600', 'Prove triangle theorems'),
('Atom Builder', (SELECT id FROM subjects WHERE name = 'Chemistry'), 9, '⚛️', 'from-cyan-600 to-blue-600', 'Build atoms and molecules'),
('Trigonometry Tower', (SELECT id FROM subjects WHERE name = 'Mathematics'), 10, '🗼', 'from-violet-600 to-purple-600', 'Climb with trigonometry'),
('Vector Voyage', (SELECT id FROM subjects WHERE name = 'Physics'), 11, '🧭', 'from-teal-600 to-cyan-600', 'Navigate with vectors'),
('Periodic Quest', (SELECT id FROM subjects WHERE name = 'Chemistry'), 11, '🧪', 'from-yellow-600 to-amber-600', 'Quest through the periodic table'),
('Calculus Climber', (SELECT id FROM subjects WHERE name = 'Mathematics'), 12, '📈', 'from-pink-600 to-rose-600', 'Climb calculus mountain'),
('Genetics Lab', (SELECT id FROM subjects WHERE name = 'Biology'), 12, '🧬', 'from-lime-600 to-green-600', 'Experiment with genetics')
ON CONFLICT DO NOTHING;

-- New game quizzes for classes 7-12
INSERT INTO quizzes (title, description, subject_id, category_id, class_level, difficulty, duration_minutes, total_questions, quiz_type, game_component) VALUES
('Integer Battle Arena', 'Battle with integers - add, subtract, multiply under pressure',
 (SELECT id FROM subjects WHERE name = 'Mathematics'),
 (SELECT id FROM quiz_categories WHERE name = 'Integer Battle'),
 7, 'easy', 20, 10, 'game', 'integer-battle'),
('Cell Explorer Challenge', 'Drag and identify cell organelles and their functions',
 (SELECT id FROM subjects WHERE name = 'Science'),
 (SELECT id FROM quiz_categories WHERE name = 'Cell Explorer'),
 8, 'medium', 25, 12, 'game', 'cell-explorer'),
('Triangle Theorem Quest', 'Prove congruence with SAS, ASA, SSS, RHS theorems',
 (SELECT id FROM subjects WHERE name = 'Mathematics'),
 (SELECT id FROM quiz_categories WHERE name = 'Triangle Theorem'),
 9, 'medium', 30, 10, 'game', 'triangle-theorem'),
('Atom Builder Workshop', 'Build atoms by placing protons, neutrons and electrons',
 (SELECT id FROM subjects WHERE name = 'Chemistry'),
 (SELECT id FROM quiz_categories WHERE name = 'Atom Builder'),
 9, 'medium', 30, 12, 'game', 'atom-builder'),
('Trigonometry Tower Climb', 'Use sin, cos, tan to solve angle puzzles and climb floors',
 (SELECT id FROM subjects WHERE name = 'Mathematics'),
 (SELECT id FROM quiz_categories WHERE name = 'Trigonometry Tower'),
 10, 'hard', 35, 15, 'game', 'trig-tower'),
('Vector Voyage Explorer', 'Add vectors graphically and find resultants',
 (SELECT id FROM subjects WHERE name = 'Physics'),
 (SELECT id FROM quiz_categories WHERE name = 'Vector Voyage'),
 11, 'hard', 35, 12, 'game', 'vector-voyage'),
('Periodic Table Quest', 'Race to identify elements by group, period, and properties',
 (SELECT id FROM subjects WHERE name = 'Chemistry'),
 (SELECT id FROM quiz_categories WHERE name = 'Periodic Quest'),
 11, 'medium', 30, 20, 'game', 'periodic-quest'),
('Calculus Mountain Climber', 'Solve derivatives and integrals to reach the summit',
 (SELECT id FROM subjects WHERE name = 'Mathematics'),
 (SELECT id FROM quiz_categories WHERE name = 'Calculus Climber'),
 12, 'hard', 40, 15, 'game', 'calculus-climber'),
('Genetics Lab Simulator', 'Predict offspring traits using Punnett squares',
 (SELECT id FROM subjects WHERE name = 'Biology'),
 (SELECT id FROM quiz_categories WHERE name = 'Genetics Lab'),
 12, 'hard', 35, 12, 'game', 'genetics-lab')
ON CONFLICT DO NOTHING;

-- ============ ACHIEVEMENTS SEED DATA ============

INSERT INTO achievements (code, name, description, icon, tier, rarity, xp_reward, criteria) VALUES
-- Quiz ladder
('quiz_1', 'Quiz Beginner', 'Complete your first quiz', '📝', 'bronze', 'common', 10, '{"quiz_count": 1}'),
('quiz_5', 'Quiz Apprentice', 'Complete 5 quizzes', '📋', 'bronze', 'common', 25, '{"quiz_count": 5}'),
('quiz_25', 'Quiz Adept', 'Complete 25 quizzes', '📚', 'silver', 'common', 75, '{"quiz_count": 25}'),
('quiz_100', 'Quiz Master', 'Complete 100 quizzes', '🏆', 'gold', 'rare', 200, '{"quiz_count": 100}'),
('quiz_250', 'Quiz Legend', 'Complete 250 quizzes', '👑', 'platinum', 'epic', 500, '{"quiz_count": 250}'),
('quiz_500', 'Quiz Mythic', 'Complete 500 quizzes - truly legendary!', '💎', 'diamond', 'legendary', 1000, '{"quiz_count": 500}'),
-- Perfect score
('perfect_easy', 'Sharp Mind', 'Get 100% on any easy quiz', '⭐', 'bronze', 'common', 30, '{"perfect_score": true, "difficulty": "easy"}'),
('perfect_medium', 'Brilliant', 'Get 100% on a medium quiz', '🌟', 'silver', 'rare', 75, '{"perfect_score": true, "difficulty": "medium"}'),
('perfect_hard', 'Genius', 'Get 100% on a hard quiz', '💡', 'gold', 'epic', 150, '{"perfect_score": true, "difficulty": "hard"}'),
-- Streaks
('streak_3', 'On Fire', 'Log in 3 days in a row', '🔥', 'bronze', 'common', 15, '{"streak": 3}'),
('streak_7', 'Blazing', 'Log in 7 days in a row', '🔥', 'silver', 'common', 50, '{"streak": 7}'),
('streak_30', 'Inferno', 'Log in 30 days in a row', '🌋', 'gold', 'rare', 200, '{"streak": 30}'),
('streak_100', 'Eternal Flame', 'Log in 100 days in a row - unstoppable!', '☀️', 'diamond', 'legendary', 1000, '{"streak": 100}'),
-- Lectures
('lecture_1', 'Curious Cat', 'Watch your first lecture', '📺', 'bronze', 'common', 10, '{"lecture_count": 1}'),
('lecture_10', 'Eager Learner', 'Watch 10 lectures', '🎓', 'bronze', 'common', 30, '{"lecture_count": 10}'),
('lecture_50', 'Knowledge Seeker', 'Watch 50 lectures', '📖', 'silver', 'rare', 100, '{"lecture_count": 50}'),
('lecture_200', 'The Sage', 'Watch 200 lectures - a true scholar', '🧙', 'gold', 'epic', 300, '{"lecture_count": 200}'),
-- Multilingual
('polyglot', 'Polyglot', 'Watch lectures in 3+ languages', '🌍', 'gold', 'epic', 150, '{"languages_used": 3}'),
-- Games
('game_1', 'Game On', 'Complete any game', '🎮', 'bronze', 'common', 20, '{"games_completed": 1}'),
('game_5', 'Game Enthusiast', 'Complete 5 different games', '🕹️', 'silver', 'common', 75, '{"games_completed": 5}'),
('game_all_class', 'Class Champion', 'Complete all games for your class', '🏅', 'gold', 'rare', 200, '{"games_all_class": true}'),
('game_all', 'Game Legend', 'Complete all 14 games', '🎖️', 'platinum', 'legendary', 800, '{"games_completed": 14}'),
-- Subject mastery
('math_10', 'Math Whiz', 'Pass 10 Mathematics quizzes', '➕', 'gold', 'rare', 100, '{"subject": "Mathematics", "quiz_count": 10}'),
('science_10', 'Science Sage', 'Pass 10 Science quizzes', '🔬', 'gold', 'rare', 100, '{"subject": "Science", "quiz_count": 10}'),
('hindi_10', 'Hindi Hero', 'Pass 10 Hindi quizzes', '🅗', 'gold', 'rare', 100, '{"subject": "Hindi", "quiz_count": 10}'),
('english_10', 'English Eloquent', 'Pass 10 English quizzes', '📝', 'gold', 'rare', 100, '{"subject": "English", "quiz_count": 10}'),
-- Level milestones
('level_5', 'Rising Star', 'Reach Level 5', '⭐', 'bronze', 'common', 50, '{"level": 5}'),
('level_10', 'Powerhouse', 'Reach Level 10', '💪', 'silver', 'rare', 150, '{"level": 10}'),
('level_25', 'Elite Scholar', 'Reach Level 25', '🎯', 'platinum', 'epic', 500, '{"level": 25}'),
-- Special
('early_bird', 'Early Bird', 'Log in before 7am five times', '🌅', 'silver', 'rare', 75, '{"early_logins": 5}'),
('night_owl', 'Night Owl', 'Study after 10pm five times', '🦉', 'silver', 'rare', 75, '{"night_logins": 5}'),
('first_perfect', 'First Blood', 'Get your first 100% score', '💯', 'bronze', 'common', 50, '{"any_perfect": 1}'),
('speed_demon', 'Speed Demon', 'Finish a 10-question quiz in under 3 minutes', '⚡', 'silver', 'rare', 75, '{"fast_quiz_minutes": 3}')
ON CONFLICT (code) DO NOTHING;

-- ============ ADDITIONAL INDEXES ============

CREATE INDEX IF NOT EXISTS idx_lecture_videos_lecture ON lecture_videos(lecture_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_users_xp ON users(xp_points DESC);
