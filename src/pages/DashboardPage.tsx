import React, { useMemo } from 'react';
import {
  Users, Building2, MapPin, Activity,
  CheckCircle, Target, Award, ArrowUpRight, Plus,
  Sparkles, Calendar, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AZHAR_REGIONS } from '../data/organizationData';
import { useAuthStore, useStudentStore } from '../store';
import { ROLE_LABELS } from '../types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { students, sessions } = useStudentStore();

  const totalAdmins = useMemo(() => {
    return AZHAR_REGIONS.reduce((acc, r) => acc + r.administrations.length, 0);
  }, []);

  return (
    <div className="page-container animate-fade-in">
      {/* بطاقة الترحيب الملكية الفاخرة */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '24px',
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '300px',
          height: '100%',
          background: 'radial-gradient(circle at top left, rgba(16, 185, 129, 0.15), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.85rem',
              borderRadius: '999px',
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              color: '#facc15',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '0.75rem'
            }}>
              <Sparkles size={14} />
              <span>المشروع القومي للياقة البدنية — العام الدراسي 2026/2027</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.4rem' }}>
              أهلاً بك، {user?.name || 'مسؤول المنظومة'}
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '650px' }}>
              لوحة المتابعة الإحصائية المركزية لقطاع المعاهد الأزهرية. المنظومة جاهزة لرصد وتسجيل قياسات واختبارات اللياقة البدنية.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/assessments" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px' }}>
              <Activity size={18} />
              <span>حاسبة ومعايير الاختبارات</span>
            </Link>
            <Link to="/students" className="btn btn-secondary" style={{ padding: '0.8rem 1.5rem', borderRadius: '12px' }}>
              <Plus size={18} />
              <span>تسجيل طالب جديد</span>
            </Link>
          </div>
        </div>
      </div>

      {/* المؤشرات الرئيسية المعتمدة */}
      <div className="kpi-grid">
        <div className="kpi-card emerald">
          <div className="kpi-icon-wrap">
            <MapPin size={26} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{AZHAR_REGIONS.length}</div>
            <div className="kpi-label">المناطق الأزهرية</div>
            <div className="kpi-meta">البيانات الرسمية لـ 27 محافظة</div>
          </div>
        </div>

        <div className="kpi-card amber">
          <div className="kpi-icon-wrap">
            <Building2 size={26} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{totalAdmins}</div>
            <div className="kpi-label">الإدارات التعليمية</div>
            <div className="kpi-meta">مطابقة للملف الإداري المعتمد</div>
          </div>
        </div>

        <div className="kpi-card sky">
          <div className="kpi-icon-wrap">
            <Users size={26} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{students.length}</div>
            <div className="kpi-label">الطلاب المسجلون فعلياً</div>
            <div className="kpi-meta">جاهز للرصد الميداني</div>
          </div>
        </div>

        <div className="kpi-card indigo">
          <div className="kpi-icon-wrap">
            <Award size={26} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{sessions.length}</div>
            <div className="kpi-label">جلسات التقييم المكتملة</div>
            <div className="kpi-meta">حسب جداول المعايير الرسمية</div>
          </div>
        </div>
      </div>

      {/* قسم الإجراءات السريعة والمعايير المعتمدة */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Activity size={20} color="var(--color-primary)" />
              <span>محاور الاختبارات البدنية المعتمدة</span>
            </div>
            <Link to="/assessments" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}>
              <span>عرض الدليل كاملاً</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { title: 'المرحلة الابتدائية (بنين / بنات)', desc: 'السرعة (عدو 30م)، الرشاقة (الجري المكوكي)، المرونة (ثني الجذع)، القوة والتحمل (600م)' },
              { title: 'المرحلة الإعدادية (بنين / بنات)', desc: 'السرعة (عدو 50م)، الوثب العريض، ثني الذراعين، الرقود من الجلوس، التحمل الدوري التنفسي (800م)' },
              { title: 'المرحلة الثانوية (بنين / بنات)', desc: 'السرعة (عدو 50م)، ثني الجذع للأمام، الوثب من الثبات، اختبار التحمل (800م بنين / 600م بنات)' },
            ].map((stage, idx) => (
              <div key={idx} style={{
                padding: '1rem',
                borderRadius: 'var(--border-radius-sm)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {stage.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <MapPin size={20} color="var(--color-secondary)" />
              <span>توزيع الإدارات على كبرى المناطق</span>
            </div>
            <Link to="/regions" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-secondary)' }}>
              <span>استعراض كافة الـ 27 منطقة</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {AZHAR_REGIONS.slice(0, 5).map((region) => (
              <div key={region.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}>
                    {region.name.slice(5, 7)}
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {region.name}
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {region.administrations.length} إدارة تعليمية
                    </p>
                  </div>
                </div>
                <span className="badge badge-neutral">
                  {region.administrations.length} إدارات
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
