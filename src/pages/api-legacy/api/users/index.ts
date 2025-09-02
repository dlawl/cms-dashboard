import type { NextApiRequest, NextApiResponse } from 'next';
import { getPool } from '../../../lib/db';
import { verifyJwt } from '../../../lib/jwt';

function requireAuth(req: NextApiRequest) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) throw new Error('NO_TOKEN');
  verifyJwt(token);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    requireAuth(req);
    const { status } = req.query;
    const pool = getPool();
    let sql = 'SELECT id, name, email, status, status_change_date AS statusChangeDate FROM users';
    const params: unknown[] = [];
    if (status && status !== 'all') {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    type UserRow = { id: string; name: string; email: string; status: string; statusChangeDate: string };
    const [rows] = await pool.execute(sql, params);
    return res.status(200).json(rows as UserRow[]);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'NO_TOKEN') return res.status(401).json({ message: 'UNAUTHORIZED' });
    console.error(e);
    return res.status(500).json({ message: 'SERVER_ERROR' });
  }
}
