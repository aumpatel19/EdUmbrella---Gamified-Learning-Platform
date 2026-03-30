#!/usr/bin/env python3
"""
Complete EdUmbrella Database Setup Script
Consolidated setup for SIH project with all features and sample data
"""

import mysql.connector
import os
import json
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random

# Database configuration
MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', 'krushil298')
MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE', 'edumbrella')
MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))

def create_database():
    """Create database if it doesn't exist"""
    try:
        print("Connecting to MySQL server...")
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            port=MYSQL_PORT
        )
        cursor = conn.cursor(buffered=True)
        
        print(f"Creating database '{MYSQL_DATABASE}'...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DATABASE}")
        cursor.execute(f"USE {MYSQL_DATABASE}")
        
        print("SUCCESS: Database created/selected")
        
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as err:
        print(f"ERROR: Database error: {err}")
        return False

def create_tables():
    """Create all database tables"""
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            port=MYSQL_PORT
        )
        cursor = conn.cursor(buffered=True)
        
        print("Creating database tables...")
        
        # Users table
        cursor.execute("""
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
            )
        """)
        
        # Subjects table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS subjects (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                icon VARCHAR(10) DEFAULT 'book',
                color VARCHAR(50) DEFAULT 'from-blue-500 to-blue-700',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Quiz categories table (with class_level for CBSE grades)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS quiz_categories (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                subject_id INT,
                class_level INT,
                icon VARCHAR(10) DEFAULT 'quiz',
                color VARCHAR(50) DEFAULT 'from-purple-500 to-purple-700',
                description TEXT,
                FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
            )
        """)
        
        # Quizzes table (with class_level for CBSE grades)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS quizzes (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                subject_id INT,
                category_id INT,
                teacher_id INT,
                class_level INT,
                difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
                duration_minutes INT DEFAULT 30,
                total_questions INT DEFAULT 10,
                passing_score INT DEFAULT 60,
                is_active BOOLEAN DEFAULT TRUE,
                quiz_type ENUM('traditional', 'game') DEFAULT 'traditional',
                game_component VARCHAR(100) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
                FOREIGN KEY (category_id) REFERENCES quiz_categories(id) ON DELETE SET NULL,
                FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        # Quiz questions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS quiz_questions (
                id INT PRIMARY KEY AUTO_INCREMENT,
                quiz_id INT NOT NULL,
                question_text TEXT NOT NULL,
                question_type ENUM('multiple_choice', 'true_false', 'fill_blank', 'matching') DEFAULT 'multiple_choice',
                correct_answer TEXT,
                options JSON,
                explanation TEXT,
                points INT DEFAULT 1,
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
            )
        """)
        
        # Quiz attempts table
        cursor.execute("""
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
                answers JSON,
                FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        # Student quiz progress table
        cursor.execute("""
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
            )
        """)
        
        # Game scores table (for SIH games integration)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS game_scores (
                id INT PRIMARY KEY AUTO_INCREMENT,
                student_id INT NOT NULL,
                game_name VARCHAR(100) NOT NULL,
                class_level INT,
                subject_name VARCHAR(100),
                score INT DEFAULT 0,
                level_reached INT DEFAULT 1,
                time_played_minutes INT DEFAULT 0,
                completed BOOLEAN DEFAULT FALSE,
                game_data JSON,
                played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        # Classes table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS classes (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                teacher_id INT NOT NULL,
                subject_id INT,
                description TEXT,
                schedule JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL
            )
        """)
        
        # Class enrollments table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS class_enrollments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                student_id INT NOT NULL,
                class_id INT NOT NULL,
                enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
                UNIQUE KEY unique_enrollment (student_id, class_id)
            )
        """)
        
        conn.commit()
        print("SUCCESS: All tables created")
        
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as err:
        print(f"ERROR: Table creation error: {err}")
        return False

def insert_subjects():
    """Insert all subjects"""
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            port=MYSQL_PORT
        )
        cursor = conn.cursor(buffered=True)
        
        print("Adding subjects...")
        
        subjects = [
            ('Mathematics', 'Mathematical concepts and problem solving', 'math', 'from-blue-500 to-blue-700'),
            ('Science', 'Scientific concepts and experiments', 'science', 'from-green-500 to-green-700'),
            ('Physics', 'Physics principles and applications', 'physics', 'from-purple-500 to-purple-700'),
            ('Biology', 'Life sciences and biology', 'bio', 'from-lime-500 to-lime-700'),
            ('Chemistry', 'Chemical concepts and reactions', 'chem', 'from-yellow-500 to-yellow-700'),
            ('History', 'Historical events and civilizations', 'history', 'from-orange-500 to-orange-700'),
            ('English', 'Language arts and literature', 'english', 'from-red-500 to-red-700'),
            ('Geography', 'Earth science and geography', 'geo', 'from-teal-500 to-teal-700'),
        ]
        
        for name, description, icon, color in subjects:
            cursor.execute("""
                INSERT IGNORE INTO subjects (name, description, icon, color) 
                VALUES (%s, %s, %s, %s)
            """, (name, description, icon, color))
        
        conn.commit()
        print("SUCCESS: Subjects added")
        
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as err:
        print(f"ERROR: Subjects insertion error: {err}")
        return False

def insert_quiz_categories():
    """Insert quiz categories for games with CBSE class levels"""
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            port=MYSQL_PORT
        )
        cursor = conn.cursor(buffered=True)
        
        print("Adding quiz categories...")
        
        # Get subject IDs
        cursor.execute("SELECT id FROM subjects WHERE name = 'Physics'")
        physics_result = cursor.fetchone()
        physics_id = physics_result[0] if physics_result else None
        
        cursor.execute("SELECT id FROM subjects WHERE name = 'Mathematics'")
        math_result = cursor.fetchone()
        math_id = math_result[0] if math_result else None
        
        cursor.execute("SELECT id FROM subjects WHERE name = 'Science'")
        science_result = cursor.fetchone()
        science_id = science_result[0] if science_result else None
        
        categories = [
            ('Circuit Building', physics_id, 10, 'circuit', 'from-blue-600 to-purple-600', 'Interactive circuit building game'),
            ('Pizza Fractions', math_id, 6, 'pizza', 'from-orange-600 to-red-600', 'Learn fractions with pizza'),
            ('Nutrition Match', science_id, 6, 'nutrition', 'from-green-600 to-teal-600', 'Food and nutrition matching game'),
            ('Photosynthesis', science_id, 7, 'plant', 'from-green-600 to-blue-600', 'Plant biology and photosynthesis'),
            ('Equation Unlock', math_id, 8, 'equation', 'from-purple-600 to-pink-600', 'Solve equations to unlock puzzles'),
        ]
        
        for name, subject_id, class_level, icon, color, description in categories:
            if subject_id:
                cursor.execute("""
                    INSERT IGNORE INTO quiz_categories (name, subject_id, class_level, icon, color, description)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (name, subject_id, class_level, icon, color, description))
        
        conn.commit()
        print("SUCCESS: Quiz categories added")
        
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as err:
        print(f"ERROR: Quiz categories insertion error: {err}")
        return False

