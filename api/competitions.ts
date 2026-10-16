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

  const collection = db.collection('competitions');

  try {
    if (req.method === 'GET') {
      const competitions = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, count: competitions.length, data: competitions });
    }

    if (req.method === 'POST') {
      const comp = req.body;
      if (!comp || !comp.id) {
        return res.status(400).json({ success: false, message: 'Competition id is required' });
      }

      await collection.updateOne(
        { id: comp.id },
        { $set: { ...comp, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );

      return res.status(200).json({ success: true, message: 'Competition saved' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'ID is required' });
      }

      await collection.deleteOne({ id });
      return res.status(200).json({ success: true, message: 'Competition deleted' });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
