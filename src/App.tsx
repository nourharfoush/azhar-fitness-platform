import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import RegionsPage from './pages/RegionsPage';
import StudentsPage from './pages/StudentsPage';
import AssessmentsPage from './pages/AssessmentsPage';
import MeasurementsPage from './pages/MeasurementsPage';
import ReportsPage from './pages/ReportsPage';
import AdministrationsPage from './pages/AdministrationsPage';
import InstitutesPage from './pages/InstitutesPage';
import CompetitionsPage from './pages/CompetitionsPage';
import FollowUpPage from './pages/FollowUpPage';
import UsersPage from './pages/UsersPage';
import AuditLogPage from './pages/AuditLogPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/regions" element={<RegionsPage />} />
          <Route path="/administrations" element={<AdministrationsPage />} />
          <Route path="/institutes" element={<InstitutesPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/measurements" element={<MeasurementsPage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/followup" element={<FollowUpPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/audit-log" element={<AuditLogPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
