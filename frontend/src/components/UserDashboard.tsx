import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { scoreAPI } from '../services/api';
import { Score } from '../types';

const UserDashboard: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const data = await scoreAPI.getUserScores();
      setScores(data);
    } catch (err) {
      setError('Failed to fetch scores');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculatePercentage = (score: number, total: number) => {
    return Math.round((score / total) * 100);
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Quiz Dashboard</h1>
          <p className="text-muted">Welcome, {user?.username}</p>
        </div>
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

      {/* Quiz Instructions */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Quiz Instructions</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <h5>How to take the quiz:</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Click "Start Quiz" to begin
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Read each question carefully
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Select one answer from the four options provided
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Use the navigation buttons to move between questions
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  The sidebar shows your progress (green = answered, yellow = not answered)
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Submit your quiz when you're finished
                </li>
              </ul>
            </div>
            <div className="col-md-4 text-center">
              <button
                className="btn btn-success btn-lg mb-3"
                onClick={handleStartQuiz}
                style={{ minWidth: '150px' }}
              >
                Start Quiz
              </button>
              <p className="text-muted small">
                Take your time and answer carefully!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Past Scores */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Quiz History</h4>
          <button className="btn btn-outline-primary btn-sm" onClick={fetchScores}>
            Refresh
          </button>
        </div>
        <div className="card-body">
          {scores.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Quiz #</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date Taken</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <tr key={score.quizAttemptId}>
                      <td>{scores.length - index}</td>
                      <td>
                        <span className={`badge ${score.score === score.totalQuestions ? 'bg-success' : score.score >= score.totalQuestions * 0.7 ? 'bg-warning' : 'bg-danger'}`}>
                          {score.score}/{score.totalQuestions}
                        </span>
                      </td>
                      <td>
                        <strong className={score.score === score.totalQuestions ? 'text-success' : score.score >= score.totalQuestions * 0.7 ? 'text-warning' : 'text-danger'}>
                          {calculatePercentage(score.score, score.totalQuestions)}%
                        </strong>
                      </td>
                      <td>{formatDate(score.endTime)}</td>
                      <td>
                        {Math.round((new Date(score.endTime).getTime() - new Date(score.startTime).getTime()) / 1000 / 60)} min
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-clipboard-data display-1 text-muted"></i>
              <h4 className="text-muted mt-3">No quiz attempts yet</h4>
              <p className="text-muted">Take your first quiz to see your scores here!</p>
              <button className="btn btn-primary" onClick={handleStartQuiz}>
                Start Your First Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
