import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes.auth.js';
import usersRoutes from './routes.users.js';
import fs from 'fs';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const app = express();

// CORS 미들웨어를 라우트보다 위에, 옵션 명시
const allowedOrigins = process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(',') : ['http://localhost:3000'];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.get('/api/health', (_req, res) => res.send('OK'));

/* DB 스키마 적용 + (선택) 관리자 시드 */
async function ensureSchemaAndSeed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  // 1) schema.sql 실행(테이블 없으면 생성)
  const schema = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
  await conn.query(schema);

  // 2) (선택) ADMIN_* 환경변수로 최초 관리자 자동 생성
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass  = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPass) {
    const [rows] = await conn.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if (Array.isArray(rows) && rows.length === 0) {
      const hash = await bcrypt.hash(adminPass, 10);
      await conn.query(
        'INSERT INTO users (email, password, name, role, status) VALUES (?, ?, ?, ?, ?)',
        [adminEmail, hash, process.env.ADMIN_NAME || 'admin', 'admin', 'approved'],
      );
      console.log(`Seeded admin user ${adminEmail}`);
    }
  }

  await conn.end();
}

/* Start */
const PORT = process.env.PORT || 4000;
(async () => {
  await ensureSchemaAndSeed();       // ★ 서버 시작 전에 스키마/시드 보장
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();