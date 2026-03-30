# Teacher Quiz Server

A Flask-based server for managing teacher-created quizzes with local file storage.

## Features

- **Quiz Creation**: Teachers can create custom quizzes with multiple question types
- **Subject Organization**: Quizzes are organized by subject in separate directories
- **Local Storage**: All quizzes are stored as JSON files in the server
- **Student Integration**: Quizzes can be sent to students and appear in their portal
- **RESTful API**: Complete CRUD operations for quiz management

## Directory Structure

```
SIH_Backend/
├── teacher_quiz_server.py          # Main Flask server
├── requirements_teacher_quiz.txt   # Python dependencies
├── start_teacher_quiz_server.py    # Server startup script
└── teacher_quizzes/                # Quiz storage directory
    ├── mathematics/                # Math quizzes
    ├── science/                    # Science quizzes
    ├── english/                    # English quizzes
    ├── physics/                    # Physics quizzes
    ├── chemistry/                  # Chemistry quizzes
    ├── biology/                    # Biology quizzes
    ├── history/                    # History quizzes
    └── geography/                  # Geography quizzes
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd SIH_Backend
pip install -r requirements_teacher_quiz.txt
```

### 2. Start the Server
```bash
# Option 1: Use the startup script
python start_teacher_quiz_server.py

# Option 2: Run directly
python teacher_quiz_server.py
```

The server will start on `http://0.0.0.0:5001`

## API Endpoints

### Quiz Management
- `GET /api/teacher-quizzes` - Get all teacher quizzes
- `GET /api/teacher-quizzes/<subject>` - Get quizzes by subject
- `POST /api/teacher-quizzes` - Create a new quiz
- `GET /api/teacher-quizzes/<quiz_id>` - Get specific quiz
- `PUT /api/teacher-quizzes/<quiz_id>` - Update quiz
- `DELETE /api/teacher-quizzes/<quiz_id>` - Delete quiz

### Student Integration
- `POST /api/teacher-quizzes/<quiz_id>/send` - Send quiz to students

### Utility
- `GET /api/subjects` - Get available subjects

## Quiz Data Structure

```json
{
  "id": "teacher_abc123def456",
  "title": "Basic Algebra Quiz",
  "description": "Fundamental algebra concepts",
  "subject": "mathematics",
  "subject_name": "Mathematics",
  "subject_icon": "🧮",
  "difficulty": "medium",
  "duration_minutes": 15,
  "total_questions": 5,
  "quiz_type": "traditional",
  "classes": ["6", "7", "8", "9", "10", "11", "12"],
  "questions": [
    {
      "id": 1,
      "question_text": "What is 2 + 2?",
      "question_type": "multiple_choice",
      "options": ["3", "4", "5", "6"],
      "correct_answer": "4",
      "explanation": "2 + 2 = 4",
      "points": 1
    }
  ],
  "status": "Published",
  "responses": 0,
  "created_at": "2024-01-15T10:30:00.000Z",
  "teacher_email": "teacher@example.com",
  "teacher_created": true,
  "available_to_students": true
}
```

## Frontend Integration

The frontend has been updated to use this server:

### Teacher Dashboard (`TeacherQuizzes.js`)
- Creates quizzes via `ApiService.createTeacherQuiz()`
- Loads quizzes via `ApiService.getTeacherQuizzes()`
- Sends quizzes via `ApiService.sendQuizToStudents()`

### Student Portal (`Quizzes.js`)
- Loads teacher quizzes via `ApiService.getTeacherQuizzes()`
- Filters by student class and availability

### Quiz Taking (`QuizTaking.js`)
- Loads teacher quizzes via `ApiService.getTeacherQuizById()`
- Supports all quiz types with universal interface

## Subject-Wise Quiz Access

When students open a subject page (e.g., Science), they can access subject-specific quizzes:

1. **Teacher creates quiz** → Stored in `teacher_quizzes/science/`
2. **Teacher sends quiz** → Marked as available to students
3. **Student opens Science page** → Loads science quizzes from server
4. **Student takes quiz** → Universal quiz interface

## Configuration

### Server Settings
- **Host**: `0.0.0.0` (accessible from any IP)
- **Port**: `5001`
- **Debug**: `True` (for development)

### Supported Subjects
- Mathematics (🧮)
- Science (🔬)
- English (📚)
- Physics (⚡)
- Chemistry (🧪)
- Biology (🧬)
- History (📜)
- Geography (🌍)

## Error Handling

The server includes comprehensive error handling:
- Invalid quiz data validation
- File system error handling
- API error responses
- CORS support for frontend integration

## Development

### Adding New Subjects
1. Add subject to `SUBJECTS` list in `teacher_quiz_server.py`
2. Create subject directory in `teacher_quizzes/`
3. Update frontend subject lists if needed

### Customizing Quiz Structure
- Modify the quiz creation endpoint
- Update frontend quiz handling
- Ensure backward compatibility

## Production Deployment

For production deployment:
1. Set `debug=False` in `teacher_quiz_server.py`
2. Use a production WSGI server (e.g., Gunicorn)
3. Set up proper file permissions for quiz storage
4. Configure reverse proxy (e.g., Nginx)
5. Set up SSL certificates

## Troubleshooting

### Common Issues
1. **Port already in use**: Change port in `teacher_quiz_server.py`
2. **Permission errors**: Check file system permissions for quiz directories
3. **CORS errors**: Ensure Flask-CORS is properly configured
4. **Quiz not appearing**: Check quiz status and student class filtering

### Logs
The server provides detailed console logs for debugging:
- Quiz creation/updates
- File operations
- API requests/responses
- Error messages
