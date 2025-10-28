export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthRequest {
  username: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  userId: number;
}

export interface Option {
  id: number;
  optionText: string;
  isCorrect?: boolean;
}

export interface Question {
  id: number;
  questionText: string;
  options: Option[];
}

export interface QuestionRequest {
  questionText: string;
  options: {
    optionText: string;
    isCorrect: boolean;
  }[];
}

export interface AnswerSubmission {
  questionId: number;
  selectedOptionId: number | null;
}

export interface QuizSubmissionRequest {
  answers: AnswerSubmission[];
}

export interface QuizResult {
  quizAttemptId: number;
  score: number;
  totalQuestions: number;
  endTime: string;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: number;
  questionText: string;
  options: OptionResult[];
  selectedOptionId: number | null;
  isCorrect: boolean;
}

export interface OptionResult {
  id: number;
  optionText: string;
  isCorrect: boolean;
}

export interface Score {
  quizAttemptId: number;
  score: number;
  totalQuestions: number;
  startTime: string;
  endTime: string;
}
