import express from 'express';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const router = express.Router();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 인증 미들웨어
// 인증 + 승인 상태 미들웨어 (user/admin 모두)
async function requireApproved(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: '토큰이 필요합니다.' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    try {
      const [rows] = await db.query('SELECT role, status FROM users WHERE id = ?', [user.id]);
      if (!rows.length) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      const { role, status } = rows[0];
      if (status !== 'approved') return res.status(403).json({ message: '승인되지 않은 사용자입니다.' });
      req.user = { ...user, role, status };
      next();
    } catch (e) {
      return res.status(500).json({ message: '권한 확인 오류', error: e.message });
    }
  });
}

// 관리자 권한 미들웨어 (requireApproved 이후 사용)
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  next();
}



// [조회] 사용자 목록 조회: 승인된 user/admin 모두 허용, 민감 필드 제외
router.get('/', requireApproved, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, email, name, role, status, created_at FROM users');
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: '사용자 목록 조회 실패', error: e.message });
  }
});

// [변경] 사용자 상태 변경: 관리자만 허용
router.patch('/:id/status', requireApproved, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: '유효하지 않은 상태값입니다.' });
  }
  try {
    const [result] = await db.query('UPDATE users SET status = ?, status_change_date = NOW() WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    res.json({ message: '상태 변경 성공' });
  } catch (e) {
    res.status(500).json({ message: '상태 변경 실패', error: e.message });
  }
});

export default router;
