import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let _instance: DrizzleDb | undefined;

function getInstance(): DrizzleDb {
  if (!_instance) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _instance = drizzle(neon(process.env.DATABASE_URL), { schema });
  }
  return _instance;
}

// Proxy defers initialization to first query call, allowing the module
// to load at build time without requiring DATABASE_URL.
export const db: DrizzleDb = new Proxy({} as DrizzleDb, {
  get(_target, prop, receiver) {
    return Reflect.get(getInstance(), prop, receiver);
  },
});
