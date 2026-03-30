const API_BASE_URL = 'http://172.20.206.13:8000';
const TEACHER_QUIZ_API_URL = 'http://172.20.206.13:5001';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async loginStudent(email, password) {
    return this.request('/api/students/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async loginTeacher(email, password) {
    return this.request('/api/teachers/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  // Quiz endpoints
  async getSubjects() {
    return this.request('/api/subjects');
  }

  async getQuizCategories() {
    return this.request('/api/quiz-categories');
  }

  async getQuizzes(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const queryString = queryParams.toString();
    return this.request(`/api/quizzes${queryString ? `?${queryString}` : ''}`);
  }

  async getQuizDetails(quizId) {
    return this.request(`/api/quizzes/${quizId}/questions`);
  }

  async getStudentProgress(email) {
    return this.request('/api/student/quiz-progress', {
      method: 'POST',
      body: { email },
    });
  }

  async startQuiz(quizId, studentEmail) {
    return this.request('/api/quiz/start', {
      method: 'POST',
      body: { quiz_id: quizId, student_email: studentEmail },
    });
  }

  async submitQuiz(attemptId, answers, timeSpentMinutes) {
    return this.request('/api/quiz/submit', {
      method: 'POST',
      body: {
        attempt_id: attemptId,
        answers,
        time_spent_minutes: timeSpentMinutes
      },
    });
  }

  // Game endpoints
  async saveGameScore(studentEmail, gameName, scoreData) {
    return this.request('/api/games/score', {
      method: 'POST',
      body: {
        student_email: studentEmail,
        game_name: gameName,
        ...scoreData
      },
    });
  }

  async getGameLeaderboard(gameName) {
    return this.request(`/api/games/leaderboard/${gameName}`);
  }

  // Dashboard endpoints
  async getStudentDashboard(email) {
    return this.request('/api/dashboard/student', {
      method: 'POST',
      body: { email },
    });
  }

  async getTeacherClasses(email) {
    return this.request('/api/teacher/classes', {
      method: 'POST',
      body: { email },
    });
  }

  async getTeacherDashboard(email) {
    return this.request('/api/dashboard/teacher', {
      method: 'POST',
      body: { email },
    });
  }

  // Teacher Quiz API methods
  async requestTeacherQuiz(endpoint, options = {}) {
    const url = `${TEACHER_QUIZ_API_URL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Teacher Quiz API request failed:', error);
      throw error;
    }
  }

  async getTeacherQuizzes() {
    return this.requestTeacherQuiz('/api/teacher-quizzes');
  }

  async getQuizzesBySubject(subject) {
    return this.requestTeacherQuiz(`/api/teacher-quizzes/${subject}`);
  }

  async createTeacherQuiz(quizData) {
    return this.requestTeacherQuiz('/api/teacher-quizzes', {
      method: 'POST',
      body: quizData,
    });
  }

  async getTeacherQuizById(quizId) {
    return this.requestTeacherQuiz(`/api/teacher-quizzes/${quizId}`);
  }

  async updateTeacherQuiz(quizId, quizData) {
    return this.requestTeacherQuiz(`/api/teacher-quizzes/${quizId}`, {
      method: 'PUT',
      body: quizData,
    });
  }

  async deleteTeacherQuiz(quizId) {
    return this.requestTeacherQuiz(`/api/teacher-quizzes/${quizId}`, {
      method: 'DELETE',
    });
  }

  async sendQuizToStudents(quizId, studentClass) {
    return this.requestTeacherQuiz(`/api/teacher-quizzes/${quizId}/send`, {
      method: 'POST',
      body: { student_class: studentClass },
    });
  }

  async getSubjects() {
    return this.requestTeacherQuiz('/api/subjects');
  }

}

export default new ApiService();
