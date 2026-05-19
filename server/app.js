import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRoute from "./modules/auth/auth.routes.js";
import prayerRoutes from './modules/prayers/prayer.route.js';
import quranRoutes from './modules/quran/quran.routes.js';
import adhkarRoutes from './modules/adhkar/adhkar.route.js';

const app = express();


app.use(cors({
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

export default app;