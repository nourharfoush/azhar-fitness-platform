import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './_lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db, isConnected, error } = await connectToDatabase();

    if (!isConnected || !db) {
      return res.status(200).json({
        status: 'disconnected',
        database: 'MongoDB Atlas',
        message: error || 'MONGODB_URI not configured',
        timestamp: new Date().toISOString(),
      });
    }

    // Ping the database
    await db.command({ ping: 1 });
    const collections = await db.listCollections().toArray();

    return res.status(200).json({
      status: 'connected',
      database: 'MongoDB Atlas',
      databaseName: db.databaseName,
      collectionsCount: collections.length,
      collections: collections.map((c) => c.name),
      message: 'MongoDB Atlas connection active and healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
