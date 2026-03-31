import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "غير مصرح لك بالدخول، برجاء تسجيل الدخول أولاً" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "التوكن غير صالح أو انتهت صلاحيته" });
  }
};