-- EdUmbrella Database Schema
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS edumbrella;
USE edumbrella;

-- Users table (already exists but let's define it properly)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    class VARCHAR(100),
    name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT 'book',
    color VARCHAR(50) DEFAULT 'from-blue-500 to-blue-700',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz categories table
CREATE TABLE IF NOT EXISTS quiz_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    subject_id INT,
    class_level INT, -- Class 6-12
    icon VARCHAR(10) DEFAULT 'quiz',
    color VARCHAR(50) DEFAULT 'from-purple-500 to-purple-700',
    description TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id INT,
    category_id INT,
    teacher_id INT,
    class_level INT, -- Class 6-12
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    duration_minutes INT DEFAULT 30,
    total_questions INT DEFAULT 10,
    passing_score INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    quiz_type ENUM('traditional', 'game') DEFAULT 'traditional',
    game_component VARCHAR(100) NULL, -- for SIH games integration
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES quiz_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'fill_blank', 'matching') DEFAULT 'multiple_choice',
    correct_answer TEXT,
    options JSON, -- Store multiple choice options as JSON
    explanation TEXT,
    points INT DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    student_id INT NOT NULL,
    score DECIMAL(5,2) DEFAULT 0.00,
    total_questions INT,
    correct_answers INT,
    time_spent_minutes INT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    answers JSON, -- Store user answers as JSON
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Student quiz progress table
CREATE TABLE IF NOT EXISTS student_quiz_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    total_quizzes_attempted INT DEFAULT 0,
    total_quizzes_completed INT DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    best_score DECIMAL(5,2) DEFAULT 0.00,
    total_time_spent_minutes INT DEFAULT 0,
    last_attempt_date TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_subject (student_id, subject_id)
);

-- Game scores table (for SIH games integration)
CREATE TABLE IF NOT EXISTS game_scores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    game_name VARCHAR(100) NOT NULL,
    class_level INT, -- Class 6-12
    subject_name VARCHAR(100),
    score INT DEFAULT 0,
    level_reached INT DEFAULT 1,
    time_played_minutes INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    game_data JSON, -- Store game-specific data
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    teacher_id INT NOT NULL,
    subject_id INT,
    description TEXT,
    schedule JSON, -- Store class schedule as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
);

-- Student class enrollments
CREATE TABLE IF NOT EXISTS class_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, class_id)
);

-- Insert default subjects
INSERT INTO subjects (name, description, icon, color) VALUES
('Mathematics', 'Mathematical concepts and problem solving', 'math', 'from-blue-500 to-blue-700'),
('Science', 'Scientific concepts and experiments', 'science', 'from-green-500 to-green-700'),
('Physics', 'Physics principles and applications', 'physics', 'from-purple-500 to-purple-700'),
('History', 'Historical events and civilizations', 'history', 'from-orange-500 to-orange-700'),
('English', 'Language arts and literature', 'english', 'from-red-500 to-red-700'),
('Geography', 'Earth science and geography', 'geo', 'from-teal-500 to-teal-700'),
('Biology', 'Life sciences and biology', 'bio', 'from-lime-500 to-lime-700'),
('Chemistry', 'Chemical concepts and reactions', 'chem', 'from-yellow-500 to-yellow-700')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert quiz categories for games integration with class levels
INSERT INTO quiz_categories (name, subject_id, class_level, icon, color, description) VALUES
('Circuit Building', (SELECT id FROM subjects WHERE name = 'Physics'), 10, 'circuit', 'from-blue-600 to-purple-600', 'Interactive circuit building game'),
('Nutrition Match', (SELECT id FROM subjects WHERE name = 'Science'), 6, 'nutrition', 'from-green-600 to-teal-600', 'Food and nutrition matching game'),
('Pizza Fractions', (SELECT id FROM subjects WHERE name = 'Mathematics'), 6, 'pizza', 'from-orange-600 to-red-600', 'Learn fractions with pizza'),
('Photosynthesis', (SELECT id FROM subjects WHERE name = 'Science'), 7, 'plant', 'from-green-600 to-blue-600', 'Plant biology and photosynthesis'),
('Equation Unlock', (SELECT id FROM subjects WHERE name = 'Mathematics'), 8, 'equation', 'from-purple-600 to-pink-600', 'Solve equations to unlock puzzles')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert sample quizzes for the games with class levels
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
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Create indexes for better performance
CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_completed ON quiz_attempts(is_completed);
CREATE INDEX idx_game_scores_student ON game_scores(student_id);
CREATE INDEX idx_game_scores_game ON game_scores(game_name);
CREATE INDEX idx_student_progress_student ON student_quiz_progress(student_id);
CREATE INDEX idx_quizzes_active ON quizzes(is_active);
CREATE INDEX idx_quizzes_type ON quizzes(quiz_type);