def insert_game_quizzes():
    """Insert game quizzes and traditional quizzes"""
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            port=MYSQL_PORT
        )
        cursor = conn.cursor(buffered=True)
        
        print("Adding quizzes...")
        
        # Get subject IDs
        cursor.execute("SELECT id FROM subjects WHERE name = 'Physics'")
        physics_result = cursor.fetchone()
        physics_id = physics_result[0] if physics_result else None
        
        cursor.execute("SELECT id FROM subjects WHERE name = 'Mathematics'")
        math_result = cursor.fetchone()
        math_id = math_result[0] if math_result else None
        
        cursor.execute("SELECT id FROM subjects WHERE name = 'Science'")
        science_result = cursor.fetchone()
        science_id = science_result[0] if science_result else None
        
        # Get category IDs
        cursor.execute("SELECT id FROM quiz_categories WHERE name = 'Circuit Building'")
        circuit_cat_result = cursor.fetchone()
        circuit_cat_id = circuit_cat_result[0] if circuit_cat_result else None
        
        cursor.execute("SELECT id FROM quiz_categories WHERE name = 'Pizza Fractions'")
        pizza_cat_result = cursor.fetchone()
        pizza_cat_id = pizza_cat_result[0] if pizza_cat_result else None
        
        cursor.execute("SELECT id FROM quiz_categories WHERE name = 'Nutrition Match'")
        nutrition_cat_result = cursor.fetchone()
        nutrition_cat_id = nutrition_cat_result[0] if nutrition_cat_result else None
        
        cursor.execute("SELECT id FROM quiz_categories WHERE name = 'Photosynthesis'")
        photo_cat_result = cursor.fetchone()
        photo_cat_id = photo_cat_result[0] if photo_cat_result else None
        
        cursor.execute("SELECT id FROM quiz_categories WHERE name = 'Equation Unlock'")
        equation_cat_result = cursor.fetchone()
        equation_cat_id = equation_cat_result[0] if equation_cat_result else None
        
        # Game quizzes with CBSE class levels
        game_quizzes = [
            ('Circuit Designer Challenge', 'Build electrical circuits to solve physics problems', 
             physics_id, circuit_cat_id, 10, 'medium', 45, 10, 'game', 'circuit'),
            ('Pizza Fraction Fun', 'Learn fractions by dividing pizzas', 
             math_id, pizza_cat_id, 6, 'easy', 25, 12, 'game', 'pizza'),
            ('Nutrition Knowledge Game', 'Match foods with their nutritional values', 
             science_id, nutrition_cat_id, 6, 'easy', 30, 8, 'game', 'nutrition'),
            ('Photosynthesis Explorer', 'Discover how plants make food', 
             science_id, photo_cat_id, 7, 'medium', 35, 15, 'game', 'photosynthesis'),
            ('Equation Master', 'Solve mathematical equations step by step', 
             math_id, equation_cat_id, 8, 'hard', 40, 20, 'game', 'equation-unlock'),
        ]
        
        for title, description, subject_id, category_id, class_level, difficulty, duration, questions, quiz_type, game_component in game_quizzes:
            if subject_id:
                cursor.execute("""
                    INSERT IGNORE INTO quizzes 
                    (title, description, subject_id, category_id, class_level, difficulty, duration_minutes, total_questions, quiz_type, game_component, is_active)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (title, description, subject_id, category_id, class_level, difficulty, duration, questions, quiz_type, game_component, True))
                print(f"  SUCCESS: Added game: {title}")
        
        # Traditional quizzes with class levels
        traditional_quizzes = [
            ('Basic Math Quiz', 'Test your basic mathematical skills', math_id, None, 6, 'easy', 20, 10, 'traditional', None),
            ('Physics Fundamentals', 'Basic physics concepts quiz', physics_id, None, 10, 'medium', 30, 15, 'traditional', None),
            ('Science Basics', 'Introduction to science quiz', science_id, None, 6, 'easy', 25, 12, 'traditional', None),
        ]
        
        for title, description, subject_id, category_id, class_level, difficulty, duration, questions, quiz_type, game_component in traditional_quizzes:
            if subject_id:
                cursor.execute("""
                    INSERT IGNORE INTO quizzes 
                    (title, description, subject_id, category_id, class_level, difficulty, duration_minutes, total_questions, quiz_type, game_component, is_active)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (title, description, subject_id, category_id, class_level, difficulty, duration, questions, quiz_type, game_component, True))
                print(f"  SUCCESS: Added quiz: {title}")
        
        conn.commit()
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as err:
        print(f"ERROR: Quiz insertion error: {err}")
        return False

