from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
from mysql.connector import Error
import os
import json
from datetime import datetime, timedelta
import traceback
from decimal import Decimal

app = Flask(__name__)
CORS(app)

# Custom JSON encoder to handle Decimal objects
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

app.json_encoder = DecimalEncoder

# MySQL configuration
MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', 'krushil298')
MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE', 'edumbrella')
MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))

def get_db_connection():
    return mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE,
        port=MYSQL_PORT
    )

def test():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DATABASE()")
    db = cursor.fetchone()
    cursor.close()
    conn.close()
    print(db)

@app.route('/api/teachers/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('email')
        print(username)
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        print("Connecting to the database...")

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s and role= %s", (username,'teacher'))
        user = cursor.fetchone()
        print(user)
        cursor.close()
        conn.close()

        if user and check_password_hash(user['password'], password):
            print("User authenticated successfully.")
            return jsonify({'message': 'Login successful', 'user': {'id': user['id'], 'username': user['email']}}), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({'error': 'An error occurred during login'}), 500
    
@app.route('/api/students/login', methods=['POST'])
def student_login():
    data = request.get_json()
    username = data.get('email')
    print(username)
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s and role= %s", (username,'student'))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and check_password_hash(user['password'], password):
        return jsonify({'message': 'Login successful', 'user': {'id': user['id'], 'username': user['email']}})
    else:
        return jsonify({'error': 'Invalid username or password'}), 401


@app.route('/api/teacher/classes', methods=['GET','POST'])
def classes():
    try:
        data = request.get_json()
        email= data.get('email')
        conn= get_db_connection()
        cursor= conn.cursor(dictionary=True)
        print(email)
        cursor.execute("SELECT class,role from users WHERE email= %s", (email,))
        classes= cursor.fetchone()
        if classes['role'] != 'teacher':
            return jsonify({'error': 'User is not a teacher'}), 403
        cursor.close()
        conn.close()
        return jsonify({'classes': classes['class']}), 200
    except Exception as e:
        print(f"Error fetching classes: {e}")
        return jsonify({'error': 'An error occurred fetching classes'}), 500
    
def hash_password(password):
    return generate_password_hash(password)

def demo_add_user_to_db(email,password, role):
    print("Adding user to the database...")
    conn = get_db_connection()
    cursor = conn.cursor()
    hashed_password = hash_password(password)
    cursor.execute("INSERT INTO users (email, password, role) VALUES (%s, %s, %s)", (email, hashed_password, role))
    conn.commit()
    cursor.close()
    conn.close()
    print(f"User {email} added to the database.")

# ============ QUIZ API ENDPOINTS ============

@app.route('/api/subjects', methods=['GET'])
def get_subjects():
    """Get all subjects"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM subjects ORDER BY name")
        subjects = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({'subjects': subjects}), 200
    except Exception as e:
        print(f"Error fetching subjects: {e}")
        return jsonify({'error': 'Failed to fetch subjects'}), 500

@app.route('/api/quiz-categories', methods=['GET'])
def get_quiz_categories():
    """Get all quiz categories with subject info"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT qc.*, s.name as subject_name, s.icon as subject_icon
            FROM quiz_categories qc
            LEFT JOIN subjects s ON qc.subject_id = s.id
            ORDER BY s.name, qc.name
        """
        cursor.execute(query)
        categories = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({'categories': categories}), 200
    except Exception as e:
        print(f"Error fetching quiz categories: {e}")
        return jsonify({'error': 'Failed to fetch quiz categories'}), 500

@app.route('/api/quizzes', methods=['GET'])
def get_quizzes():
    """Get all active quizzes with filters"""
    try:
        subject_id = request.args.get('subject_id')
        category_id = request.args.get('category_id')
        quiz_type = request.args.get('type', 'all')  # 'all', 'traditional', 'game'
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT q.*, s.name as subject_name, s.icon as subject_icon, s.color as subject_color,
                   qc.name as category_name, qc.icon as category_icon,
                   u.name as teacher_name
            FROM quizzes q
            LEFT JOIN subjects s ON q.subject_id = s.id
            LEFT JOIN quiz_categories qc ON q.category_id = qc.id
            LEFT JOIN users u ON q.teacher_id = u.id
            WHERE q.is_active = TRUE
        """
        
        params = []
        if subject_id:
            query += " AND q.subject_id = %s"
            params.append(subject_id)
        if category_id:
            query += " AND q.category_id = %s"
            params.append(category_id)
        if quiz_type != 'all':
            query += " AND q.quiz_type = %s"
            params.append(quiz_type)
            
        query += " ORDER BY q.created_at DESC"
        
        cursor.execute(query, params)
        quizzes = cursor.fetchall()
        
        # Convert datetime objects to strings
        for quiz in quizzes:
            if quiz['created_at']:
                quiz['created_at'] = quiz['created_at'].isoformat()
            if quiz['updated_at']:
                quiz['updated_at'] = quiz['updated_at'].isoformat()
        
        cursor.close()
        conn.close()
        return jsonify({'quizzes': quizzes}), 200
    except Exception as e:
        print(f"Error fetching quizzes: {e}")
        return jsonify({'error': 'Failed to fetch quizzes'}), 500


@app.route('/api/student/quiz-progress', methods=['POST'])
def get_student_quiz_progress():
    """Get student's quiz progress"""
    try:
        data = request.get_json()
        student_email = data.get('email')
        
        if not student_email:
            return jsonify({'error': 'Student email required'}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get student ID
        cursor.execute("SELECT id FROM users WHERE email = %s AND role = 'student'", (student_email,))
        student = cursor.fetchone()
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        student_id = student['id']
        
        # Get overall stats
        stats_query = """
            SELECT 
                COUNT(*) as total_attempts,
                COUNT(CASE WHEN is_completed = TRUE THEN 1 END) as completed_quizzes,
                COALESCE(AVG(CASE WHEN is_completed = TRUE THEN score END), 0) as average_score,
                COALESCE(MAX(score), 0) as best_score,
                COALESCE(SUM(time_spent_minutes), 0) as total_time_spent
            FROM quiz_attempts 
            WHERE student_id = %s
        """
        cursor.execute(stats_query, (student_id,))
        stats = cursor.fetchone()
        
        # Get subject-wise progress
        subject_progress_query = """
            SELECT 
                s.id, s.name, s.icon, s.color,
                COUNT(qa.id) as total_quizzes,
                COUNT(CASE WHEN qa.is_completed = TRUE THEN 1 END) as completed,
                COALESCE(AVG(CASE WHEN qa.is_completed = TRUE THEN qa.score END), 0) as average_score,
                COALESCE(MAX(qa.score), 0) as best_score
            FROM subjects s
            LEFT JOIN quizzes q ON s.id = q.subject_id
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = %s
            GROUP BY s.id, s.name, s.icon, s.color
            ORDER BY s.name
        """
        cursor.execute(subject_progress_query, (student_id,))
        subject_progress = cursor.fetchall()
        
        # Get recent attempts
        recent_attempts_query = """
            SELECT qa.*, q.title, q.difficulty, s.name as subject_name, s.icon as subject_icon
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.id
            JOIN subjects s ON q.subject_id = s.id
            WHERE qa.student_id = %s AND qa.is_completed = TRUE
            ORDER BY qa.completed_at DESC
            LIMIT 5
        """
        cursor.execute(recent_attempts_query, (student_id,))
        recent_attempts = cursor.fetchall()
        
        # Convert datetime objects
        for attempt in recent_attempts:
            if attempt['started_at']:
                attempt['started_at'] = attempt['started_at'].isoformat()
            if attempt['completed_at']:
                attempt['completed_at'] = attempt['completed_at'].isoformat()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'overall_stats': stats,
            'subject_progress': subject_progress,
            'recent_attempts': recent_attempts
        }), 200
        
    except Exception as e:
        print(f"Error fetching student progress: {e}")
        return jsonify({'error': 'Failed to fetch student progress'}), 500

