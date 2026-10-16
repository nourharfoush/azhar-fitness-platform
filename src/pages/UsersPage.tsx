import React, { useState } from 'react';
import {
  UserCircle, Plus, Shield, CheckCircle, XCircle,
  Search, Lock, Mail, Phone, MapPin, KeyRound, X
} from 'lucide-react';
import { useUserManagementStore, useAuditLogStore, useAuthStore } from '../store';
import { AZHAR_REGIONS } from '../data/organizationData';
import { ROLE_LABELS } from '../types';
import type { User, UserRole } from '../types';

export default function UsersPage() {
  const { users, addUser, toggleUserStatus, deleteUser } = useUserManagementStore();
  const { addLog } = useAuditLogStore();
  const { user: currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('institute_officer');
  const [scopeType, setScopeType] = useState<'national' | 'region' | 'administration' | 'institute'>('region');
  const [selectedRegionId, setSelectedRegionId] = useState(AZHAR_REGIONS[0]?.id || '');

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.scopeName && u.scopeName.toLowerCase().includes(q));
    return matchesRole && matchesSearch;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    let scopeName = 'جمهورية مصر العربية';
    if (scopeType === 'region') {
      const reg = AZHAR_REGIONS.find((r) => r.id === selectedRegionId);
      scopeName = reg ? reg.name : 'منطقة أزهرية';
    } else if (scopeType === 'institute') {
      scopeName = 'معهد أزهري محدد';
    } else if (scopeType === 'administration') {
      scopeName = 'إدارة تعليمية محددة';
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      role,
      scopeType,
      scopeId: scopeType === 'region' ? selectedRegionId : null,
      scopeName,
      isActive: true,
      createdAt: new Date().toISOString().slice(0, 10),
      lastLogin: 'لم يسجل دخول بعد',
    };

    addUser(newUser);

    addLog({
      entityType: 'مستخدم',
      entityId: newUser.id,
      action: 'create',
      description: `إنشاء حساب جديد: ${newUser.name} بدور ${ROLE_LABELS[newUser.role]}`,
      performedBy: currentUser?.name || 'مدير النظام',
      performedByRole: 'مدير النظام',
    });

    setShowAddModal(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const handleToggle = (id: string, uName: string) => {
    toggleUserStatus(id);
    addLog({
      entityType: 'مستخدم',
      entityId: id,
      action: 'update',
      description: `تغيير حالة حساب المستخدم: ${uName}`,
      performedBy: currentUser?.name || 'مدير النظام',
      performedByRole: 'مدير النظام',
    });
  };

  const handleDelete = (id: string, uName: string) => {
    if (window.confirm(`هل أنت متأكد من حذف حساب ${uName}؟`)) {
      deleteUser(id);
      addLog({
        entityType: 'مستخدم',
        entityId: id,
        action: 'delete',
        description: `حذف حساب المستخدم: ${uName}`,
        performedBy: currentUser?.name || 'مدير النظام',
        performedByRole: 'مدير النظام',
      });
    }
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UserCircle className="text-primary" size={28} />
            <span>إدارة المستخدمين ومنظومة الصلاحيات (RBAC)</span>
          </h1>
          <p className="page-subtitle">
            التحكم في حسابات مسؤولي المناطق والموجهين ومعلمي التربية الرياضية وضبط النطاقات الإدارية
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>إضافة مستخدم جديد</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          حسابات المستخدمين ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          مصفوفة الصلاحيات حسب الدور
        </button>
      </div>

      {activeTab === 'users' && (
        <>
          {/* Filters Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'center' }}>
              <div>
                <label className="form-label">تصفية حسب الدور الوظيفي:</label>
                <select
                  className="form-select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="all">جميع الأدوار</option>
                  {Object.entries(ROLE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">بحث سريع:</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ابحث بالاسم، البريد أو النطاق..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <UserCircle size={20} color="var(--primary)" />
                <span>قائمة المستخدمين المعتمدين بالمنظومة</span>
                <span className="badge badge-primary" style={{ marginRight: '0.5rem' }}>
                  {filteredUsers.length} مستخدم
                </span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>المستخدم</th>
                    <th>الدور الوظيفي</th>
                    <th>النطاق الإداري / الجغرافي</th>
                    <th>بيانات الاتصال</th>
                    <th>الحالة</th>
                    <th>آخر تسجيل دخول</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const initials = u.name.split(' ').slice(0, 2).map((n) => n[0]).join('');
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                              }}
                            >
                              {initials}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{u.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                            {ROLE_LABELS[u.role] || u.role}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPin size={13} color="#64748b" />
                            <span style={{ fontSize: '0.9rem' }}>{u.scopeName || 'غير محدد'}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                            {u.phone || 'غير مسجل'}
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggle(u.id, u.name)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            title="انقر لتغيير الحالة"
                          >
                            {u.isActive ? (
                              <span className="badge badge-success">
                                <CheckCircle size={12} /> نشط
                              </span>
                            ) : (
                              <span className="badge badge-danger">
                                <XCircle size={12} /> معطل
                              </span>
                            )}
                          </button>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                            {u.lastLogin || 'حديثاً'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: '#ef4444' }}
                            onClick={() => handleDelete(u.id, u.name)}
                            title="حذف الحساب"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'matrix' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Shield size={20} color="var(--primary)" />
              <span>مصفوفة الصلاحيات التفصيلية (RBAC Permissions Matrix)</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>الدور الوظيفي</th>
                  <th>إدخال القياسات</th>
                  <th>مراجعة واعتماد النتائج</th>
                  <th>إدارة المعايير والمساطر</th>
                  <th>استخراج التقارير</th>
                  <th>إدارة المستخدمين</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 800 }}>مدير النظام العام</td>
                  <td><span className="badge badge-success">✓ كامل الصلاحيات</span></td>
                  <td><span className="badge badge-success">✓ كامل الصلاحيات</span></td>
                  <td><span className="badge badge-success">✓ كامل الصلاحيات</span></td>
                  <td><span className="badge badge-success">✓ الجمهورية</span></td>
                  <td><span className="badge badge-success">✓ نعم</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 800 }}>قطاع المعاهد الأزهرية</td>
                  <td><span className="badge badge-neutral">— عرض فقط</span></td>
                  <td><span className="badge badge-success">✓ اعتماد نهائي</span></td>
                  <td><span className="badge badge-success">✓ تعديل المساطر</span></td>
                  <td><span className="badge badge-success">✓ الجمهورية</span></td>
                  <td><span className="badge badge-neutral">— عرض فقط</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 800 }}>منسق المنطقة الأزهرية</td>
                  <td><span className="badge badge-neutral">— في نطاق المنطقة</span></td>
                  <td><span className="badge badge-success">✓ اعتماد المنطقة</span></td>
                  <td><span className="badge badge-neutral">— عرض فقط</span></td>
                  <td><span className="badge badge-success">✓ منطقته</span></td>
                  <td><span className="badge badge-neutral">— لا</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 800 }}>موجه الإدارة التعليمية</td>
                  <td><span className="badge badge-neutral">— فحص ومراجعة</span></td>
                  <td><span className="badge badge-success">✓ مراجعة الإدارة</span></td>
                  <td><span className="badge badge-neutral">— عرض فقط</span></td>
                  <td><span className="badge badge-success">✓ إدارته</span></td>
                  <td><span className="badge badge-neutral">— لا</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 800 }}>معلم التربية الرياضية بالمعهد</td>
                  <td><span className="badge badge-success">✓ إدخال وتعديل مسودات</span></td>
                  <td><span className="badge badge-neutral">— إرسال للمراجعة</span></td>
                  <td><span className="badge badge-neutral">— عرض فقط</span></td>
                  <td><span className="badge badge-success">✓ معهده</span></td>
                  <td><span className="badge badge-neutral">— لا</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 800 }}>عضو لجنة التحكيم</td>
                  <td><span className="badge badge-success">✓ رصد درجات التحكيم</span></td>
                  <td><span className="badge badge-success">✓ توقيع النتائج</span></td>
                  <td><span className="badge badge-neutral">— عرض فقط</span></td>
                  <td><span className="badge badge-success">✓ منافساته</span></td>
                  <td><span className="badge badge-neutral">— لا</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <UserCircle size={20} color="var(--primary)" />
                <span>إضافة مستخدم جديد للنظام</span>
              </h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">الاسم بالكامل:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: كابتن / حازم الشريف"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">البريد الإلكتروني / اسم الدخول:</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="user@azhar.gov.eg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">رقم الهاتف:</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="01xxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">الدور الوظيفي والصلاحية:</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                    >
                      {Object.entries(ROLE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">مستوى النطاق:</label>
                    <select
                      className="form-select"
                      value={scopeType}
                      onChange={(e) => setScopeType(e.target.value as any)}
                    >
                      <option value="national">على مستوى الجمهورية</option>
                      <option value="region">على مستوى المنطقة الأزهرية</option>
                      <option value="administration">على مستوى الإدارة التعليمية</option>
                      <option value="institute">على مستوى المعهد</option>
                    </select>
                  </div>
                </div>

                {scopeType === 'region' && (
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">اختر المنطقة الأزهرية:</label>
                    <select
                      className="form-select"
                      value={selectedRegionId}
                      onChange={(e) => setSelectedRegionId(e.target.value)}
                    >
                      {AZHAR_REGIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  إنشاء الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
