import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { questionAPI } from '../services/api';
import { Question, QuestionRequest } from '../types';

const AdminDashboard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<QuestionRequest>({
    questionText: '',
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false }
    ]
  });

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionAPI.getAllQuestions();
      setQuestions(data);
    } catch (err) {
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      questionText: '',
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    });
    setShowModal(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      options: question.options.map(opt => ({
        optionText: opt.optionText,
        isCorrect: opt.isCorrect || false
      }))
    });
    setShowModal(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionAPI.deleteQuestion(id);
        fetchQuestions();
      } catch (err) {
        setError('Failed to delete question');
      }
    }
  };

  const handleOptionChange = (index: number, field: 'optionText' | 'isCorrect', value: string | boolean) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.questionText.trim()) {
      setError('Question text is required');
      return;
    }

    const validOptions = formData.options.filter(opt => opt.optionText.trim());
    if (validOptions.length < 2) {
      setError('At least 2 options are required');
      return;
    }

    const correctOptions = validOptions.filter(opt => opt.isCorrect);
    if (correctOptions.length !== 1) {
      setError('Exactly one correct option is required');
      return;
    }

    try {
      if (editingQuestion) {
        await questionAPI.updateQuestion(editingQuestion.id, formData);
      } else {
        await questionAPI.createQuestion(formData);
      }
      setShowModal(false);
      fetchQuestions();
    } catch (err) {
      setError('Failed to save question');
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Admin Dashboard</h1>
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

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Questions Management</h2>
        <button className="btn btn-primary" onClick={handleAddQuestion}>
          Add New Question
        </button>
      </div>

      <div className="row">
        {questions.map((question) => (
          <div key={question.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Question {question.id}</h5>
                <p className="card-text">{question.questionText}</p>
                <div className="mb-3">
                  <strong>Options:</strong>
                  <ul className="list-unstyled mt-2">
                    {question.options.map((option, index) => (
                      <li key={index} className={option.isCorrect ? 'text-success' : ''}>
                        {option.optionText} {option.isCorrect && '(Correct)'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handleEditQuestion(question)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-5">
          <h4 className="text-muted">No questions found</h4>
          <p className="text-muted">Click "Add New Question" to create your first question.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="questionText" className="form-label">Question Text</label>
                    <textarea
                      className="form-control"
                      id="questionText"
                      rows={3}
                      value={formData.questionText}
                      onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                      required
                    />
                  </div>

                  <h6>Options:</h6>
                  {formData.options.map((option, index) => (
                    <div key={index} className="mb-3">
                      <div className="row">
                        <div className="col-10">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`Option ${index + 1}`}
                            value={option.optionText}
                            onChange={(e) => handleOptionChange(index, 'optionText', e.target.value)}
                          />
                        </div>
                        <div className="col-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="correctOption"
                              checked={option.isCorrect}
                              onChange={() => {
                                const newOptions = formData.options.map((opt, i) => ({
                                  ...opt,
                                  isCorrect: i === index
                                }));
                                setFormData({ ...formData, options: newOptions });
                              }}
                            />
                            <label className="form-check-label">Correct</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingQuestion ? 'Update Question' : 'Add Question'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showModal && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default AdminDashboard;
