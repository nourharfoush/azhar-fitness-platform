import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, BarChart3, FileText,
  Settings, MapPin, Building2, School, ClipboardList,
  Trophy, Eye, Target, ChevronLeft, ChevronRight, LogOut,
  Bell, Shield, UserCircle, ActivitySquare, Search, X
} from 'lucide-react';
import { useAuthStore, useNotificationStore, useUIStore } from '../../store';
import { ROLE_LABELS } from '../../types';
import '../../styles/sidebar.css';

interface NavItemDef {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  allowedRoles?: string[];
}

interface NavGroupDef {
  label: string;
  items: NavItemDef[];
}

const NAV_GROUPS: NavGroupDef[] = [
  {
    label: 'الرئيسية',
    items: [
      { to: '/', icon: <LayoutDashboard size={18} />, label: 'لوحة التحكم' },
      { to: '/about', icon: <BookOpen size={18} />, label: 'عن المشروع' },
    ],
  },
  {
    label: 'الهيكل الإداري',
    items: [
      { to: '/regions', icon: <MapPin size={18} />, label: 'المناطق الأزهرية' },
      { to: '/administrations', icon: <Building2 size={18} />, label: 'الإدارات التعليمية' },
      { to: '/institutes', icon: <School size={18} />, label: 'المعاهد' },
    ],
  },
  {
    label: 'الطلاب والبيانات',
    items: [
      { to: '/students', icon: <Users size={18} />, label: 'الطلاب' },
      { to: '/assessments', icon: <ActivitySquare size={18} />, label: 'بنك الاختبارات' },
      { to: '/measurements', icon: <ClipboardList size={18} />, label: 'القياسات والنتائج' },
    ],
  },
  {
    label: 'المتابعة والتقارير',
    items: [
      { to: '/competitions', icon: <Trophy size={18} />, label: 'المنافسات' },
      { to: '/followup', icon: <Target size={18} />, label: 'المتابعة والتقييم' },
      { to: '/reports', icon: <BarChart3 size={18} />, label: 'التقارير والإحصاءات' },
    ],
  },
  {
    label: 'الإدارة',
    items: [
      { to: '/users', icon: <UserCircle size={18} />, label: 'إدارة المستخدمين' },
      { to: '/audit-log', icon: <Eye size={18} />, label: 'سجل العمليات' },
      { to: '/settings', icon: <Settings size={18} />, label: 'الإعدادات' },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { isSidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const location = useLocation();

  const isCollapsed = !isSidebarOpen;

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((n) => n[0]).join('');

  const handleNavClick = () => {
    if (window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* خلفية معتمة للموبايل لإغلاق القائمة عند النقر خارجها */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* القائمة الجانبية */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isSidebarOpen ? 'open' : ''}`}>
        {/* الشعار */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Shield size={22} color="#fff" />
          </div>
          <div className="logo-text">
            <h1>لياقة الأزهر</h1>
            <p>المشروع القومي للياقة البدنية</p>
          </div>
          <button
            className="sidebar-mobile-close"
            onClick={() => setSidebarOpen(false)}
            title="إغلاق القائمة"
            aria-label="إغلاق القائمة"
          >
            <X size={18} />
          </button>
        </div>

        {/* التنقل */}
        <nav className="sidebar-nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="nav-group">
              <div className="nav-group-label">{group.label}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                  end={item.to === '/'}
                  title={isCollapsed ? item.label : undefined}
                  onClick={handleNavClick}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.label === 'القياسات والنتائج' && unreadCount > 0 && (
                    <span className="nav-badge">{unreadCount}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* تذييل الجانب */}
        <div className="sidebar-footer">
          {/* معلومات المستخدم */}
          <div className="user-info-sidebar" onClick={logout} title="تسجيل الخروج">
            <div className="avatar">
              {user ? getInitials(user.name) : 'م'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'مسؤول المنظومة'}</div>
              <div className="user-role">{user ? ROLE_LABELS[user.role] : 'مدير النظام'}</div>
            </div>
            {!isCollapsed && <LogOut size={15} color="var(--text-muted)" />}
          </div>

          {/* زر طي القائمة للشاشات الكبيرة فقط */}
          <button
            onClick={toggleSidebar}
            className="btn btn-ghost btn-sm sidebar-collapse-btn"
            style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
            title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
          >
            {isCollapsed ? <ChevronLeft size={16} /> : <><ChevronRight size={16} /> <span>طي القائمة</span></>}
          </button>
        </div>
      </aside>
    </>
  );
}
