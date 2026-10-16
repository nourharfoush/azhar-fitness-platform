import React, { useState } from 'react';
import { Scale, Plus, Ruler, X, CheckCircle2 } from 'lucide-react';
import { useStudentStore } from '../store';
import type { MeasurementSession, Measurement } from '../types';

export default function MeasurementsPage() {
  const { students, sessions, addSession } = useStudentStore();
  const [showModal, setShowModal] = useState(false);

  // حقول رصد القياس
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [sessionType, setSessionType] = useState<'initial' | 'final' | 'followup'>('initial');
  const [heightCm, setHeightCm] = useState(150);
  const [weightKg, setWeightKg] = useState(45);
  const [pulseRest, setPulseRest] = useState(72);
  const [bloodPressure, setBloodPressure] = useState('110/70');

  // حساب كتلة الجسم BMI تلقائياً
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '0';

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    const newMeasurement: Measurement = {
      id: 'mea-' + Date.now(),
      studentId: student.id,
      sessionId: 'ses-' + Date.now(),
      status: 'approved',
      enteredBy: 'معلم التربية الرياضية',
      enteredAt: new Date().toISOString(),
      heightCm,
      weightKg,
      bmi: Number(bmi),
      pulseRest,
      bloodPressure,
      measuredAt: new Date().toISOString(),
      measuredBy: 'معلم التربية الرياضية',
      isValidated: true,
    };

    const newSession: MeasurementSession = {
      id: 'ses-' + Date.now(),
      title: sessionType === 'initial' ? 'القياس القبلي الأولي' : 'القياس البعدي النهائي',
      type: sessionType,
      academicYear: '2026-2027',
      instituteId: student.instituteId,
      instituteName: student.instituteName || 'معهد أزهري',
      startDate: new Date().toISOString(),
      status: 'approved',
      totalStudents: 1,
      completedStudents: 1,
      measurements: [newMeasurement],
    };

    addSession(newSession);
    setShowModal(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Scale size={28} color="#047857" />
            <span>القياسات البدنية والجسمانية</span>
          </h1>
          <p className="page-subtitle">
            تسجيل مؤشرات الطول، الوزن، مؤشر كتلة الجسم (BMI)، والوظائف الحيوية
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          disabled={students.length === 0}
        >
          <Plus size={18} />
          <span>رصد قياس جديد</span>
        </button>
      </div>

      {/* في حال عدم وجود طلاب */}
      {students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Ruler size={32} />
          </div>
          <h3 className="empty-title">لا توجد قياسات مسجلة بعد</h3>
          <p className="empty-desc">
            يلزم أولاً تسجيل طلاب في صفحة (الطلاب) لتتمكن من رصد القياسات القبلية والبعدية لهم.
          </p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Scale size={32} />
          </div>
          <h3 className="empty-title">لم يتم رصد أي جلسات قياس حتى الآن</h3>
          <p className="empty-desc">
            لديك {students.length} طلاب مسجلين في المنظومة. يمكنك البدء الآن في رصد القياسات القبلية لهم.
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} />
            <span>رصد أول قياس</span>
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>عنوان الجلسة</th>
                  <th>نوع القياس</th>
                  <th>المعهد</th>
                  <th>العام الدراسي</th>
                  <th>الطلاب المنجزون</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((ses) => (
                  <tr key={ses.id}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{ses.title || ses.name}</td>
                    <td>
                      <span className="badge badge-info">
                        {ses.type === 'initial' ? 'قياس قبلي' : 'قياس بعدي'}
                      </span>
                    </td>
                    <td>{ses.instituteName}</td>
                    <td>{ses.academicYear}</td>
                    <td>{ses.completedStudents || 1} طالب</td>
                    <td>
                      <span className="badge badge-success">معتمد ومكتمل</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* نافذة رصد القياس المودال */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  رصد قياسات جسمانية لطالب
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem', margin: 0 }}>
                  تسجيل أطوال وأوزان الطالب وحساب كتلة الجسم فورياً
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '6px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMeasurement} style={{ padding: '1.75rem' }}>
              <div className="form-group">
                <label className="form-label">اختر الطالب</label>
                <select
                  className="form-control"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.instituteName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">نوع جلسة القياس</label>
                <select
                  className="form-control"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value as any)}
                >
                  <option value="initial">قياس قبلي (بداية العام الدراسي)</option>
                  <option value="final">قياس بعدي (نهاية البرنامج)</option>
                  <option value="followup">قياس مرحلي للمتابعة</option>
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">الطول (سم)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">الوزن (كجم)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* حساب مؤشر كتلة الجسم فورياً */}
              <div style={{
                padding: '1.25rem',
                borderRadius: '10px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>مؤشر كتلة الجسم المحسوب (BMI):</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#047857' }}>{bmi} كجم/م²</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                  وزن طبيعي ومعتدل
                </span>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
                paddingTop: '1.25rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ واعتماد القياس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
