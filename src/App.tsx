import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProjectProvider } from '@/context/ProjectContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthLayout } from './pages/auth/layout/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardHome from './pages/DashboardPage';
import { DashboardLayout } from './pages/DashboardPage/layout/DashboardLayout';
import ProjectPage from './pages/ProjectPage';


export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<DashboardLayout />}>
              <Route
                path="/"
                element={<ProtectedRoute><DashboardHome /></ProtectedRoute>}
              />
              <Route
                path="/project/:projectId"
                element={<ProtectedRoute><ProjectPage /></ProtectedRoute>}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