def insert_sample_users():
    """Insert sample users for testing"""
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            port=MYSQL_PORT
        )
        cursor = conn.cursor(buffered=True)
        
        print("Creating sample users...")
        
        sample_users = [
            # CBSE class-wise students
            ('student6a@school.com', 'student123', 'student', 'Alice Johnson', '6'),
            ('student6b@school.com', 'student123', 'student', 'Bob Smith', '6'),
            ('student7a@school.com', 'student123', 'student', 'Charlie Brown', '7'),
            ('student8a@school.com', 'student123', 'student', 'Diana Ross', '8'),
            ('student10a@school.com', 'student123', 'student', 'Eve Wilson', '10'),
            ('student12a@school.com', 'student123', 'student', 'Frank Miller', '12'),
            # Class-wise teachers
            ('teacher6@school.com', 'teacher123', 'teacher', 'Ms. Anderson', '6,7'),
            ('teacher8@school.com', 'teacher123', 'teacher', 'Mr. Thompson', '8,9'),
            ('teacher10@school.com', 'teacher123', 'teacher', 'Dr. Williams', '10,11,12'),
            # Legacy accounts for compatibility
            ('student@edumbrella.com', 'student123', 'student', 'John Doe', '10'),
            ('teacher@edumbrella.com', 'teacher123', 'teacher', 'Jane Smith', '6,7,8'),
            ('admin@edumbrella.com', 'admin123', 'admin', 'Admin User', None),
        ]
        
        for email, password, role, name, class_name in sample_users:
            # Check if user already exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                print(f"  User {email} already exists, skipping...")
                continue
            
            hashed_password = generate_password_hash(password)
            cursor.execute("""
                INSERT INTO users (email, password, role, name, class) 
                VALUES (%s, %s, %s, %s, %s)
            """, (email, hashed_password, role, name, class_name))
            print(f"  SUCCESS: Created: {email} ({role})")
        
        conn.commit()
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as err:
        print(f"ERROR: User creation error: {err}")
        return False

