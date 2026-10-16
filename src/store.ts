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
import {
  syncUserWithAtlas,
  deleteUserFromAtlas,
  syncStudentWithAtlas,
  deleteStudentFromAtlas,
  syncInstituteWithAtlas,
  deleteInstituteFromAtlas,
  syncSessionWithAtlas,
  fetchFullCloudSync,
} from './services/api';

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
      id: 'notif-1',
      title: 'تدشين المنظومة الرسمية',
      message: 'تم تفعيل منظومة المشروع القومي للياقة البدنية بالأزهر الشريف لجميع المناطق للعام الدراسي 2026/2027.',
      type: 'info',
      userId: 'official',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ],
  unreadCount: 1,
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
      addStudent: (s) => {
        set((state) => ({ students: [s, ...state.students] }));
        syncStudentWithAtlas(s).catch(console.error);
      },
      updateStudent: (id, updates) => {
        set((state) => {
          const updated = state.students.map((s) => (s.id === id ? { ...s, ...updates } : s));
          const target = updated.find((s) => s.id === id);
          if (target) syncStudentWithAtlas(target).catch(console.error);
          return { students: updated };
        });
      },
      deleteStudent: (id) => {
        set((state) => ({ students: state.students.filter((s) => s.id !== id) }));
        deleteStudentFromAtlas(id).catch(console.error);
      },
      addSession: (s) => {
        set((state) => ({ sessions: [s, ...state.sessions] }));
        syncSessionWithAtlas(s).catch(console.error);
      },
      updateSession: (id, updates) => {
        set((state) => {
          const updated = state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s));
          const target = updated.find((s) => s.id === id);
          if (target) syncSessionWithAtlas(target).catch(console.error);
          return { sessions: updated };
        });
      },
    }),
    {
      name: 'azhar-fitness-students-db',
      version: 4,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.students)) {
          return { students: [], sessions: [] };
        }
        // Purge dummy demo students
        const cleanedStudents = persistedState.students.filter(
          (s: any) => !s.id.startsWith('stu-0') && !s.id.startsWith('stu-10')
        );
        const cleanedSessions = Array.isArray(persistedState.sessions)
          ? persistedState.sessions.filter((sess: any) => !sess.id.startsWith('sess-'))
          : [];
        return {
          ...persistedState,
          students: cleanedStudents,
          sessions: cleanedSessions,
        };
      },
    }
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
      addInstitute: (inst) => {
        set((state) => ({ institutes: [inst, ...state.institutes] }));
        syncInstituteWithAtlas(inst).catch(console.error);
      },
      updateInstitute: (id, updates) => {
        set((state) => {
          const updated = state.institutes.map((i) => (i.id === id ? { ...i, ...updates } : i));
          const target = updated.find((i) => i.id === id);
          if (target) syncInstituteWithAtlas(target).catch(console.error);
          return { institutes: updated };
        });
      },
      deleteInstitute: (id) => {
        set((state) => ({ institutes: state.institutes.filter((i) => i.id !== id) }));
        deleteInstituteFromAtlas(id).catch(console.error);
      },
    }),
    {
      name: 'azhar-fitness-institutes',
      version: 4,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.institutes)) {
          return { institutes: [] };
        }
        return {
          ...persistedState,
          institutes: persistedState.institutes.filter((i: any) => !i.id.startsWith('inst-')),
        };
      },
    }
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
    {
      name: 'azhar-fitness-competitions',
      version: 4,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.competitions)) {
          return { competitions: [], competitionResults: [] };
        }
        return {
          ...persistedState,
          competitions: persistedState.competitions.filter((c: any) => !c.id.startsWith('comp-')),
          competitionResults: Array.isArray(persistedState.competitionResults)
            ? persistedState.competitionResults.filter((r: any) => !r.id.startsWith('cres-'))
            : [],
        };
      },
    }
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
    {
      name: 'azhar-fitness-followup',
      version: 4,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.fieldVisits)) {
          return { fieldVisits: [] };
        }
        return {
          ...persistedState,
          fieldVisits: persistedState.fieldVisits.filter((v: any) => !v.id.startsWith('visit-')),
        };
      },
    }
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

