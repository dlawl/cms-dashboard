import type { NextApiRequest, NextApiResponse } from 'next';
import { getPool } from '../../../../lib/db';
import { verifyJwt } from '../../../../lib/jwt';

function requireAuth(req: NextApiRequest) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) throw new Error('NO_TOKEN');
  verifyJwt(token);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end();
  try {
    requireAuth(req);
    const { id } = req.query;
    const { status } = req.body || {};
    if (!id || !status) return res.status(400).json({ message: 'MISSING_FIELDS' });

    const pool = getPool();
    await pool.execute(
      'UPDATE users SET status = ?, status_change_date = NOW() WHERE id = ?',
      [status, id]
    );
    return res.status(204).end();
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'NO_TOKEN') return res.status(401).json({ message: 'UNAUTHORIZED' });
    console.error(e);
    return res.status(500).json({ message: 'SERVER_ERROR' });
  }
}
