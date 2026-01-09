import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageSelection } from './screens/LanguageSelection';
import { RoleSelection } from './screens/RoleSelection';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import { ProfileSetup } from './screens/ProfileSetup';
import { LabourHome } from './screens/LabourHome';
import { EmployerHome } from './screens/EmployerHome';
import { PostJob } from './screens/PostJob';
import { Profile } from './screens/Profile';
import { JobDashboard } from './screens/JobDashboard';
import { DebugPanel } from './components/DebugPanel';

// Protected route wrapper component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRole?: 'labour' | 'employer'
}> = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏗️</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to appropriate home based on role
    return <Navigate to={user.role === 'labour' ? '/labour-home' : '/employer-home'} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LanguageSelection />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/profile-setup"
        element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/labour-home"
        element={
          <ProtectedRoute allowedRole="labour">
            <LabourHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer-home"
        element={
          <ProtectedRoute allowedRole="employer">
            <EmployerHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post-job"
        element={
          <ProtectedRoute allowedRole="employer">
            <PostJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-dashboard"
        element={
          <ProtectedRoute allowedRole="employer">
            <JobDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          user ? (
            <Navigate
              to={user.role === 'labour' ? '/labour-home' : '/employer-home'}
              replace
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
          <DebugPanel />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
