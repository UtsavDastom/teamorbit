import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from '././pages/projectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TasksPage from '././pages/tasksPage';
import UsersPage from './pages/UsersPage';
import LoadingSpinner from './components/common/LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-orbit-bg"><LoadingSpinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-orbit-bg"><LoadingSpinner size="lg" /></div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="users" element={<ProtectedRoute adminOnly><UsersPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#16161f',
              color: '#e2e2f0',
              border: '1px solid #1e1e2e',
              fontFamily: 'Syne, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22d3a0', secondary: '#16161f' } },
            error: { iconTheme: { primary: '#f25a5a', secondary: '#16161f' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
