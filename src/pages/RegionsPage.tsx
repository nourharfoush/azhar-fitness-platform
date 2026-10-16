import React, { useState, useMemo } from 'react';
import { Search, MapPin, Building2, ChevronDown, ChevronUp, Layers, CheckCircle } from 'lucide-react';
import { AZHAR_REGIONS } from '../data/organizationData';

export default function RegionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set([AZHAR_REGIONS[0]?.id]));

  const toggleRegion = (id: string) => {
    setExpandedRegions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedRegions(new Set(AZHAR_REGIONS.map((r) => r.id)));
  };

  const collapseAll = () => {
    setExpandedRegions(new Set());
  };

  const filteredRegions = useMemo(() => {
    if (!searchTerm.trim()) return AZHAR_REGIONS;
    const q = searchTerm.trim().toLowerCase();
    return AZHAR_REGIONS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.administrations.some((a) => a.name.toLowerCase().includes(q))
    );
  }, [searchTerm]);

  const totalAdministrations = useMemo(() => {
    return AZHAR_REGIONS.reduce((sum, r) => sum + r.administrations.length, 0);
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <MapPin className="text-primary" size={28} />
            <span>المناطق والإدارات التعليمية المعتمدة</span>
          </h1>
          <p className="page-subtitle">
            الهيكل الجغرافي والإداري لقطاع المعاهد الأزهرية (27 منطقة أزهرية — {totalAdministrations} إدارة تعليمية)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={expandAll} className="btn btn-secondary btn-sm">
            توسيع الكل
          </button>
          <button onClick={collapseAll} className="btn btn-secondary btn-sm">
            طي الكل
          </button>
        </div>
      </div>

      {/* المؤشرات السريعة للهيكل الجغرافي */}
      <div className="kpi-grid">
        <div className="kpi-card emerald">
          <div className="kpi-icon-wrap">
            <MapPin size={26} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{AZHAR_REGIONS.length}</div>
            <div className="kpi-label">منطقة أزهرية رسمية</div>
            <div className="kpi-meta">تغطي كافة محافظات الجمهورية</div>
          </div>
        </div>

        <div className="kpi-card amber">
          <div className="kpi-icon-wrap">
            <Building2 size={26} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{totalAdministrations}</div>
            <div className="kpi-label">إدارة تعليمية معتمدة</div>
            <div className="kpi-meta">وفق قاعدة البيانات الرسمية الموحدة</div>
          </div>
        </div>

        <div className="kpi-card sky">
          <div className="kpi-icon-wrap">
            <Layers size={26} />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">100%</div>
            <div className="kpi-label">جاهزية التوزيع الميداني</div>
            <div className="kpi-meta">جاهزة للربط مع المعاهد واللجان</div>
          </div>
        </div>
      </div>

      {/* شريط البحث الميداني الفاخر */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div className="search-bar-wrap" style={{ maxWidth: '100%' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث بالاسم عن أي منطقة أزهرية أو إدارة تعليمية (مثال: المنتزه، دمنهور، إسنا، السنبلاوين)..."
          />
        </div>
      </div>

      {/* قائمة المناطق والأكورديون */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredRegions.map((region) => {
          const isExpanded = expandedRegions.has(region.id);
          return (
            <div
              key={region.id}
              className="card"
              style={{
                padding: '0',
                border: isExpanded ? '1px solid var(--border-accent)' : '1px solid var(--border-color)',
                boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-xs)'
              }}
            >
              <div
                onClick={() => toggleRegion(region.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  background: isExpanded ? 'rgba(16, 185, 129, 0.04)' : 'transparent',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800
                    }}
                  >
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {region.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      تضم {region.administrations.length} إدارة تعليمية معتمدة
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="badge badge-success">
                    {region.administrations.length} إدارات
                  </span>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderTop: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)'
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase'
                    }}
                  >
                    الإدارات التعليمية التابعة للمنطقة:
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '0.75rem'
                    }}
                  >
                    {region.administrations.map((admin) => (
                      <div
                        key={admin.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.75rem 1rem',
                          background: 'var(--bg-surface)',
                          borderRadius: 'var(--border-radius-sm)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.9rem',
                          color: 'var(--text-primary)',
                          fontWeight: 600
                        }}
                      >
                        <Building2 size={16} color="var(--color-primary)" />
                        <span>{admin.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredRegions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={32} />
            </div>
            <h3 className="empty-title">لا توجد نتائج مطابقة</h3>
            <p className="empty-desc">
              تأكد من كتابة اسم المنطقة أو الإدارة التعليمية بشكل صحيح.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
