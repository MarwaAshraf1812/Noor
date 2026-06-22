import { Router } from "express";
import * as authController from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

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
router.post("/google", authController.googleLogin);

/*
@route   POST /api/auth/logout
@desc    Logout user & clear cookie
@access  Public
*/
router.post("/logout", authController.logout);

/*
@route   GET /api/auth/me
@desc    Get current user
@access  Private
*/
router.get("/me", authenticate, authController.getMe);
router.put("/profile", authenticate, authController.updateProfile);

export default router;