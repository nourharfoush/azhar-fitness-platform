import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  AuthState,
  Notification,
  Student,
  MeasurementSession,
  Institute,
  Competition,
  StudentCompetitionResult,
  FieldVisit,
  AuditLog,
  SystemSettings
} from './types';
import {
  INITIAL_INSTITUTES,
  INITIAL_STUDENTS,
  INITIAL_SESSIONS,
  INITIAL_COMPETITIONS,
  INITIAL_COMPETITION_RESULTS,
  INITIAL_FIELD_VISITS,
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
} from './data/sampleData';

// ------------- متجر المصادقة -------------
interface AuthStore extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: {
        id: 'usr-admin',
        name: 'د. عبد الرحمن الأزهري',
        email: 'admin@azhar.gov.eg',
        role: 'system_admin',
        scopeType: 'national',
        scopeId: null,
        scopeName: 'جمهورية مصر العربية (عام)',
        isActive: true,
        createdAt: '2026-09-01',
      },
      isAuthenticated: true,
      isLoading: false,
      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'azhar-fitness-auth' }
  )
);

// ------------- متجر الإشعارات -------------
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [
    {
      id: '1',
      title: 'بدء الموسم التدريبي والتقييمي',
      message: 'تم تفعيل منظومة المشروع القومي للياقة البدنية بالمعاهد الأزهرية لجميع المناطق 2026/2027.',
      type: 'info',
      userId: 'official',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'اعتماد نتائج منطقة القاهرة',
      message: 'تم اعتماد نتائج قياسات معهد الإمام الطيب النموذجي واكتمال مرحلة التقييم الأولى.',
      type: 'success',
      userId: 'official',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ],
  unreadCount: 2,
  addNotification: (n) =>
    set((state) => {
      const notification: Notification = {
        ...n,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: state.notifications.find((n) => n.id === id && !n.isRead)
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    })),
}));

// ------------- متجر واجهة المستخدم -------------
interface UIStore {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  activeRegionFilter: string | null;
  activeAdminFilter: string | null;
  activeInstituteFilter: string | null;
  activeYearFilter: string;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setRegionFilter: (id: string | null) => void;
  setAdminFilter: (id: string | null) => void;
  setInstituteFilter: (id: string | null) => void;
  setYearFilter: (year: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isDarkMode: false,
      activeRegionFilter: null,
      activeAdminFilter: null,
      activeInstituteFilter: null,
      activeYearFilter: '2026-2027',
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
      setRegionFilter: (id) =>
        set({ activeRegionFilter: id, activeAdminFilter: null, activeInstituteFilter: null }),
      setAdminFilter: (id) => set({ activeAdminFilter: id, activeInstituteFilter: null }),
      setInstituteFilter: (id) => set({ activeInstituteFilter: id }),
      setYearFilter: (year) => set({ activeYearFilter: year }),
    }),
    { name: 'azhar-fitness-ui' }
  )
);

