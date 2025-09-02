import type { NextApiRequest, NextApiResponse } from 'next';
import { getPool } from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password, name, role } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ message: 'MISSING_FIELDS' });

  try {
    const pool = getPool();
    const hash = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (name, email, password_hash, status, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, 'approved', role || 'admin']
    );
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'SERVER_ERROR' });
  }
}
