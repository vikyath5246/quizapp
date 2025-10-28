import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import QuizPage from './components/QuizPage';
import ScoresPage from './components/ScoresPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'USER' | 'ADMIN' }> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" replace />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          {user?.role === 'ADMIN' ? <AdminDashboard /> : <UserDashboard />}
        </ProtectedRoute>
      } />
      
      <Route path="/quiz" element={
        <ProtectedRoute requiredRole="USER">
          <QuizPage />
        </ProtectedRoute>
      } />
      
      <Route path="/scores" element={
        <ProtectedRoute requiredRole="USER">
          <ScoresPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
