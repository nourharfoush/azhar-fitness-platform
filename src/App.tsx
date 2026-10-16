import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, initializeCrossDeviceSync } from './store';
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
  useEffect(() => {
    // 1. تنظيف البيانات التجريبية نهائياً من الذاكرة المحلية للمتصفح (Local Storage)
    const PURGE_KEY = '_azhar_purged_dummy_2026_v4';
    if (!localStorage.getItem(PURGE_KEY)) {
      try {
        localStorage.removeItem('azhar-fitness-students-db');
        localStorage.removeItem('azhar-fitness-institutes');
        localStorage.removeItem('azhar-fitness-competitions');
        localStorage.removeItem('azhar-fitness-followup');
        localStorage.removeItem('azhar-fitness-users');
        localStorage.removeItem('azhar-fitness-audit');
        localStorage.setItem(PURGE_KEY, 'true');
      } catch (e) {
        console.error('Purge error:', e);
      }
    }

    // 2. مزامنة سحابية أولية لكافة الأجهزة عند تشغيل التطبيق وعند التركيز على الصفحة
    initializeCrossDeviceSync();

    const handleFocus = () => {
      initializeCrossDeviceSync();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);
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