// ------------- متجر بيانات الطلاب والقياسات الرسمية -------------
interface StudentStore {
  students: Student[];
  sessions: MeasurementSession[];
  addStudent: (s: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addSession: (s: MeasurementSession) => void;
  updateSession: (id: string, updates: Partial<MeasurementSession>) => void;
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set) => ({
      students: INITIAL_STUDENTS,
      sessions: INITIAL_SESSIONS,
      addStudent: (s) => set((state) => ({ students: [s, ...state.students] })),
      updateStudent: (id, updates) =>
        set((state) => ({
          students: state.students.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      deleteStudent: (id) =>
        set((state) => ({ students: state.students.filter((s) => s.id !== id) })),
      addSession: (s) => set((state) => ({ sessions: [s, ...state.sessions] })),
      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
    }),
    { name: 'azhar-fitness-students-db' }
  )
);

// ------------- متجر المعاهد الأزهرية -------------
interface InstituteStore {
  institutes: Institute[];
  addInstitute: (inst: Institute) => void;
  updateInstitute: (id: string, updates: Partial<Institute>) => void;
  deleteInstitute: (id: string) => void;
}

export const useInstituteStore = create<InstituteStore>()(
  persist(
    (set) => ({
      institutes: INITIAL_INSTITUTES,
      addInstitute: (inst) =>
        set((state) => ({ institutes: [inst, ...state.institutes] })),
      updateInstitute: (id, updates) =>
        set((state) => ({
          institutes: state.institutes.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
      deleteInstitute: (id) =>
        set((state) => ({
          institutes: state.institutes.filter((i) => i.id !== id),
        })),
    }),
    { name: 'azhar-fitness-institutes' }
  )
);

// ------------- متجر المنافسات والبطولات -------------
interface CompetitionStore {
  competitions: Competition[];
  competitionResults: StudentCompetitionResult[];
  addCompetition: (c: Competition) => void;
  updateCompetition: (id: string, updates: Partial<Competition>) => void;
  addCompetitionResult: (r: StudentCompetitionResult) => void;
}

export const useCompetitionStore = create<CompetitionStore>()(
  persist(
    (set) => ({
      competitions: INITIAL_COMPETITIONS,
      competitionResults: INITIAL_COMPETITION_RESULTS,
      addCompetition: (c) =>
        set((state) => ({ competitions: [c, ...state.competitions] })),
      updateCompetition: (id, updates) =>
        set((state) => ({
          competitions: state.competitions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      addCompetitionResult: (r) =>
        set((state) => ({ competitionResults: [r, ...state.competitionResults] })),
    }),
    { name: 'azhar-fitness-competitions' }
  )
);

// ------------- متجر المتابعة الميدانية والتقييم -------------
interface FollowUpStore {
  fieldVisits: FieldVisit[];
  addFieldVisit: (visit: FieldVisit) => void;
  updateFieldVisit: (id: string, updates: Partial<FieldVisit>) => void;
  deleteFieldVisit: (id: string) => void;
}

export const useFollowUpStore = create<FollowUpStore>()(
  persist(
    (set) => ({
      fieldVisits: INITIAL_FIELD_VISITS,
      addFieldVisit: (v) =>
        set((state) => ({ fieldVisits: [v, ...state.fieldVisits] })),
      updateFieldVisit: (id, updates) =>
        set((state) => ({
          fieldVisits: state.fieldVisits.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        })),
      deleteFieldVisit: (id) =>
        set((state) => ({
          fieldVisits: state.fieldVisits.filter((v) => v.id !== id),
        })),
    }),
    { name: 'azhar-fitness-followup' }
  )
);

// ------------- متجر إدارة المستخدمين والصلاحيات -------------
interface UserManagementStore {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
}

export const useUserManagementStore = create<UserManagementStore>()(
  persist(
    (set) => ({
      users: INITIAL_USERS,
      addUser: (u) => set((state) => ({ users: [u, ...state.users] })),
      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),
      deleteUser: (id) =>
        set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
      toggleUserStatus: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, isActive: !u.isActive } : u
          ),
        })),
    }),
    { name: 'azhar-fitness-users' }
  )
);

// ------------- متجر سجل العمليات والتدقيق -------------
interface AuditLogStore {
  logs: AuditLog[];
  addLog: (log: Omit<AuditLog, 'id' | 'performedAt'>) => void;
  clearLogs: () => void;
}

export const useAuditLogStore = create<AuditLogStore>()(
  persist(
    (set) => ({
      logs: INITIAL_AUDIT_LOGS,
      addLog: (l) =>
        set((state) => {
          const newLog: AuditLog = {
            ...l,
            id: 'log-' + Date.now(),
            performedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
          return { logs: [newLog, ...state.logs] };
        }),
      clearLogs: () => set({ logs: [] }),
    }),
    { name: 'azhar-fitness-audit' }
  )
);

// ------------- متجر إعدادات النظام -------------
interface SettingsStore {
  settings: SystemSettings;
  updateSettings: (updates: Partial<SystemSettings>) => void;
  resetAllData: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: INITIAL_SETTINGS,
      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),
      resetAllData: () => {
        set({ settings: INITIAL_SETTINGS });
        useStudentStore.setState({ students: INITIAL_STUDENTS, sessions: INITIAL_SESSIONS });
        useInstituteStore.setState({ institutes: INITIAL_INSTITUTES });
        useCompetitionStore.setState({
          competitions: INITIAL_COMPETITIONS,
          competitionResults: INITIAL_COMPETITION_RESULTS,
        });
        useFollowUpStore.setState({ fieldVisits: INITIAL_FIELD_VISITS });
        useUserManagementStore.setState({ users: INITIAL_USERS });
        useAuditLogStore.setState({ logs: INITIAL_AUDIT_LOGS });
      },
    }),
    { name: 'azhar-fitness-settings' }
  )
);
