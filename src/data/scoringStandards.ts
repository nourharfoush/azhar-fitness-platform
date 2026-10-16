// =============================================================================
// محرّك التقييم (Scoring Engine)
// المصدر: شيت "المساطر" من ملف سجلات_التقييم_والمتابعة_اللياقة_البدنية.xlsx
// الدليل ص 21-23 و 29-30
// =============================================================================

export type Stage = 'primary' | 'preparatory' | 'secondary';
export type Gender = 'male' | 'female';
export type ScoreDirection = 'higher_better' | 'lower_better';

export interface FitnessTest {
  id: string;
  name: string;
  unit: string;
  direction: ScoreDirection;
  stages: Stage[];
  genders: Gender[];
  description: string;
  minVal?: number;
  maxVal?: number;
}

export interface ScoringRow {
  degree: number; // 1-10
  minValue?: number; // للاختبارات التي الأعلى أفضل (حد أدنى)
  maxValue?: number; // للاختبارات الزمنية التي الأقل أفضل (حد أقصى)
}

export interface ScoringStandard {
  id: string;
  testId: string;
  stage: Stage;
  gender: Gender;
  version: string;
  rows: ScoringRow[];
}

// ============================================================
// تعريف الاختبارات
// ============================================================
export const FITNESS_TESTS: FitnessTest[] = [
  {
    id: 'running_in_place_15s',
    name: 'الجري في المكان (15 ث)',
    unit: 'عدد',
    direction: 'higher_better',
    stages: ['primary', 'preparatory'],
    genders: ['male', 'female'],
    description: 'الجري في المكان لمدة 15 ثانية وحساب عدد الخطوات',
    minVal: 0,
    maxVal: 100,
  },
  {
    id: 'sit_ups_30s',
    name: 'الجلوس من الرقود (30 ث)',
    unit: 'عدد',
    direction: 'higher_better',
    stages: ['primary', 'preparatory'],
    genders: ['male', 'female'],
    description: 'الجلوس من وضع الرقود خلال 30 ثانية',
    minVal: 0,
    maxVal: 80,
  },
  {
    id: 'push_ups',
    name: 'الانبطاح المائل',
    unit: 'عدد',
    direction: 'higher_better',
    stages: ['primary', 'preparatory'],
    genders: ['male'],
    description: 'الانبطاح المائل وعدد التكرارات',
    minVal: 0,
    maxVal: 80,
  },
  {
    id: 'push_ups_high',
    name: 'الانبطاح المائل العالي',
    unit: 'عدد',
    direction: 'higher_better',
    stages: ['primary', 'preparatory'],
    genders: ['female'],
    description: 'الانبطاح المائل العالي وعدد التكرارات',
    minVal: 0,
    maxVal: 80,
  },
  {
    id: 'circles_jump',
    name: 'الوثب داخل الدوائر المرقمة',
    unit: 'ثانية',
    direction: 'lower_better',
    stages: ['primary'],
    genders: ['male', 'female'],
    description: 'الوثب بالقدمين داخل الدوائر المرقمة (1-9)',
    minVal: 1,
    maxVal: 20,
  },
  {
    id: 'broad_jump',
    name: 'الوثب العريض من الثبات',
    unit: 'سم',
    direction: 'higher_better',
    stages: ['preparatory'],
    genders: ['male', 'female'],
    description: 'الوثب العريض من الثبات بالقدمين معًا',
    minVal: 50,
    maxVal: 350,
  },
  {
    id: 'zigzag_run_30m',
    name: 'الجري الزجزاجي (30م)',
    unit: 'ثانية',
    direction: 'lower_better',
    stages: ['preparatory'],
    genders: ['male', 'female'],
    description: 'الجري الزجزاجي مسافة 30 متر',
    minVal: 5,
    maxVal: 30,
  },
  {
    id: 'bounce_run',
    name: 'الجري الارتدادي',
    unit: 'ثانية',
    direction: 'lower_better',
    stages: ['primary'],
    genders: ['female'],
    description: 'الجري الارتدادي للبنات',
    minVal: 5,
    maxVal: 30,
  },
  {
    id: 'multidirectional_run',
    name: 'الجري متعدد الجهات',
    unit: 'ثانية',
    direction: 'lower_better',
    stages: ['secondary'],
    genders: ['male'],
    description: 'الجري متعدد الجهات',
    minVal: 10,
    maxVal: 25,
  },
  {
    id: 'trunk_bend',
    name: 'ثني الجذع من الوقوف',
    unit: 'سم',
    direction: 'higher_better',
    stages: ['secondary'],
    genders: ['male'],
    description: 'ثني الجذع للأمام من وضع الوقوف',
    minVal: -10,
    maxVal: 50,
  },
  {
    id: 'running_in_place_15s_secondary',
    name: 'الجري في المكان (15 ث)',
    unit: 'عدد',
    direction: 'higher_better',
    stages: ['secondary'],
    genders: ['male'],
    description: 'الجري في المكان لمدة 15 ثانية - ثانوي بنين',
    minVal: 0,
    maxVal: 100,
  },
  {
    id: 'sit_ups_30s_secondary',
    name: 'الجلوس من الرقود (30 ث)',
    unit: 'عدد',
    direction: 'higher_better',
    stages: ['secondary'],
    genders: ['male'],
    description: 'الجلوس من الرقود - ثانوي بنين',
    minVal: 0,
    maxVal: 80,
  },
  {
    id: 'push_ups_secondary',
    name: 'الانبطاح المائل',
    unit: 'عدد',
    direction: 'higher_better',
    stages: ['secondary'],
    genders: ['male'],
    description: 'الانبطاح المائل - ثانوي بنين',
    minVal: 0,
    maxVal: 100,
  },
];

