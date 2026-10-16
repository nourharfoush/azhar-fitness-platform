import React, { useState } from 'react';
import { Users, Plus, Search, Trash2, X, AlertCircle } from 'lucide-react';
import { useStudentStore } from '../store';
import { AZHAR_REGIONS } from '../data/organizationData';
import type { Student, Stage, Gender } from '../types';

export default function StudentsPage() {
  const { students, addStudent, deleteStudent } = useStudentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // حقول إضافة طالب جديد
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [stage, setStage] = useState<Stage>('primary');
  const [grade, setGrade] = useState('4');
  const [birthDate, setBirthDate] = useState('2014-05-15');
  const [selectedRegionId, setSelectedRegionId] = useState(AZHAR_REGIONS[0]?.id || '');
  const [selectedAdminId, setSelectedAdminId] = useState(AZHAR_REGIONS[0]?.administrations[0]?.id || '');
  const [instituteName, setInstituteName] = useState('');

  const currentRegion = AZHAR_REGIONS.find((r) => r.id === selectedRegionId);
  const currentAdmins = currentRegion ? currentRegion.administrations : [];

  const handleRegionChange = (regId: string) => {
    setSelectedRegionId(regId);
    const reg = AZHAR_REGIONS.find((r) => r.id === regId);
    if (reg && reg.administrations.length > 0) {
      setSelectedAdminId(reg.administrations[0].id);
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nationalId || !instituteName) return;

    const newStudent: Student = {
      id: 'stu-' + Date.now(),
      name,
      nationalId,
      enrollmentNumber: 'ENR-' + Date.now().toString().slice(-6),
      gender,
      stage,
      grade,
      birthDate,
      regionId: selectedRegionId,
      regionName: currentRegion?.name || '',
      administrationId: selectedAdminId,
      administrationName: currentAdmins.find((a) => a.id === selectedAdminId)?.name || '',
      instituteId: 'inst-' + Date.now(),
      instituteName,
      academicYear: '2026-2027',
      isActive: true,
    };

    addStudent(newStudent);
    setShowModal(false);
    setName('');
    setNationalId('');
    setInstituteName('');
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.name && s.name.includes(searchTerm)) ||
      (s.nationalId && s.nationalId.includes(searchTerm)) ||
      (s.instituteName && s.instituteName.includes(searchTerm)) ||
      (s.regionName && s.regionName.includes(searchTerm))
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={28} color="#047857" />
            <span>سجل الطلاب الميداني</span>
          </h1>
          <p className="page-subtitle">
            قاعدة البيانات الرسمية للطلاب المشاركين في المشروع القومي للياقة البدنية
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>تسجيل طالب جديد</span>
        </button>
      </div>

      {/* شريط البحث والفرز */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div className="search-bar-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث باسم الطالب أو الرقم القومي أو المعهد أو المنطقة..."
          />
        </div>
      </div>

      {/* جدول الطلاب */}
      {filteredStudents.length > 0 ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>اسم الطالب</th>
                  <th>الرقم القومي</th>
                  <th>النوع</th>
                  <th>المرحلة الدراسية</th>
                  <th>المنطقة الأزهرية</th>
                  <th>الإدارة التعليمية</th>
                  <th>المعهد</th>
                  <th style={{ textAlign: 'center' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{student.name}</td>
                    <td style={{ fontFamily: 'monospace', color: '#475569' }}>{student.nationalId}</td>
                    <td>
                      <span className={`badge ${student.gender === 'male' ? 'badge-info' : 'badge-warning'}`}>
                        {student.gender === 'male' ? 'بنين' : 'بنات'}
                      </span>
                    </td>
                    <td>
                      {student.stage === 'primary' ? 'الابتدائية' : student.stage === 'preparatory' ? 'الإعدادية' : 'الثانوية'} - الصف {student.grade}
                    </td>
                    <td>{student.regionName}</td>
                    <td>{student.administrationName}</td>
                    <td>{student.instituteName}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#ef4444' }}
                        title="حذف السجل"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Users size={32} />
          </div>
          <h3 className="empty-title">لا توجد بيانات طلاب مسجلة بعد</h3>
          <p className="empty-desc">
            قاعدة البيانات نظيفة وخالية من أي سجلات مسبقة. يمكنك تسجيل طلاب المعاهد الأزهرية الآن بالنقر على الزر أدناه.
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} />
            <span>تسجيل طالب جديد</span>
          </button>
        </div>
      )}

      {/* نافذة مودال بيضاء واضحة وفخمة */}
      {showModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  تسجيل طالب جديد في المنظومة
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem', margin: 0 }}>
                  أدخل البيانات المعتمدة للطالب وفق سجل المعهد
                </p>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                  <label className="form-label">الاسم رباعي (وفق شهادة الميلاد)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد محمد علي إبراهيم"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div className="form-group">
                    <label className="form-label">الرقم القومي (14 رقم)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="29901011234567"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">النوع</label>
                    <select
                      className="form-control"
                      value={gender}
                      onChange={(e) => setGender(e.target.value as Gender)}
                    >
                      <option value="male">بنين</option>
                      <option value="female">بنات</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div className="form-group">
                    <label className="form-label">المرحلة التعليمية</label>
                    <select
                      className="form-control"
                      value={stage}
                      onChange={(e) => setStage(e.target.value as Stage)}
                    >
                      <option value="primary">المرحلة الابتدائية</option>
                      <option value="preparatory">المرحلة الإعدادية</option>
                      <option value="secondary">المرحلة الثانوية</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">الصف الدراسي</label>
                    <input
                      type="text"
                      className="form-control"
                      value={grade}
                      placeholder="الصف الرابع"
                      onChange={(e) => setGrade(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div className="form-group">
                    <label className="form-label">المنطقة الأزهرية</label>
                    <select
                      className="form-control"
                      value={selectedRegionId}
                      onChange={(e) => handleRegionChange(e.target.value)}
                    >
                      {AZHAR_REGIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">الإدارة التعليمية التابعة</label>
                    <select
                      className="form-control"
                      value={selectedAdminId}
                      onChange={(e) => setSelectedAdminId(e.target.value)}
                    >
                      {currentAdmins.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">اسم المعهد الأزهري</label>
                  <input
                    type="text"
                    className="form-control"
                    value={instituteName}
                    onChange={(e) => setInstituteName(e.target.value)}
                    placeholder="معهد ..."
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ وتسجيل الطالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
