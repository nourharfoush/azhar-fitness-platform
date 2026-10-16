import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './_lib/mongodb';
import {
  INITIAL_INSTITUTES,
  INITIAL_STUDENTS,
  INITIAL_SESSIONS,
  INITIAL_COMPETITIONS,
  INITIAL_COMPETITION_RESULTS,
  INITIAL_FIELD_VISITS,
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
} from '../src/data/sampleData';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { db, isConnected, error } = await connectToDatabase();
  if (!isConnected || !db) {
    return res.status(200).json({
      success: false,
      message: 'MongoDB Atlas is not connected. Configure MONGODB_URI in Vercel.',
      error,
    });
  }

  try {
    const counts: Record<string, number> = {};

    // 1. Institutes
    const instCol = db.collection('institutes');
    const instExisting = await instCol.countDocuments();
    if (instExisting === 0) {
      await instCol.insertMany(INITIAL_INSTITUTES.map((i) => ({ ...i, _syncedAt: new Date() })));
      counts.institutes = INITIAL_INSTITUTES.length;
    } else {
      counts.institutes = instExisting;
    }

    // 2. Students
    const stuCol = db.collection('students');
    const stuExisting = await stuCol.countDocuments();
    if (stuExisting === 0) {
      await stuCol.insertMany(INITIAL_STUDENTS.map((s) => ({ ...s, _syncedAt: new Date() })));
      counts.students = INITIAL_STUDENTS.length;
    } else {
      counts.students = stuExisting;
    }

    // 3. Sessions
    const sessCol = db.collection('measurement_sessions');
    const sessExisting = await sessCol.countDocuments();
    if (sessExisting === 0) {
      await sessCol.insertMany(INITIAL_SESSIONS.map((s) => ({ ...s, _syncedAt: new Date() })));
      counts.sessions = INITIAL_SESSIONS.length;
    } else {
      counts.sessions = sessExisting;
    }

    // 4. Competitions
    const compCol = db.collection('competitions');
    const compExisting = await compCol.countDocuments();
    if (compExisting === 0) {
      await compCol.insertMany(INITIAL_COMPETITIONS.map((c) => ({ ...c, _syncedAt: new Date() })));
      counts.competitions = INITIAL_COMPETITIONS.length;
    } else {
      counts.competitions = compExisting;
    }

    // 5. Users
    const usrCol = db.collection('users');
    const usrExisting = await usrCol.countDocuments();
    if (usrExisting === 0) {
      await usrCol.insertMany(INITIAL_USERS.map((u) => ({ ...u, _syncedAt: new Date() })));
      counts.users = INITIAL_USERS.length;
    } else {
      counts.users = usrExisting;
    }

    return res.status(200).json({
      success: true,
      message: 'MongoDB Atlas collections verified and seeded successfully',
      database: db.databaseName,
      counts,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
