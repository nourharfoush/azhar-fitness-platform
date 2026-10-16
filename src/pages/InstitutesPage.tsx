import React, { useState, useMemo } from 'react';
import {
  School, Plus, Search, Filter, MapPin, Users,
  Phone, CheckCircle, Trash2, Edit3, X, Download, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AZHAR_REGIONS } from '../data/organizationData';
import { useInstituteStore, useStudentStore, useAuditLogStore, useAuthStore } from '../store';
import type { Institute } from '../types';

export default function InstitutesPage() {
  const navigate = useNavigate();
  const { institutes, addInstitute, deleteInstitute } = useInstituteStore();
  const { students } = useStudentStore();
  const { addLog } = useAuditLogStore();
  const { user } = useAuthStore();

  const [selectedRegionId, setSelectedRegionId] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for adding new institute
  const [name, setName] = useState('');
  const [regionId, setRegionId] = useState(AZHAR_REGIONS[0]?.id || '');
  const [adminId, setAdminId] = useState(AZHAR_REGIONS[0]?.administrations[0]?.id || '');
  const [type, setType] = useState<'primary' | 'preparatory' | 'secondary' | 'combined'>('secondary');
  const [gender, setGender] = useState<'male' | 'female' | 'mixed'>('male');
  const [principalName, setPrincipalName] = useState('');
  const [peTeacherName, setPeTeacherName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const currentRegion = AZHAR_REGIONS.find((r) => r.id === regionId);
  const currentAdmins = currentRegion ? currentRegion.administrations : [];

  const handleRegionChange = (newRegId: string) => {
    setRegionId(newRegId);
    const reg = AZHAR_REGIONS.find((r) => r.id === newRegId);
    if (reg && reg.administrations.length > 0) {
      setAdminId(reg.administrations[0].id);
    }
  };

  // Filtered institutes
  const filteredInstitutes = useMemo(() => {
    return institutes.filter((inst) => {
      const matchesRegion =
        selectedRegionId === 'all' || inst.regionId === selectedRegionId;
      const matchesStage =
        selectedStage === 'all' || inst.type === selectedStage;
      const matchesGender =
        selectedGender === 'all' || inst.gender === selectedGender;
      const matchesSearch =
        inst.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (inst.principalName && inst.principalName.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
        (inst.peTeacherName && inst.peTeacherName.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
        (inst.administrationName && inst.administrationName.toLowerCase().includes(searchQuery.trim().toLowerCase()));

      return matchesRegion && matchesStage && matchesGender && matchesSearch;
    });
  }, [institutes, selectedRegionId, selectedStage, selectedGender, searchQuery]);

  const handleAddInstitute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newInst: Institute = {
      id: 'inst-' + Date.now(),
      name: name.trim(),
      regionId,
      regionName: currentRegion?.name || '',
      administrationId: adminId,
      administrationName: currentAdmins.find((a) => a.id === adminId)?.name || '',
      type,
      gender,
      principalName: principalName.trim() || undefined,
      peTeacherName: peTeacherName.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      isRegistered: true,
      studentsCount: 0,
    };

    addInstitute(newInst);

    addLog({
      entityType: 'معهد أزهري',
      entityId: newInst.id,
      action: 'create',
      description: `تسجيل معهد جديد: ${newInst.name} في ${newInst.regionName}`,
      performedBy: user?.name || 'مدير النظام',
      performedByRole: 'مدير النظام',
    });

    setShowAddModal(false);
    setName('');
    setPrincipalName('');
    setPeTeacherName('');
    setPhone('');
    setAddress('');
  };

  const handleDeleteInstitute = (id: string, instName: string) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف ${instName}؟`)) {
      deleteInstitute(id);
      addLog({
        entityType: 'معهد أزهري',
        entityId: id,
        action: 'delete',
        description: `حذف المعهد الأزهري: ${instName}`,
        performedBy: user?.name || 'مدير النظام',
        performedByRole: 'مدير النظام',
      });
    }
  };

  const getStageLabel = (t: string) => {
    switch (t) {
      case 'primary': return 'مرحلة ابتدائية';
      case 'preparatory': return 'مرحلة إعدادية';
      case 'secondary': return 'مرحلة ثانوية';
      case 'combined': return 'مشترك (إعدادي/ثانوي)';
      default: return t;
    }
  };

  const getGenderLabel = (g: string) => {
    switch (g) {
      case 'male': return 'بنين';
      case 'female': return 'فتيات';
      case 'mixed': return 'مشترك';
      default: return g;
    }
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <School className="text-primary" size={28} />
            <span>دليل المعاهد الأزهرية</span>
          </h1>
          <p className="page-subtitle">
            إدارة المعاهد وبياناتها وإحصاءات القياس البدني ومسؤولي التربية الرياضية
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>إضافة معهد أزهري</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
            <School size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">{institutes.length}</div>
            <div className="kpi-label">إجمالي المعاهد المسجلة</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
            <Users size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">{students.length}</div>
            <div className="kpi-label">إجمالي الطلاب المرصودين</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <ShieldCheck size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">
              {institutes.filter((i) => i.peTeacherName).length}
            </div>
            <div className="kpi-label">معاهد ذات كادر رياضي معتمد</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <CheckCircle size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">100%</div>
            <div className="kpi-label">مطابقة الهيكل التنظيمي</div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label className="form-label">المنطقة الأزهرية:</label>
            <select
              className="form-select"
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
            >
              <option value="all">جميع المناطق الأزهرية (27)</option>
              {AZHAR_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">المرحلة الدراسية:</label>
            <select
              className="form-select"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="all">جميع المراحل</option>
              <option value="primary">الابتدائية</option>
              <option value="preparatory">الإعدادية</option>
              <option value="secondary">الثانوية</option>
              <option value="combined">مشترك (إعدادي/ثانوي)</option>
            </select>
          </div>

          <div>
            <label className="form-label">النوع:</label>
            <select
              className="form-select"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value="all">الكل (بنين وفتيات)</option>
              <option value="male">بنين</option>
              <option value="female">فتيات</option>
              <option value="mixed">مشترك</option>
            </select>
          </div>

          <div>
            <label className="form-label">بحث سريع:</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="ابحث باسم المعهد أو المعلم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Institutes Table Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <School size={20} color="var(--primary)" />
            <span>قائمة المعاهد الأزهرية</span>
            <span className="badge badge-primary" style={{ marginRight: '0.5rem' }}>
              {filteredInstitutes.length} معهد
            </span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>اسم المعهد الأزهري</th>
                <th>المرحلة والنوع</th>
                <th>المنطقة والإدارة التعليمية</th>
                <th>شيخ/مدير المعهد</th>
                <th>معلم التربية الرياضية</th>
                <th>الطلاب المسجلون</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstitutes.map((inst) => {
                const instStudents = students.filter(
                  (s) => s.instituteId === inst.id || s.instituteName === inst.name
                );

                return (
                  <tr key={inst.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {inst.name}
                      </div>
                      {inst.address && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                          {inst.address}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-neutral">
                          {getStageLabel(inst.type)}
                        </span>
                        <span
                          className={`badge ${
                            inst.gender === 'male'
                              ? 'badge-primary'
                              : inst.gender === 'female'
                              ? 'badge-warning'
                              : 'badge-neutral'
                          }`}
                        >
                          {getGenderLabel(inst.gender)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inst.regionName || 'منطقة معتمدة'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {inst.administrationName || 'إدارة تعليمية'}
                      </div>
                    </td>
                    <td>{inst.principalName || 'غير مسجل'}</td>
                    <td>
                      {inst.peTeacherName ? (
                        <span style={{ fontWeight: 600, color: '#047857' }}>
                          {inst.peTeacherName}
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>غير محدد</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-neutral">
                        <Users size={12} />
                        <span>{instStudents.length > 0 ? instStudents.length : inst.studentsCount || 0} طالب</span>
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--primary)', fontWeight: 600 }}
                          onClick={() => navigate('/students')}
                          title="عرض طلاب المعهد"
                        >
                          الطلاب
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#ef4444' }}
                          onClick={() => handleDeleteInstitute(inst.id, inst.name)}
                          title="حذف المعهد"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Institute Modal */}
      {showAddModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <School size={20} color="var(--primary)" />
                <span>إضافة معهد أزهري جديد</span>
              </h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddInstitute}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">اسم المعهد بالكامل:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: معهد فتيات نصر سيتي النموذجي الإعدادي"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">المنطقة الأزهرية:</label>
                    <select
                      className="form-select"
                      value={regionId}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      required
                    >
                      {AZHAR_REGIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">الإدارة التعليمية التابعة:</label>
                    <select
                      className="form-select"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      required
                    >
                      {currentAdmins.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">المرحلة الدراسية:</label>
                    <select
                      className="form-select"
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                    >
                      <option value="primary">ابتدائية</option>
                      <option value="preparatory">إعدادية</option>
                      <option value="secondary">ثانوية</option>
                      <option value="combined">مشترك (إعدادي/ثانوي)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">النوع (الطلبة):</label>
                    <select
                      className="form-select"
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                    >
                      <option value="male">بنين</option>
                      <option value="female">فتيات</option>
                      <option value="mixed">مشترك</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">اسم شيخ / مدير المعهد:</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="فضيلة الشيخ..."
                      value={principalName}
                      onChange={(e) => setPrincipalName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">مسؤول التربية الرياضية بالمعهد:</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="كابتن..."
                      value={peTeacherName}
                      onChange={(e) => setPeTeacherName(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف للتواصل:</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="01xxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">العنوان / المقر:</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="المحافظة والمركز/الحي"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ المعهد الأزهري
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
