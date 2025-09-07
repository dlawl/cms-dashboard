// backend/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes.auth.js';
import usersRoutes from './routes.users.js';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const app = express();

// --- CORS ---
const allowedOrigins = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.set('trust proxy', 1);
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// --- 라우터 ---
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// 헬스체크
app.get('/api/health', (_req, res) => res.send('OK'));

// --- DB 풀 (부트스트랩용) ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
});

// 서버 기동 시, 스키마 보장 + 관리자 계정 업서트
async function ensureSchemaAndAdmin() {
  // 1) 스키마(테이블) 없으면 생성
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      role ENUM('admin','manager','user') DEFAULT 'user',
      status ENUM('approved','rejected','pending') DEFAULT 'pending',
      status_change_date TIMESTAMP NULL DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2) ADMIN_* 환경변수로 초기 관리자 업서트(선택)
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'admin';

  if (!email || !password) {
    console.log('[bootstrap] ADMIN_* env 없음 → 관리자 자동생성 건너뜀');
    return;
  }

  const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  const hash = await bcrypt.hash(password, 10);

  if (Array.isArray(rows) && rows.length > 0) {
    await pool.query(
      'UPDATE users SET password = ?, name = ?, role = "admin", status = "approved", status_change_date = NOW() WHERE email = ?',
      [hash, name, email]
    );
    console.log('[bootstrap] 기존 관리자 업데이트/승인 완료:', email);
  } else {
    await pool.query(
      'INSERT INTO users (email, password, name, role, status) VALUES (?, ?, ?, "admin", "approved")',
      [email, hash, name]
    );
    console.log('[bootstrap] 관리자 생성/승인 완료:', email);
  }
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await ensureSchemaAndAdmin();
  } catch (e) {
    console.error('[bootstrap] 실패:', e);
  }
});
