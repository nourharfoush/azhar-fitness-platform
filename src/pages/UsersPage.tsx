import React, { useState } from 'react';
import {
  UserCircle, Plus, Shield, CheckCircle, XCircle,
  Search, Lock, Mail, Phone, MapPin, KeyRound, X,
  Edit, Eye, EyeOff, Key
} from 'lucide-react';
import { useUserManagementStore, useAuditLogStore, useAuthStore } from '../store';
import { AZHAR_REGIONS } from '../data/organizationData';
import { ROLE_LABELS } from '../types';
import type { User, UserRole } from '../types';

export default function UsersPage() {
  const { users, addUser, updateUser, toggleUserStatus, deleteUser } = useUserManagementStore();
  const { addLog } = useAuditLogStore();
  const { user: currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Password visibility map for table rows
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Add Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Azhar@2026');
  const [showAddPass, setShowAddPass] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('institute_officer');
  const [scopeType, setScopeType] = useState<'national' | 'region' | 'administration' | 'institute'>('region');
  const [selectedRegionId, setSelectedRegionId] = useState(AZHAR_REGIONS[0]?.id || '');

  // Edit Form State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPass, setShowEditPass] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('institute_officer');
  const [editScopeType, setEditScopeType] = useState<'national' | 'region' | 'administration' | 'institute'>('region');
  const [editSelectedRegionId, setEditSelectedRegionId] = useState(AZHAR_REGIONS[0]?.id || '');
  const [editIsActive, setEditIsActive] = useState(true);

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
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

    const finalUsername = username.trim() || email.split('@')[0];
    const finalPassword = password.trim() || 'Azhar@2026';

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      username: finalUsername,
      password: finalPassword,
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
      description: `إنشاء حساب جديد: ${newUser.name} (اسم المستخدم: ${newUser.username}) بدور ${ROLE_LABELS[newUser.role]}`,
      performedBy: currentUser?.name || 'مدير النظام',
      performedByRole: 'مدير النظام',
    });

    setShowAddModal(false);
    setName('');
    setUsername('');
    setPassword('Azhar@2026');
    setEmail('');
    setPhone('');
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditUsername(user.username || user.email.split('@')[0]);
    setEditPassword(user.password || 'Azhar@2026');
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditRole(user.role);
    setEditScopeType(user.scopeType);
    setEditSelectedRegionId(user.scopeId || AZHAR_REGIONS[0]?.id || '');
    setEditIsActive(user.isActive);
    setShowEditPass(false);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName.trim() || !editUsername.trim()) return;

    let scopeName = editingUser.scopeName || 'جمهورية مصر العربية';
    if (editScopeType === 'region') {
      const reg = AZHAR_REGIONS.find((r) => r.id === editSelectedRegionId);
      scopeName = reg ? reg.name : 'منطقة أزهرية';
    } else if (editScopeType === 'institute') {
      scopeName = 'معهد أزهري محدد';
    } else if (editScopeType === 'administration') {
      scopeName = 'إدارة تعليمية محددة';
    } else if (editScopeType === 'national') {
      scopeName = 'جمهورية مصر العربية (عام)';
    }

    const updatedData: Partial<User> = {
      name: editName.trim(),
      username: editUsername.trim(),
      password: editPassword.trim() || 'Azhar@2026',
      email: editEmail.trim(),
      phone: editPhone.trim() || undefined,
      role: editRole,
      scopeType: editScopeType,
      scopeId: editScopeType === 'region' ? editSelectedRegionId : null,
      scopeName,
      isActive: editIsActive,
    };

    updateUser(editingUser.id, updatedData);

    addLog({
      entityType: 'مستخدم',
      entityId: editingUser.id,
      action: 'update',
      description: `تعديل بيانات المستخدم وكلمة المرور: ${updatedData.name} (اسم المستخدم: ${updatedData.username})`,
      performedBy: currentUser?.name || 'مدير النظام',
      performedByRole: 'مدير النظام',
    });

    setShowEditModal(false);
    setEditingUser(null);
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
                    <th>المستخدم والاسم</th>
                    <th>اسم الدخول (Username)</th>
                    <th>كلمة المرور (Password)</th>
                    <th>الدور الوظيفي</th>
                    <th>النطاق الإداري / الجغرافي</th>
                    <th>الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const initials = u.name.split(' ').slice(0, 2).map((n) => n[0]).join('');
                    const isPassVisible = showPasswords[u.id];
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
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            background: 'rgba(3, 105, 161, 0.1)',
                            color: '#0284c7',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            fontSize: '0.85rem'
                          }}>
                            <KeyRound size={13} />
                            <span>{u.username || u.email.split('@')[0]}</span>
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.55rem',
                              borderRadius: '6px',
                              background: '#f1f5f9',
                              color: '#334155',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              letterSpacing: isPassVisible ? 'normal' : '0.15em'
                            }}>
                              {isPassVisible ? (u.password || 'Azhar@2026') : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#64748b',
                                padding: '3px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title={isPassVisible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                            >
                              {isPassVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenEdit(u)}
                              title="تعديل المستخدم وبيانات الدخول"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
                            >
                              <Edit size={13} />
                              <span>تعديل</span>
                            </button>

                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              style={{ color: '#ef4444', padding: '0.35rem 0.5rem' }}
                              onClick={() => handleDelete(u.id, u.name)}
                              title="حذف الحساب"
                            >
                              حذف
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
                    <label className="form-label">اسم المستخدم للدخول (Username):</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="مثال: hazem_pe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ paddingRight: '2.2rem' }}
                      />
                      <KeyRound size={15} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">كلمة المرور (Password):</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showAddPass ? 'text' : 'password'}
                        className="form-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ paddingLeft: '2.5rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAddPass(!showAddPass)}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748b'
                        }}
                      >
                        {showAddPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">البريد الإلكتروني المؤسسي:</label>
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

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Edit size={20} color="var(--primary)" />
                <span>تعديل بيانات المستخدم: {editingUser.name}</span>
              </h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">الاسم بالكامل:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">اسم المستخدم للدخول (Username):</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        required
                        style={{ paddingRight: '2.2rem' }}
                      />
                      <KeyRound size={15} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">كلمة المرور (Password):</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showEditPass ? 'text' : 'password'}
                        className="form-input"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        required
                        style={{ paddingLeft: '2.5rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPass(!showEditPass)}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748b'
                        }}
                      >
                        {showEditPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">البريد الإلكتروني:</label>
                    <input
                      type="email"
                      className="form-input"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">رقم الهاتف:</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">الدور الوظيفي والصلاحية:</label>
                    <select
                      className="form-select"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as any)}
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
                      value={editScopeType}
                      onChange={(e) => setEditScopeType(e.target.value as any)}
                    >
                      <option value="national">على مستوى الجمهورية</option>
                      <option value="region">على مستوى المنطقة الأزهرية</option>
                      <option value="administration">على مستوى الإدارة التعليمية</option>
                      <option value="institute">على مستوى المعهد</option>
                    </select>
                  </div>
                </div>

                {editScopeType === 'region' && (
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">اختر المنطقة الأزهرية:</label>
                    <select
                      className="form-select"
                      value={editSelectedRegionId}
                      onChange={(e) => setEditSelectedRegionId(e.target.value)}
                    >
                      {AZHAR_REGIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label">حالة الحساب:</label>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.35rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="editUserStatus"
                        checked={editIsActive}
                        onChange={() => setEditIsActive(true)}
                      />
                      <span style={{ fontWeight: 700, color: '#16a34a' }}>حساب نشط ومفعّل</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="editUserStatus"
                        checked={!editIsActive}
                        onChange={() => setEditIsActive(false)}
                      />
                      <span style={{ fontWeight: 700, color: '#dc2626' }}>حساب معطل وموقوف</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