def add_sample_quiz_questions():
    """Add sample questions to quizzes for testing"""
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            port=MYSQL_PORT
        )
        cursor = conn.cursor(buffered=True)
        
        print("Adding sample quiz questions...")
        
        # Questions for each quiz type
        quiz_questions = {
            'Basic Math Quiz': [
                ("What is 2 + 2?", "multiple_choice", "4", '["2", "3", "4", "5"]', "Basic addition"),
                ("What is 10 - 5?", "multiple_choice", "5", '["3", "4", "5", "6"]', "Basic subtraction"),
                ("What is 3 × 4?", "multiple_choice", "12", '["10", "11", "12", "13"]', "Basic multiplication"),
            ],
            'Science Basics': [
                ("What do plants need for photosynthesis?", "multiple_choice", "Sunlight, water, CO2", 
                 '["Water only", "Sunlight, water, CO2", "Only CO2", "Only sunlight"]', "Plants need these three components"),
                ("Which food is rich in protein?", "multiple_choice", "Chicken", 
                 '["Apple", "Rice", "Chicken", "Bread"]', "Chicken is a good protein source"),
            ],
            'Pizza Fraction Fun': [
                ("If you eat 2 slices of a pizza that has 8 equal slices, what fraction did you eat?", 
                 "multiple_choice", "2/8", '["1/4", "2/8", "1/2", "2/4"]', "2 out of 8 slices"),
                ("Which fraction is equivalent to 1/2?", "multiple_choice", "2/4", 
                 '["2/4", "3/5", "1/3", "2/3"]', "Both equal 0.5"),
            ],
            'Nutrition Knowledge Game': [
                ("Milk is a good source of which nutrient?", "multiple_choice", "Calcium", 
                 '["Calcium", "Iron", "Fiber", "Fat"]', "Milk provides calcium for bones"),
                ("Which food group gives us energy?", "multiple_choice", "Carbohydrates", 
                 '["Proteins", "Carbohydrates", "Vitamins", "Minerals"]', "Carbs provide energy"),
            ],
            'Photosynthesis Explorer': [
                ("What gas do plants produce during photosynthesis?", "multiple_choice", "Oxygen", 
                 '["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"]', "Plants release oxygen"),
                ("Where does photosynthesis occur in plants?", "multiple_choice", "Leaves", 
                 '["Roots", "Stem", "Leaves", "Flowers"]', "Leaves contain chloroplasts"),
            ],
            'Equation Master': [
                ("Solve: x + 5 = 12", "multiple_choice", "x = 7", 
                 '["x = 5", "x = 7", "x = 17", "x = 12"]', "Subtract 5 from both sides"),
                ("Solve: 2x = 16", "multiple_choice", "x = 8", 
                 '["x = 6", "x = 8", "x = 32", "x = 14"]', "Divide both sides by 2"),
            ],
            'Circuit Designer Challenge': [
                ("In a series circuit, if one bulb burns out, what happens?", "multiple_choice", "All bulbs go out", 
                 '["Other bulbs stay on", "All bulbs go out", "Bulbs get brighter", "Nothing changes"]', "Series circuits share one path"),
                ("What is the unit of electrical resistance?", "multiple_choice", "Ohm", 
                 '["Volt", "Ampere", "Ohm", "Watt"]', "Resistance is measured in ohms"),
            ]
        }
        
        for quiz_title, questions in quiz_questions.items():
            cursor.execute("SELECT id FROM quizzes WHERE title = %s", (quiz_title,))
            quiz_result = cursor.fetchone()
            if quiz_result:
                quiz_id = quiz_result[0]
                for i, (question, q_type, answer, options, explanation) in enumerate(questions):
                    cursor.execute("""
                        INSERT IGNORE INTO quiz_questions 
                        (quiz_id, question_text, question_type, correct_answer, options, explanation, order_index, points)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """, (quiz_id, question, q_type, answer, options, explanation, i, 2))
        
        conn.commit()
        print("SUCCESS: Sample questions added")
        
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as err:
        print(f"ERROR: Quiz questions error: {err}")
        return False

