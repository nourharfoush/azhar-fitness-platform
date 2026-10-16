import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store';
import type { User as UserType } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, setLoading } = useAuthStore();
  
  const [email, setEmail] = useState('admin@azhar.gov.eg');
  const [password, setPassword] = useState('Azhar@2026');
  const [name, setName] = useState('المشرف العام');
  const [role, setRole] = useState<UserType['role']>('system_admin');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const authenticatedUser: UserType = {
        id: 'usr-' + Date.now(),
        name: name || 'مسؤول المنظومة',
        email,
        role,
        scopeType: role === 'system_admin' ? 'national' : 'region',
        scopeId: null,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      login(authenticatedUser);
      navigate('/', { replace: true });
    }, 400);
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
        maxWidth: '460px',
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
            المنظومة الرقمية الموحدة للتقييم والرصد الميداني
          </p>
        </div>

        {/* بطاقة تسجيل الدخول الفاخرة */}
        <div style={{
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
            <span>تسجيل الدخول للمنظومة</span>
          </h2>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">الاسم الكامل / الصفة</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل الاسم"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">مستوى الصلاحية المعتمد</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="system_admin">مدير النظام العام (إدارة المنظومة بالكامل)</option>
                <option value="sector_admin">قطاع المعاهد الأزهرية (الإدارة المركزية)</option>
                <option value="region_coordinator">منسق المنطقة الأزهرية</option>
                <option value="admin_inspector">موجه التربية الرياضية بالإدارة</option>
                <option value="institute_officer">معلم التربية الرياضية بالمعهد</option>
                <option value="arbitrator">عضو لجنة التحكيم والتقييم</option>
                <option value="viewer">متابع ومستعرض للتقارير والإحصاءات</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">البريد الإلكتروني المؤسسي</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingRight: '2.75rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@azhar.gov.eg"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور</label>
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
                  style={{ paddingRight: '2.75rem', paddingLeft: '2.75rem' }}
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
                fontSize: '0.85rem',
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
                borderRadius: '12px'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'جاري التحقق...' : 'دخول إلى المنظومة'}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
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
