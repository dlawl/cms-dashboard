import type { NextApiRequest, NextApiResponse } from 'next';
import { getPool } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { signJwt } from '../../../lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'MISSING_FIELDS' });

  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, email, password_hash, status FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    type UserRow = { id: string; email: string; password_hash: string; status: string };
    const user = Array.isArray(rows) ? (rows[0] as UserRow | undefined) : undefined;
    if (!user) return res.status(401).json({ message: 'INVALID_CREDENTIALS' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'INVALID_CREDENTIALS' });

    if (user.status !== 'approved') {
      return res.status(403).json({ message: 'NOT_APPROVED', user: { email: user.email, status: user.status } });
    }

    const token = signJwt({ sub: user.id, email: user.email });
    return res.status(200).json({ token, user: { email: user.email, status: user.status } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'SERVER_ERROR' });
  }
}
