#!/usr/bin/env python3
"""
Test script for teacher dashboard endpoint
"""

from app import get_db_connection
import traceback
import json

def test_teacher_dashboard(teacher_email):
    """Test teacher dashboard functionality"""
    try:
        print(f"Testing teacher dashboard for: {teacher_email}")
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get teacher info
        print("Step 1: Getting teacher info...")
        cursor.execute("SELECT id, name, email, class FROM users WHERE email = %s AND role = 'teacher'", (teacher_email,))
        teacher = cursor.fetchone()
        
        if not teacher:
            return {'error': 'Teacher not found'}, 404
        
        teacher_id = teacher['id']
        teacher_classes = teacher['class'].split(',') if teacher['class'] else []
        print(f"Teacher: {teacher}")
        print(f"Classes: {teacher_classes}")
        
        # Get teacher's students by class
        print("Step 2: Getting students...")
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
        print(f"Found {len(students)} students")
        
        # Get quiz statistics for teacher's classes
        print("Step 3: Getting quiz statistics...")
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
            numeric_classes = [int(c) for c in teacher_classes if c.isdigit()]
            if numeric_classes:
                placeholders = ','.join(['%s'] * len(numeric_classes))
                quiz_stats_query += f" AND q.class_level IN ({placeholders})"
                quiz_stats_query += " GROUP BY q.id ORDER BY q.class_level, s.name"
                cursor.execute(quiz_stats_query, numeric_classes)
            else:
                quiz_stats_query += " GROUP BY q.id ORDER BY q.class_level, s.name"
                cursor.execute(quiz_stats_query)
        else:
            quiz_stats_query += " GROUP BY q.id ORDER BY q.class_level, s.name"
            cursor.execute(quiz_stats_query)
        
        quiz_statistics = cursor.fetchall()
        print(f"Found {len(quiz_statistics)} quiz statistics")
        
        # Simplified result
        result = {
            'teacher': teacher,
            'students': students,
            'quiz_statistics': quiz_statistics,
            'student_performance': [],  # Simplified for now
            'game_performance': [],     # Simplified for now
            'classes': teacher_classes
        }
        
        cursor.close()
        conn.close()
        
        return result
        
    except Exception as e:
        print(f"Error occurred: {e}")
        traceback.print_exc()
        return {'error': 'Failed to fetch teacher dashboard data'}, 500

if __name__ == "__main__":
    result = test_teacher_dashboard('teacher6@school.com')
    print("\nResult:")
    print(json.dumps(result, indent=2, default=str))