@app.route('/api/quizzes/<int:quiz_id>/questions', methods=['GET'])
def get_quiz_questions(quiz_id):
    """Get quiz details with questions"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get quiz details
        cursor.execute("""
            SELECT q.*, s.name as subject_name, s.icon as subject_icon
            FROM quizzes q
            LEFT JOIN subjects s ON q.subject_id = s.id
            WHERE q.id = %s AND q.is_active = TRUE
        """, (quiz_id,))
        quiz = cursor.fetchone()
        
        if not quiz:
            return jsonify({'error': 'Quiz not found'}), 404
        
        # Get quiz questions
        cursor.execute("""
            SELECT id, question_text, question_type, correct_answer, options, explanation, points, order_index
            FROM quiz_questions
            WHERE quiz_id = %s
            ORDER BY order_index, id
        """, (quiz_id,))
        questions = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'quiz': quiz,
            'questions': questions
        }), 200
        
    except Exception as e:
        print(f"Error fetching quiz details: {e}")
        return jsonify({'error': 'Failed to fetch quiz details'}), 500

@app.route('/api/quiz/start', methods=['POST'])
def start_quiz():
    """Start a new quiz attempt"""
    try:
        data = request.get_json()
        quiz_id = data.get('quiz_id')
        student_email = data.get('student_email')
        
        if not quiz_id or not student_email:
            return jsonify({'error': 'Quiz ID and student email required'}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get student ID
        cursor.execute("SELECT id FROM users WHERE email = %s AND role = 'student'", (student_email,))
        student = cursor.fetchone()
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Check if quiz exists and is active
        cursor.execute("SELECT * FROM quizzes WHERE id = %s AND is_active = TRUE", (quiz_id,))
        quiz = cursor.fetchone()
        
        if not quiz:
            return jsonify({'error': 'Quiz not found or inactive'}), 404
        
        # Create quiz attempt
        attempt_query = """
            INSERT INTO quiz_attempts (quiz_id, student_id, total_questions, started_at)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(attempt_query, (quiz_id, student['id'], quiz['total_questions'], datetime.now()))
        attempt_id = cursor.lastrowid
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'attempt_id': attempt_id,
            'message': 'Quiz started successfully',
            'duration_minutes': quiz['duration_minutes']
        }), 200
        
    except Exception as e:
        print(f"Error starting quiz: {e}")
        return jsonify({'error': 'Failed to start quiz'}), 500

