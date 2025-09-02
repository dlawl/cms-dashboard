import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes.auth.js';
import usersRoutes from './routes.users.js';

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
