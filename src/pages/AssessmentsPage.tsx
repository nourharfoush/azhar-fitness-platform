import React, { useState } from 'react';
import {
  Activity, Info, AlertTriangle, CheckCircle, ArrowUp, ArrowDown, Calculator, BookOpen, Layers
} from 'lucide-react';
import {
  FITNESS_TESTS, SCORING_STANDARDS, calculateScore, getDegreeGrade,
  getGradeColor, getTestsForStageAndGender
} from '../data/scoringStandards';
import type { Stage, Gender } from '../data/scoringStandards';
import { STAGE_LABELS, GENDER_LABELS } from '../types';

function ScoreCalculator() {
  const [stage, setStage] = useState<Stage>('primary');
  const [gender, setGender] = useState<Gender>('male');
  const [selectedTest, setSelectedTest] = useState('');
  const [rawValue, setRawValue] = useState<string>('');
  const [result, setResult] = useState<ReturnType<typeof calculateScore> | null>(null);

  const tests = getTestsForStageAndGender(stage, gender);

  const handleCalculate = () => {
    if (!selectedTest || rawValue === '') return;
    const r = calculateScore(selectedTest, parseFloat(rawValue), stage, gender);
    setResult(r);
  };

  const selectedTestObj = FITNESS_TESTS.find((t) => t.id === selectedTest);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Calculator size={20} color="#047857" />
          <span>حاسبة الدرجات والمعايير الرسمية المعتمدة</span>
        </div>
      </div>

      <div className="alert alert-info">
        <Info size={18} style={{ flexShrink: 0 }} />
        <span>تعتمد الحاسبة على معايير شيت «المساطر» المأخوذة من الدليل الرسمي لتقييم الاختبارات البدنية.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">المرحلة الدراسية</label>
          <select className="form-control" value={stage} onChange={(e) => { setStage(e.target.value as Stage); setSelectedTest(''); setResult(null); }}>
            <option value="primary">الابتدائية</option>
            <option value="preparatory">الإعدادية</option>
            <option value="secondary">الثانوية</option>
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">النوع</label>
          <select className="form-control" value={gender} onChange={(e) => { setGender(e.target.value as Gender); setSelectedTest(''); setResult(null); }}>
            <option value="male">بنين</option>
            <option value="female">بنات</option>
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">الاختبار</label>
          <select className="form-control" value={selectedTest} onChange={(e) => { setSelectedTest(e.target.value); setResult(null); }}>
            <option value="">اختر الاختبار...</option>
            {tests.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.unit})</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">
            القيمة المسجلة {selectedTestObj ? `(${selectedTestObj.unit})` : ''}
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="أدخل القيمة..."
            value={rawValue}
            onChange={(e) => setRawValue(e.target.value)}
            step="0.01"
          />
        </div>
      </div>

      {selectedTestObj && (
        <div style={{
          padding: '0.75rem 1rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#475569',
          marginBottom: '1.25rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
        }}>
          {selectedTestObj.direction === 'higher_better'
            ? <><ArrowUp size={16} color="#047857" /> <strong>الأعلى أفضل:</strong> يحصل الطالب على الدرجة بتحقيق الحد الأدنى المطلوب.</>
            : <><ArrowDown size={16} color="#0284c7" /> <strong>الأقل أفضل (اختبار زمني):</strong> يحصل الطالب على الدرجة بعدم تجاوز الحد الأقصى للزمن.</>}
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleCalculate}
        disabled={!selectedTest || rawValue === ''}
      >
        <Calculator size={16} />
        <span>احسب الدرجة والتقدير</span>
      </button>

      {result && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: result.isStandardAvailable ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${result.isStandardAvailable ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: '12px',
        }}>
          {result.isStandardAvailable ? (
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>الدرجة المستحقة</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: getGradeColor(result.grade), lineHeight: 1 }}>
                  {result.degree ?? 0} <span style={{ fontSize: '1.2rem', color: '#64748b' }}>/ 10</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>المستوى التقديري</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: getGradeColor(result.grade) }}>
                  {result.grade}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>نسخة المعيار</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>{result.standardVersion}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#ef4444' }}>
              <AlertTriangle size={18} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{result.grade}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AssessmentsPage() {
  const [activeTab, setActiveTab] = useState<'standards' | 'tests' | 'calculator'>('standards');

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Activity size={28} color="#047857" />
            <span>بنك الاختبارات والدرجات المعيارية</span>
          </h1>
          <p className="page-subtitle">
            الجداول المعيارية الرسمية ومكتبة اختبارات اللياقة البدنية المعتمدة لقطاع المعاهد الأزهرية
          </p>
        </div>
      </div>

      <div className="alert alert-warning">
        <AlertTriangle size={18} style={{ flexShrink: 0 }} />
        <span>
          جميع الدرجات والمساطر المعيارية مطابقة للملحق الرسمي المعتمد. تُطبق الجداول بحسب المرحلة الدراسية والنوع.
        </span>
      </div>

      {/* التبويبات الفاخرة */}
      <div className="tabs">
        {[
          { key: 'standards', label: 'جداول الدرجات المعيارية (المساطر)' },
          { key: 'tests', label: 'دليل وتعريف الاختبارات' },
          { key: 'calculator', label: 'حاسبة الدرجات' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* جداول الدرجات المعيارية */}
      {activeTab === 'standards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {['primary', 'preparatory', 'secondary'].map((stage) => (
            ['male', 'female'].map((gender) => {
              const stageStandards = SCORING_STANDARDS.filter(
                (s) => s.stage === stage && s.gender === gender
              );
              if (stageStandards.length === 0) return null;

              const testNames = stageStandards.map((s) => {
                const t = FITNESS_TESTS.find((f) => f.id === s.testId);
                return t ? `${t.name} (${t.unit})` : s.testId;
              });

              return (
                <div key={`${stage}-${gender}`} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{
                    padding: '1.25rem 1.5rem',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      مسطرة تقييم: المرحلة {STAGE_LABELS[stage as Stage]} ({GENDER_LABELS[gender as Gender]})
                    </h3>
                    <span className="badge badge-success">
                      معتمد 2026/2027
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ width: '80px', textAlign: 'center' }}>الدرجة</th>
                          <th style={{ width: '120px' }}>التقدير</th>
                          {testNames.map((n) => <th key={n}>{n}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((degree) => (
                          <tr key={degree}>
                            <td style={{ textAlign: 'center', fontWeight: 900, fontSize: '1.1rem', color: getGradeColor(getDegreeGrade(degree)) }}>
                              {degree}
                            </td>
                            <td>
                              <span style={{
                                background: `${getGradeColor(getDegreeGrade(degree))}18`,
                                color: getGradeColor(getDegreeGrade(degree)),
                                padding: '0.25rem 0.65rem',
                                borderRadius: '6px',
                                fontSize: '0.82rem',
                                fontWeight: 800,
                              }}>
                                {getDegreeGrade(degree)}
                              </span>
                            </td>
                            {stageStandards.map((std) => {
                              const row = std.rows.find((r) => r.degree === degree);
                              const val = row?.minValue !== undefined ? `≥ ${row.minValue}` :
                                         row?.maxValue !== undefined ? `≤ ${row.maxValue}` : '—';
                              return (
                                <td key={std.id} style={{ fontWeight: 600, fontFamily: 'sans-serif' }}>
                                  {val}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          ))}
        </div>
      )}

      {/* دليل الاختبارات */}
      {activeTab === 'tests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {['primary', 'preparatory', 'secondary'].map((stage) => {
            const stageTests = FITNESS_TESTS.filter((t) => t.stages.includes(stage as Stage));
            if (stageTests.length === 0) return null;
            return (
              <div key={stage} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                  padding: '1.25rem 1.5rem',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    اختبارات المرحلة {STAGE_LABELS[stage as Stage]}
                  </h3>
                </div>

                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>اسم الاختبار</th>
                        <th>وحدة القياس</th>
                        <th>طريقة التقييم</th>
                        <th>الوصف والهدف</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stageTests.map((test) => (
                        <tr key={test.id}>
                          <td style={{ fontWeight: 700, color: '#0f172a' }}>{test.name}</td>
                          <td><span className="badge badge-info">{test.unit}</span></td>
                          <td>
                            {test.direction === 'higher_better'
                              ? <span className="badge badge-success"><ArrowUp size={12} /> الأعلى أفضل</span>
                              : <span className="badge badge-neutral"><ArrowDown size={12} /> الأقل أفضل (زمن)</span>}
                          </td>
                          <td style={{ color: '#475569' }}>{test.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* حاسبة الدرجات */}
      {activeTab === 'calculator' && <ScoreCalculator />}
    </div>
  );
}