@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    """Submit quiz answers"""
    try:
        data = request.get_json()
        attempt_id = data.get('attempt_id')
        answers = data.get('answers', {})
        time_spent = data.get('time_spent_minutes', 0)
        
        if not attempt_id:
            return jsonify({'error': 'Attempt ID required'}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get attempt details
        cursor.execute("SELECT * FROM quiz_attempts WHERE id = %s", (attempt_id,))
        attempt = cursor.fetchone()
        
        if not attempt:
            return jsonify({'error': 'Quiz attempt not found'}), 404
            
        if attempt['is_completed']:
            return jsonify({'error': 'Quiz already submitted'}), 400
        
        # Get quiz questions with correct answers
        cursor.execute("""
            SELECT id, correct_answer, points 
            FROM quiz_questions 
            WHERE quiz_id = %s 
            ORDER BY order_index, id
        """, (attempt['quiz_id'],))
        questions = cursor.fetchall()
        
        # Calculate score
        total_points = sum(q['points'] for q in questions)
        earned_points = 0
        correct_answers = 0
        
        for question in questions:
            question_id = str(question['id'])
            if question_id in answers:
                if answers[question_id] == question['correct_answer']:
                    earned_points += question['points']
                    correct_answers += 1
        
        score_percentage = (earned_points / total_points * 100) if total_points > 0 else 0
        
        # Update quiz attempt
        update_query = """
            UPDATE quiz_attempts 
            SET score = %s, correct_answers = %s, time_spent_minutes = %s,
                completed_at = %s, is_completed = TRUE, answers = %s
            WHERE id = %s
        """
        cursor.execute(update_query, (
            round(score_percentage, 2),
            correct_answers,
            time_spent,
            datetime.now(),
            json.dumps(answers),
            attempt_id
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'score': round(score_percentage, 2),
            'correct_answers': correct_answers,
            'total_questions': len(questions),
            'message': 'Quiz submitted successfully'
        }), 200
        
    except Exception as e:
        print(f"Error submitting quiz: {e}")
        return jsonify({'error': 'Failed to submit quiz'}), 500

# ============ GAME INTEGRATION ENDPOINTS ============

# Keep original endpoint for backward compatibility
@app.route('/api/games/score', methods=['POST'])
def save_game_score():
    """Save game score - legacy endpoint"""
    return save_enhanced_game_score()

@app.route('/api/games/leaderboard/<string:game_name>', methods=['GET'])
def get_game_leaderboard(game_name):
    """Get game leaderboard"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT gs.score, gs.level_reached, gs.time_played_minutes, gs.played_at,
                   u.name as student_name, u.email
            FROM game_scores gs
            JOIN users u ON gs.student_id = u.id
            WHERE gs.game_name = %s
            ORDER BY gs.score DESC, gs.level_reached DESC, gs.played_at DESC
            LIMIT 10
        """
        cursor.execute(query, (game_name,))
        leaderboard = cursor.fetchall()
        
        # Convert datetime
        for entry in leaderboard:
            if entry['played_at']:
                entry['played_at'] = entry['played_at'].isoformat()
        
        cursor.close()
        conn.close()
        
        return jsonify({'leaderboard': leaderboard}), 200
        
    except Exception as e:
        print(f"Error fetching leaderboard: {e}")
        return jsonify({'error': 'Failed to fetch leaderboard'}), 500

# ============ DASHBOARD DATA ENDPOINTS ============

@app.route('/api/dashboard/student', methods=['POST'])
def get_student_dashboard():
    """Get enhanced student dashboard data with class-wise organization"""
    try:
        data = request.get_json()
        student_email = data.get('email')
        
        if not student_email:
            return jsonify({'error': 'Student email required'}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get student info with class level
        cursor.execute("SELECT id, name, email, class FROM users WHERE email = %s AND role = 'student'", (student_email,))
        student = cursor.fetchone()
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        student_id = student['id']
        student_class = int(student['class']) if student['class'] and student['class'].isdigit() else None
        
        # Get overall statistics
        stats_query = """
            SELECT 
                COUNT(*) as total_quiz_attempts,
                COUNT(CASE WHEN is_completed = TRUE THEN 1 END) as completed_quizzes,
                COALESCE(AVG(CASE WHEN is_completed = TRUE THEN score END), 0) as average_score,
                COALESCE(MAX(score), 0) as best_score,
                COALESCE(SUM(time_spent_minutes), 0) as total_time_spent
            FROM quiz_attempts 
            WHERE student_id = %s
        """
        cursor.execute(stats_query, (student_id,))
        overall_stats = cursor.fetchone()
        
        # Get class-wise available games and quizzes
        class_content_query = """
            SELECT 
                q.id, q.title, q.description, q.class_level, q.difficulty, q.duration_minutes, 
                q.total_questions, q.quiz_type, q.game_component,
                s.name as subject_name, s.icon as subject_icon, s.color as subject_color,
                qc.name as category_name, qc.icon as category_icon,
                CASE WHEN qa.id IS NOT NULL THEN 'attempted' ELSE 'available' END as status,
                qa.score as last_score
            FROM quizzes q
            JOIN subjects s ON q.subject_id = s.id
            LEFT JOIN quiz_categories qc ON q.category_id = qc.id
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = %s 
                AND qa.is_completed = TRUE
                AND qa.id = (SELECT MAX(id) FROM quiz_attempts WHERE quiz_id = q.id AND student_id = %s)
            WHERE q.is_active = TRUE
        """
        
        if student_class:
            class_content_query += " AND q.class_level = %s"
            cursor.execute(class_content_query + " ORDER BY q.quiz_type, s.name, q.title", (student_id, student_id, student_class))
        else:
            cursor.execute(class_content_query + " ORDER BY q.quiz_type, s.name, q.title", (student_id, student_id))
        
        class_content = cursor.fetchall()
        
        # Organize by class level and subject
        organized_content = {}
        for item in class_content:
            class_level = item['class_level']
            subject = item['subject_name']
            
            if class_level not in organized_content:
                organized_content[class_level] = {}
            if subject not in organized_content[class_level]:
                organized_content[class_level][subject] = {
                    'games': [],
                    'quizzes': []
                }
            
            if item['quiz_type'] == 'game':
                organized_content[class_level][subject]['games'].append(item)
            else:
                organized_content[class_level][subject]['quizzes'].append(item)
        
        # Get recent activity
        recent_activity_query = """
            SELECT 'quiz' as activity_type, qa.score, qa.completed_at as activity_date, 
                   q.title as activity_name, s.name as subject_name, s.icon as subject_icon,
                   q.class_level
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.id
            JOIN subjects s ON q.subject_id = s.id
            WHERE qa.student_id = %s AND qa.is_completed = TRUE
            
            UNION ALL
            
            SELECT 'game' as activity_type, gs.score, gs.played_at as activity_date,
                   gs.game_name as activity_name, gs.subject_name, 'game' as subject_icon,
                   gs.class_level
            FROM game_scores gs
            WHERE gs.student_id = %s
            
            ORDER BY activity_date DESC
            LIMIT 10
        """
        cursor.execute(recent_activity_query, (student_id, student_id))
        recent_activity = cursor.fetchall()
        
        # Get subject-wise progress
        subject_progress_query = """
            SELECT 
                s.name, s.icon, s.color,
                COUNT(DISTINCT q.id) as total_content,
                COUNT(DISTINCT CASE WHEN qa.is_completed = TRUE THEN q.id END) as completed_content,
                COALESCE(AVG(CASE WHEN qa.is_completed = TRUE THEN qa.score END), 0) as average_score
            FROM subjects s
            LEFT JOIN quizzes q ON s.id = q.subject_id AND q.is_active = TRUE
        """
        
        if student_class:
            subject_progress_query += " AND q.class_level = %s"
            subject_progress_query += """
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = %s
            GROUP BY s.id, s.name, s.icon, s.color
            ORDER BY s.name
            """
            cursor.execute(subject_progress_query, (student_class, student_id))
        else:
            subject_progress_query += """
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id AND qa.student_id = %s
            GROUP BY s.id, s.name, s.icon, s.color
            ORDER BY s.name
            """
            cursor.execute(subject_progress_query, (student_id,))
        
        subject_progress = cursor.fetchall()
        
        # Convert datetimes
        for activity in recent_activity:
            if activity['activity_date']:
                activity['activity_date'] = activity['activity_date'].isoformat()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'student': student,
            'overall_stats': overall_stats,
            'organized_content': organized_content,
            'recent_activity': recent_activity,
            'subject_progress': subject_progress
        }), 200
        
    except Exception as e:
        print(f"Error fetching student dashboard: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch dashboard data'}), 500

# ============ TEACHER DASHBOARD ENDPOINTS ============

@app.route('/api/dashboard/teacher', methods=['POST'])
def get_teacher_dashboard():
    """Get teacher dashboard data with class management"""
    try:
        data = request.get_json()
        teacher_email = data.get('email')
        
        if not teacher_email:
            return jsonify({'error': 'Teacher email required'}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get teacher info
        cursor.execute("SELECT id, name, email, class FROM users WHERE email = %s AND role = 'teacher'", (teacher_email,))
        teacher = cursor.fetchone()
        
        if not teacher:
            return jsonify({'error': 'Teacher not found'}), 404
        
        teacher_id = teacher['id']
        teacher_classes = teacher['class'].split(',') if teacher['class'] else []
        
        # Get teacher's students by class
        students_query = """
            SELECT id, name, email, class
            FROM users 
            WHERE role = 'student'
        """
        
        if teacher_classes:
            placeholders = ','.join(['%s'] * len(teacher_classes))
            students_query += f" AND class IN ({placeholders})"
            cursor.execute(students_query, teacher_classes)
        else:
            cursor.execute(students_query)
        
        students = cursor.fetchall()
        
        # Get quiz statistics for teacher's classes
        quiz_stats_query = """
            SELECT 
                q.title, q.class_level, q.quiz_type,
                s.name as subject_name,
                COUNT(qa.id) as total_attempts,
                COUNT(CASE WHEN qa.is_completed = TRUE THEN 1 END) as completed_attempts,
                COALESCE(AVG(CASE WHEN qa.is_completed = TRUE THEN qa.score END), 0) as average_score
            FROM quizzes q
            JOIN subjects s ON q.subject_id = s.id
            LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
            WHERE q.is_active = TRUE
        """
        
        if teacher_classes:
            placeholders = ','.join(['%s'] * len([int(c) for c in teacher_classes if c.isdigit()]))
            if placeholders:
                quiz_stats_query += f" AND q.class_level IN ({placeholders})"
                cursor.execute(quiz_stats_query + " GROUP BY q.id ORDER BY q.class_level, s.name", 
                             [int(c) for c in teacher_classes if c.isdigit()])
            else:
                cursor.execute(quiz_stats_query + " GROUP BY q.id ORDER BY q.class_level, s.name")
        else:
            cursor.execute(quiz_stats_query + " GROUP BY q.id ORDER BY q.class_level, s.name")
        
        quiz_statistics = cursor.fetchall()
        
        # Get student performance by class (simplified)
        performance_query = """
            SELECT 
                u.name as student_name, u.email, u.class,
                COUNT(DISTINCT qa.id) as total_attempts,
                COUNT(DISTINCT CASE WHEN qa.is_completed = TRUE THEN qa.id END) as completed_quizzes,
                COALESCE(AVG(CASE WHEN qa.is_completed = TRUE THEN qa.score END), 0) as average_score
            FROM users u
            LEFT JOIN quiz_attempts qa ON u.id = qa.student_id
            WHERE u.role = 'student'
        """
        
        if teacher_classes:
            placeholders = ','.join(['%s'] * len(teacher_classes))
            performance_query += f" AND u.class IN ({placeholders})"
            performance_query += " GROUP BY u.id, u.name, u.email, u.class ORDER BY u.class, average_score DESC"
            cursor.execute(performance_query, teacher_classes)
        else:
            performance_query += " GROUP BY u.id, u.name, u.email, u.class ORDER BY u.class, average_score DESC"
            cursor.execute(performance_query)
        
        student_performance = cursor.fetchall()
        
        # Get class-wise game performance (simplified)
        game_performance_query = """
            SELECT 
                gs.game_name, gs.class_level, gs.subject_name,
                COUNT(gs.id) as total_plays,
                COUNT(CASE WHEN gs.completed = TRUE THEN 1 END) as completed_games,
                COALESCE(AVG(gs.score), 0) as average_score,
                COALESCE(MAX(gs.score), 0) as best_score
            FROM game_scores gs
            JOIN users u ON gs.student_id = u.id
            WHERE u.role = 'student'
        """
        
        numeric_classes = [int(c) for c in teacher_classes if c.isdigit()] if teacher_classes else []
        if numeric_classes:
            placeholders = ','.join(['%s'] * len(numeric_classes))
            game_performance_query += f" AND gs.class_level IN ({placeholders})"
            game_performance_query += " GROUP BY gs.game_name, gs.class_level, gs.subject_name ORDER BY gs.class_level, gs.game_name"
            cursor.execute(game_performance_query, numeric_classes)
        else:
            game_performance_query += " GROUP BY gs.game_name, gs.class_level, gs.subject_name ORDER BY gs.class_level, gs.game_name"
            cursor.execute(game_performance_query)
        
        game_performance = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'teacher': teacher,
            'students': students,
            'quiz_statistics': quiz_statistics,
            'student_performance': student_performance,
            'game_performance': game_performance,
            'classes': teacher_classes
        }), 200
        
    except Exception as e:
        print(f"Error fetching teacher dashboard: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to fetch teacher dashboard data'}), 500

@app.route('/api/class/<int:class_level>/content', methods=['GET'])
def get_class_content(class_level):
    """Get all games and quizzes for a specific class level"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT 
                q.id, q.title, q.description, q.class_level, q.difficulty, q.duration_minutes,
                q.total_questions, q.quiz_type, q.game_component,
                s.name as subject_name, s.icon as subject_icon, s.color as subject_color,
                qc.name as category_name, qc.icon as category_icon
            FROM quizzes q
            JOIN subjects s ON q.subject_id = s.id
            LEFT JOIN quiz_categories qc ON q.category_id = qc.id
            WHERE q.is_active = TRUE AND q.class_level = %s
            ORDER BY s.name, q.quiz_type, q.title
        """
        
        cursor.execute(query, (class_level,))
        content = cursor.fetchall()
        
        # Organize by subject and type
        organized = {}
        for item in content:
            subject = item['subject_name']
            if subject not in organized:
                organized[subject] = {
                    'games': [],
                    'quizzes': [],
                    'subject_info': {
                        'name': subject,
                        'icon': item['subject_icon'],
                        'color': item['subject_color']
                    }
                }
            
            if item['quiz_type'] == 'game':
                organized[subject]['games'].append(item)
            else:
                organized[subject]['quizzes'].append(item)
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'class_level': class_level,
            'content': organized
        }), 200
        
    except Exception as e:
        print(f"Error fetching class content: {e}")
        return jsonify({'error': 'Failed to fetch class content'}), 500