// ============================================================
// جداول الدرجات المعيارية (المساطر)
// المصدر: شيت "المساطر" من ملف الإكسيل
// ============================================================

export const SCORING_STANDARDS: ScoringStandard[] = [
  // ابتدائي بنين
  {
    id: 'std_primary_male_running',
    testId: 'running_in_place_15s',
    stage: 'primary',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 12 },
      { degree: 2, minValue: 14 },
      { degree: 3, minValue: 16 },
      { degree: 4, minValue: 18 },
      { degree: 5, minValue: 20 },
      { degree: 6, minValue: 22 },
      { degree: 7, minValue: 24 },
      { degree: 8, minValue: 26 },
      { degree: 9, minValue: 28 },
      { degree: 10, minValue: 30 },
    ],
  },
  {
    id: 'std_primary_male_situps',
    testId: 'sit_ups_30s',
    stage: 'primary',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 13 },
      { degree: 2, minValue: 15 },
      { degree: 3, minValue: 17 },
      { degree: 4, minValue: 19 },
      { degree: 5, minValue: 21 },
      { degree: 6, minValue: 23 },
      { degree: 7, minValue: 25 },
      { degree: 8, minValue: 27 },
      { degree: 9, minValue: 29 },
      { degree: 10, minValue: 31 },
    ],
  },
  {
    id: 'std_primary_male_pushups',
    testId: 'push_ups',
    stage: 'primary',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 11 },
      { degree: 2, minValue: 13 },
      { degree: 3, minValue: 15 },
      { degree: 4, minValue: 17 },
      { degree: 5, minValue: 19 },
      { degree: 6, minValue: 21 },
      { degree: 7, minValue: 23 },
      { degree: 8, minValue: 25 },
      { degree: 9, minValue: 27 },
      { degree: 10, minValue: 29 },
    ],
  },
  {
    id: 'std_primary_male_circles',
    testId: 'circles_jump',
    stage: 'primary',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, maxValue: 7.99 },
      { degree: 2, maxValue: 7.59 },
      { degree: 3, maxValue: 7.19 },
      { degree: 4, maxValue: 6.79 },
      { degree: 5, maxValue: 6.39 },
      { degree: 6, maxValue: 5.99 },
      { degree: 7, maxValue: 5.59 },
      { degree: 8, maxValue: 5.19 },
      { degree: 9, maxValue: 4.79 },
      { degree: 10, maxValue: 4.39 },
    ],
  },
  // إعدادي بنين
  {
    id: 'std_prep_male_running',
    testId: 'running_in_place_15s',
    stage: 'preparatory',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 24 },
      { degree: 2, minValue: 25 },
      { degree: 3, minValue: 26 },
      { degree: 4, minValue: 27 },
      { degree: 5, minValue: 28 },
      { degree: 6, minValue: 29 },
      { degree: 7, minValue: 30 },
      { degree: 8, minValue: 31 },
      { degree: 9, minValue: 32 },
      { degree: 10, minValue: 33 },
    ],
  },
  {
    id: 'std_prep_male_situps',
    testId: 'sit_ups_30s',
    stage: 'preparatory',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 23 },
      { degree: 2, minValue: 24 },
      { degree: 3, minValue: 25 },
      { degree: 4, minValue: 26 },
      { degree: 5, minValue: 27 },
      { degree: 6, minValue: 28 },
      { degree: 7, minValue: 29 },
      { degree: 8, minValue: 30 },
      { degree: 9, minValue: 31 },
      { degree: 10, minValue: 32 },
    ],
  },
  {
    id: 'std_prep_male_pushups',
    testId: 'push_ups',
    stage: 'preparatory',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 21 },
      { degree: 2, minValue: 23 },
      { degree: 3, minValue: 25 },
      { degree: 4, minValue: 27 },
      { degree: 5, minValue: 29 },
      { degree: 6, minValue: 31 },
      { degree: 7, minValue: 33 },
      { degree: 8, minValue: 35 },
      { degree: 9, minValue: 37 },
      { degree: 10, minValue: 39 },
    ],
  },
  {
    id: 'std_prep_male_broad_jump',
    testId: 'broad_jump',
    stage: 'preparatory',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 131 },
      { degree: 2, minValue: 141 },
      { degree: 3, minValue: 151 },
      { degree: 4, minValue: 161 },
      { degree: 5, minValue: 171 },
      { degree: 6, minValue: 181 },
      { degree: 7, minValue: 191 },
      { degree: 8, minValue: 201 },
      { degree: 9, minValue: 211 },
      { degree: 10, minValue: 221 },
    ],
  },
  {
    id: 'std_prep_male_zigzag',
    testId: 'zigzag_run_30m',
    stage: 'preparatory',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, maxValue: 14.49 },
      { degree: 2, maxValue: 13.99 },
      { degree: 3, maxValue: 13.49 },
      { degree: 4, maxValue: 12.99 },
      { degree: 5, maxValue: 12.49 },
      { degree: 6, maxValue: 11.99 },
      { degree: 7, maxValue: 11.49 },
      { degree: 8, maxValue: 10.99 },
      { degree: 9, maxValue: 10.49 },
      { degree: 10, maxValue: 9.99 },
    ],
  },
  // ثانوي بنين
  {
    id: 'std_sec_male_running',
    testId: 'running_in_place_15s_secondary',
    stage: 'secondary',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 26 },
      { degree: 2, minValue: 27 },
      { degree: 3, minValue: 28 },
      { degree: 4, minValue: 29 },
      { degree: 5, minValue: 30 },
      { degree: 6, minValue: 31 },
      { degree: 7, minValue: 32 },
      { degree: 8, minValue: 33 },
      { degree: 9, minValue: 34 },
      { degree: 10, minValue: 35 },
    ],
  },
  {
    id: 'std_sec_male_situps',
    testId: 'sit_ups_30s_secondary',
    stage: 'secondary',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 25 },
      { degree: 2, minValue: 26 },
      { degree: 3, minValue: 27 },
      { degree: 4, minValue: 28 },
      { degree: 5, minValue: 29 },
      { degree: 6, minValue: 30 },
      { degree: 7, minValue: 31 },
      { degree: 8, minValue: 32 },
      { degree: 9, minValue: 33 },
      { degree: 10, minValue: 34 },
    ],
  },
  {
    id: 'std_sec_male_pushups',
    testId: 'push_ups_secondary',
    stage: 'secondary',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 34 },
      { degree: 2, minValue: 36 },
      { degree: 3, minValue: 38 },
      { degree: 4, minValue: 40 },
      { degree: 5, minValue: 42 },
      { degree: 6, minValue: 44 },
      { degree: 7, minValue: 46 },
      { degree: 8, minValue: 48 },
      { degree: 9, minValue: 50 },
      { degree: 10, minValue: 52 },
    ],
  },
  {
    id: 'std_sec_male_multidirectional',
    testId: 'multidirectional_run',
    stage: 'secondary',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, maxValue: 14.8 },
      { degree: 2, maxValue: 14.6 },
      { degree: 3, maxValue: 14.4 },
      { degree: 4, maxValue: 14.2 },
      { degree: 5, maxValue: 14.0 },
      { degree: 6, maxValue: 13.8 },
      { degree: 7, maxValue: 13.6 },
      { degree: 8, maxValue: 13.4 },
      { degree: 9, maxValue: 13.2 },
      { degree: 10, maxValue: 13.0 },
    ],
  },
  {
    id: 'std_sec_male_trunk_bend',
    testId: 'trunk_bend',
    stage: 'secondary',
    gender: 'male',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 1 },
      { degree: 2, minValue: 3 },
      { degree: 3, minValue: 5 },
      { degree: 4, minValue: 7 },
      { degree: 5, minValue: 9 },
      { degree: 6, minValue: 11 },
      { degree: 7, minValue: 13 },
      { degree: 8, minValue: 15 },
      { degree: 9, minValue: 17 },
      { degree: 10, minValue: 19 },
    ],
  },
  // ابتدائي بنات
  {
    id: 'std_primary_female_running',
    testId: 'running_in_place_15s',
    stage: 'primary',
    gender: 'female',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 12 },
      { degree: 2, minValue: 14 },
      { degree: 3, minValue: 16 },
      { degree: 4, minValue: 18 },
      { degree: 5, minValue: 20 },
      { degree: 6, minValue: 22 },
      { degree: 7, minValue: 24 },
      { degree: 8, minValue: 26 },
      { degree: 9, minValue: 28 },
      { degree: 10, minValue: 30 },
    ],
  },
  {
    id: 'std_primary_female_situps',
    testId: 'sit_ups_30s',
    stage: 'primary',
    gender: 'female',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 9 },
      { degree: 2, minValue: 11 },
      { degree: 3, minValue: 13 },
      { degree: 4, minValue: 15 },
      { degree: 5, minValue: 17 },
      { degree: 6, minValue: 19 },
      { degree: 7, minValue: 21 },
      { degree: 8, minValue: 23 },
      { degree: 9, minValue: 25 },
      { degree: 10, minValue: 27 },
    ],
  },
  {
    id: 'std_primary_female_pushups_high',
    testId: 'push_ups_high',
    stage: 'primary',
    gender: 'female',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 20 },
      { degree: 2, minValue: 22 },
      { degree: 3, minValue: 24 },
      { degree: 4, minValue: 26 },
      { degree: 5, minValue: 28 },
      { degree: 6, minValue: 30 },
      { degree: 7, minValue: 32 },
      { degree: 8, minValue: 34 },
      { degree: 9, minValue: 36 },
      { degree: 10, minValue: 38 },
    ],
  },
  {
    id: 'std_primary_female_bounce_run',
    testId: 'bounce_run',
    stage: 'primary',
    gender: 'female',
    version: '2026-2027',
    rows: [
      { degree: 1, maxValue: 14.99 },
      { degree: 2, maxValue: 14.49 },
      { degree: 3, maxValue: 13.99 },
      { degree: 4, maxValue: 13.49 },
      { degree: 5, maxValue: 12.99 },
      { degree: 6, maxValue: 12.49 },
      { degree: 7, maxValue: 11.99 },
      { degree: 8, maxValue: 11.49 },
      { degree: 9, maxValue: 10.99 },
      { degree: 10, maxValue: 10.49 },
    ],
  },
  {
    id: 'std_primary_female_circles',
    testId: 'circles_jump',
    stage: 'primary',
    gender: 'female',
    version: '2026-2027',
    rows: [
      { degree: 1, maxValue: 9.19 },
      { degree: 2, maxValue: 8.79 },
      { degree: 3, maxValue: 8.39 },
      { degree: 4, maxValue: 7.99 },
      { degree: 5, maxValue: 7.59 },
      { degree: 6, maxValue: 7.19 },
      { degree: 7, maxValue: 6.79 },
      { degree: 8, maxValue: 6.39 },
      { degree: 9, maxValue: 5.99 },
      { degree: 10, maxValue: 5.59 },
    ],
  },
  // إعدادي بنات
  {
    id: 'std_prep_female_running',
    testId: 'running_in_place_15s',
    stage: 'preparatory',
    gender: 'female',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 11 },
      { degree: 2, minValue: 13 },
      { degree: 3, minValue: 15 },
      { degree: 4, minValue: 17 },
      { degree: 5, minValue: 19 },
      { degree: 6, minValue: 21 },
      { degree: 7, minValue: 23 },
      { degree: 8, minValue: 25 },
      { degree: 9, minValue: 27 },
      { degree: 10, minValue: 29 },
    ],
  },
  {
    id: 'std_prep_female_situps',
    testId: 'sit_ups_30s',
    stage: 'preparatory',
    gender: 'female',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 11 },
      { degree: 2, minValue: 13 },
      { degree: 3, minValue: 15 },
      { degree: 4, minValue: 17 },
      { degree: 5, minValue: 19 },
      { degree: 6, minValue: 21 },
      { degree: 7, minValue: 23 },
      { degree: 8, minValue: 25 },
      { degree: 9, minValue: 27 },
      { degree: 10, minValue: 29 },
    ],
  },
  {
    id: 'std_prep_female_pushups_high',
    testId: 'push_ups_high',
    stage: 'preparatory',
    gender: 'female',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 21 },
      { degree: 2, minValue: 23 },
      { degree: 3, minValue: 25 },
      { degree: 4, minValue: 27 },
      { degree: 5, minValue: 29 },
      { degree: 6, minValue: 31 },
      { degree: 7, minValue: 33 },
      { degree: 8, minValue: 35 },
      { degree: 9, minValue: 37 },
      { degree: 10, minValue: 39 },
    ],
  },
  {
    id: 'std_prep_female_broad_jump',
    testId: 'broad_jump',
    stage: 'preparatory',
    gender: 'female',
    version: '2026-2027',
    rows: [
      { degree: 1, minValue: 130 },
      { degree: 2, minValue: 135 },
      { degree: 3, minValue: 140 },
      { degree: 4, minValue: 145 },
      { degree: 5, minValue: 150 },
      { degree: 6, minValue: 155 },
      { degree: 7, minValue: 160 },
      { degree: 8, minValue: 165 },
      { degree: 9, minValue: 170 },
      { degree: 10, minValue: 175 },
    ],
  },
  {
    id: 'std_prep_female_zigzag',
    testId: 'zigzag_run_30m',
    stage: 'preparatory',
    gender: 'female',
    version: '2026-2027',
    rows: [
      { degree: 1, maxValue: 15.49 },
      { degree: 2, maxValue: 14.99 },
      { degree: 3, maxValue: 14.49 },
      { degree: 4, maxValue: 13.99 },
      { degree: 5, maxValue: 13.49 },
      { degree: 6, maxValue: 12.99 },
      { degree: 7, maxValue: 12.49 },
      { degree: 8, maxValue: 11.99 },
      { degree: 9, maxValue: 11.49 },
      { degree: 10, maxValue: 10.99 },
    ],
  },
];

