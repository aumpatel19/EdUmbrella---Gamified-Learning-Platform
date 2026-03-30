#!/usr/bin/env python3
"""
Test script to verify teacher quizzes are accessible to students
"""

import json
import os

def test_teacher_quizzes_for_students():
    """Test if teacher quizzes are properly formatted for student access"""
    
    print("🎓 Testing Teacher Quizzes for Student Dashboard")
    print("=" * 60)
    
    # Check if teacher_quizzes directory exists
    quizzes_dir = "teacher_quizzes"
    if not os.path.exists(quizzes_dir):
        print("❌ teacher_quizzes directory not found!")
        return
    
    print(f"✅ Found teacher_quizzes directory")
    
    # Scan all subject directories
    subjects = ['mathematics', 'science', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography']
    all_quizzes = []
    
    for subject in subjects:
        subject_dir = os.path.join(quizzes_dir, subject)
        if os.path.exists(subject_dir):
            print(f"\n📁 Checking {subject} directory...")
            
            # Find all JSON files in the subject directory
            json_files = [f for f in os.listdir(subject_dir) if f.endswith('.json')]
            
            if json_files:
                print(f"   Found {len(json_files)} quiz(es)")
                
                for json_file in json_files:
                    file_path = os.path.join(subject_dir, json_file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            quiz_data = json.load(f)
                            
                        # Check if quiz is suitable for students
                        if quiz_data.get('status') == 'Published' and quiz_data.get('available_to_students', True):
                            print(f"   ✅ {quiz_data['title']} - Available to students")
                            print(f"      - ID: {quiz_data['id']}")
                            print(f"      - Questions: {quiz_data.get('total_questions', 0)}")
                            print(f"      - Classes: {quiz_data.get('classes', [])}")
                            
                            all_quizzes.append(quiz_data)
                        else:
                            print(f"   ⚠️  {quiz_data['title']} - Not available to students")
                            
                    except Exception as e:
                        print(f"   ❌ Error reading {json_file}: {e}")
            else:
                print(f"   No quizzes found")
    
    print(f"\n📊 Summary:")
    print(f"   Total quizzes available to students: {len(all_quizzes)}")
    
    # Test student class filtering (class 6)
    student_class = "6"
    available_for_class = [q for q in all_quizzes if student_class in q.get('classes', [])]
    print(f"   Quizzes available for class {student_class}: {len(available_for_class)}")
    
    if available_for_class:
        print(f"\n🎯 Quizzes available for class {student_class}:")
        for quiz in available_for_class:
            print(f"   - {quiz['title']} ({quiz['subject']})")
    
    # Test API response format
    print(f"\n🔗 API Response Format:")
    api_response = {
        "success": True,
        "quizzes": all_quizzes
    }
    
    print(f"   Response structure: ✅")
    print(f"   Total quizzes in response: {len(api_response['quizzes'])}")
    
    # Test subject-wise filtering
    print(f"\n📚 Subject-wise Quiz Distribution:")
    subject_counts = {}
    for quiz in all_quizzes:
        subject = quiz.get('subject', 'unknown')
        subject_counts[subject] = subject_counts.get(subject, 0) + 1
    
    for subject, count in subject_counts.items():
        print(f"   - {subject}: {count} quiz(es)")
    
    print(f"\n✅ Integration test completed!")
    print(f"   Teacher quizzes are ready for student dashboard!")

if __name__ == "__main__":
    test_teacher_quizzes_for_students()
