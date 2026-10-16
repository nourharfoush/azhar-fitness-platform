// =============================================================================
// خدمة الاتصال السحابي بقاعدة بيانات MongoDB Atlas
// تدعم المزامنة السحابية المباشرة مع الحفظ المحلي كنسخة احتياطية
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

export async function syncStudentWithAtlas(student: any) {
  try {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    return await res.json();
  } catch (err) {
    // Falls back seamlessly to local state
    return { success: false, isLocalFallback: true };
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
  } catch (err) {
    return { success: false, isLocalFallback: true };
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
  } catch (err) {
    return { success: false, isLocalFallback: true };
  }
}