@app.route('/api/games/save-score', methods=['POST'])
def save_enhanced_game_score():
    """Enhanced game score saving with class and subject info"""
    try:
        data = request.get_json()
        student_email = data.get('student_email')
        game_name = data.get('game_name')
        score = data.get('score', 0)
        level_reached = data.get('level_reached', 1)
        time_played = data.get('time_played_minutes', 0)
        completed = data.get('completed', False)
        game_data = data.get('game_data', {})
        
        if not student_email or not game_name:
            return jsonify({'error': 'Student email and game name required'}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get student info with class
        cursor.execute("SELECT id, class FROM users WHERE email = %s AND role = 'student'", (student_email,))
        student = cursor.fetchone()
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Get game info to determine class level and subject
        game_mapping = {
            'pizza': {'class_level': 6, 'subject': 'Mathematics'},
            'nutrition': {'class_level': 6, 'subject': 'Science'},
            'photosynthesis': {'class_level': 7, 'subject': 'Science'},
            'equation-unlock': {'class_level': 8, 'subject': 'Mathematics'},
            'circuit': {'class_level': 10, 'subject': 'Physics'}
        }
        
        game_info = game_mapping.get(game_name, {'class_level': None, 'subject': 'General'})
        
        # Save enhanced game score
        insert_query = """
            INSERT INTO game_scores 
            (student_id, game_name, class_level, subject_name, score, level_reached, 
             time_played_minutes, completed, game_data)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            student['id'], game_name, game_info['class_level'], game_info['subject'],
            score, level_reached, time_played, completed, json.dumps(game_data)
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'message': 'Game score saved successfully',
            'class_level': game_info['class_level'],
            'subject': game_info['subject']
        }), 200
        
    except Exception as e:
        print(f"Error saving enhanced game score: {e}")
        return jsonify({'error': 'Failed to save game score'}), 500


if __name__ == '__main__':
    # demo_add_user_to_db('student@booking.com','student123', 'student')
    # demo_add_user_to_db('teacher@school.com','teacher123', 'teacher')
    app.run(debug=True, host="0.0.0.0", port=8000)