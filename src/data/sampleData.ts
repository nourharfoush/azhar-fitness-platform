// =============================================================================
// البيانات الرسمية الأساسية للمشروع القومي للياقة البدنية بالأزهر الشريف
// تم تنظيف كافة البيانات التجريبية والإبقاء فقط على حساب مدير النظام والمناطق والإدارات
// =============================================================================

import type {
  Institute,
  Student,
  MeasurementSession,
  Competition,
  StudentCompetitionResult,
  FieldVisit,
  User,
  AuditLog,
  SystemSettings
} from '../types';

export const INITIAL_INSTITUTES: Institute[] = [];

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_SESSIONS: MeasurementSession[] = [];

export const INITIAL_COMPETITIONS: Competition[] = [];

export const INITIAL_COMPETITION_RESULTS: StudentCompetitionResult[] = [];

export const INITIAL_FIELD_VISITS: FieldVisit[] = [];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'مدير عام المنظومة',
    username: 'admin',
    password: 'Azhar@2026',
    email: 'admin@azhar.gov.eg',
    role: 'system_admin',
    scopeType: 'national',
    scopeId: null,
    scopeName: 'جمهورية مصر العربية (عام)',
    isActive: true,
    createdAt: '2026-09-01',
    phone: '01001234567',
    lastLogin: '2026-10-17 00:00',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-init',
    entityType: 'نظام المنظومة',
    entityId: 'sys-init',
    action: 'create',
    description: 'تدشين المنظومة الإلكترونية للمشروع القومي للياقة البدنية وتفعيل حساب مدير النظام العام',
    performedBy: 'مدير عام المنظومة',
    performedByRole: 'مدير النظام العام',
    performedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    ipAddress: '127.0.0.1',
    reason: 'بدء الموسم الرياضي الرسمي وتطهير البيانات التجريبية',
  },
];

export const INITIAL_SETTINGS: SystemSettings = {
  academicYear: '2026-2027',
  activeSemester: 'first',
  measurementWindowOpen: true,
  autoCalculation: true,
  offlineDrafts: true,
  minimumPassDegree: 60,
  targetParticipationRate: 85,
  lastBackupDate: new Date().toISOString().slice(0, 10),
};
