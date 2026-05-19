import { prisma } from '../../config/prisma.config.js';
import { handleGemsAndLevel, updateActivityStreak, calculateActivityGems } from '../gamification/gamification.service.js';

export const logTasbihSession = async (userId, tasbihData) => {
  const { tasbih_name, tasbih_count, completed } = tasbihData;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const gemsEarned = calculateActivityGems('TASBIH', {
    completedSession: completed,
    count: tasbih_count
  });

  return await prisma.$transaction(async (tx) => {
    const log = await tx.tasbihSession.create({
      data: {
        user_id: userId,
        tasbih_name,
        tasbih_count: tasbih_count || 0,
        completed: completed || false,
        date: today
      }
    });

    let gamificationResult = { totalGems: 0, currentLevel: 1, isLevelUP: false };
    if (gemsEarned > 0) {
      gamificationResult = await handleGemsAndLevel(userId, gemsEarned, tx);
    } else {
      const userGems = await tx.gems.findUnique({ where: { user_id: userId } });
      const user = await tx.user.findUnique({ where: { id: userId }, select: { level: true } });
      gamificationResult = {
        totalGems: userGems ? userGems.total : 0,
        currentLevel: user ? user.level : 1,
        isLevelUP: false
      };
    }

    const streakResult = await updateActivityStreak(userId, 'TASBIH', tx);

    return {
      message: completed 
        ? `أحسنت يا بطل! أكملت تسبيح ${tasbih_name} بنجاح 🎉`
        : `تم حفظ تقدم التسبيح بنجاح!`,
      log,
      gemsEarned,
      totalGems: gamificationResult.totalGems,
      currentLevel: gamificationResult.currentLevel,
      isLevelUp: gamificationResult.isLevelUP,
      tasbihStreak: streakResult.streak_count
    };
  });
};

export const getTasbihAnalytics = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const aggregates = await prisma.tasbihSession.groupBy({
    by: ['tasbih_name'],
    where: {
      user_id: userId,
      date: today
    },
    _sum: {
      tasbih_count: true
    }
  });

  const progress = {
    "سبحان الله": 0,
    "الحمد لله": 0,
    "الله أكبر": 0,
    "سبحان الله وبحمده": 0
  };

  aggregates.forEach(item => {
    if (progress[item.tasbih_name] !== undefined) {
      progress[item.tasbih_name] = item._sum.tasbih_count || 0;
    }
  });

  const streakRecord = await prisma.activityStreak.findUnique({
    where: {
      user_id_activity_type: {
        user_id: userId,
        activity_type: 'TASBIH'
      }
    }
  });

  return {
    todayProgress: progress,
    streak: streakRecord ? streakRecord.streak_count : 0
  };
};