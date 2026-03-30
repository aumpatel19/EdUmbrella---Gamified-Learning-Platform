#!/usr/bin/env python3
"""
Demo script showing how teacher quizzes are loaded for students
"""

import json
import os

def simulate_student_quiz_loading():
    """Simulate how the student dashboard loads teacher quizzes"""
    
    print("🎓 Student Dashboard - Teacher Quiz Loading Demo")
    print("=" * 60)
    
    # Simulate student class (default is class 6)
    student_class = "6"
    print(f"👨‍🎓 Student Class: {student_class}")
    
    # Load teacher quizzes (simulating API call)
    quizzes_dir = "teacher_quizzes"
    all_quizzes = []
    
    # Scan all subject directories for quizzes
    subjects = ['mathematics', 'science', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography']
    
    for subject in subjects:
        subject_dir = os.path.join(quizzes_dir, subject)
        if os.path.exists(subject_dir):
            json_files = [f for f in os.listdir(subject_dir) if f.endswith('.json')]
            
            for json_file in json_files:
                file_path = os.path.join(subject_dir, json_file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        quiz_data = json.load(f)
                        all_quizzes.append(quiz_data)
                except Exception as e:
                    print(f"❌ Error reading {json_file}: {e}")
    
    print(f"\n📚 Step 1: Load all teacher quizzes from backend")
    print(f"   Found {len(all_quizzes)} total quizzes")
    
    # Filter quizzes for student class
    print(f"\n🔍 Step 2: Filter quizzes for class {student_class}")
    available_quizzes = []
    
    for quiz in all_quizzes:
        # Check if quiz is available to students
        if (quiz.get('status') == 'Published' and 
            quiz.get('available_to_students', True) and
            student_class in quiz.get('classes', [])):
            
            available_quizzes.append(quiz)
            print(f"   ✅ {quiz['title']} ({quiz['subject']}) - Available")
        else:
            print(f"   ❌ {quiz['title']} ({quiz['subject']}) - Not available")
    
    print(f"\n📊 Step 3: Final result for student dashboard")
    print(f"   Quizzes available to student: {len(available_quizzes)}")
    
    if available_quizzes:
        print(f"\n🎯 Available Quizzes in Student Dashboard:")
        for i, quiz in enumerate(available_quizzes, 1):
            print(f"\n   {i}. {quiz['title']}")
            print(f"      📖 Subject: {quiz['subject_name']} {quiz.get('subject_icon', '📚')}")
            print(f"      ⏱️  Duration: {quiz['duration_minutes']} minutes")
            print(f"      ❓ Questions: {quiz['total_questions']}")
            print(f"      🎯 Difficulty: {quiz['difficulty']}")
            print(f"      📝 Description: {quiz['description']}")
            print(f"      🆔 Quiz ID: {quiz['id']}")
    
    # Simulate API response format
    print(f"\n🔗 API Response Format (what frontend receives):")
    api_response = {
        "success": True,
        "quizzes": available_quizzes
    }
    
    print(f"   Response: {json.dumps(api_response, indent=2)}")
    
    # Show how quizzes appear in different sections
    print(f"\n📱 How quizzes appear in Student Dashboard:")
    print(f"   📊 Stats Overview:")
    print(f"      - Total Quizzes: {len(available_quizzes)}")
    print(f"      - Available Quizzes: {len(available_quizzes)}")
    print(f"      - Completed: 0")
    print(f"      - In Progress: 0")
    
    print(f"\n   📚 Available Quizzes Section:")
    for quiz in available_quizzes:
        print(f"      - {quiz['title']} ({quiz['subject_name']})")
    
    print(f"\n   🎯 Subject-wise Distribution:")
    subject_quizzes = {}
    for quiz in available_quizzes:
        subject = quiz['subject_name']
        if subject not in subject_quizzes:
            subject_quizzes[subject] = []
        subject_quizzes[subject].append(quiz['title'])
    
    for subject, quiz_titles in subject_quizzes.items():
        print(f"      - {subject}: {len(quiz_titles)} quiz(es)")
        for title in quiz_titles:
            print(f"        • {title}")
    
    print(f"\n✅ Demo completed!")
    print(f"   Teacher quizzes are successfully integrated with student dashboard!")
    print(f"   Students can now see and take teacher-created quizzes!")

if __name__ == "__main__":
    simulate_student_quiz_loading()
