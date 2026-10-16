import React, { useState } from 'react';
import {
  Target, Plus, Calendar, CheckCircle, AlertTriangle,
  FileCheck, Shield, Award, ClipboardCheck, X, Search
} from 'lucide-react';
import { useFollowUpStore, useInstituteStore, useAuditLogStore, useAuthStore } from '../store';
import type { FieldVisit } from '../types';

export default function FollowUpPage() {
  const { fieldVisits, addFieldVisit } = useFollowUpStore();
  const { institutes } = useInstituteStore();
  const { addLog } = useAuditLogStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'visits' | 'performance'>('visits');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [instituteId, setInstituteId] = useState(institutes[0]?.id || '');
  const [visitorName, setVisitorName] = useState(user?.name || 'ك/ موجه التربية الرياضية');
  const [visitorRole, setVisitorRole] = useState('موجه التربية الرياضية بالإدارة');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [purpose, setPurpose] = useState('متابعة سير القياسات البدنية ومطابقة السجلات الورقية');
  const [classesAttended, setClassesAttended] = useState(true);
  const [recordsChecked, setRecordsChecked] = useState(true);
  const [testsPerformed, setTestsPerformed] = useState(true);
  const [facilitiesCheck, setFacilitiesCheck] = useState(true);
  const [awarenessCheck, setAwarenessCheck] = useState(true);
  const [rating, setRating] = useState<'excellent' | 'very_good' | 'good' | 'needs_improvement'>('excellent');
  const [recommendations, setRecommendations] = useState('');
  const [nextVisitDate, setNextVisitDate] = useState('');

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const inst = institutes.find((i) => i.id === instituteId);
    if (!inst) return;

    let score = 70;
    if (rating === 'excellent') score = 96;
    else if (rating === 'very_good') score = 88;
    else if (rating === 'good') score = 78;
    else score = 62;

    const newVisit: FieldVisit = {
      id: 'visit-' + Date.now(),
      visitDate,
      instituteId: inst.id,
      instituteName: inst.name,
      administrationId: inst.administrationId,
      administrationName: inst.administrationName,
      regionName: inst.regionName,
      visitorName,
      visitorRole,
      purpose,
      classesAttended,
      recordsChecked,
      testsPerformed,
      facilitiesCheck,
      awarenessCheck,
      rating,
      score,
      recommendations: recommendations.trim() || 'لا توجد ملاحظات سلبية، الاستمرار على نفس المستوى.',
      nextVisitDate: nextVisitDate || undefined,
    };

    addFieldVisit(newVisit);

    addLog({
      entityType: 'متابعة ميدانية',
      entityId: newVisit.id,
      action: 'create',
      description: `تسجيل زيارة ميدانية لمعهد: ${inst.name} بواسطة ${visitorName}`,
      performedBy: user?.name || visitorName,
      performedByRole: visitorRole,
    });

    setShowAddModal(false);
    setRecommendations('');
  };

  const filteredVisits = fieldVisits.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (v.instituteName && v.instituteName.toLowerCase().includes(q)) ||
      v.visitorName.toLowerCase().includes(q) ||
      (v.regionName && v.regionName.toLowerCase().includes(q))
    );
  });

  const getRatingBadge = (r?: string) => {
    switch (r) {
      case 'excellent':
        return <span className="badge badge-success">متميز (أداء ممتاز)</span>;
      case 'very_good':
        return <span className="badge badge-primary">جيد جداً (مستوفٍ)</span>;
      case 'good':
        return <span className="badge badge-warning">جيد (يحتاج تحسين)</span>;
      default:
        return <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>بحاجة لدعم عاجل</span>;
    }
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Target className="text-primary" size={28} />
            <span>المتابعة والتقييم الميداني</span>
          </h1>
          <p className="page-subtitle">
            سجلات الزيارات الميدانية لموجهي التربية الرياضية ومؤشرات جودة الرصد والتجهيزات
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>تسجيل زيارة ميدانية</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
            <ClipboardCheck size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">{fieldVisits.length}</div>
            <div className="kpi-label">إجمالي الزيارات الموثقة</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
            <Award size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">
              {fieldVisits.filter((v) => v.rating === 'excellent' || v.rating === 'very_good').length}
            </div>
            <div className="kpi-label">معاهد ذات أداء متميز</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <FileCheck size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">100%</div>
            <div className="kpi-label">مطابقة السجلات الورقية</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Shield size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">معتمد</div>
            <div className="kpi-label">جاهزية ملاعب القياس</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'visits' ? 'active' : ''}`}
          onClick={() => setActiveTab('visits')}
        >
          سجل الزيارات الميدانية ({fieldVisits.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          مؤشرات جودة المعاهد والتجهيزات
        </button>
      </div>

      {activeTab === 'visits' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ClipboardCheck size={20} color="var(--primary)" />
              <span>تقارير الزيارات والتفتيش الميداني</span>
            </div>
            <div style={{ position: 'relative', width: '250px' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingRight: '2rem' }}
                placeholder="بحث بالمعهد أو الموجه..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={15} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>تاريخ الزيارة</th>
                  <th>المعهد الأزهري المستهدف</th>
                  <th>الموجه / المشرف الزائر</th>
                  <th>عناصر التحقق الميداني</th>
                  <th>التقييم العام</th>
                  <th>التوصيات والملاحظات</th>
                  <th>المتابعة القادمة</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit) => (
                  <tr key={visit.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{visit.visitDate}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--primary)' }}>
                        {visit.instituteName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {visit.regionName} — {visit.administrationName}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{visit.visitorName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{visit.visitorRole}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span className={`badge ${visit.recordsChecked ? 'badge-success' : 'badge-warning'}`}>
                          {visit.recordsChecked ? '✓ السجلات سليمة' : '✕ السجلات ناقصة'}
                        </span>
                        <span className={`badge ${visit.facilitiesCheck ? 'badge-success' : 'badge-warning'}`}>
                          {visit.facilitiesCheck ? '✓ الأدوات جاهزة' : '✕ نقص أدوات'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div>{getRatingBadge(visit.rating)}</div>
                      {visit.score && (
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginTop: '0.2rem' }}>
                          الدرجة: {visit.score} / 100
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: '0.88rem', color: '#334155', maxWidth: '300px' }}>
                      {visit.recommendations}
                    </td>
                    <td>
                      {visit.nextVisitDate ? (
                        <span className="badge badge-neutral">
                          <Calendar size={12} /> {visit.nextVisitDate}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>غير محدد</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">معايير فحص المعهد الأزهري</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: 700, color: '#166534', marginBottom: '0.25rem' }}>1. سلامة أدوات القياس البدني</div>
                <div>شريط قياس مدرج، ميزان رقمي معاير، ساعات إيقاف دقيقة، وشواخص الجري الزجزاجي.</div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: '0.25rem' }}>2. انتظام حصص التربية الرياضية</div>
                <div>حضور الطلاب بالزي الرياضي المناسب، وممارسة تمرينات الإحماء والتهيئة البدنية.</div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <div style={{ fontWeight: 700, color: '#92400e', marginBottom: '0.25rem' }}>3. دقة الرصد الإلكتروني الفوري</div>
                <div>إدخال القياسات على المنظومة أولاً بأول، وتدقيق أي قيم شاذة فوراً مع المحكمين.</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">توجيهات لجان المتابعة والتوجيه الفني</div>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.8 }}>
              بناءً على تعليمات الإدارة العامة للتربية الرياضية بقطاع المعاهد الأزهرية:
            </p>
            <ul style={{ paddingRight: '1.25rem', marginTop: '0.5rem', lineHeight: 1.8, fontSize: '0.9rem', color: '#334155' }}>
              <li>ضرورة قيام موجه الإدارة بزيارة معاهد نطاقه مرتين على الأقل خلال الفصل الدراسي.</li>
              <li>التحقق من توقيع ولي الأمر على إقرار الحالة الصحية للطالب.</li>
              <li>رفع تقارير المعاهد المتعثرة لمنسق المنطقة لاتخاذ الإجراءات الداعمة وتوفير الأدوات البديلة.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Add Visit Modal */}
      {showAddModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Target size={20} color="var(--primary)" />
                <span>تسجيل تقرير زيارة ميدانية جديدة</span>
              </h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddVisit}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">المعهد الأزهري المرصود:</label>
                  <select
                    className="form-select"
                    value={instituteId}
                    onChange={(e) => setInstituteId(e.target.value)}
                    required
                  >
                    {institutes.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} — {i.regionName} ({i.administrationName})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">اسم الموجه / المشرف الزائر:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">الصفة / الدور الوظيفي:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={visitorRole}
                      onChange={(e) => setVisitorRole(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">تاريخ الزيارة الميدانية:</label>
                    <input
                      type="date"
                      className="form-input"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">التقييم العام للمعهد:</label>
                    <select
                      className="form-select"
                      value={rating}
                      onChange={(e) => setRating(e.target.value as any)}
                    >
                      <option value="excellent">متميز (أداء ممتاز 90-100%)</option>
                      <option value="very_good">جيد جداً (80-89%)</option>
                      <option value="good">جيد (70-79%)</option>
                      <option value="needs_improvement">بحاجة لتحسين وتوفير تجهيزات</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">بنود التحقق الميداني:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={recordsChecked}
                        onChange={(e) => setRecordsChecked(e.target.checked)}
                      />
                      <span>مطابقة السجلات الورقية</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={facilitiesCheck}
                        onChange={(e) => setFacilitiesCheck(e.target.checked)}
                      />
                      <span>جاهزية الملاعب والأدوات</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={testsPerformed}
                        onChange={(e) => setTestsPerformed(e.target.checked)}
                      />
                      <span>انتظام إجراء الاختبارات</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={awarenessCheck}
                        onChange={(e) => setAwarenessCheck(e.target.checked)}
                      />
                      <span>توعية الطلاب بالصحة والـ BMI</span>
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">توصيات وملاحظات الموجه الفنية:</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="اكتب التوصيات الموجهة لمعلم التربية الرياضية وشيخ المعهد..."
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">موعد الزيارة القادمة (اختياري):</label>
                  <input
                    type="date"
                    className="form-input"
                    value={nextVisitDate}
                    onChange={(e) => setNextVisitDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ تقرير الزيارة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
