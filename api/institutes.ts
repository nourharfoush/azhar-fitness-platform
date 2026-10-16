import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './_lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
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

  const collection = db.collection('institutes');

  try {
    if (req.method === 'GET') {
      const institutes = await collection.find({}).sort({ name: 1 }).toArray();
      return res.status(200).json({ success: true, count: institutes.length, data: institutes });
    }

    if (req.method === 'POST') {
      const inst = req.body;
      if (!inst || !inst.id) {
        return res.status(400).json({ success: false, message: 'Institute ID required' });
      }

      const result = await collection.updateOne(
        { id: inst.id },
        { $set: { ...inst, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Institute saved to MongoDB Atlas',
        upsertedId: result.upsertedId,
      });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'Institute ID required' });
      }

      await collection.deleteOne({ id });
      return res.status(200).json({ success: true, message: 'Institute deleted' });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
