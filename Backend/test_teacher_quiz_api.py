#!/usr/bin/env python3
"""
Test script for Teacher Quiz API
"""

import requests
import json

BASE_URL = "http://172.20.206.13:5001"

def test_api_endpoints():
    """Test all API endpoints"""
    
    print("🧪 Testing Teacher Quiz API Endpoints")
    print("=" * 50)
    
    # Test 1: Get subjects
    print("\n1. Testing GET /api/subjects")
    try:
        response = requests.get(f"{BASE_URL}/api/subjects")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Found {len(data['subjects'])} subjects")
            for subject in data['subjects']:
                print(f"   - {subject['name']} ({subject['id']}) {subject['icon']}")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Get all quizzes (should be empty initially)
    print("\n2. Testing GET /api/teacher-quizzes")
    try:
        response = requests.get(f"{BASE_URL}/api/teacher-quizzes")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Found {len(data['quizzes'])} quizzes")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Create a test quiz
    print("\n3. Testing POST /api/teacher-quizzes (Create Quiz)")
    test_quiz = {
        "title": "Test Mathematics Quiz",
        "description": "A test quiz for mathematics",
        "subject": "mathematics",
        "teacher_email": "test@example.com",
        "questions": [
            {
                "id": 1,
                "question_text": "What is 2 + 2?",
                "question_type": "multiple_choice",
                "options": ["3", "4", "5", "6"],
                "correct_answer": "4",
                "explanation": "2 + 2 = 4",
                "points": 1
            },
            {
                "id": 2,
                "question_text": "What is 5 × 3?",
                "question_type": "multiple_choice",
                "options": ["15", "12", "18", "20"],
                "correct_answer": "15",
                "explanation": "5 × 3 = 15",
                "points": 1
            }
        ]
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/teacher-quizzes", json=test_quiz)
        if response.status_code == 200:
            data = response.json()
            quiz_id = data['quiz']['id']
            print(f"✅ Success: Created quiz with ID {quiz_id}")
            print(f"   - Title: {data['quiz']['title']}")
            print(f"   - Subject: {data['quiz']['subject']}")
            print(f"   - Questions: {data['quiz']['total_questions']}")
            print(f"   - Status: {data['quiz']['status']}")
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    # Test 4: Get quizzes by subject
    print("\n4. Testing GET /api/teacher-quizzes/mathematics")
    try:
        response = requests.get(f"{BASE_URL}/api/teacher-quizzes/mathematics")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Found {len(data['quizzes'])} mathematics quizzes")
            for quiz in data['quizzes']:
                print(f"   - {quiz['title']} (ID: {quiz['id']})")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 5: Send quiz to students
    print("\n5. Testing POST /api/teacher-quizzes/{quiz_id}/send")
    try:
        response = requests.post(f"{BASE_URL}/api/teacher-quizzes/{quiz_id}/send", 
                               json={"student_class": "6"})
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {data['message']}")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 6: Get all quizzes again (should show the created quiz)
    print("\n6. Testing GET /api/teacher-quizzes (After Creation)")
    try:
        response = requests.get(f"{BASE_URL}/api/teacher-quizzes")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Found {len(data['quizzes'])} quizzes")
            for quiz in data['quizzes']:
                print(f"   - {quiz['title']} ({quiz['subject']}) - Status: {quiz['status']}")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Test completed! Check the teacher_quizzes/ directory for created files.")

if __name__ == "__main__":
    test_api_endpoints()
