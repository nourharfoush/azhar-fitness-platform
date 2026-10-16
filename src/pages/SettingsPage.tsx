import React, { useState } from 'react';
import {
  Settings, Save, Download, Upload, RotateCcw,
  CheckCircle, AlertCircle, Database, Server, Shield,
  Calendar, Clock, Sliders
} from 'lucide-react';
import { useSettingsStore, useAuditLogStore, useAuthStore } from '../store';

export default function SettingsPage() {
  const { settings, updateSettings, resetAllData } = useSettingsStore();
  const { addLog } = useAuditLogStore();
  const { user } = useAuthStore();

  const [formState, setFormState] = useState({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    addLog({
      entityType: 'إعدادات النظام',
      entityId: 'settings',
      action: 'update',
      description: `تحديث إعدادات المنظومة: العام ${formState.academicYear}، فترة الرصد: ${formState.measurementWindowOpen ? 'مفتوحة' : 'مغلقة'}`,
      performedBy: user?.name || 'مدير النظام',
      performedByRole: 'مدير النظام',
    });
  };

  // Export full JSON database backup
  const handleExportBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      platform: 'Azhar Fitness Platform',
      version: '1.0.0',
      localStorageData: {
        auth: localStorage.getItem('azhar-fitness-auth'),
        studentsDb: localStorage.getItem('azhar-fitness-students-db'),
        institutes: localStorage.getItem('azhar-fitness-institutes'),
        competitions: localStorage.getItem('azhar-fitness-competitions'),
        followup: localStorage.getItem('azhar-fitness-followup'),
        users: localStorage.getItem('azhar-fitness-users'),
        audit: localStorage.getItem('azhar-fitness-audit'),
        settings: localStorage.getItem('azhar-fitness-settings'),
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `azhar_fitness_backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addLog({
      entityType: 'نسخ احتياطي',
      entityId: 'backup',
      action: 'export',
      description: 'تصدير نسخة احتياطية كاملة لقاعدة بيانات المنظومة بصيغة JSON',
      performedBy: user?.name || 'مدير النظام',
      performedByRole: 'مدير النظام',
    });
  };

  // Restore JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.localStorageData) {
          Object.entries(json.localStorageData).forEach(([key, val]) => {
            if (val && typeof val === 'string') {
              localStorage.setItem(`azhar-fitness-${key}`, val);
            }
          });
          alert('تمت استعادة النسخة الاحتياطية بنجاح! سيتم إعادة تحميل الصفحة لتطبيق التغييرات.');
          window.location.reload();
        } else {
          alert('الملف المرفوع لا يحتوي على بنية النسخة الاحتياطية المتوافقة.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('تحذير: هل أنت متأكد من إعادة تعيين جميع البيانات إلى حالتها النموذجية الأولية؟')) {
      resetAllData();
      alert('تمت إعادة تهيئة البيانات النموذجية بنجاح.');
      window.location.reload();
    }
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Settings className="text-primary" size={28} />
            <span>إعدادات المنظومة والبيئة التشغيلية</span>
          </h1>
          <p className="page-subtitle">
            ضبط معايير العام الدراسي، فترات إدخال ورصد النتائج، وإدارة النسخ الاحتياطي
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="alert alert-info animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle size={20} color="#166534" />
          <span>تم حفظ الإعدادات وتطبيقها بنجاح على مستوى المنظومة!</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {/* Settings Form Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Sliders size={20} color="var(--primary)" />
              <span>المعايير التشغيلية للقياس البدني</span>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">العام الدراسي المعتمد:</label>
              <input
                type="text"
                className="form-input"
                value={formState.academicYear}
                onChange={(e) => setFormState({ ...formState, academicYear: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">الفصل الدراسي الحالي:</label>
              <select
                className="form-select"
                value={formState.activeSemester}
                onChange={(e) => setFormState({ ...formState, activeSemester: e.target.value as any })}
              >
                <option value="first">الفصل الدراسي الأول (التقييم القبلي)</option>
                <option value="second">الفصل الدراسي الثاني (التقييم البعدي والنهائيات)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">فترة رصد القياسات للمدارس والمعاهد:</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="window"
                    checked={formState.measurementWindowOpen}
                    onChange={() => setFormState({ ...formState, measurementWindowOpen: true })}
                  />
                  <span style={{ fontWeight: 700, color: '#047857' }}>مفتوحة ومتاحة للمعلمين</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="window"
                    checked={!formState.measurementWindowOpen}
                    onChange={() => setFormState({ ...formState, measurementWindowOpen: false })}
                  />
                  <span style={{ fontWeight: 700, color: '#b91c1c' }}>مغلقة للمراجعة والاعتماد</span>
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formState.autoCalculation}
                  onChange={(e) => setFormState({ ...formState, autoCalculation: e.target.checked })}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>تفعيل محرك التقييم التلقائي المباشر</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    حساب الدرجات والتقديرات والـ BMI فور إدخال النتيجة الخام
                  </div>
                </div>
              </label>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formState.offlineDrafts}
                  onChange={(e) => setFormState({ ...formState, offlineDrafts: e.target.checked })}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>تفعيل حفظ المسودات محلياً (Offline Storage)</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    حماية البيانات من الفقد عند ضعف أو انقطاع الإنترنت في الملاعب
                  </div>
                </div>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={16} />
              <span>حفظ الإعدادات</span>
            </button>
          </form>
        </div>

        {/* Backup and Environment Diagnostics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Data Backup Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Database size={20} color="var(--primary)" />
                <span>النسخ الاحتياطي وإدارة البيانات</span>
              </div>
            </div>

            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              يمكنك تصدير نسخة كاملة من جميع سجلات الطلاب والقياسات والمعاهد والمستخدمين في ملف JSON آمن لاستعادتها في أي وقت.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={handleExportBackup} style={{ justifyContent: 'center' }}>
                <Download size={16} />
                <span>تصدير نسخة احتياطية كاملة (JSON)</span>
              </button>

              <label className="btn btn-ghost" style={{ justifyContent: 'center', border: '1px dashed #cbd5e1', cursor: 'pointer' }}>
                <Upload size={16} />
                <span>استعادة البيانات من ملف JSON</span>
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleImportBackup}
                />
              </label>

              <button
                className="btn btn-ghost"
                onClick={handleResetData}
                style={{ justifyContent: 'center', color: '#dc2626', marginTop: '0.5rem' }}
              >
                <RotateCcw size={16} />
                <span>إعادة ضبط البيانات النموذجية الأولية</span>
              </button>
            </div>
          </div>

          {/* Environment Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Server size={20} color="var(--primary)" />
                <span>بيئة التشغيل والجاهزية للنشر</span>
              </div>
              <span className="badge badge-success">جاهز للنشر 100%</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>الواجهة وإطار العمل:</span>
                <span style={{ fontWeight: 700 }}>React 19 + TypeScript + Vite 8</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>إدارة الحالة وقاعدة البيانات:</span>
                <span style={{ fontWeight: 700 }}>Zustand + LocalStorage Persist</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>منصة الاستضافة السحابية:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Vercel + GitHub Actions</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                <span style={{ color: '#64748b' }}>إعدادات التوجيه (SPA Routing):</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>vercel.json Rewrites مهيأة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
