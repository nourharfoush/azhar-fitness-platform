// =============================================================================
// خدمة الاتصال والمزامنة السحابية المباشرة (Cross-Device Cloud Sync Service)
// تتيح ظهور أي تعديل أو إضافة على كافة الأجهزة فورياً مع الحفظ المحلي الفوري
// =============================================================================

export interface AtlasHealthStatus {
  status: 'connected' | 'disconnected' | 'error' | 'checking';
  database?: string;
  databaseName?: string;
  collectionsCount?: number;
  collections?: string[];
  message: string;
}

export async function checkAtlasHealth(): Promise<AtlasHealthStatus> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      return {
        status: 'disconnected',
        message: 'تعذر الاتصال بمسار الـ API السحابي (وضع التخزين المحلي نشط)',
      };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      status: 'disconnected',
      message: 'يعمل في وضع التخزين المحلي الآمن (Offline / Local Storage)',
    };
  }
}

export async function seedAtlasDatabase(): Promise<{ success: boolean; message: string; counts?: Record<string, number> }> {
  try {
    const res = await fetch('/api/seed', { method: 'POST' });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'فشلت المزامنة مع MongoDB Atlas',
    };
  }
}

// ---------------- المستخدمين (Users) ----------------
export async function fetchCloudUsers() {
  try {
    const res = await fetch('/api/users');
    if (!res.ok) return { success: false, data: [] };
    const data = await res.json();
    return data;
  } catch {
    return { success: false, data: [] };
  }
}

export async function syncUserWithAtlas(user: any) {
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch {
    return { success: false, isLocalFallback: true };
  }
}

export async function deleteUserFromAtlas(id: string) {
  try {
    const res = await fetch(`/api/users?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

// ---------------- الطلاب (Students) ----------------
export async function fetchCloudStudents() {
  try {
    const res = await fetch('/api/students');
    if (!res.ok) return { success: false, data: [] };
    return await res.json();
  } catch {
    return { success: false, data: [] };
  }
}

export async function syncStudentWithAtlas(student: any) {
  try {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    return await res.json();
  } catch {
    return { success: false, isLocalFallback: true };
  }
}

export async function deleteStudentFromAtlas(id: string) {
  try {
    const res = await fetch(`/api/students?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

// ---------------- المعاهد (Institutes) ----------------
export async function fetchCloudInstitutes() {
  try {
    const res = await fetch('/api/institutes');
    if (!res.ok) return { success: false, data: [] };
    return await res.json();
  } catch {
    return { success: false, data: [] };
  }
}

export async function syncInstituteWithAtlas(institute: any) {
  try {
    const res = await fetch('/api/institutes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(institute),
    });
    return await res.json();
  } catch {
    return { success: false, isLocalFallback: true };
  }
}

export async function deleteInstituteFromAtlas(id: string) {
  try {
    const res = await fetch(`/api/institutes?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

// ---------------- جلسات القياس (Measurements) ----------------
export async function fetchCloudSessions() {
  try {
    const res = await fetch('/api/measurements');
    if (!res.ok) return { success: false, data: [] };
    return await res.json();
  } catch {
    return { success: false, data: [] };
  }
}

export async function syncSessionWithAtlas(session: any) {
  try {
    const res = await fetch('/api/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    return await res.json();
  } catch {
    return { success: false, isLocalFallback: true };
  }
}

// ---------------- المزامنة الكاملة لكافة الأجهزة (Full Cloud Sync) ----------------
export async function fetchFullCloudSync() {
  try {
    const res = await fetch('/api/sync');
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function pushFullCloudSync(payload: {
  users?: any[];
  students?: any[];
  institutes?: any[];
  sessions?: any[];
}) {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}
