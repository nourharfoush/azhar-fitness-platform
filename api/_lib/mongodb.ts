import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'azhar_fitness';

// Global cache for serverless environment
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{
  client: MongoClient | null;
  db: Db | null;
  isConnected: boolean;
  error?: string;
}> {
  if (!uri) {
    return {
      client: null,
      db: null,
      isConnected: false,
      error: 'MONGODB_URI is not set in environment variables. Running in Local Mode.',
    };
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb, isConnected: true };
  }

  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;

    return { client, db, isConnected: true };
  } catch (err: any) {
    console.error('MongoDB Atlas connection error:', err);
    return {
      client: null,
      db: null,
      isConnected: false,
      error: err?.message || 'Failed to connect to MongoDB Atlas',
    };
  }
}
