import { Router } from "express";
import * as authController from "./auth.controller.js";

const router = Router();
/*
@route   POST /api/auth/register
@desc    Register a new user
@access  Public
*/
router.post("/register", authController.register);
/*
@route   POST /api/auth/login
@desc    Authenticate user & get token
@access  Public
*/
router.post("/login", authController.login);

/*
@route   POST /api/auth/logout
@desc    Logout user & clear cookie
@access  Public
*/
router.post("/logout", authController.logout);

export default router;