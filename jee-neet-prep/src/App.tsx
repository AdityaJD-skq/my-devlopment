import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OtpConfirmationPage from './pages/auth/OtpConfirmationPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import Dashboard from './pages/dashboard/Dashboard';
import PreparationTracker from './pages/preparation/PreparationTracker';
import { CustomTest, TestScreen } from './pages/tests';
import TestResults from './pages/results/TestResults';
import QuestionBank from './pages/questionbank/QuestionBank';
import Analytics from './pages/analytics/Analytics';
import FormulaCards from './pages/formulacards/FormulaCards';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import ActivityLogsPage from './pages/admin/ActivityLogsPage';

// Layout components
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import AdminLayout from './components/layout/AdminLayout';

// Zustand store for auth
import useAuthStore from './store/authStore';
import TeacherStudentsPage from './pages/admin/TeacherStudentsPage';

function App() {
  const { isLoggedIn, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth status
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
        <Route path="/confirm-email" element={<OtpConfirmationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected Routes - Redirect to login if not authenticated */}
      <Route element={isLoggedIn ? <Layout /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preparation" element={<PreparationTracker />} />
        <Route path="/custom-test" element={<CustomTest />} />
        <Route path="/test/:testId" element={<TestScreen />} />
        <Route path="/results/:resultId" element={<TestResults />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/formula-cards" element={<FormulaCards />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>

      {/* Admin Routes - Redirect to login if not authenticated */}
      <Route element={isLoggedIn ? <AdminLayout /> : <Navigate to="/login" replace />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/activity" element={<ActivityLogsPage />} />
        <Route path="/admin/students" element={<TeacherStudentsPage />} />
      </Route>

      {/* Redirect based on auth status and role */}
      <Route
        path="*"
        element={
          isLoggedIn ? (
            ['Developer', 'Admin'].includes(user?.role || '') ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App; 