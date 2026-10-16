import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../../store';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();
  const { isSidebarOpen } = useUIStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className={`main-content ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <main className="page-content animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
