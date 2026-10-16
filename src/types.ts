// =============================================================================
// أنواع البيانات الرئيسية للمشروع
// =============================================================================

import type { Stage, Gender } from './data/scoringStandards';
export type { Stage, Gender };

export type UserRole =
  | 'system_admin'
  | 'sector_admin'
  | 'region_coordinator'
  | 'admin_inspector'
  | 'institute_officer'
  | 'arbitrator'
  | 'viewer';

export interface Institute {
  id: string;
  name: string;
  administrationId: string;
  administrationName?: string;
  regionId: string;
  regionName?: string;
  type: 'primary' | 'preparatory' | 'secondary' | 'combined';
  gender: 'male' | 'female' | 'mixed';
  studentsCount?: number;
  principalName?: string;
  peTeacherName?: string;
  phone?: string;
  address?: string;
  isRegistered?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  scopeType: 'national' | 'region' | 'administration' | 'institute';
  scopeId: string | null;
  scopeName?: string;
  isActive: boolean;
  createdAt: string;
  phone?: string;
  lastLogin?: string;
}

export interface Student {
  id: string;
  name: string;
  nationalId?: string;
  enrollmentNumber: string;
  gender: Gender;
  birthDate: string;
  stage: Stage;
  grade: string; // الصف (الأول الابتدائي، الثاني الإعدادي، الخ)
  classroom?: string; // الفصل (أ، ب، ج، ...)
  instituteId: string;
  instituteName?: string;
  regionId?: string;
  regionName?: string;
  administrationId?: string;
  administrationName?: string;
  academicYear: string;
  isActive: boolean;
}

export type MeasurementStatus = 'draft' | 'submitted' | 'needs_revision' | 'reviewed' | 'approved';

export interface Measurement {
  id: string;
  studentId: string;
  testId?: string;
  rawValue?: number;
  unit?: string;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  pulseRest?: number;
  bloodPressure?: string;
  measuredAt?: string;
  measuredBy?: string;
  isValidated?: boolean;
  judge1Value?: number;
  judge2Value?: number;
  averageValue?: number;
  attemptValues?: number[]; // لاختبارات المحاولات المتعددة
  bestValue?: number;
  degree?: number | null;
  grade?: string;
  standardId?: string;
  standardVersion?: string;
  sessionId: string;
  status: MeasurementStatus;
  enteredBy: string;
  enteredAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  correctionReason?: string;
}

export interface MeasurementSession {
  id: string;
  name?: string;
  title?: string;
  instituteId: string;
  instituteName?: string;
  stage?: Stage;
  gender?: Gender;
  type?: 'initial' | 'final' | 'followup';
  academicYear: string;
  period?: string;
  sessionDate?: string;
  startDate?: string;
  status: MeasurementStatus;
  createdBy?: string;
  totalStudents?: number;
  completedStudents?: number;
  measurements?: Measurement[];
}

export interface CompetitionPhase {
  id: string;
  name: string;
  level: 'institute' | 'administration' | 'region' | 'national';
  startDate: string;
  endDate: string;
  status?: 'completed' | 'active' | 'upcoming';
}

export interface Competition {
  id: string;
  name: string;
  academicYear: string;
  stage: Stage;
  gender?: Gender;
  status?: 'active' | 'completed' | 'upcoming';
  phases: CompetitionPhase[];
  rules: string;
  minQualifiers: number;
  maxQualifiers: number;
  qualifiersCount?: number;
}

export interface StudentCompetitionResult {
  id?: string;
  studentId: string;
  studentName?: string;
  instituteName?: string;
  regionName?: string;
  competitionId: string;
  competitionName?: string;
  phaseId: string;
  phaseName?: string;
  totalScore: number;
  rank: number;
  isQualified: boolean;
  medal?: 'gold' | 'silver' | 'bronze' | 'none';
  notes?: string;
}

export interface FieldVisit {
  id: string;
  visitDate: string;
  instituteId: string;
  instituteName?: string;
  administrationId: string;
  administrationName?: string;
  regionName?: string;
  visitorName: string;
  visitorRole: string;
  purpose: string;
  classesAttended: boolean;
  recordsChecked: boolean;
  testsPerformed: boolean;
  facilitiesCheck: boolean;
  awarenessCheck: boolean;
  rating?: 'excellent' | 'very_good' | 'good' | 'needs_improvement';
  score?: number;
  recommendations: string;
  nextVisitDate?: string;
}

export interface FollowUpForm {
  id: string;
  type: 'institute' | 'administration' | 'region';
  scopeId: string;
  period: string;
  academicYear: string;
  targetStudents: number;
  measuredStudents: number;
  completionRate: number;
  dataQuality: string;
  obstacles: string;
  correctiveActions: string;
  notes: string;
  status: MeasurementStatus;
  submittedBy: string;
  submittedAt: string;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'submit' | 'export' | 'login';
  description?: string;
  previousValue?: unknown;
  newValue?: unknown;
  performedBy: string;
  performedByRole?: string;
  performedAt: string;
  ipAddress?: string;
  reason?: string;
}

export interface SystemSettings {
  academicYear: string;
  activeSemester: 'first' | 'second';
  measurementWindowOpen: boolean;
  autoCalculation: boolean;
  offlineDrafts: boolean;
  minimumPassDegree: number;
  targetParticipationRate: number;
  lastBackupDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  userId: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  system_admin: 'مدير النظام العام',
  sector_admin: 'قطاع المعاهد الأزهرية',
  region_coordinator: 'منسق المنطقة الأزهرية',
  admin_inspector: 'موجه التربية الرياضية بالإدارة',
  institute_officer: 'معلم التربية الرياضية بالمعهد',
  arbitrator: 'عضو لجنة التحكيم والتقييم',
  viewer: 'متابع ومستعرض للتقارير',
};

export const STAGE_LABELS: Record<Stage, string> = {
  primary: 'الابتدائية',
  preparatory: 'الإعدادية',
  secondary: 'الثانوية',
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: 'بنين',
  female: 'بنات',
};

export const STATUS_LABELS: Record<MeasurementStatus, string> = {
  draft: 'مسودة',
  submitted: 'مرسل للمراجعة',
  needs_revision: 'يحتاج استكمال',
  reviewed: 'تمت المراجعة',
  approved: 'معتمد',
};

export const GRADE_LABELS = [
  'الأول الابتدائي', 'الثاني الابتدائي', 'الثالث الابتدائي',
  'الرابع الابتدائي', 'الخامس الابتدائي', 'السادس الابتدائي',
  'الأول الإعدادي', 'الثاني الإعدادي', 'الثالث الإعدادي',
  'الأول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي',
];
