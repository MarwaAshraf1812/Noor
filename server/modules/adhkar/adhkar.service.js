import { prisma } from '../../config/prisma.config.js';
import { POINTS_CONFIG } from '../../config/points.config.js';
import { handleGemsAndLevel, updateActivityStreak } from '../gamification/gamification.service.js';
import { getAdhkarByCategory } from '../../utils/adkar.js';

const CATEGORY_MAP = {
  MORNING: 'أذكار الصباح',
  NIGHT: 'أذكار المساء',
  SLEEP: 'أذكار النوم'
};


export const logAdhkarSession = async (userId, category) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const mappedCategory = category.toUpperCase() === 'EVENING' ? 'NIGHT' : category.toUpperCase();
  if (!CATEGORY_MAP[mappedCategory]) {
    throw new Error('تصنيف الأذكار غير مدعوم');
  }

  const alreadyLoggedToday = await prisma.adhkarProgress.findFirst({
    where: {
      user_id: userId,
      category: mappedCategory,
      date: today
    }
  });

  if (alreadyLoggedToday) {
    throw new Error('لقد قمت بتسجيل هذه الجلسة من الأذكار اليوم بالفعل');
  }

  const pointsKey = mappedCategory === 'NIGHT' ? 'EVENING' : mappedCategory;
  const gemsEarned = POINTS_CONFIG.AZKAR[pointsKey] || 10;

  return await prisma.$transaction(async (tx) => {
    const log = await tx.adhkarProgress.create({
      data: {
        user_id: userId,
        category: mappedCategory,
        date: today,
        completed: true
      }
    });

    const gamificationResult = await handleGemsAndLevel(userId, gemsEarned, tx);
    const streakResult = await updateActivityStreak(userId, 'ADHKAR', tx);

    return {
      message: 'تقبل الله طاعتك يا بطل! تم تسجيل الأذكار بنجاح 🎉',
      log,
      gemsEarned,
      totalGems: gamificationResult.totalGems,
      currentLevel: gamificationResult.currentLevel,
      isLevelUp: gamificationResult.isLevelUp,
      adhkarStreak: streakResult.streak_count
    };
  });
};

export const getAdhkarAnalytics = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedToday = await prisma.adhkarProgress.findMany({
    where: {
      user_id: userId,
      date: today
    },
    select: {
      category: true,
      completed: true
    }
  });

  const status = {
    MORNING: false,
    NIGHT: false,
    EVENING: false,
    SLEEP: false
  };

  completedToday.forEach(log => {
    if (log.category === 'NIGHT') {
      status.NIGHT = log.completed;
      status.EVENING = log.completed;
    } else if (status[log.category] !== undefined) {
      status[log.category] = log.completed;
    }
  });

  const streakRecord = await prisma.activityStreak.findUnique({
    where: {
      user_id_activity_type: {
        user_id: userId,
        activity_type: 'ADHKAR'
      }
    }
  });

  return {
    todayStatus: status,
    streak: streakRecord ? streakRecord.streak_count : 0
  };
};

export const getAdhkarList = async (category) => {
  const normalized = category.toUpperCase() === 'EVENING' ? 'NIGHT' : category.toUpperCase();
  const arabicCategory = CATEGORY_MAP[normalized];
  if (!arabicCategory) {
    throw new Error('تصنيف الأذكار غير مدعوم');
  } 
  return await getAdhkarByCategory(arabicCategory);
};