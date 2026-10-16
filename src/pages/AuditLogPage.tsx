import React, { useState } from 'react';
import {
  Eye, Search, Filter, Download, ShieldCheck,
  Clock, User, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import { useAuditLogStore } from '../store';

export default function AuditLogPage() {
  const { logs, clearLogs } = useAuditLogStore();
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((l) => {
    const matchesAction = selectedAction === 'all' || l.action === selectedAction;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      l.performedBy.toLowerCase().includes(q) ||
      l.entityType.toLowerCase().includes(q) ||
      (l.description && l.description.toLowerCase().includes(q)) ||
      (l.reason && l.reason.toLowerCase().includes(q));
    return matchesAction && matchesSearch;
  });

  const getActionBadge = (act: string) => {
    switch (act) {
      case 'approve':
        return <span className="badge badge-success">✓ اعتماد نتائج</span>;
      case 'create':
        return <span className="badge badge-primary">+ إنشاء سجل</span>;
      case 'update':
        return <span className="badge badge-warning">✎ تعديل بيانات</span>;
      case 'delete':
        return <span className="badge badge-danger">✕ حذف</span>;
      case 'submit':
        return <span className="badge badge-neutral">↑ إرسال للمراجعة</span>;
      case 'export':
        return <span className="badge" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>↓ تصدير بيانات</span>;
      default:
        return <span className="badge badge-neutral">{act}</span>;
    }
  };

  const handleExportCSV = () => {
    const headers = 'رقم العملية,التاريخ والوقت,المستخدم,الدور,نوع الإجراء,الكيان,التفاصيل,السبب,عنوان IP\n';
    const rows = filteredLogs
      .map((l) =>
        `"${l.id}","${l.performedAt}","${l.performedBy}","${l.performedByRole || ''}","${l.action}","${l.entityType}","${l.description || ''}","${l.reason || ''}","${l.ipAddress || ''}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `سجل_العمليات_الازهر_${Date.now()}.csv`);
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
            <Eye className="text-primary" size={28} />
            <span>سجل العمليات والتدقيق الأمني (Audit Log)</span>
          </h1>
          <p className="page-subtitle">
            سجل شامل لتتبع جميع العمليات والتعديلات والاعتمادات بالمنظومة لضمان النزاهة والحوكمة
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} />
            <span>تصدير السجل CSV</span>
          </button>
        </div>
      </div>

      {/* Security Info Card */}
      <div className="alert alert-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <ShieldCheck size={24} color="#166534" />
        <div>
          <strong>نظام الحماية والشفافية:</strong> يتم تسجيل كافة حركات إضافة وتعديل واعتماد قياسات الطلاب آلياً مع توثيق اسم المستخدم وتاريخ العملية وسبب التعديل لمنع أي تلاعب بالدرجات المعتمدة.
        </div>
      </div>

      {/* Filters Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label className="form-label">نوع الإجراء:</label>
            <select
              className="form-select"
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              <option value="all">جميع الإجراءات</option>
              <option value="approve">اعتماد نتائج</option>
              <option value="create">إنشاء</option>
              <option value="update">تعديل</option>
              <option value="submit">إرسال للمراجعة</option>
              <option value="export">تصدير بيانات</option>
              <option value="delete">حذف</option>
            </select>
          </div>

          <div>
            <label className="form-label">بحث في السجل:</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="ابحث باسم المستخدم، الكيان أو الوصف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Clock size={20} color="var(--primary)" />
            <span>الحركات المسجلة مؤخراً</span>
            <span className="badge badge-primary" style={{ marginRight: '0.5rem' }}>
              {filteredLogs.length} عملية
            </span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>التاريخ والوقت</th>
                <th>المستخدم المنفذ</th>
                <th>نوع الإجراء</th>
                <th>الكيان المتأثر</th>
                <th>تفاصيل العملية</th>
                <th>سبب التعديل / الإجراء</th>
                <th>عنوان IP</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
                      {log.performedAt}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {log.performedBy}
                    </div>
                    {log.performedByRole && (
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {log.performedByRole}
                      </div>
                    )}
                  </td>
                  <td>{getActionBadge(log.action)}</td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
                      {log.entityType}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.9rem', color: '#1e293b', maxWidth: '320px' }}>
                    {log.description || '—'}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '240px' }}>
                    {log.reason || 'إجراء روتيني معتمد'}
                  </td>
                  <td>
                    <code style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {log.ipAddress || '197.xx.xx.xx'}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
