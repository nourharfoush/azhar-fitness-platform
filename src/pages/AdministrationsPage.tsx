import React, { useState, useMemo } from 'react';
import {
  Building2, Search, MapPin, School, Users,
  CheckCircle2, Download, Plus, Filter, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AZHAR_REGIONS, ALL_ADMINISTRATIONS } from '../data/organizationData';
import { useInstituteStore, useStudentStore } from '../store';

export default function AdministrationsPage() {
  const navigate = useNavigate();
  const { institutes } = useInstituteStore();
  const { students } = useStudentStore();

  const [selectedRegionId, setSelectedRegionId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New admin form state
  const [newAdminName, setNewAdminName] = useState('');
  const [newRegionId, setNewRegionId] = useState(AZHAR_REGIONS[0]?.id || '');

  // Filtered administrations
  const filteredAdmins = useMemo(() => {
    return ALL_ADMINISTRATIONS.filter((admin) => {
      const matchesRegion =
        selectedRegionId === 'all' || admin.regionId === selectedRegionId;
      const matchesSearch =
        admin.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        admin.regionName.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [selectedRegionId, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = 'كود الإدارة,اسم الإدارة,المنطقة الأزهرية,عدد المعاهد,عدد الطلاب\n';
    const rows = filteredAdmins
      .map((admin) => {
        const instCount = institutes.filter((i) => i.administrationId === admin.id).length;
        const stuCount = students.filter((s) => s.administrationId === admin.id).length;
        return `"${admin.id}","${admin.name}","${admin.regionName}","${instCount}","${stuCount}"`;
      })
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `الادارات_التعليمية_الازهرية_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Building2 className="text-primary" size={28} />
            <span>الإدارات التعليمية الأزهرية</span>
          </h1>
          <p className="page-subtitle">
            قاعدة البيانات الرسمية الشاملة لـ 202 إدارة تعليمية موزعة على 27 منطقة أزهرية
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} />
            <span>تصدير Excel/CSV</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>إضافة إدارة تعليمية</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
            <Building2 size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">{ALL_ADMINISTRATIONS.length}</div>
            <div className="kpi-label">إجمالي الإدارات المعتمدة</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
            <MapPin size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">{AZHAR_REGIONS.length}</div>
            <div className="kpi-label">المناطق الأزهرية (المحافظات)</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <School size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">{institutes.length}</div>
            <div className="kpi-label">المعاهد المربوطة حالياً</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="kpi-details">
            <div className="kpi-value">100%</div>
            <div className="kpi-label">جاهزية المنظومة الميدانية</div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={15} />
              <span>تصفية حسب المنطقة الأزهرية:</span>
            </label>
            <select
              className="form-select"
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
            >
              <option value="all">جميع المناطق الأزهرية (27 منطقة)</option>
              {AZHAR_REGIONS.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name} ({region.administrations.length} إدارة)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Search size={15} />
              <span>بحث سريع عن إدارة:</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="ابحث باسم الإدارة أو المنطقة..."
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
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Administrations Table Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Building2 size={20} color="var(--primary)" />
            <span>قائمة الإدارات التعليمية</span>
            <span className="badge badge-primary" style={{ marginRight: '0.5rem' }}>
              {filteredAdmins.length} إدارة
            </span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>كود الإدارة</th>
                <th>اسم الإدارة التعليمية</th>
                <th>المنطقة الأزهرية التابعة</th>
                <th>المعاهد المسجلة</th>
                <th>الطلاب المقيدون</th>
                <th>حالة الرصد</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.slice(0, 100).map((admin, idx) => {
                const adminInstitutes = institutes.filter(
                  (i) => i.administrationId === admin.id || i.administrationName?.includes(admin.name)
                );
                const adminStudents = students.filter(
                  (s) => s.administrationId === admin.id || s.administrationName?.includes(admin.name)
                );

                return (
                  <tr key={admin.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <code style={{ fontSize: '0.85rem', color: '#64748b' }}>{admin.id}</code>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {admin.name}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MapPin size={14} color="#64748b" />
                        <span>{admin.regionName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">
                        <School size={12} />
                        <span>{adminInstitutes.length} معهد</span>
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">
                        <Users size={12} />
                        <span>{adminStudents.length} طالب</span>
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} />
                        <span>نشطة ومعتمدة</span>
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--primary)', fontWeight: 600 }}
                        onClick={() => navigate('/institutes')}
                        title="عرض معاهد هذه الإدارة"
                      >
                        معاهد الإدارة
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAdmins.length > 100 && (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem', borderTop: '1px solid #f1f5f9' }}>
            يتم عرض أول 100 إدارة لتسهيل التصفح. استخدم البحث أو فلتر المنطقة للوصول إلى إدارة بعينها.
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Building2 size={20} color="var(--primary)" />
                <span>إضافة إدارة تعليمية جديدة</span>
              </h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAdminName.trim()) return;
                alert(`تم تسجيل طلب إضافة "${newAdminName}" وسيتم ربطها بنطاق المنطقة المختارة.`);
                setShowAddModal(false);
                setNewAdminName('');
              }}
            >
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">المنطقة الأزهرية التابعة:</label>
                  <select
                    className="form-select"
                    value={newRegionId}
                    onChange={(e) => setNewRegionId(e.target.value)}
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
                  <label className="form-label">اسم الإدارة التعليمية الجديدة:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: إدارة الشيخ زايد التعليمية"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ الإدارة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
