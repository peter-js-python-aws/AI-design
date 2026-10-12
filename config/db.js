import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

let _db;

function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  _db = drizzle(neon(url), { schema });
  return _db;
}

// Keeps existing `import { db } from '@/lib/db'` working, but connects on first use
export const db = new Proxy({}, {
  get(_, prop) {
    const real = getDb();
    const value = real[prop];
    return typeof value === 'function' ? value.bind(real) : value;
  },
});