def add_sample_game_scores():
    """Add sample game scores for testing dashboards"""
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            port=MYSQL_PORT
        )
        cursor = conn.cursor(buffered=True)
        
        print("Adding sample game scores...")
        
        # Get student IDs
        cursor.execute("SELECT id, class FROM users WHERE role = 'student'")
        students = cursor.fetchall()
        
        # Game mapping with class and subject info
        game_mapping = {
            'pizza': {'class_level': 6, 'subject_name': 'Mathematics'},
            'nutrition': {'class_level': 6, 'subject_name': 'Science'},
            'photosynthesis': {'class_level': 7, 'subject_name': 'Science'},
            'equation-unlock': {'class_level': 8, 'subject_name': 'Mathematics'},
            'circuit': {'class_level': 10, 'subject_name': 'Physics'}
        }
        
        for student_id, student_class in students:
            student_class_num = int(student_class) if student_class and student_class.isdigit() else 6
            
            # Add games appropriate for the student's class
            for game_name, game_info in game_mapping.items():
                if game_info['class_level'] <= student_class_num:
                    # Add 1-3 game sessions per appropriate game
                    for session in range(random.randint(1, 3)):
                        score = random.randint(60, 100)
                        level = random.randint(1, 5)
                        time_played = random.randint(5, 30)
                        completed = score >= 80
                        played_at = datetime.now() - timedelta(days=random.randint(1, 30))
                        
                        game_data = {
                            'session': session + 1,
                            'difficulty': 'easy' if score > 85 else 'medium',
                            'mistakes': random.randint(0, 5)
                        }
                        
                        cursor.execute("""
                            INSERT INTO game_scores 
                            (student_id, game_name, class_level, subject_name, score, level_reached, 
                             time_played_minutes, completed, game_data, played_at)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, (
                            student_id, game_name, game_info['class_level'], 
                            game_info['subject_name'], score, level, time_played, 
                            completed, json.dumps(game_data), played_at
                        ))
        
        conn.commit()
        print("SUCCESS: Sample game scores added")
        
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as err:
        print(f"ERROR: Game scores error: {err}")
        return False

def create_indexes():
    """Create database indexes for performance"""
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            port=MYSQL_PORT
        )
        cursor = conn.cursor(buffered=True)
        
        print("Creating database indexes...")
        
        indexes = [
            "CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id)",
            "CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id)",
            "CREATE INDEX idx_quiz_attempts_completed ON quiz_attempts(is_completed)",
            "CREATE INDEX idx_game_scores_student ON game_scores(student_id)",
            "CREATE INDEX idx_game_scores_game ON game_scores(game_name)",
            "CREATE INDEX idx_student_progress_student ON student_quiz_progress(student_id)",
            "CREATE INDEX idx_quizzes_active ON quizzes(is_active)",
            "CREATE INDEX idx_quizzes_type ON quizzes(quiz_type)",
        ]
        
        for index_sql in indexes:
            try:
                cursor.execute(index_sql)
            except mysql.connector.Error as err:
                if "already exists" not in str(err):
                    print(f"Warning: Could not create index: {err}")
        
        conn.commit()
        print("SUCCESS: Database indexes created")
        
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as err:
        print(f"ERROR: Index creation error: {err}")
        return False

def main():
    print("EdUmbrella Complete Database Setup")
    print("=" * 50)
    print(f"Host: {MYSQL_HOST}:{MYSQL_PORT}")
    print(f"Database: {MYSQL_DATABASE}")
    print()
    
    steps = [
        ("Create database", create_database),
        ("Create tables", create_tables),
        ("Insert subjects", insert_subjects),
        ("Insert quiz categories", insert_quiz_categories),
        ("Insert quizzes", insert_game_quizzes),
        ("Insert sample users", insert_sample_users),
        ("Add sample quiz questions", add_sample_quiz_questions),
        ("Add sample game scores", add_sample_game_scores),
        ("Create indexes", create_indexes),
    ]
    
    for step_name, step_func in steps:
        print(f"Step: {step_name}...")
        if not step_func():
            print(f"FAILED at step: {step_name}")
            return
        print()
    
    print("SUCCESS: EdUmbrella database setup completed successfully!")
    print()
    print("CBSE Class-wise Sample Login Credentials:")
    print("Students:")
    print("  - Class 6: student6a@school.com / student123")  
    print("  - Class 7: student7a@school.com / student123")
    print("  - Class 8: student8a@school.com / student123") 
    print("  - Class 10: student10a@school.com / student123")
    print("  - Class 12: student12a@school.com / student123")
    print()
    print("Teachers:")
    print("  - Classes 6,7: teacher6@school.com / teacher123")
    print("  - Classes 8,9: teacher8@school.com / teacher123") 
    print("  - Classes 10,11,12: teacher10@school.com / teacher123")
    print()
    print("Legacy Accounts:")
    print("  - Student: student@edumbrella.com / student123")
    print("  - Teacher: teacher@edumbrella.com / teacher123")
    print("  - Admin: admin@edumbrella.com / admin123")
    print()
    print("CBSE Class-wise Games Available:")
    print("  - Class 6: Pizza Fraction Fun (Math), Nutrition Knowledge Game (Science)")
    print("  - Class 7: Photosynthesis Explorer (Science)")
    print("  - Class 8: Equation Master (Math)")
    print("  - Class 10: Circuit Designer Challenge (Physics)")
    print()
    print("Enhanced Features:")
    print("  - Class-wise dashboard organization (CBSE grades 6-12)")
    print("  - Student progress tracking by class and subject")
    print("  - Teacher multi-class management dashboards")
    print("  - Sample game scores and quiz attempts")
    print("  - Comprehensive quiz questions with explanations")
    print("  - Performance indexes for fast queries")
    print()
    print("You can now start the Flask backend with: python app.py")

if __name__ == "__main__":
    main()