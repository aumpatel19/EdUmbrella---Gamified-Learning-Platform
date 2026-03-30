from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# Create quizzes directory if it doesn't exist
QUIZZES_DIR = os.path.join(os.path.dirname(__file__), 'teacher_quizzes')
if not os.path.exists(QUIZZES_DIR):
    os.makedirs(QUIZZES_DIR)

# Create subjects directory structure
SUBJECTS = ['mathematics', 'science', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography']
for subject in SUBJECTS:
    subject_dir = os.path.join(QUIZZES_DIR, subject)
    if not os.path.exists(subject_dir):
        os.makedirs(subject_dir)

@app.route('/api/teacher-quizzes', methods=['GET'])
def get_teacher_quizzes():
    """Get all teacher-created quizzes"""
    try:
        all_quizzes = []
        
        # Scan all subject directories
        for subject in SUBJECTS:
            subject_dir = os.path.join(QUIZZES_DIR, subject)
            if os.path.exists(subject_dir):
                for filename in os.listdir(subject_dir):
                    if filename.endswith('.json'):
                        filepath = os.path.join(subject_dir, filename)
                        with open(filepath, 'r', encoding='utf-8') as f:
                            quiz_data = json.load(f)
                            all_quizzes.append(quiz_data)
        
        return jsonify({
            'success': True,
            'quizzes': all_quizzes
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/teacher-quizzes/<subject>', methods=['GET'])
def get_quizzes_by_subject(subject):
    """Get quizzes for a specific subject"""
    try:
        if subject not in SUBJECTS:
            return jsonify({
                'success': False,
                'error': 'Invalid subject'
            }), 400
        
        subject_dir = os.path.join(QUIZZES_DIR, subject)
        quizzes = []
        
        if os.path.exists(subject_dir):
            for filename in os.listdir(subject_dir):
                if filename.endswith('.json'):
                    filepath = os.path.join(subject_dir, filename)
                    with open(filepath, 'r', encoding='utf-8') as f:
                        quiz_data = json.load(f)
                        quizzes.append(quiz_data)
        
        return jsonify({
            'success': True,
            'subject': subject,
            'quizzes': quizzes
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/teacher-quizzes', methods=['POST'])
def create_teacher_quiz():
    """Create a new teacher quiz"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'subject', 'questions', 'teacher_email']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Generate unique quiz ID
        quiz_id = f"teacher_{uuid.uuid4().hex[:12]}"
        
        # Create quiz object
        quiz = {
            'id': quiz_id,
            'title': data['title'],
            'description': data['description'],
            'subject': data['subject'],
            'subject_name': data.get('subject_name', data['subject'].title()),
            'subject_icon': data.get('subject_icon', '📚'),
            'difficulty': data.get('difficulty', 'medium'),
            'duration_minutes': data.get('duration_minutes', len(data['questions']) * 2),
            'total_questions': len(data['questions']),
            'quiz_type': 'traditional',
            'classes': data.get('classes', ['6', '7', '8', '9', '10', '11', '12']),
            'questions': data['questions'],
            'status': 'Published',
            'responses': 0,
            'created_at': datetime.now().isoformat(),
            'teacher_email': data['teacher_email'],
            'teacher_created': True,
            'available_to_students': True
        }
        
        # Save quiz to subject directory
        subject_dir = os.path.join(QUIZZES_DIR, data['subject'])
        filename = f"{quiz_id}.json"
        filepath = os.path.join(subject_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(quiz, f, indent=2, ensure_ascii=False)
        
        return jsonify({
            'success': True,
            'quiz': quiz,
            'message': 'Quiz created successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/teacher-quizzes/<quiz_id>', methods=['GET'])
def get_quiz_by_id(quiz_id):
    """Get a specific quiz by ID"""
    try:
        # Search through all subject directories
        for subject in SUBJECTS:
            subject_dir = os.path.join(QUIZZES_DIR, subject)
            filename = f"{quiz_id}.json"
            filepath = os.path.join(subject_dir, filename)
            
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    quiz_data = json.load(f)
                    return jsonify({
                        'success': True,
                        'quiz': quiz_data
                    })
        
        return jsonify({
            'success': False,
            'error': 'Quiz not found'
        }), 404
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/teacher-quizzes/<quiz_id>', methods=['PUT'])
def update_quiz(quiz_id):
    """Update an existing quiz"""
    try:
        data = request.get_json()
        
        # Find the quiz file
        quiz_file = None
        for subject in SUBJECTS:
            subject_dir = os.path.join(QUIZZES_DIR, subject)
            filename = f"{quiz_id}.json"
            filepath = os.path.join(subject_dir, filename)
            
            if os.path.exists(filepath):
                quiz_file = filepath
                break
        
        if not quiz_file:
            return jsonify({
                'success': False,
                'error': 'Quiz not found'
            }), 404
        
        # Load existing quiz
        with open(quiz_file, 'r', encoding='utf-8') as f:
            quiz = json.load(f)
        
        # Update quiz data
        for key, value in data.items():
            if key != 'id':  # Don't allow ID changes
                quiz[key] = value
        
        quiz['updated_at'] = datetime.now().isoformat()
        
        # Save updated quiz
        with open(quiz_file, 'w', encoding='utf-8') as f:
            json.dump(quiz, f, indent=2, ensure_ascii=False)
        
        return jsonify({
            'success': True,
            'quiz': quiz,
            'message': 'Quiz updated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/teacher-quizzes/<quiz_id>', methods=['DELETE'])
def delete_quiz(quiz_id):
    """Delete a quiz"""
    try:
        # Find and delete the quiz file
        for subject in SUBJECTS:
            subject_dir = os.path.join(QUIZZES_DIR, subject)
            filename = f"{quiz_id}.json"
            filepath = os.path.join(subject_dir, filename)
            
            if os.path.exists(filepath):
                os.remove(filepath)
                return jsonify({
                    'success': True,
                    'message': 'Quiz deleted successfully'
                })
        
        return jsonify({
            'success': False,
            'error': 'Quiz not found'
        }), 404
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/teacher-quizzes/<quiz_id>/send', methods=['POST'])
def send_quiz_to_students(quiz_id):
    """Mark quiz as sent to students"""
    try:
        data = request.get_json()
        student_class = data.get('student_class', '6')
        
        # Find the quiz file
        quiz_file = None
        for subject in SUBJECTS:
            subject_dir = os.path.join(QUIZZES_DIR, subject)
            filename = f"{quiz_id}.json"
            filepath = os.path.join(subject_dir, filename)
            
            if os.path.exists(filepath):
                quiz_file = filepath
                break
        
        if not quiz_file:
            return jsonify({
                'success': False,
                'error': 'Quiz not found'
            }), 404
        
        # Load and update quiz
        with open(quiz_file, 'r', encoding='utf-8') as f:
            quiz = json.load(f)
        
        quiz['status'] = 'Published'
        quiz['available_to_students'] = True
        quiz['sent_to_class'] = student_class
        quiz['sent_at'] = datetime.now().isoformat()
        
        # Save updated quiz
        with open(quiz_file, 'w', encoding='utf-8') as f:
            json.dump(quiz, f, indent=2, ensure_ascii=False)
        
        return jsonify({
            'success': True,
            'message': f'Quiz sent to class {student_class} successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/subjects', methods=['GET'])
def get_subjects():
    """Get list of available subjects"""
    return jsonify({
        'success': True,
        'subjects': [
            {'id': 'mathematics', 'name': 'Mathematics', 'icon': '🧮'},
            {'id': 'science', 'name': 'Science', 'icon': '🔬'},
            {'id': 'english', 'name': 'English', 'icon': '📚'},
            {'id': 'physics', 'name': 'Physics', 'icon': '⚡'},
            {'id': 'chemistry', 'name': 'Chemistry', 'icon': '🧪'},
            {'id': 'biology', 'name': 'Biology', 'icon': '🧬'},
            {'id': 'history', 'name': 'History', 'icon': '📜'},
            {'id': 'geography', 'name': 'Geography', 'icon': '🌍'}
        ]
    })

if __name__ == '__main__':
    print(f"Teacher Quiz Server starting...")
    print(f"Quizzes will be stored in: {QUIZZES_DIR}")
    print(f"Available subjects: {', '.join(SUBJECTS)}")
    app.run(host='0.0.0.0', port=5001, debug=True)