// ============================================================
// محرّك التقييم
// ============================================================

export interface ScoreResult {
  degree: number | null;
  grade: string;
  standardId: string | null;
  standardVersion: string | null;
  isStandardAvailable: boolean;
}

/**
 * يحسب الدرجة والتقدير لقياس معين
 * @param testId - معرّف الاختبار
 * @param rawValue - القيمة الخام
 * @param stage - المرحلة الدراسية
 * @param gender - النوع
 */
export function calculateScore(
  testId: string,
  rawValue: number,
  stage: Stage,
  gender: Gender
): ScoreResult {
  const standard = SCORING_STANDARDS.find(
    (s) => s.testId === testId && s.stage === stage && s.gender === gender
  );

  if (!standard) {
    return {
      degree: null,
      grade: 'لم يتم إعداد الدرجة المعيارية: جدول المعايير المعتمد غير متاح',
      standardId: null,
      standardVersion: null,
      isStandardAvailable: false,
    };
  }

  const test = FITNESS_TESTS.find((t) => t.id === testId);
  if (!test) {
    return {
      degree: null,
      grade: 'اختبار غير معرّف',
      standardId: null,
      standardVersion: null,
      isStandardAvailable: false,
    };
  }

  let degree: number | null = null;

  if (test.direction === 'higher_better') {
    // الأعلى أفضل - نأخذ أعلى درجة يستطيع الطالب تحقيقها
    const sortedRows = [...standard.rows].sort((a, b) => b.degree - a.degree);
    for (const row of sortedRows) {
      if (row.minValue !== undefined && rawValue >= row.minValue) {
        degree = row.degree;
        break;
      }
    }
    if (degree === null) degree = 0; // أقل من الحد الأدنى
  } else {
    // الأقل أفضل (اختبارات الزمن) - نأخذ أعلى درجة يستطيع الطالب تحقيقها
    const sortedRows = [...standard.rows].sort((a, b) => b.degree - a.degree);
    for (const row of sortedRows) {
      if (row.maxValue !== undefined && rawValue <= row.maxValue) {
        degree = row.degree;
        break;
      }
    }
    if (degree === null) degree = 0; // أعلى من الحد الأقصى
  }

  return {
    degree,
    grade: getDegreeGrade(degree),
    standardId: standard.id,
    standardVersion: standard.version,
    isStandardAvailable: true,
  };
}

