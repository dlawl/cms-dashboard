import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 회원가입
router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length > 0) return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', [email, hash, name, role || 'user']);
    res.json({ message: '회원가입 성공' });
  } catch (e) {
    res.status(500).json({ message: '회원가입 실패', error: e.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    if (user.status !== 'approved') {
      return res.status(403).json({ message: 'NOT_APPROVED', user: { id: user.id, email: user.email, status: user.status } });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status } });
  } catch (e) {
    res.status(500).json({ message: '로그인 실패', error: e.message });
  }
});

// 인증 미들웨어 (users.js와 동일하게 재정의)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: '토큰이 필요합니다.' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    req.user = user;
    next();
  });
}

// 내 정보 조회 (SSR에서 사용)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, email, name, role, status FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    const user = rows[0];
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: '내 정보 조회 실패', error: e.message });
  }
});

export default router;
