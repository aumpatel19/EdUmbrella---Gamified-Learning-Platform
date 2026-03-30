# Enhanced EdUmbrella Backend API Documentation

## Overview
The EdUmbrella backend has been enhanced with class-wise organization (Classes 6-12) and comprehensive dashboard functionality for both students and teachers.

## Database Schema Changes

### Enhanced Tables
- **users**: Added `class` field for student/teacher class assignments
- **quizzes**: Added `class_level` field for CBSE class organization (6-12)  
- **quiz_categories**: Added `class_level` field for class-specific categorization
- **game_scores**: Added `class_level` and `subject_name` fields for better tracking

### Class-Game Mapping
```
Class 6: pizza (Math), nutrition (Science)
Class 7: photosynthesis (Science)  
Class 8: equation-unlock (Math)
Class 10: circuit (Physics)
Classes 9, 11, 12: Ready for future games
```

## API Endpoints

### Authentication Endpoints

#### Student Login
```
POST /api/students/login
Content-Type: application/json

{
  "email": "student6a@school.com",
  "password": "student123"
}

Response:
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "student6a@school.com"
  }
}
```

#### Teacher Login  
```
POST /api/teachers/login
Content-Type: application/json

{
  "email": "teacher6@school.com", 
  "password": "teacher123"
}

Response:
{
  "message": "Login successful",
  "user": {
    "id": 5,
    "username": "teacher6@school.com"
  }
}
```

### Dashboard Endpoints

#### Enhanced Student Dashboard
```
POST /api/dashboard/student
Content-Type: application/json

{
  "email": "student6a@school.com"
}

Response:
{
  "student": {
    "id": 1,
    "name": "Alice Johnson", 
    "email": "student6a@school.com",
    "class": "6"
  },
  "overall_stats": {
    "total_quiz_attempts": 5,
    "completed_quizzes": 3,
    "average_score": 82.5,
    "best_score": 95.0,
    "total_time_spent": 120
  },
  "organized_content": {
    "6": {
      "Mathematics": {
        "games": [
          {
            "id": 3,
            "title": "Pizza Fraction Fun",
            "game_component": "pizza",
            "difficulty": "easy",
            "status": "available",
            "subject_name": "Mathematics"
          }
        ],
        "quizzes": []
      },
      "Science": {
        "games": [
          {
            "id": 2,
            "title": "Nutrition Knowledge Game", 
            "game_component": "nutrition",
            "difficulty": "easy",
            "status": "attempted",
            "last_score": 88.0
          }
        ]
      }
    }
  },
  "recent_activity": [
    {
      "activity_type": "game",
      "score": 85,
      "activity_date": "2025-09-12T10:30:00",
      "activity_name": "pizza",
      "subject_name": "Mathematics",
      "class_level": 6
    }
  ],
  "subject_progress": [
    {
      "name": "Mathematics",
      "icon": "math",
      "color": "from-blue-500 to-blue-700",
      "total_content": 2,
      "completed_content": 1,
      "average_score": 82.5
    }
  ]
}
```

#### Teacher Dashboard
```
POST /api/dashboard/teacher
Content-Type: application/json

{
  "email": "teacher6@school.com"
}

Response:
{
  "teacher": {
    "id": 5,
    "name": "Ms. Anderson",
    "email": "teacher6@school.com", 
    "class": "6,7"
  },
  "students": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "student6a@school.com",
      "class": "6"
    }
  ],
  "quiz_statistics": [
    {
      "title": "Pizza Fraction Fun",
      "class_level": 6,
      "quiz_type": "game",
      "subject_name": "Mathematics",
      "total_attempts": 8,
      "completed_attempts": 6,
      "average_score": 78.5
    }
  ],
  "student_performance": [
    {
      "student_name": "Alice Johnson",
      "email": "student6a@school.com",
      "class": "6",
      "total_attempts": 5,
      "completed_quizzes": 3,
      "average_score": 82.5,
      "last_activity": "2025-09-12T10:30:00"
    }
  ],
  "game_performance": [
    {
      "game_name": "pizza",
      "class_level": 6,
      "subject_name": "Mathematics",
      "total_plays": 12,
      "completed_games": 8,
      "average_score": 76.3,
      "best_score": 95
    }
  ],
  "classes": ["6", "7"]
}
```

### Class Content Endpoints

