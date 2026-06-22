import * as authService from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

/**
 * @desc    Register a new user account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async(req, res) => {
  try {
    const {error, value} = registerSchema.validate(req.body);
    if(error) {
      return res.status(400).json({success: false, message: error.details[0].message});
    }

    const { user, token } = await authService.registerNewUser(value);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });

    res.status(201).json({success: true, message: "تم تسجيل الحساب بنجاح", user, token});
    
  } catch (error) {
    res.status(400).json({success: false, message: error.message || "حدث خطأ أثناء تسجيل الحساب"});
  }
}

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async(req, res) => {
  try {
    const {error, value} = loginSchema.validate(req.body);
    if(error) {
      return res.status(400).json({success: false, message: error.details[0].message});
    }

    const { user, token } = await authService.loginUser(value);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });

    res.status(200).json({success: true, message: "تم تسجيل الدخول بنجاح", user, token});
  } catch (error) {
    res.status(400).json({success: false, message: error.message || "حدث خطأ أثناء تسجيل الدخول"});
  }
}

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Public / Private
 */
export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
  });
  res.status(200).json({ success: true, message: "تم تسجيل الخروج" });
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await authService.getUserProfile(userId);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token: googleToken, isRegister } = req.body;
    if (!googleToken) {
      return res.status(400).json({ success: false, message: "توكن جوجل مطلوب" });
    }

    const { user, token } = await authService.loginWithGoogle(googleToken, isRegister);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });

    res.status(200).json({ success: true, message: "تم تسجيل الدخول بجوجل بنجاح", user, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "حدث خطأ أثناء تسجيل الدخول بجوجل" });
  }
};