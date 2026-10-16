import React, { useState } from 'react';
import {
  BarChart3, FileSpreadsheet, Download, Printer, Filter,
  CheckCircle2, Award, User, School, MapPin, Search
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { AZHAR_REGIONS } from '../data/organizationData';
import { useStudentStore, useInstituteStore, useCompetitionStore } from '../store';
import { FITNESS_TESTS } from '../data/scoringStandards';

const GRADE_COLORS = ['#047857', '#0284c7', '#f59e0b', '#ea580c', '#dc2626'];

export default function ReportsPage() {
  const { students, sessions } = useStudentStore();
  const { institutes } = useInstituteStore();
  const { competitions } = useCompetitionStore();

  const [activeTab, setActiveTab] = useState<'national' | 'regions' | 'student-card'>('national');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [searchRegion, setSearchRegion] = useState('');

  // Sample data for charts
  const fitnessDistributionData = [
    { name: 'ممتاز (90-100)', value: 42, color: '#047857' },
    { name: 'جيد جداً (80-89)', value: 35, color: '#0284c7' },
    { name: 'جيد (70-79)', value: 15, color: '#f59e0b' },
    { name: 'مقبول (60-69)', value: 6, color: '#ea580c' },
    { name: 'يحتاج عناية (<60)', value: 2, color: '#dc2626' },
  ];

  const bmiDistributionData = [
    { name: 'وزن مثالي طبيعي', value: 68, color: '#047857' },
    { name: 'زيادة وزن طفيفة', value: 18, color: '#f59e0b' },
    { name: 'نحافة', value: 9, color: '#0284c7' },
    { name: 'سمنة مفرطة', value: 5, color: '#dc2626' },
  ];

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleExportCSV = () => {
    const headers = 'المنطقة الأزهرية,عدد الإدارات,المعاهد المسجلة,الطلاب المقيدون,جلسات القياس,حالة الرصد\n';
    const rows = AZHAR_REGIONS.map((r) => {
      const regInsts = institutes.filter((i) => i.regionId === r.id).length;
      const regStudents = students.filter((s) => s.regionId === r.id).length;
      return `"${r.name}","${r.administrations.length}","${regInsts}","${regStudents}","${sessions.length}","معتمد"`;
    }).join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `التقرير_الشامل_المناطق_الازهرية_${Date.now()}.csv`);
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
            <BarChart3 className="text-primary" size={28} />
            <span>التقارير والإحصاءات الرسمية</span>
          </h1>
          <p className="page-subtitle">
            استخراج وتصدير البيانات الإحصائية وبطاقات اللياقة البدنية الفردية على مستوى الجمهورية
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} />
            <span>طباعة التقرير الحالي</span>
          </button>
          <button className="btn btn-primary" onClick={handleExportCSV}>
            <Download size={16} />
            <span>تصدير كشف Excel</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'national' ? 'active' : ''}`}
          onClick={() => setActiveTab('national')}
        >
          المؤشرات والرسوم البيانية القومية
        </button>
        <button
          className={`tab-btn ${activeTab === 'regions' ? 'active' : ''}`}
          onClick={() => setActiveTab('regions')}
        >
          كشف المناطق الأزهرية (27 منطقة)
        </button>
        <button
          className={`tab-btn ${activeTab === 'student-card' ? 'active' : ''}`}
          onClick={() => setActiveTab('student-card')}
        >
          بطاقة تقييم اللياقة الفردية للطالب
        </button>
      </div>

      {/* Tab 1: National Charts & Stats */}
      {activeTab === 'national' && (
        <div>
          {/* National KPIs */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
                <Award size={24} />
              </div>
              <div className="kpi-details">
                <div className="kpi-value">87.4%</div>
                <div className="kpi-label">متوسط درجات اللياقة العامة</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                <CheckCircle2 size={24} />
              </div>
              <div className="kpi-details">
                <div className="kpi-value">94.8%</div>
                <div className="kpi-label">نسبة اجتياز الاختبارات</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                <School size={24} />
              </div>
              <div className="kpi-details">
                <div className="kpi-value">{institutes.length}</div>
                <div className="kpi-label">معاهد منخرطة في الرصد</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <User size={24} />
              </div>
              <div className="kpi-details">
                <div className="kpi-value">{students.length}</div>
                <div className="kpi-label">إجمالي الطلاب المقيّمين</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <BarChart3 size={20} color="var(--primary)" />
                  <span>توزيع تقديرات اللياقة البدنية العامة للطلاب</span>
                </div>
              </div>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fitnessDistributionData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" name="النسبة المئوية %" radius={[6, 6, 0, 0]}>
                      {fitnessDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Award size={20} color="var(--gold)" />
                  <span>مؤشر كتلة الجسم (BMI) والحالة التغذوية</span>
                </div>
              </div>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bmiDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {bmiDistributionData.map((entry, index) => (
                        <Cell key={`cell-pie-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Regions Table */}
      {activeTab === 'regions' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileSpreadsheet size={20} color="var(--primary)" />
              <span>جاهزية وتغطية الـ 27 منطقة أزهرية على مستوى الجمهورية</span>
            </div>
            <div style={{ position: 'relative', width: '250px' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingRight: '2rem' }}
                placeholder="ابحث باسم المنطقة..."
                value={searchRegion}
                onChange={(e) => setSearchRegion(e.target.value)}
              />
              <Search size={15} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>المنطقة الأزهرية</th>
                  <th>عدد الإدارات التعليمية</th>
                  <th>المعاهد المسجلة</th>
                  <th>الطلاب المقيدون</th>
                  <th>حالة الاعتماد</th>
                </tr>
              </thead>
              <tbody>
                {AZHAR_REGIONS.filter((r) => !searchRegion || r.name.includes(searchRegion)).map((region, idx) => {
                  const regionStudents = students.filter((s) => s.regionId === region.id).length;
                  const regionInsts = institutes.filter((i) => i.regionId === region.id).length;

                  return (
                    <tr key={region.id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{region.name}</td>
                      <td>{region.administrations.length} إدارة تعليمية</td>
                      <td>
                        <span className="badge badge-neutral">
                          <School size={12} /> {regionInsts} معهد
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-neutral">
                          <User size={12} /> {regionStudents} طالب
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> جاهز للرصد الميداني
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Individual Student Fitness Card */}
      {activeTab === 'student-card' && (
        <div>
          {/* Student Selector */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 700 }}>
              اختر الطالب لعرض واستخراج بطاقة اللياقة البدنية الرسمية:
            </label>
            <select
              className="form-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              style={{ maxWidth: '500px' }}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.grade} ({s.instituteName})
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <div
              className="card"
              style={{
                border: '2px solid var(--primary)',
                borderRadius: '16px',
                padding: '2.5rem',
                backgroundColor: '#ffffff',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* Card Official Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#047857' }}>
                    الأزهر الشريف — قطاع المعاهد الأزهرية
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 700 }}>
                    الإدارة المركزية لرعاية الطلاب — الإدارة العامة للتربية الرياضية
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 800, marginTop: '0.25rem' }}>
                    بطاقة تقييم اللياقة البدنية للطالب (المشروع القومي) 2026/2027
                  </div>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <div className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                    رقم القيد: {selectedStudent.enrollmentNumber}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>
                    تاريخ الاستخراج: {new Date().toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>

              {/* Student Metadata Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  backgroundColor: '#f8fafc',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1.75rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>اسم الطالب:</div>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{selectedStudent.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>الرقم القومي:</div>
                  <div style={{ fontWeight: 700 }}>{selectedStudent.nationalId || 'مسجل'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>الصف والمرحلة:</div>
                  <div style={{ fontWeight: 700 }}>{selectedStudent.grade} ({selectedStudent.classroom || '1'})</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>المعهد والمنطقة:</div>
                  <div style={{ fontWeight: 700 }}>{selectedStudent.instituteName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedStudent.regionName}</div>
                </div>
              </div>

              {/* Fitness Scores Table */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  نتائج الاختبارات البدنية ومستوى الأداء:
                </h4>
                <table className="table" style={{ border: '1px solid #e2e8f0' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                      <th>اسم الاختبار البدني</th>
                      <th>العنصر المقاس</th>
                      <th>النتيجة الخام</th>
                      <th>الدرجة المستحقة (من 10)</th>
                      <th>التقدير النوعي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FITNESS_TESTS.slice(0, 6).map((test, index) => {
                      const mockDegree = 9.5 - (index * 0.3);
                      return (
                        <tr key={test.id}>
                          <td style={{ fontWeight: 700 }}>{test.name}</td>
                          <td style={{ color: '#64748b', fontSize: '0.88rem' }}>{test.description}</td>
                          <td>
                            <span style={{ fontWeight: 700 }}>{test.unit === 'ثانية' ? '8.4 ث' : '28 تكرار'}</span>
                          </td>
                          <td>
                            <strong style={{ color: '#047857', fontSize: '1rem' }}>
                              {mockDegree.toFixed(1)}
                            </strong>
                          </td>
                          <td>
                            <span className="badge badge-success">ممتاز</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Signatures and Stamp */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.5rem',
                  borderTop: '2px dashed #cbd5e1',
                  paddingTop: '1.5rem',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '2.5rem' }}>معلم التربية الرياضية بالمعهد</div>
                  <div style={{ borderBottom: '1px solid #94a3b8', width: '160px', margin: '0 auto' }}></div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem' }}>التوقيع والاعتماد</div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, marginBottom: '2.5rem' }}>موجه التربية الرياضية بالإدارة</div>
                  <div style={{ borderBottom: '1px solid #94a3b8', width: '160px', margin: '0 auto' }}></div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem' }}>التوقيع والمراجعة</div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, marginBottom: '2.5rem' }}>خاتم المعهد الأزهري المعتمد</div>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: '2px dashed #047857',
                      margin: '-1rem auto 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#047857',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                    }}
                  >
                    شعار الأزهر
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
