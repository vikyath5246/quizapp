import axios from 'axios';
import { AuthRequest, AuthResponse, Question, QuestionRequest, QuizSubmissionRequest, QuizResult, Score } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: AuthRequest): Promise<AuthResponse> =>
    api.post('/auth/login', credentials).then(res => res.data),
  
  signup: (userData: AuthRequest): Promise<AuthResponse> =>
    api.post('/auth/signup', userData).then(res => res.data),
};

export const questionAPI = {
  getAllQuestions: (): Promise<Question[]> =>
    api.get('/questions').then(res => res.data),
  
  getQuestionById: (id: number): Promise<Question> =>
    api.get(`/questions/${id}`).then(res => res.data),
  
  createQuestion: (question: QuestionRequest): Promise<Question> =>
    api.post('/questions', question).then(res => res.data),
  
  updateQuestion: (id: number, question: QuestionRequest): Promise<Question> =>
    api.put(`/questions/${id}`, question).then(res => res.data),
  
  deleteQuestion: (id: number): Promise<void> =>
    api.delete(`/questions/${id}`).then(res => res.data),
};

export const quizAPI = {
  startQuiz: (): Promise<Question[]> =>
    api.get('/quiz/start').then(res => res.data),
  
  submitQuiz: (submission: QuizSubmissionRequest): Promise<QuizResult> =>
    api.post('/quiz/submit', submission).then(res => res.data),
};

export const scoreAPI = {
  getUserScores: (): Promise<Score[]> =>
    api.get('/scores').then(res => res.data),
};

export default api;
