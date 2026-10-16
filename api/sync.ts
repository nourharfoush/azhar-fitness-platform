import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './_lib/mongodb';
import { INITIAL_USERS } from '../src/data/sampleData';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { db, isConnected, error } = await connectToDatabase();
  if (!isConnected || !db) {
    return res.status(200).json({
      success: false,
      isLocalFallback: true,
      error: error || 'MongoDB Atlas is not connected',
      data: null,
    });
  }

  try {
    if (req.method === 'GET') {
      const [users, students, institutes, sessions, competitions, fieldVisits] = await Promise.all([
        db.collection('users').find({}).sort({ createdAt: -1 }).toArray(),
        db.collection('students').find({}).sort({ createdAt: -1 }).toArray(),
        db.collection('institutes').find({}).sort({ name: 1 }).toArray(),
        db.collection('measurement_sessions').find({}).sort({ sessionDate: -1 }).toArray(),
        db.collection('competitions').find({}).sort({ createdAt: -1 }).toArray(),
        db.collection('field_visits').find({}).sort({ visitDate: -1 }).toArray(),
      ]);

      const finalUsers = users.length > 0 ? users : INITIAL_USERS;

      return res.status(200).json({
        success: true,
        data: {
          users: finalUsers,
          students,
          institutes,
          sessions,
          competitions,
          fieldVisits,
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (req.method === 'POST') {
      const { users, students, institutes, sessions } = req.body || {};

      const ops = [];

      if (Array.isArray(users)) {
        for (const u of users) {
          if (u.id) {
            ops.push(
              db.collection('users').updateOne(
                { id: u.id },
                { $set: { ...u, updatedAt: new Date().toISOString() } },
                { upsert: true }
              )
            );
          }
        }
      }

      if (Array.isArray(students)) {
        for (const s of students) {
          if (s.id) {
            ops.push(
              db.collection('students').updateOne(
                { id: s.id },
                { $set: { ...s, updatedAt: new Date().toISOString() } },
                { upsert: true }
              )
            );
          }
        }
      }

      if (Array.isArray(institutes)) {
        for (const i of institutes) {
          if (i.id) {
            ops.push(
              db.collection('institutes').updateOne(
                { id: i.id },
                { $set: { ...i, updatedAt: new Date().toISOString() } },
                { upsert: true }
              )
            );
          }
        }
      }

      if (Array.isArray(sessions)) {
        for (const s of sessions) {
          if (s.id) {
            ops.push(
              db.collection('measurement_sessions').updateOne(
                { id: s.id },
                { $set: { ...s, updatedAt: new Date().toISOString() } },
                { upsert: true }
              )
            );
          }
        }
      }

      await Promise.all(ops);

      return res.status(200).json({
        success: true,
        message: 'Sync completed across all collections',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
