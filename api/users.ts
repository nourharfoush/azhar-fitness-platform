import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './_lib/mongodb';
import { INITIAL_USERS } from '../src/data/sampleData';

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
      data: INITIAL_USERS,
    });
  }

  const collection = db.collection('users');

  try {
    if (req.method === 'GET') {
      const users = await collection.find({}).sort({ createdAt: -1 }).toArray();
      // If DB has no users yet, seed the admin user
      if (users.length === 0) {
        await collection.insertOne({ ...INITIAL_USERS[0], _syncedAt: new Date() });
        return res.status(200).json({ success: true, count: 1, data: INITIAL_USERS });
      }
      return res.status(200).json({ success: true, count: users.length, data: users });
    }

    if (req.method === 'POST') {
      const user = req.body;
      if (!user || !user.id || !user.username) {
        return res.status(400).json({ success: false, message: 'User id and username are required' });
      }

      const result = await collection.updateOne(
        { id: user.id },
        { $set: { ...user, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: 'User saved to MongoDB Atlas',
        upsertedId: result.upsertedId,
        modifiedCount: result.modifiedCount,
      });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }

      if (id === 'usr-admin') {
        return res.status(400).json({ success: false, message: 'Cannot delete primary admin account' });
      }

      await collection.deleteOne({ id });
      return res.status(200).json({ success: true, message: 'User deleted from MongoDB Atlas' });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