/**
 * يحسب التقدير من الدرجة المئينية (1 إلى 10)
 * 1-4: مقبول، 5-6: جيد، 7-8: جيد جداً، 9-10: ممتاز
 */
export function getDegreeGrade(degree: number | null): string {
  if (degree === null || degree === 0) return 'لم يتحقق';
  if (degree <= 4) return 'مقبول';
  if (degree <= 6) return 'جيد';
  if (degree <= 8) return 'جيد جداً';
  return 'ممتاز';
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'ممتاز': return '#047857';
    case 'جيد جداً': return '#0284c7';
    case 'جيد': return '#b45309';
    case 'مقبول': return '#d97706';
    default: return '#64748b';
  }
}

/**
 * يحسب إجمالي الدرجات للطالب
 */
export function calculateTotalScore(degrees: (number | null)[]): {
  total: number;
  average: number;
  grade: string;
} {
  const validDegrees = degrees.filter((d): d is number => d !== null && d > 0);
  if (validDegrees.length === 0) return { total: 0, average: 0, grade: 'لم يتحقق' };
  const total = validDegrees.reduce((a, b) => a + b, 0);
  const average = total / validDegrees.length;
  return {
    total,
    average: Math.round(average * 10) / 10,
    grade: getDegreeGrade(Math.round(average)),
  };
}

/**
 * يجلب اختبارات مرحلة ونوع معين
 */
export function getTestsForStageAndGender(stage: Stage, gender: Gender): FitnessTest[] {
  return FITNESS_TESTS.filter(
    (t) => t.stages.includes(stage) && t.genders.includes(gender)
  );
}
