import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRoute from "./modules/auth/auth.routes.js";
import prayerRoutes from './modules/prayers/prayer.route.js';
import quranRoutes from './modules/quran/quran.routes.js';
import adhkarRoutes from './modules/adhkar/adhkar.route.js';
import tasbihRoutes from './modules/tasbih/tasbih.routes.js';

const app = express();

const extraOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
      const isVercel = url.hostname.endsWith(".vercel.app");
      const isAllowed = extraOrigins.includes(origin);
      if (isLocalhost || isVercel || isAllowed) {
        return callback(null, true);
      }
    } catch (e) {
      // invalid URL format, ignore
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use("/api/v1/auth", authRoute);
app.use('/api/v1/prayer', prayerRoutes);
app.use('/api/v1/quran', quranRoutes);
app.use('/api/v1/adhkar', adhkarRoutes);
app.use('/api/v1/tasbih', tasbihRoutes);

export default app;