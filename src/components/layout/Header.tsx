import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu, Bell, Sun, Moon, Search, Calendar, ChevronDown,
  Info, AlertTriangle, CheckCircle, X
} from 'lucide-react';
import { useAuthStore, useNotificationStore, useUIStore } from '../../store';
import '../../styles/header.css';

const PAGE_TITLES: Record<string, string> = {
  '/': 'لوحة التحكم',
  '/about': 'عن المشروع',
  '/regions': 'المناطق الأزهرية',
  '/administrations': 'الإدارات التعليمية',
  '/institutes': 'المعاهد',
  '/students': 'الطلاب',
  '/assessments': 'بنك الاختبارات',
  '/measurements': 'القياسات والنتائج',
  '/competitions': 'المنافسات',
  '/followup': 'المتابعة والتقييم',
  '/reports': 'التقارير والإحصاءات',
  '/users': 'إدارة المستخدمين',
  '/audit-log': 'سجل العمليات',
  '/settings': 'الإعدادات',
};

const NOTIF_ICON: Record<string, React.ReactNode> = {
  info:    <Info size={16} color="#3b82f6" />,
  warning: <AlertTriangle size={16} color="#f59e0b" />,
  success: <CheckCircle size={16} color="#10b981" />,
  error:   <AlertTriangle size={16} color="#ef4444" />,
};

const NOTIF_BG: Record<string, string> = {
  info:    'rgba(59,130,246,0.15)',
  warning: 'rgba(245,158,11,0.15)',
  success: 'rgba(16,185,129,0.15)',
  error:   'rgba(239,68,68,0.15)',
};

export default function Header() {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode, activeYearFilter, setYearFilter } = useUIStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const currentTitle = PAGE_TITLES[location.pathname] || 'المنظومة الإلكترونية';

  // إغلاق لوحة الإشعارات عند النقر خارجها
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // تطبيق الوضع الداكن/الفاتح
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  };

  return (
    <header className={`header ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
      {/* يمين الهيدر */}
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button className="header-icon-btn" onClick={toggleSidebar} title="القائمة">
          <Menu size={18} />
        </button>
        <div className="header-breadcrumb">
          <span className="breadcrumb-org">المنظومة الإلكترونية</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{currentTitle}</span>
        </div>
      </div>

      {/* يسار الهيدر */}
      <div className="header-left">
        {/* منتقي العام الدراسي */}
        <div className="year-selector">
          <Calendar size={14} />
          <span>العام {activeYearFilter}</span>
        </div>

        {/* تبديل الوضع الداكن */}
        <button className="header-icon-btn" onClick={toggleDarkMode} title={isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}>
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* الإشعارات */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="header-icon-btn notif-btn"
            onClick={() => setShowNotif((v) => !v)}
            title="الإشعارات"
          >
            <Bell size={17} />
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {showNotif && (
            <div className="notif-panel">
              <div className="notif-header">
                <span className="notif-title">
                  الإشعارات {unreadCount > 0 && <span style={{ color: 'var(--color-danger)', marginRight: '4px' }}>({unreadCount})</span>}
                </span>
                {unreadCount > 0 && (
                  <button className="btn btn-ghost btn-sm" onClick={markAllAsRead}>
                    تحديد الكل كمقروء
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    لا توجد إشعارات
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div
                        className="notif-icon-wrap"
                        style={{ background: NOTIF_BG[n.type] }}
                      >
                        {NOTIF_ICON[n.type]}
                      </div>
                      <div className="notif-content">
                        <div className="notif-item-title">{n.title}</div>
                        <div className="notif-item-msg">{n.message}</div>
                        <div className="notif-time">{formatTime(n.createdAt)}</div>
                      </div>
                      {!n.isRead && (
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: 'var(--color-primary-light)',
                          flexShrink: 0, marginTop: 4
                        }} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