const DUMMY_USER_IDS = new Set([
  'usr-sector',
  'usr-cairo',
  'usr-alex',
  'usr-inspector-tanta',
  'usr-teacher-tayeb',
  'usr-arbitrator-1',
]);

export const useUserManagementStore = create<UserManagementStore>()(
  persist(
    (set) => ({
      users: INITIAL_USERS,
      addUser: (u) => {
        set((state) => ({ users: [u, ...state.users] }));
        syncUserWithAtlas(u).catch(console.error);
      },
      updateUser: (id, updates) => {
        set((state) => {
          const updated = state.users.map((u) => (u.id === id ? { ...u, ...updates } : u));
          const target = updated.find((u) => u.id === id);
          if (target) syncUserWithAtlas(target).catch(console.error);
          return { users: updated };
        });
      },
      deleteUser: (id) => {
        set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
        deleteUserFromAtlas(id).catch(console.error);
      },
      toggleUserStatus: (id) => {
        set((state) => {
          const updated = state.users.map((u) =>
            u.id === id ? { ...u, isActive: !u.isActive } : u
          );
          const target = updated.find((u) => u.id === id);
          if (target) syncUserWithAtlas(target).catch(console.error);
          return { users: updated };
        });
      },
    }),
    {
      name: 'azhar-fitness-users',
      version: 4,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.users)) {
          return { users: INITIAL_USERS };
        }
        // Purge dummy demo users, keep only admin and newly created real accounts
        let cleaned = persistedState.users.filter((u: any) => !DUMMY_USER_IDS.has(u.id));
        if (!cleaned.some((u: any) => u.id === 'usr-admin' || u.username === 'admin')) {
          cleaned = [INITIAL_USERS[0], ...cleaned];
        }
        return {
          ...persistedState,
          users: cleaned,
        };
      },
    }
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
    {
      name: 'azhar-fitness-audit',
      version: 4,
      migrate: () => ({ logs: INITIAL_AUDIT_LOGS }),
    }
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
        useStudentStore.setState({ students: [], sessions: [] });
        useInstituteStore.setState({ institutes: [] });
        useCompetitionStore.setState({ competitions: [], competitionResults: [] });
        useFollowUpStore.setState({ fieldVisits: [] });
        useUserManagementStore.setState({ users: INITIAL_USERS });
        useAuditLogStore.setState({ logs: INITIAL_AUDIT_LOGS });
      },
    }),
    { name: 'azhar-fitness-settings' }
  )
);

// ------------- خدمة المزامنة السحابية المشتركة لكافة الأجهزة -------------
export async function initializeCrossDeviceSync() {
  try {
    const cloudData = await fetchFullCloudSync();
    if (cloudData) {
      if (Array.isArray(cloudData.users) && cloudData.users.length > 0) {
        useUserManagementStore.setState({ users: cloudData.users });
      }
      if (Array.isArray(cloudData.students)) {
        useStudentStore.setState({ students: cloudData.students });
      }
      if (Array.isArray(cloudData.sessions)) {
        useStudentStore.setState({ sessions: cloudData.sessions });
      }
      if (Array.isArray(cloudData.institutes)) {
        useInstituteStore.setState({ institutes: cloudData.institutes });
      }
      if (Array.isArray(cloudData.competitions)) {
        useCompetitionStore.setState({ competitions: cloudData.competitions });
      }
      if (Array.isArray(cloudData.fieldVisits)) {
        useFollowUpStore.setState({ fieldVisits: cloudData.fieldVisits });
      }
    }
  } catch (err) {
    console.warn('Cross-device sync fallback to local mode:', err);
  }
}
