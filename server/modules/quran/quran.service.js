import { prisma } from '../../config/prisma.config.js';
import { POINTS_CONFIG } from '../../config/points.config.js';
import { handleGemsAndLevel, updateActivityStreak } from '../gamification/gamification.service.js';
import { getQuranSurahDataByName } from '../../utils/quranSurah.js';

export const logQuranSession = async (userId, sessionData) => {
  const { surah_name, verse_count, type } = sessionData;
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { daily_hifz_target: true, daily_revision_target: true }
  });
  if (!user) throw new Error('User not found');

  const surah = await getQuranSurahDataByName(surah_name);
  if (!surah) {
    throw new Error('Surah not found');
  }
  const { numberOfAyahs } = surah;

  if (verse_count > numberOfAyahs) {
    throw new Error(`سورة ${surah_name} عدد آياتها ${numberOfAyahs} بس، إزاي قرأت/حفظت ${verse_count}؟ 🤔`);
  }

  let gemsEarned = 0;
  if (type === 'HIFZ') {
    gemsEarned = (verse_count * POINTS_CONFIG.QURAN.HIFZ_PER_AYAH) + POINTS_CONFIG.QURAN.HIFZ_BONUS;
  } else if (type === 'REVISION') {
    gemsEarned = (verse_count * POINTS_CONFIG.QURAN.REVISION_PER_AYAH) + POINTS_CONFIG.QURAN.REVISION_BONUS;
  } else if (type === 'READING') {
    gemsEarned = (verse_count * POINTS_CONFIG.QURAN.READING_PER_AYAH);
  } else {
    throw new Error('Invalid session type');
  }

  const todayStats = await prisma.quranSession.aggregate({
    _sum: { verse_count: true },
    where: { user_id: userId, type, date: todayDate }
  });
  const previousTotal = todayStats._sum.verse_count || 0;
  const currentTotal = previousTotal + verse_count;
  const target = type === 'HIFZ' ? user.daily_hifz_target : user.daily_revision_target;

  let goalBonusAchieved = false;
  if (target > 0 && previousTotal < target && currentTotal >= target) {
    gemsEarned += POINTS_CONFIG.QURAN.GOAL_BONUS;
    goalBonusAchieved = true;
  }

  return await prisma.$transaction(async (tx) => {
    const session = await tx.quranSession.create({
      data: {
        user_id: userId,
        surah_name,
        verse_count,
        type,
        date: todayDate
      }
    });

    const gamificationResult = await handleGemsAndLevel(userId,  gemsEarned, tx);
    const streakResult = await updateActivityStreak(userId, 'QURAN', tx);

    let message = "";
    if (type === 'HIFZ') message = "مبارك حفظك الجديد يا بطل! 🎉";
    else if (type === 'REVISION') message = "مراجعة ممتازة، الله يفتح عليك! 📖";
    else message = "تلاوة مباركة، تقبل الله! 🤲";

    if (goalBonusAchieved) {
      message += " ما شاء الله! حفظت هدفك اليوم بنجاح وربحت بونص 🌟";
    }

    return {
      message,
      session,
      gemsEarned,
      goalBonusAchieved,
      totalGems: gamificationResult.totalGems,
      currentLevel: gamificationResult.currentLevel,
      isLevelUp: gamificationResult.isLevelUp,
      quranStreak: streakResult.streak_count
    };
  });
};

export const getQuranAnalytics = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      daily_hifz_target: true,
      daily_revision_target: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetHifz = user.daily_hifz_target;
  const targetRevision = user.daily_revision_target;

  const todayHifz = await prisma.quranSession.aggregate({
    _sum: { verse_count: true },
    where: {
      user_id: userId,
      type: 'HIFZ',
      date: today
    }
  });

  const todayRevision = await prisma.quranSession.aggregate({
    _sum: { verse_count: true },
    where: {
      user_id: userId,
      type: 'REVISION',
      date: today
    }
  });

  const totalHifz = await prisma.quranSession.aggregate({
    _sum: { verse_count: true },
    where: {
      user_id: userId,
      type: 'HIFZ'
    }
  });

  const streakRecord = await prisma.activityStreak.findUnique({
    where: {
      user_id_activity_type: {
        user_id: userId,
        activity_type: 'QURAN'
      }
    }
  });

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const recentSessions = await prisma.quranSession.findMany({
    where: {
      user_id: userId,
      date: { gte: sevenDaysAgo }
    },
    select: { date: true, type: true }
  });

  const weeklyActivity = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const isActive = recentSessions.some(s => s.date.getTime() === d.getTime());
    weeklyActivity.push({
      date: d.toISOString(),
      active: isActive
    });
  }

  const currentHifz = todayHifz._sum.verse_count || 0;
  const currentRevision = todayRevision._sum.verse_count || 0;
  const totalHifzCount = totalHifz._sum.verse_count || 0;
  
  const hifzProgress = targetHifz > 0 ? Math.min(100, (currentHifz / targetHifz) * 100) : 0;
  const revisionProgress = targetRevision > 0 ? Math.min(100, (currentRevision / targetRevision) * 100) : 0;

  return {
    todayHifz: {
      verse_count: currentHifz,
      target: targetHifz,
      progress: Math.round(hifzProgress)
    },
    todayRevision: {
      verse_count: currentRevision,
      target: targetRevision,
      progress: Math.round(revisionProgress)
    },
    totalHifz: totalHifzCount,
    streak: streakRecord ? streakRecord.streak_count : 0,
    weeklyActivity
  };
};

export const getQuranHistory = async (userId, limit = 10) => {
  const history = await prisma.quranSession.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: limit,
    select: {
      id: true,
      surah_name: true,
      verse_count: true,
      type: true,
      date: true,
      created_at: true
    }
  });
  return history;
};

export const getCurrentSurahProgress = async (userId) => {
  const lastSession = await prisma.quranSession.findFirst({
    where: { user_id: userId, type: 'HIFZ' },
    orderBy: { created_at: 'desc' }
  });

  if (!lastSession) {
    return null;
  }

  const currentSurahName = lastSession.surah_name;
  const surahData = await getQuranSurahDataByName(currentSurahName);
  
  if (!surahData) return null;

  const surahProgress = await prisma.quranSession.aggregate({
    _sum: { verse_count: true },
    where: {
      user_id: userId,
      type: 'HIFZ',
      surah_name: currentSurahName
    }
  });

  const memorizedAyahs = surahProgress._sum.verse_count || 0;
  const remainingAyahs = Math.max(0, surahData.numberOfAyahs - memorizedAyahs);

  return {
    surahName: currentSurahName,
    totalAyahs: surahData.numberOfAyahs,
    memorizedAyahs: memorizedAyahs,
    remainingAyahs: remainingAyahs,
    completed: remainingAyahs === 0
  };
};

export const updateDailyTargets = async (userId, hifzTarget, revisionTarget) => {
  const dataToUpdate = {};
  if (hifzTarget !== undefined) dataToUpdate.daily_hifz_target = hifzTarget;
  if (revisionTarget !== undefined) dataToUpdate.daily_revision_target = revisionTarget;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
    select: { daily_hifz_target: true, daily_revision_target: true }
  });

  return updatedUser;
};
