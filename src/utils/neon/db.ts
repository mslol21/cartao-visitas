import 'server-only';
import { neon } from '@neondatabase/serverless';

export function getNeonSql() {
  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    throw new Error('NEON_DATABASE_URL não está configurada');
  }
  // Credentials are server-side only. Never use NEXT_PUBLIC_ for this URL.
  return neon(connectionString);
}
