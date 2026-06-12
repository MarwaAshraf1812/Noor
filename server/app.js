import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRoute from "./modules/auth/auth.routes.js";
import prayerRoutes from './modules/prayers/prayer.route.js';
import quranRoutes from './modules/quran/quran.routes.js';
import adhkarRoutes from './modules/adhkar/adhkar.route.js';
import tasbihRoutes from './modules/tasbih/tasbih.routes.js';

const app = express();


app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      if (
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1" ||
        origin === "https://elnoor-app.vercel.app"
      ) {
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

app.use("/api/v1/auth", authRoute);
app.use('/api/v1/prayer', prayerRoutes);
app.use('/api/v1/quran', quranRoutes);
app.use('/api/v1/adhkar', adhkarRoutes);
app.use('/api/v1/tasbih', tasbihRoutes);

export default app;