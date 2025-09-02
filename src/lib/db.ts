import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      // (호스팅 DB가 SSL 요구하면) ssl: { rejectUnauthorized: true },
    });
  }
  return pool;
}
