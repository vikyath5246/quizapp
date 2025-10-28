import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { quizAPI } from '../services/api';
import { Question, QuizSubmissionRequest, AnswerSubmission, QuizResult } from '../types';

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await quizAPI.startQuiz();
      setQuestions(data);
    } catch (err) {
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionId: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questions[currentQuestionIndex].id, optionId);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitQuiz = async () => {
    if (window.confirm('Are you sure you want to submit your quiz? You cannot change your answers after submission.')) {
      setSubmitting(true);
      
      try {
        const submissionData: QuizSubmissionRequest = {
          answers: questions.map(question => ({
            questionId: question.id,
            selectedOptionId: answers.get(question.id) || null
          }))
        };

        const result = await quizAPI.submitQuiz(submissionData);
        setQuizResult(result);
      } catch (err) {
        setError('Failed to submit quiz');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const getQuestionStatus = (questionIndex: number) => {
    const question = questions[questionIndex];
    const isAnswered = answers.has(question.id);
    
    if (quizResult) {
      const questionResult = quizResult.questionResults.find(qr => qr.questionId === question.id);
      if (questionResult) {
        return questionResult.isCorrect ? 'correct' : 'incorrect';
      }
      return 'not-answered';
    }
    
    return isAnswered ? 'answered' : 'not-answered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
      case 'correct':
        return 'bg-success';
      case 'incorrect':
        return 'bg-danger';
      case 'not-answered':
      default:
        return 'bg-warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'answered':
        return 'Answered';
      case 'correct':
        return 'Correct';
      case 'incorrect':
        return 'Incorrect';
      case 'not-answered':
      default:
        return 'Not Answered';
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Quiz Results</h1>
          <div>
            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/')}>
              Back to Dashboard
            </button>
            <button className="btn btn-outline-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Quiz Summary</h4>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-4">
                    <h3 className="text-primary">{quizResult.score}</h3>
                    <p className="text-muted">Score</p>
                  </div>
                  <div className="col-md-4">
                    <h3 className="text-info">{quizResult.totalQuestions}</h3>
                    <p className="text-muted">Total Questions</p>
                  </div>
                  <div className="col-md-4">
                    <h3 className="text-success">{Math.round((quizResult.score / quizResult.totalQuestions) * 100)}%</h3>
                    <p className="text-muted">Percentage</p>
                  </div>
                </div>
              </div>
            </div>

            {quizResult.questionResults.map((questionResult, index) => (
              <div key={questionResult.questionId} className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Question {index + 1}</h5>
                  <span className={`badge ${questionResult.isCorrect ? 'bg-success' : 'bg-danger'}`}>
                    {questionResult.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <div className="card-body">
                  <p className="card-text">{questionResult.questionText}</p>
                  <div className="row">
                    {questionResult.options.map((option) => (
                      <div key={option.id} className="col-md-6 mb-2">
                        <div className={`p-2 rounded ${option.isCorrect ? 'bg-success text-white' : questionResult.selectedOptionId === option.id ? 'bg-danger text-white' : 'bg-light'}`}>
                          {option.optionText}
                          {option.isCorrect && <span className="ms-2">✓ Correct Answer</span>}
                          {questionResult.selectedOptionId === option.id && !option.isCorrect && <span className="ms-2">✗ Your Answer</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Question Status</h5>
              </div>
              <div className="card-body">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  return (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                      <span>Question {index + 1}</span>
                      <span className={`badge ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h3>No questions available</h3>
          <p className="text-muted">Please contact the administrator to add questions.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers.get(currentQuestion.id);

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Quiz - Question {currentQuestionIndex + 1} of {questions.length}</h1>
        <button className="btn btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">{currentQuestion.questionText}</h4>
              
              <div className="mb-4">
                {currentQuestion.options.map((option) => (
                  <div key={option.id} className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      id={`option-${option.id}`}
                      value={option.id}
                      checked={selectedAnswer === option.id}
                      onChange={() => handleAnswerSelect(option.id)}
                    />
                    <label className="form-check-label" htmlFor={`option-${option.id}`}>
                      {option.optionText}
                    </label>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                
                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    className="btn btn-success"
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Question Navigation</h5>
            </div>
            <div className="card-body">
              <div className="row g-2">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  return (
                    <div key={index} className="col-6">
                      <button
                        className={`btn btn-sm w-100 ${index === currentQuestionIndex ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => handleQuestionSelect(index)}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          <span className="me-1">{index + 1}</span>
                          <div className={`rounded-circle ${getStatusColor(status)}`} style={{ width: '8px', height: '8px' }}></div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <hr />
              
              <div className="text-center">
                <button
                  className="btn btn-success w-100"
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              </div>
              
              <div className="mt-3">
                <small className="text-muted">
                  <div className="d-flex align-items-center mb-1">
                    <div className="bg-success rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                    <span>Answered</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-warning rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                    <span>Not Answered</span>
                  </div>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
