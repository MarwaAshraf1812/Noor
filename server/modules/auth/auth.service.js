import { prisma } from "../../config/prisma.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";


export const registerNewUser = async (userData) => {
  try {
    const { name, email, password, avatar_url } = userData;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new Error("البريد الالكتروني موجود بالفعل");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar_url,
        gems: {
          create: {
            total: 100
          }
        }
      },
      include: {
        gems: true
      }
    });
    const token = jwt.sign(
      {userId: newUser.id, email: newUser.email},
      process.env.JWT_SECRET,
      {expiresIn: '7d'}
    );

    const { password: _, ...userWithoutPassword } = newUser;

    return { user: userWithoutPassword, token };
  } catch (error) {
    throw error;
  }
}

export const loginUser = async(userData) => {
  try {
    const {email, password} = userData;
    
    const user = await prisma.user.findUnique({
      where: {email},
      include: { gems: true }
    });

    if(!user){
       throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid)
    {
      throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    const token = jwt.sign(
      {userId: user.id, email: user.email},
      process.env.JWT_SECRET,
      {expiresIn: '7d'}
    );


    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
      
  } catch (error) {
    throw error;
  }
}

export const getUserProfile = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { gems: true }
    });
    if (!user) {
      throw new Error("المستخدم غير موجود");
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

export const loginWithGoogle = async (googleToken, isRegister = false) => {
  try {
    let payload;
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${googleToken}`);
      payload = response.data;
    } catch (e) {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`);
      payload = response.data;
    }
    const isEmailVerified = payload.email_verified === true || payload.email_verified === "true";
    if (!isEmailVerified) {
      throw new Error("حساب جوجل غير موثق");
    }
    
    const { email, name, picture } = payload;
    
    let user = await prisma.user.findUnique({
      where: { email },
      include: { gems: true }
    });
    
    if (!user) {
      if (!isRegister) {
        throw new Error("هذا الحساب غير مسجل لدينا. يرجى إنشاء حساب جديد أولاً.");
      }
      
      const randomPassword = Math.random().toString(36).substring(2, 15);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const defaultAvatar = "/assets/avatar_green_boy.png";
      const avatarUrl = picture || defaultAvatar;
      
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          avatar_url: avatarUrl,
          gems: {
            create: {
              total: 100
            }
          }
        },
        include: {
          gems: true
        }
      });
    } else {
      if (isRegister) {
        // If registering but account exists, we can log them in or throw an error. 
        // Let's just sign them in for convenience but we could also throw an error. 
        // Log in is usually the best user experience.
      }
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  } catch (error) {
    throw new Error(error.response?.data?.error_description || error.message || "فشل التحقق من حساب جوجل");
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name || 'User',
        avatar_url: data.avatar_url || undefined
      },
      include: {
        gems: true
      }
    });
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (error) {
    throw new Error(error.message || "فشل تحديث البيانات");
  }
};