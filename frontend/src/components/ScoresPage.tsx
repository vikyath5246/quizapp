import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { scoreAPI } from '../services/api';
import { Score } from '../types';

const ScoresPage: React.FC = () => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculatePercentage = (score: number, total: number) => {
    return Math.round((score / total) * 100);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 80) return 'text-primary';
    if (percentage >= 70) return 'text-warning';
    return 'text-danger';
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return 'bg-success';
    if (percentage >= 80) return 'bg-primary';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-danger';
  };

  const getGradeText = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    return 'F';
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / 1000 / 60);
    
    if (diffMins < 1) return '< 1 min';
    if (diffMins === 1) return '1 min';
    return `${diffMins} mins`;
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
          <h1>Quiz Scores</h1>
          <p className="text-muted">Your quiz performance history</p>
        </div>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
          <button className="btn btn-outline-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Quiz History</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchScores}>
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>

      {scores.length > 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Quiz #</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                        <th>Date Taken</th>
                        <th>Duration</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((score, index) => {
                        const percentage = calculatePercentage(score.score, score.totalQuestions);
                        return (
                          <tr key={score.quizAttemptId}>
                            <td>
                              <strong>#{scores.length - index}</strong>
                            </td>
                            <td>
                              <span className={`badge ${getGradeBadge(percentage)}`}>
                                {score.score}/{score.totalQuestions}
                              </span>
                            </td>
                            <td>
                              <strong className={getGradeColor(percentage)}>
                                {percentage}%
                              </strong>
                            </td>
                            <td>
                              <span className={`badge ${getGradeBadge(percentage)}`}>
                                {getGradeText(percentage)}
                              </span>
                            </td>
                            <td>{formatDate(score.endTime)}</td>
                            <td>{calculateDuration(score.startTime, score.endTime)}</td>
                            <td>
                              <span className={`badge ${percentage >= 70 ? 'bg-success' : 'bg-danger'}`}>
                                {percentage >= 70 ? 'Passed' : 'Failed'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="card">
            <div className="card-body py-5">
              <i className="bi bi-clipboard-data display-1 text-muted mb-4"></i>
              <h3 className="text-muted mb-3">No quiz attempts yet</h3>
              <p className="text-muted mb-4">
                You haven't taken any quizzes yet. Start your first quiz to see your scores here!
              </p>
              <button 
                className="btn btn-primary btn-lg" 
                onClick={() => navigate('/quiz')}
              >
                Take Your First Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {scores.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">Total Quizzes</h5>
                <h2 className="text-primary">{scores.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-success">Average Score</h5>
                <h2 className="text-success">
                  {Math.round(scores.reduce((sum, score) => sum + calculatePercentage(score.score, score.totalQuestions), 0) / scores.length)}%
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-info">Best Score</h5>
                <h2 className="text-info">
                  {Math.max(...scores.map(score => calculatePercentage(score.score, score.totalQuestions)))}%
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoresPage;
