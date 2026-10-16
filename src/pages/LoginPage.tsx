import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, UserCircle, CheckCircle2, Sparkles, KeyRound } from 'lucide-react';
import { useAuthStore, useUserManagementStore } from '../store';
import { INITIAL_USERS } from '../data/sampleData';
import { ROLE_LABELS } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, setLoading } = useAuthStore();
  const { users } = useUserManagementStore();

  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('Azhar@2026');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  // Combine default initial users and local storage users so all accounts are always available
  const combinedMap = new Map<string, any>();
  INITIAL_USERS.forEach((u) => combinedMap.set(u.id, { ...u }));
  if (users && Array.isArray(users)) {
    users.forEach((u) => {
      const existing = combinedMap.get(u.id);
      combinedMap.set(u.id, {
        ...existing,
        ...u,
        username: u.username || existing?.username || (u.email ? u.email.split('@')[0] : 'admin'),
        password: u.password || existing?.password || 'Azhar@2026',
      });
    });
  }
  const allAvailableUsers = Array.from(combinedMap.values());

  const handleQuickSelect = (uName: string, pass: string) => {
    setIdentifier(uName);
    setPassword(pass);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedId = identifier.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedId || !trimmedPass) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Find user by username, full email, or username prefix before @
      let foundUser = allAvailableUsers.find((u) => {
        const uName = (u.username || '').toLowerCase();
        const uEmail = (u.email || '').toLowerCase();
        const emailPrefix = uEmail.split('@')[0];
        return uName === trimmedId || uEmail === trimmedId || emailPrefix === trimmedId;
      });

      // Direct fallback for default admin credentials
      if (!foundUser && (trimmedId === 'admin' || trimmedId === 'admin@azhar.gov.eg')) {
        foundUser = INITIAL_USERS[0];
      }

      if (!foundUser) {
        setLoading(false);
        setError('اسم المستخدم أو البريد الإلكتروني غير مسجل في المنظومة');
        return;
      }

      if (!foundUser.isActive) {
        setLoading(false);
        setError('هذا الحساب معطل حالياً من قبل إدارة النظام، يرجى مراجعة المسؤول.');
        return;
      }

      const expectedPassword = foundUser.password || 'Azhar@2026';
      if (trimmedPass !== expectedPassword) {
        setLoading(false);
        setError('كلمة المرور غير صحيحة، يرجى التحقق وإعادة المحاولة.');
        return;
      }

      // Successful login with user's role and scope
      login(foundUser);
      navigate('/', { replace: true });
    }, 350);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'radial-gradient(ellipse at 50% 10%, rgba(16,185,129,0.12) 0%, #0a0f18 70%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* عناصر زخرفية فاخرة في الخلفية */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(234,179,8,0.05) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        zIndex: 1
      }}>
        {/* الترويسة والشعار */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '74px',
            height: '74px',
            margin: '0 auto 1.25rem',
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 30px rgba(16,185,129,0.35)',
            border: '2px solid rgba(255,255,255,0.15)'
          }}>
            <Shield size={38} color="#ffffff" strokeWidth={2.2} />
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem',
            borderRadius: '999px',
            background: 'rgba(234,179,8,0.12)',
            border: '1px solid rgba(234,179,8,0.3)',
            color: '#facc15',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={14} />
            <span>الأزهر الشريف — قطاع المعاهد الأزهرية</span>
          </div>
          <h1 style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            color: '#f8fafc',
            letterSpacing: '-0.02em',
            marginBottom: '0.4rem'
          }}>
            المشروع القومي للياقة البدنية
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            تسجيل الدخول الآمن للمنظومة باليوزر والباسورد
          </p>
        </div>

        {/* بطاقة تسجيل الدخول الفاخرة */}
        <div className="login-card" style={{
          background: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '2.25rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}>
          <h2 style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#f8fafc',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <KeyRound size={20} color="#10b981" />
            <span>تسجيل الدخول للمنظومة</span>
          </h2>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: '#cbd5e1', marginBottom: '0.4rem' }}>
                اسم المستخدم أو البريد الإلكتروني:
              </label>
              <div style={{ position: 'relative' }}>
                <UserCircle size={18} style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingRight: '2.75rem', height: '46px', fontSize: '0.95rem' }}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin أو user@azhar.gov.eg"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ color: '#cbd5e1', marginBottom: '0.4rem' }}>
                كلمة المرور (Password):
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingRight: '2.75rem', paddingLeft: '2.75rem', height: '46px', fontSize: '0.95rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={showPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(244,63,94,0.15)',
                border: '1px solid rgba(244,63,94,0.3)',
                color: '#fb7185',
                fontSize: '0.88rem',
                marginBottom: '1.25rem'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                height: '46px'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'جاري التحقق...' : 'دخول إلى المنظومة'}
            </button>
          </form>

          {/* حسابات تجريبية سريعة */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', fontWeight: 600 }}>
              حسابات تجريبية سريعة (انقر للاختيار التلقائي):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {allAvailableUsers.slice(0, 6).map((u) => {
                const isSelected = identifier.toLowerCase() === (u.username || '').toLowerCase();
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickSelect(u.username || u.email.split('@')[0], u.password || 'Azhar@2026')}
                    style={{
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isSelected ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      color: isSelected ? '#34d399' : '#e2e8f0',
                      textAlign: 'right',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{u.username || u.email.split('@')[0]}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {ROLE_LABELS[u.role as keyof typeof ROLE_LABELS] || u.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.8rem'
          }}>
            <CheckCircle2 size={15} color="#10b981" />
            <span>نظام إلكتروني مؤمن ومركزي معتمد</span>
          </div>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginTop: '1.75rem'
        }}>
          جمهورية مصر العربية — الإدارة المركزية لرعاية الطلاب
        </p>
      </div>
    </div>
  );
}
