import app from '../src/app';
import { connectDB } from '../src/prisma/client';

let connected: Promise<void> | null = null;

export default async function handler(req: any, res: any) {
  // Ensure a single DB connection per runtime
  if (!connected) connected = connectDB();
  await connected;
  // Delegate to Express
  // @ts-ignore - Express app is compatible with (req, res)
  return app(req, res);
}


