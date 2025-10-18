import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import Dashboard from './dashboard/Dashboard';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - only accessible when NOT logged in */}
      {!user ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Redirect root and any other route to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        /* Protected routes - only accessible when logged in */
        <>
          <Route path="/overview" element={
            <TaskProvider>
              <Dashboard />
            </TaskProvider>
          } />
          <Route path="/tasks" element={
            <TaskProvider>
              <Dashboard />
            </TaskProvider>
          } />
          <Route path="/completed" element={
            <TaskProvider>
              <Dashboard />
            </TaskProvider>
          } />
          {/* Redirect root to overview when logged in */}
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;