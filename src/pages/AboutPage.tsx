import React from 'react';
import { Target, Award, BookOpen, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BookOpen size={28} color="#047857" />
            <span>عن المشروع القومي للياقة البدنية</span>
          </h1>
          <p className="page-subtitle">
            قطاع المعاهد الأزهرية — الإدارة المركزية لرعاية الطلاب (العام الدراسي 2026/2027)
          </p>
        </div>
      </div>

      {/* بطاقة الشعار والرسالة */}
      <div style={{
        background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '2.5rem',
        marginBottom: '2rem',
        textAlign: 'center',
        boxShadow: '0 10px 25px -5px rgba(4, 120, 87, 0.3)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <Flame size={36} color="#fbbf24" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', color: '#ffffff' }}>
          «اللياقة البدنية أساس الصحة وبناء الأبطال»
        </h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '650px', margin: '0 auto' }}>
          معًا نبني الإنسان لننهض بالأوطان — مبادرة أزهرية متكاملة لتعزيز الصحة والنشاط الرياضي لطلاب المعاهد
        </p>
      </div>

      {/* الملخص التنفيذي والأهداف */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ShieldCheck size={20} color="#047857" />
              <span>الرؤية والهدف العام</span>
            </div>
          </div>
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '0.95rem' }}>
            تهدف هذه المنظومة الإلكترونية إلى إدارة المشروع القومي للياقة البدنية بالمعاهد الأزهرية،
            ودعم التخطيط والتنفيذ الميداني وتسجيل القياسات وتحليل النتائج ومتابعة المنافسات
            واكتشاف الموهوبين وإصدار التقارير على مستويات المعهد والإدارة التعليمية والمنطقة الأزهرية والإدارة المركزية.
          </p>
          <div className="alert alert-info" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
            <span><strong>نظام مؤسسي موحد:</strong> يعتمد على قاعدة بيانات مركزية وصلاحيات دقيقة لجميع المستويات التعليمية.</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Target size={20} color="#b45309" />
              <span>أهداف المبادرة</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              'توحيد بيانات اللياقة البدنية على مستوى جميع مناطق الجمهورية الـ 27.',
              'توثيق القياسات القبلية والبعدية ومتابعة التطور البدني للطلاب بدقة.',
              'إدارة التصفيات والمنافسات الرسمية على مستوى الإدارات والمناطق وصولاً للتصفيات النهائية.',
              'اكتشاف الطلاب الموهوبين رياضياً وتوجيههم للمسارات الرياضية التخصصية.',
              'إصدار تقارير وإحصاءات دقيقة لصناع القرار برئاسة قطاع المعاهد الأزهرية.'
            ].map((target, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="#047857" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <span style={{ fontSize: '0.92rem', color: '#334155' }}>{target}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
