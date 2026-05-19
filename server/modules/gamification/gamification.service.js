import { prisma } from '../../config/prisma.config.js';
import { POINTS_CONFIG } from '../../config/points.config.js';
import logger from '../../logger/logger.service.js';

/**
 * SRP: This function is only responsible for calculating gems based on the activity.
 * @param {string} activityType - The type of activity (PRAYER, QURAN, TASBIH, ADHKAR)
 * @param {Object} details - Additional details like { location: 'MOSQUE', onTime: true }
 * @returns {number} The calculated amount of gems
 */
export const calculateActivityGems = (activityType, details = {}) => {
  let gems = 0;
  switch (activityType) {
    case 'PRAYER':
      // Calculate gems based on prayer location
      if (details.location === 'MOSQUE') gems += POINTS_CONFIG.PRAYER.MOSQUE;
      else if (details.location === 'CONGREGATION') gems += POINTS_CONFIG.PRAYER.CONGREGATION;
      else gems += POINTS_CONFIG.PRAYER.HOME;
      
      // Add bonus if on time
      if (details.onTime) gems += POINTS_CONFIG.PRAYER.ON_TIME_BONUS;
      break;

    case 'QURAN':
      // Calculate gems based on number of verses read
      gems += (details.verseCount || 0) * POINTS_CONFIG.QURAN.PER_AYAH;
      if (details.type === 'HIFZ') gems += POINTS_CONFIG.QURAN.HIFZ_BONUS;
      break;

    case 'TASBIH':
      // Calculate gems based on tasbih progress
      if (details.completedSession) gems += POINTS_CONFIG.TASBIH.COMPLETED_SESSION;
      gems += Math.floor((details.count || 0) / 100) * POINTS_CONFIG.TASBIH.PER_HUNDRED;
      break;

    case 'ADHKAR':
      // Calculate gems based on adhkar category
      if (details.category === 'MORNING') gems += POINTS_CONFIG.AZKAR.MORNING;
      else if (details.category === 'NIGHT') gems += POINTS_CONFIG.AZKAR.EVENING; 
      else if (details.category === 'SLEEP') gems += POINTS_CONFIG.AZKAR.SLEEP;
      break;

    default:
      break;
  }
  return gems;
};

/**
 * Handle Gems & Level updates atomically.
 * This is used for dynamic rewards as well as manual rewards.
 */
export const handleGemsAndLevel = async(userId, amount, tx = null)  => {
  const db = tx || prisma;
  // Atomically increment gems
  const updateGems = await db.gems.update({
    where: { user_id: userId },
    data: {total: {increment: amount}},
    include: {user: true}
  })
  
  // Calculate new level based on threshold
  const newLevel = Math.floor(updateGems.total / POINTS_CONFIG.LEVELS.THRESHOLD_PER_LEVEL) + 1;
  let isLevelUP = false;

  // Update level if threshold is crossed
  if(newLevel > updateGems.user.level) {
    await db.user.update({
      where: { id: userId},
      data: {level: newLevel}
    })
    isLevelUP = true;
    logger.info(`User ${userId} leveled up to ${newLevel}`);
  }

  // Returns isLevelUP: true so the Frontend can trigger the Level Up Pop-up!
  return {totalGems: updateGems.total, currentLevel: newLevel, isLevelUP};
}

/**
 * Multi-Activity Streak System
 * Updates the streak for a specific activity type and awards streak bonuses if applicable.
 */
export const updateActivityStreak = async(userId, activityType, tx = null) => {
  const db = tx || prisma;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Fetch or create the streak record for this specific activity
  let activityStreak = await db.activityStreak.findUnique({
    where: {
      user_id_activity_type: {
        user_id: userId,
        activity_type: activityType
      }
    }
  });

  if (!activityStreak) {
    activityStreak = await db.activityStreak.create({
      data: {
        user_id: userId,
        activity_type: activityType,
        streak_count: 0,
        last_active_date: null
      }
    });
  }

  // 2. Specific rule for PRAYER: Must complete 5 prayers today to increment streak
  if (activityType === 'PRAYER') {
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const completedPrayersCount = await db.prayer.count({
      where: {
        user_id: userId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: 'COMPLETED'
      }
    });

    if (completedPrayersCount < 5) {
      // Rule not met: do not update streak yet
      return activityStreak;
    }
  }

  // 3. Date comparison logic for streak chain
  let newStreakCount = activityStreak.streak_count;
  let shouldUpdateStreak = false;

  if (activityStreak.last_active_date) {
    const lastActive = new Date(activityStreak.last_active_date);
    lastActive.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day: Already updated today
      return activityStreak;
    } else if (diffDays === 1) {
      // Consecutive day (Yesterday): Increment streak
      newStreakCount += 1;
      shouldUpdateStreak = true;
    } else {
      // Broken chain (Before yesterday): Reset streak
      newStreakCount = 1;
      shouldUpdateStreak = true;
    }
  } else {
    // First time doing this activity
    newStreakCount = 1;
    shouldUpdateStreak = true;
  }

  // 4. Update the streak in the database
  if (shouldUpdateStreak) {
    activityStreak = await db.activityStreak.update({
      where: { id: activityStreak.id },
      data: {
        streak_count: newStreakCount,
        last_active_date: new Date()
      }
    });

    // 5. Award bonuses for streaks (7 days, 30 days) using handleGemsAndLevel
    if (newStreakCount === 7) {
      await handleGemsAndLevel(userId, POINTS_CONFIG.STREAK_BONUS.DAY_7, db);
      logger.info(`User ${userId} earned 7-day streak bonus for ${activityType}`);
    } else if (newStreakCount === 30) {
      await handleGemsAndLevel(userId, POINTS_CONFIG.STREAK_BONUS.DAY_30, db);
      logger.info(`User ${userId} earned 30-day streak bonus for ${activityType}`);
    }
  }

  return activityStreak;
}

/**
 * Achievement Tracking: Check conditions and award badges if not already awarded.
 * This should be called asynchronously so it doesn't block the main flow.
 */
export const checkAndAwardBadges = async(userId, badgeName, conditionCallback, tx = null) => {
  const db = tx || prisma;

  // 1. Check if badge is already earned to prevent duplicates
  const existingBadge = await db.achievement.findUnique({
    where: {
      user_id_badge_name: {
        user_id: userId,
        badge_name: badgeName
      }
    }
  });

  if (existingBadge) return false;

  // 2. Evaluate condition using the provided callback
  const conditionMet = await conditionCallback(db);
  
  if (conditionMet) {
    // 3. Award badge
    await db.achievement.create({
      data: {
        user_id: userId,
        badge_name: badgeName
      }
    });
    logger.info(`User ${userId} unlocked achievement: ${badgeName}`);
    return true;
  }
  
  return false;
}