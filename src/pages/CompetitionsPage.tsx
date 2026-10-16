import React, { useState } from 'react';
import {
  Trophy, Award, Medal, Sparkles, CheckCircle2,
  Calendar, Users, ArrowRight, Plus, X, FileText, Star
} from 'lucide-react';
import { useCompetitionStore, useStudentStore, useAuditLogStore, useAuthStore } from '../store';
import type { StudentCompetitionResult } from '../types';

export default function CompetitionsPage() {
  const { competitions, competitionResults, addCompetitionResult } = useCompetitionStore();
  const { students } = useStudentStore();
  const { addLog } = useAuditLogStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'tournaments' | 'qualifiers' | 'rules'>('tournaments');
  const [showAddQualifierModal, setShowAddQualifierModal] = useState(false);

  // Add qualifier form state
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [competitionId, setCompetitionId] = useState(competitions[0]?.id || '');
  const [totalScore, setTotalScore] = useState<number>(95);
  const [rank, setRank] = useState<number>(1);
  const [medal, setMedal] = useState<'gold' | 'silver' | 'bronze' | 'none'>('gold');
  const [notes, setNotes] = useState('');

  const handleAddQualifier = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === studentId);
    const comp = competitions.find((c) => c.id === competitionId);
    if (!st || !comp) return;

    const newRes: StudentCompetitionResult = {
      id: 'cres-' + Date.now(),
      studentId: st.id,
      studentName: st.name,
      instituteName: st.instituteName,
      regionName: st.regionName,
      competitionId: comp.id,
      competitionName: comp.name,
      phaseId: 'phase-national',
      phaseName: 'تصفيات الإدارات والمناطق',
      totalScore,
      rank,
      isQualified: true,
      medal,
      notes: notes.trim() || undefined,
    };

    addCompetitionResult(newRes);

    addLog({
      entityType: 'منافسات وبطولات',
      entityId: newRes.id || 'res',
      action: 'create',
      description: `تسجيل متأهل جديد في ${comp.name}: الطالب ${st.name} بمجموع ${totalScore}`,
      performedBy: user?.name || 'مدير النظام',
      performedByRole: 'مدير النظام',
    });

    setShowAddQualifierModal(false);
    setNotes('');
  };

  const getMedalBadge = (m?: string) => {
    switch (m) {
      case 'gold':
        return (
          <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontWeight: 800 }}>
            🥇 المركز الأول (ميدالية ذهبية)
          </span>
        );
      case 'silver':
        return (
          <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', fontWeight: 800 }}>
            🥈 المركز الثاني (ميدالية فضية)
          </span>
        );
      case 'bronze':
        return (
          <span className="badge" style={{ backgroundColor: '#ffedd5', color: '#9a3412', border: '1px solid #fdba74', fontWeight: 800 }}>
            🥉 المركز الثالث (ميدالية برونزية)
          </span>
        );
      default:
        return (
          <span className="badge badge-success">
            <CheckCircle2 size={12} /> متأهل رسمي
          </span>
        );
    }
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Trophy className="text-primary" size={28} />
            <span>المنافسات والبطولات القومية للياقة البدنية</span>
          </h1>
          <p className="page-subtitle">
            مسار التصفيات من المعهد إلى الإدارة ثم المنطقة والبطولة القومية لقطاع المعاهد الأزهرية
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowAddQualifierModal(true)}>
            <Plus size={16} />
            <span>تسجيل بطل متأهل</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'tournaments' ? 'active' : ''}`}
          onClick={() => setActiveTab('tournaments')}
        >
          البطولات الجارية والمراحل
        </button>
        <button
          className={`tab-btn ${activeTab === 'qualifiers' ? 'active' : ''}`}
          onClick={() => setActiveTab('qualifiers')}
        >
          لوحة شرف الأبطال المتأهلين ({competitionResults.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          اللوائح وشروط التأهل الرسمية
        </button>
      </div>

      {/* Tab 1: Tournaments & Phases */}
      {activeTab === 'tournaments' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
            {competitions.map((comp) => (
              <div key={comp.id} className="card" style={{ borderTop: '4px solid var(--primary)' }}>
                <div className="card-header">
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                      {comp.academicYear}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {comp.name}
                    </h3>
                  </div>
                  <span className="badge badge-success">
                    نشطة حالياً
                  </span>
                </div>

                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {comp.rules}
                </p>

                {/* Phases timeline */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem' }}>
                    مراحل التصفيات والجدول الزمني:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {comp.phases.map((ph, idx) => (
                      <div
                        key={ph.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.65rem 1rem',
                          background: ph.status === 'completed' ? '#f0fdf4' : ph.status === 'active' ? '#ecfdf5' : '#f8fafc',
                          borderRadius: '8px',
                          border: ph.status === 'active' ? '1px solid #a7f3d0' : '1px solid #f1f5f9',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: ph.status === 'completed' ? '#16a34a' : ph.status === 'active' ? 'var(--primary)' : '#cbd5e1',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ph.name}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                            {ph.startDate} إلى {ph.endDate}
                          </span>
                          <span
                            className={`badge ${
                              ph.status === 'completed'
                                ? 'badge-neutral'
                                : ph.status === 'active'
                                ? 'badge-success'
                                : 'badge-warning'
                            }`}
                            style={{ fontSize: '0.75rem' }}
                          >
                            {ph.status === 'completed' ? 'اكتملت' : ph.status === 'active' ? 'جارية' : 'قادمة'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>كوتة التأهل لكل إدارة: {comp.minQualifiers} - {comp.maxQualifiers} طلاب</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--primary)', fontWeight: 700 }}
                    onClick={() => setActiveTab('qualifiers')}
                  >
                    عرض المتأهلين ←
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Hall of Fame & Qualifiers */}
      {activeTab === 'qualifiers' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Award size={22} color="var(--gold)" />
              <span>لوحة شرف الأبطال والمتأهلين لنهائيات الجمهورية</span>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddQualifierModal(true)}>
              <Plus size={14} />
              <span>إضافة بطل متأهل</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>الترتيب والتكريم</th>
                  <th>اسم الطالب البطل</th>
                  <th>المعهد الأزهري</th>
                  <th>المنطقة الأزهرية</th>
                  <th>البطولة والمرحلة</th>
                  <th>مجموع الدرجات</th>
                  <th>ملاحظات اللجنة</th>
                </tr>
              </thead>
              <tbody>
                {competitionResults.map((res) => (
                  <tr key={res.id}>
                    <td>{getMedalBadge(res.medal)}</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>
                      {res.studentName}
                    </td>
                    <td>{res.instituteName || 'معهد أزهري معتمد'}</td>
                    <td>{res.regionName || 'منطقة معتمدة'}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{res.competitionName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{res.phaseName}</div>
                    </td>
                    <td>
                      <div
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 900,
                          color: res.totalScore >= 95 ? '#047857' : '#b45309',
                        }}
                      >
                        {res.totalScore} / 100
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                      {res.notes || 'استوفى معايير التأهل للبطولة'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Official Rules */}
      {activeTab === 'rules' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileText size={22} color="var(--primary)" />
              <span>اللائحة العامة المنظمة للمشروع القومي للياقة البدنية بالأزهر الشريف</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', lineHeight: 1.7 }}>
            <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={18} />
                <span>1. شروط الأهلية والتسجيل</span>
              </div>
              <ul style={{ paddingRight: '1.25rem', fontSize: '0.9rem', color: '#334155' }}>
                <li>أن يكون الطالب مقيداً بشكل رسمي ومنتظم بأحد المعاهد الأزهرية.</li>
                <li>اللياقة الطبية التامة وإجراء الكشف الطبي الدوري للسلامة البدنية.</li>
                <li>موافقة ولي الأمر ومسؤول التربية الرياضية بالمعهد.</li>
              </ul>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '0.75rem' }}>
                <Star size={18} />
                <span>2. معايير التأهل والدرجات</span>
              </div>
              <ul style={{ paddingRight: '1.25rem', fontSize: '0.9rem', color: '#334155' }}>
                <li>الحد الأدنى لدرجة التأهل لبطولة الإدارة: 75% من المجموع الكلي.</li>
                <li>الحد الأدنى للتأهل لنهائيات المنطقة: 85% من المجموع الكلي.</li>
                <li>الحد الأدنى للتأهل لنهائيات بطولة الجمهورية: 90% فأكثر مع تصدر الإدارة.</li>
              </ul>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#1d4ed8', marginBottom: '0.75rem' }}>
                <Award size={18} />
                <span>3. لجان التحكيم والاعتماد</span>
              </div>
              <ul style={{ paddingRight: '1.25rem', fontSize: '0.9rem', color: '#334155' }}>
                <li>تتشكل لجنة التحكيم من موجهي التربية الرياضية وأعضاء التقييم المعتمدين.</li>
                <li>يتم أخذ متوسط محاولتين في اختبارات القوة والوثب العريض.</li>
                <li>النتائج المعتمدة نهائية بعد توقيع منسق المنطقة ورفعها للمنظومة المركزية.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Qualifier Modal */}
      {showAddQualifierModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddQualifierModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Trophy size={20} color="var(--gold)" />
                <span>تسجيل بطل متأهل للمنافسات</span>
              </h3>
              <button className="modal-close" onClick={() => setShowAddQualifierModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddQualifier}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">اختر الطالب:</label>
                  <select
                    className="form-select"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.instituteName} ({s.regionName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">البطولة المستهدفة:</label>
                  <select
                    className="form-select"
                    value={competitionId}
                    onChange={(e) => setCompetitionId(e.target.value)}
                    required
                  >
                    {competitions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">مجموع الدرجات (من 100):</label>
                    <input
                      type="number"
                      min={60}
                      max={100}
                      step={0.5}
                      className="form-input"
                      value={totalScore}
                      onChange={(e) => setTotalScore(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">الترتيب والميدالية:</label>
                    <select
                      className="form-select"
                      value={medal}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setMedal(val);
                        if (val === 'gold') setRank(1);
                        else if (val === 'silver') setRank(2);
                        else if (val === 'bronze') setRank(3);
                        else setRank(4);
                      }}
                    >
                      <option value="gold">🥇 المركز الأول (ذهبية)</option>
                      <option value="silver">🥈 المركز الثاني (فضية)</option>
                      <option value="bronze">🥉 المركز الثالث (برونزية)</option>
                      <option value="none">متأهل للتصفيات القادمة</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ملاحظات ونتائج الاختبارات الاستثنائية:</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="مثال: رقم قياسي في اختبار الجري الزجزاجي"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddQualifierModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  تسجيل المتأهل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
