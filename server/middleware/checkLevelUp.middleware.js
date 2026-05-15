import { prisma } from "../config/prisma.config.js";

export const checkLevelUp = async (req, res, next) => {
  if(!req.user || !req.user.id) {
    return next();
  }
  try {
    const initialUser = await prisma.user.findUnique({
      where: {id: req.user.id},
      select: {level: true, gems: {select: {total: true}}}
    });

  if(!initialUser) return next();
  const initialLevel = initialUser.level;
  
  const originalJson = res.json;

  res.json = async function(data) {
    res.json = originalJson;

    const currentUser = await prisma.user.findUnique({
      where: {id: req.user.id},
      select: {level: true, gems: {select: {total: true}}}
    });

    if (currentUser && currentUser?.level > initialLevel) {
      data.levelUpInfo = {
        achieved: true,
        oldLevel: initialLevel,
        newLevel: currentUser.level,
        message: "مبروك! لقد ارتقيت إلى مستوى جديد!"
      };
    }
    return originalJson.call(this, data);
  }
  next();

  } catch (error) {
    console.error("Error in checkLevelUp middleware", error);
    next(error)
  }
}