#### Get Class-Specific Content
```
GET /api/class/6/content

Response:
{
  "class_level": 6,
  "content": {
    "Mathematics": {
      "games": [
        {
          "id": 3,
          "title": "Pizza Fraction Fun",
          "description": "Learn fractions by dividing pizzas",
          "class_level": 6,
          "difficulty": "easy",
          "game_component": "pizza"
        }
      ],
      "quizzes": [],
      "subject_info": {
        "name": "Mathematics",
        "icon": "math",
        "color": "from-blue-500 to-blue-700"
      }
    },
    "Science": {
      "games": [
        {
          "id": 2,
          "title": "Nutrition Knowledge Game",
          "game_component": "nutrition"
        }
      ]
    }
  }
}
```

### Game Score Endpoints

#### Save Enhanced Game Score
```
POST /api/games/save-score
Content-Type: application/json

{
  "student_email": "student6a@school.com",
  "game_name": "pizza",
  "score": 85,
  "level_reached": 3,
  "time_played_minutes": 15,
  "completed": true,
  "game_data": {
    "fractions_solved": 8,
    "mistakes": 2
  }
}

Response:
{
  "message": "Game score saved successfully",
  "class_level": 6,
  "subject": "Mathematics"
}
```

#### Get Game Leaderboard
```
GET /api/games/leaderboard/pizza

Response:
{
  "leaderboard": [
    {
      "score": 95,
      "level_reached": 5,
      "time_played_minutes": 18,
      "played_at": "2025-09-12T10:30:00",
      "student_name": "Alice Johnson",
      "email": "student6a@school.com"
    }
  ]
}
```

### Quiz Endpoints (Enhanced)

#### Get Quizzes with Class Filter
```
GET /api/quizzes?class_level=6

Response:
{
  "quizzes": [
    {
      "id": 2,
      "title": "Nutrition Knowledge Game",
      "class_level": 6,
      "subject_name": "Science",
      "quiz_type": "game",
      "game_component": "nutrition"
    }
  ]
}
```

## Sample Accounts

### Students
- `student6a@school.com` / `student123` (Class 6)
- `student6b@school.com` / `student123` (Class 6)  
- `student7a@school.com` / `student123` (Class 7)
- `student8a@school.com` / `student123` (Class 8)
- `student10a@school.com` / `student123` (Class 10)
- `student12a@school.com` / `student123` (Class 12)

### Teachers  
- `teacher6@school.com` / `teacher123` (Classes 6,7)
- `teacher8@school.com` / `teacher123` (Classes 8,9)
- `teacher10@school.com` / `teacher123` (Classes 10,11,12)

## Setup Instructions

1. **Database Setup**:
   ```bash
   cd SIH-Backend
   python setup_enhanced_database.py
   ```

2. **Run Backend**:
   ```bash
   python app.py
   ```
   Backend runs on `http://localhost:5000`

3. **Test Endpoints**:
   Use the sample accounts above to test dashboard functionality.

## Key Features

### For Students
- ✅ Class-wise game and quiz organization
- ✅ Progress tracking by subject  
- ✅ Recent activity timeline
- ✅ Overall statistics and performance metrics
- ✅ Available content based on their class level

### For Teachers
- ✅ Multi-class management (e.g., teacher manages classes 6,7)
- ✅ Student performance monitoring
- ✅ Class-wise game and quiz statistics
- ✅ Comprehensive analytics dashboard
- ✅ Real-time student activity tracking

### Backend Enhancements
- ✅ Class-level content filtering (6-12)
- ✅ Enhanced database schema with class organization
- ✅ Game score tracking with class and subject metadata  
- ✅ Improved dashboard APIs for both user types
- ✅ Sample data for testing and demonstration

## CBSE Class Organization

The system now fully supports CBSE class-wise content:

| Class | Available Games | Subjects |
|-------|----------------|----------|
| 6 | Pizza (Math), Nutrition (Science) | Math, Science |
| 7 | Photosynthesis (Science) | Science |  
| 8 | Equation Unlock (Math) | Math |
| 9 | Ready for content | All subjects |
| 10 | Circuit Designer (Physics) | Physics, Chemistry |
| 11 | Ready for content | Math, Physics, Chemistry |
| 12 | Ready for content | Math, Physics, Chemistry, CS |

The backend is now fully enhanced and ready for production use!