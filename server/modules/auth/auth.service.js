import { prisma } from "../../config/prisma.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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
    return newUser;
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