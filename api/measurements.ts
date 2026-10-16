import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './_lib/mongodb';

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
      error: error || 'MongoDB not connected',
      data: [],
    });
  }

  const sessionsCol = db.collection('measurement_sessions');

  try {
    if (req.method === 'GET') {
      const sessions = await sessionsCol.find({}).sort({ sessionDate: -1 }).toArray();
      return res.status(200).json({ success: true, count: sessions.length, data: sessions });
    }

    if (req.method === 'POST') {
      const session = req.body;
      if (!session || !session.id) {
        return res.status(400).json({ success: false, message: 'Session ID is required' });
      }

      const result = await sessionsCol.updateOne(
        { id: session.id },
        { $set: { ...session, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Measurement session saved to MongoDB Atlas',
        upsertedId: result.upsertedId,
      });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
