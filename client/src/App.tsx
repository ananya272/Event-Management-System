import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Layout from './components/Layout';
import AdminPanel from './components/AdminPanel';
import OrganizerPanel from './components/OrganizerPanel';
import AttendeePanel from './components/AttendeePanel';
import HomePage from './components/HomePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminPanel />;
      case 'organizer':
        return <OrganizerPanel />;
      case 'attendee':
        return <AttendeePanel />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
};

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <AuthGuard>
            <LoginForm />
          </AuthGuard>
        } />
        <Route path="/signup" element={
          <AuthGuard>
            <SignupForm />
          </AuthGuard>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <HomePage />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;