import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRoute from "./modules/auth/auth.routes.js";


const app = express();


app.use(cors({
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

export default app;