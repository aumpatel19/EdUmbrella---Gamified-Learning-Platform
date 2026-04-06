-- EdUmbrella Supabase Migration
-- Run this in the Supabase SQL Editor (dashboard.supabase.com → SQL Editor)

-- Enable UUID extension (already enabled in Supabase by default)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ TABLES ============

-- Users table (mirrors Supabase auth.users for profile data)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'teacher', 'admin')) NOT NULL,
    class VARCHAR(100),
    name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects
CREATE TABLE IF NOT EXISTS public.subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT 'book',
    color VARCHAR(50) DEFAULT 'from-blue-500 to-blue-700',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz categories
CREATE TABLE IF NOT EXISTS public.quiz_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subject_id INT REFERENCES subjects(id) ON DELETE SET NULL,
    class_level INT,
    icon VARCHAR(10) DEFAULT 'quiz',
    color VARCHAR(50) DEFAULT 'from-purple-500 to-purple-700',
    description TEXT
);

-- Quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id INT REFERENCES subjects(id) ON DELETE SET NULL,
    category_id INT REFERENCES quiz_categories(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
    class_level INT,
    difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    duration_minutes INT DEFAULT 30,
    total_questions INT DEFAULT 10,
    passing_score INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    quiz_type VARCHAR(20) CHECK (quiz_type IN ('traditional', 'game')) DEFAULT 'traditional',
    game_component VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(30) CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank', 'matching')) DEFAULT 'multiple_choice',
    correct_answer TEXT,
    options JSONB,
    explanation TEXT,
    points INT DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id SERIAL PRIMARY KEY,
    quiz_id INT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score DECIMAL(5,2) DEFAULT 0.00,
    total_questions INT,
    correct_answers INT,
    time_spent_minutes INT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT FALSE,
    answers JSONB
);

-- Student quiz progress
CREATE TABLE IF NOT EXISTS public.student_quiz_progress (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    total_quizzes_attempted INT DEFAULT 0,
    total_quizzes_completed INT DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    best_score DECIMAL(5,2) DEFAULT 0.00,
    total_time_spent_minutes INT DEFAULT 0,
    last_attempt_date TIMESTAMPTZ,
    UNIQUE(student_id, subject_id)
);

-- Game scores
CREATE TABLE IF NOT EXISTS public.game_scores (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_name VARCHAR(100) NOT NULL,
    class_level INT,
    subject_name VARCHAR(100),
    score INT DEFAULT 0,
    level_reached INT DEFAULT 1,
    time_played_minutes INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    game_data JSONB,
    played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes
CREATE TABLE IF NOT EXISTS public.classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE SET NULL,
    description TEXT,
    schedule JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Class enrollments
CREATE TABLE IF NOT EXISTS public.class_enrollments (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, class_id)
);

-- ============ INDEXES ============

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed ON quiz_attempts(is_completed);
CREATE INDEX IF NOT EXISTS idx_game_scores_student ON game_scores(student_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_game ON game_scores(game_name);
CREATE INDEX IF NOT EXISTS idx_quizzes_active ON quizzes(is_active);
CREATE INDEX IF NOT EXISTS idx_quizzes_type ON quizzes(quiz_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============ ROW LEVEL SECURITY ============

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Public read for subjects, categories, quizzes
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public read quiz_categories" ON quiz_categories FOR SELECT USING (true);
CREATE POLICY "Public read quizzes" ON quizzes FOR SELECT USING (is_active = true);
CREATE POLICY "Public read quiz_questions" ON quiz_questions FOR SELECT USING (true);

-- Users: read own profile
CREATE POLICY "Users read own profile" ON users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users update own profile" ON users FOR UPDATE USING (auth.uid() = auth_id);

-- Quiz attempts: students manage their own
CREATE POLICY "Students manage own attempts" ON quiz_attempts
    FOR ALL USING (student_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Game scores: students manage their own
CREATE POLICY "Students manage own game scores" ON game_scores
    FOR ALL USING (student_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ============ TRIGGER: auto-create user profile on signup ============

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, role, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SEED DATA ============

INSERT INTO subjects (name, description, icon, color) VALUES
('Mathematics', 'Mathematical concepts and problem solving', 'math', 'from-blue-500 to-blue-700'),
('Science', 'Scientific concepts and experiments', 'science', 'from-green-500 to-green-700'),
('Physics', 'Physics principles and applications', 'physics', 'from-purple-500 to-purple-700'),
('History', 'Historical events and civilizations', 'history', 'from-orange-500 to-orange-700'),
('English', 'Language arts and literature', 'english', 'from-red-500 to-red-700'),
('Geography', 'Earth science and geography', 'geo', 'from-teal-500 to-teal-700'),
('Biology', 'Life sciences and biology', 'bio', 'from-lime-500 to-lime-700'),
('Chemistry', 'Chemical concepts and reactions', 'chem', 'from-yellow-500 to-yellow-700')
ON CONFLICT (name) DO NOTHING;

INSERT INTO quiz_categories (name, subject_id, class_level, icon, color, description) VALUES
('Circuit Building', (SELECT id FROM subjects WHERE name = 'Physics'), 10, 'circuit', 'from-blue-600 to-purple-600', 'Interactive circuit building game'),
('Nutrition Match', (SELECT id FROM subjects WHERE name = 'Science'), 6, 'nutrition', 'from-green-600 to-teal-600', 'Food and nutrition matching game'),
('Pizza Fractions', (SELECT id FROM subjects WHERE name = 'Mathematics'), 6, 'pizza', 'from-orange-600 to-red-600', 'Learn fractions with pizza'),
('Photosynthesis', (SELECT id FROM subjects WHERE name = 'Science'), 7, 'plant', 'from-green-600 to-blue-600', 'Plant biology and photosynthesis'),
('Equation Unlock', (SELECT id FROM subjects WHERE name = 'Mathematics'), 8, 'equation', 'from-purple-600 to-pink-600', 'Solve equations to unlock puzzles')
ON CONFLICT DO NOTHING;

INSERT INTO quizzes (title, description, subject_id, category_id, class_level, difficulty, duration_minutes, total_questions, quiz_type, game_component) VALUES
('Circuit Designer Challenge', 'Build electrical circuits to solve physics problems',
 (SELECT id FROM subjects WHERE name = 'Physics'),
 (SELECT id FROM quiz_categories WHERE name = 'Circuit Building'),
 10, 'medium', 45, 10, 'game', 'circuit'),
('Nutrition Knowledge Game', 'Match foods with their nutritional values',
 (SELECT id FROM subjects WHERE name = 'Science'),
 (SELECT id FROM quiz_categories WHERE name = 'Nutrition Match'),
 6, 'easy', 30, 8, 'game', 'nutrition'),
('Pizza Fraction Fun', 'Learn fractions by dividing pizzas',
 (SELECT id FROM subjects WHERE name = 'Mathematics'),
 (SELECT id FROM quiz_categories WHERE name = 'Pizza Fractions'),
 6, 'easy', 25, 12, 'game', 'pizza'),
('Photosynthesis Explorer', 'Discover how plants make food',
 (SELECT id FROM subjects WHERE name = 'Science'),
 (SELECT id FROM quiz_categories WHERE name = 'Photosynthesis'),
 7, 'medium', 35, 15, 'game', 'photosynthesis'),
('Equation Master', 'Solve mathematical equations step by step',
 (SELECT id FROM subjects WHERE name = 'Mathematics'),
 (SELECT id FROM quiz_categories WHERE name = 'Equation Unlock'),
 8, 'hard', 40, 20, 'game', 'equation-unlock')
ON CONFLICT DO NOTHING;
