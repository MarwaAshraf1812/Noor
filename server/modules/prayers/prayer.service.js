import { handleGemsAndLevel, updateActivityStreak, calculateActivityGems, checkAndAwardBadges } from '../gamification/gamification.service.js';
import { prisma } from "../../config/prisma.config.js";
import { timeToMinutes, getStartOfToday, getLastSevenDays, formatDateToYYYYMMDD, getCurrentMinutes } from '../../utils/date.utils.js';
import { getAllPrayerTimes, activePrayer } from '../../utils/prayerTimes.js';

export const recordPrayer = async(userId, prayerName, status, location, latitude, longitude) => {
  return await prisma.$transaction(async(tx) => {
    const timings = await getAllPrayerTimes(latitude, longitude);
    const currentActive = activePrayer(timings);
    const isOnTime = (currentActive === prayerName);


    const prayerTimesInMinutes = timeToMinutes(timings[prayerName])
    const currentMinutes = getCurrentMinutes();
    
    if (currentMinutes < prayerTimesInMinutes) {
      throw new Error("لا يمكنك تسجيل صلاة قبل موعدها!");
    }

    const today = getStartOfToday();

    const existingRecord = await tx.prayer.findFirst({
      where: {
        user_id: userId,
        prayer_name: prayerName,
        date: today
      }
    });

    if (existingRecord) {
      // Logic for QADAA: Allow updating a MISSED prayer to QADAA
      if (existingRecord.status === 'MISSED' && status === 'QADAA') {
        const updatedRecord = await tx.prayer.update({
          where: { id: existingRecord.id },
          data: { status: 'QADAA', location }
        });

        // Award gems for Qadaa (penalty is handled inside calculateActivityGems if onTime is false)
        const gemsAmount = calculateActivityGems('PRAYER', { location, onTime: false });
        const gamificationResult = await handleGemsAndLevel(userId, gemsAmount, tx);

        return { 
          prayerRecord: updatedRecord, 
          dayCompleted: false, 
          streak: 0,
          gamification: gamificationResult
        };
      }

      throw new Error(`لقد قمت بتسجيل صلاة ${prayerName} بالفعل لهذا اليوم!`);
    }

    const prayerRecord = await tx.prayer.create({
      data: {
        user_id: userId,
        prayer_name: prayerName,
        date: today,
        status,
        location: location || null
      }
    })

    let dayCompleted = false;
    let currentStreak = 0;
    let gamification = null;

    if (status === 'COMPLETED') {
      const gemsAmount = calculateActivityGems('PRAYER', { location, onTime: isOnTime });
      gamification = await handleGemsAndLevel(userId, gemsAmount, tx);
      
      const streakRecord = await updateActivityStreak(userId, 'PRAYER', tx);
      currentStreak = streakRecord.streak_count;

      // 1. Check if Hero of the Day (5/5)
      const countToday = await tx.prayer.count({
        where: { user_id: userId, date: today, status: 'COMPLETED' }
      });
      if (countToday === 5) dayCompleted = true;

      // 2. Award Badge: فارس الفجر (Prayed Fajr on time for 7 days)
      if (prayerName === 'Fajr') {
        await checkAndAwardBadges(userId, 'فارس الفجر', async (db) => {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
          
          const fajrCount = await db.prayer.count({
            where: {
              user_id: userId,
              prayer_name: 'Fajr',
              status: 'COMPLETED',
              date: { gte: sevenDaysAgo }
            }
          });
          return fajrCount >= 7;
        }, tx);
      }

      // 3. Award Badge: بطل الأسبوع (Prayer Streak hits 7 days)
      if (currentStreak >= 7) {
        await checkAndAwardBadges(userId, 'بطل الأسبوع', async () => true, tx);
      }
    } else if (status === 'QADAA') {
        const gemsAmount = calculateActivityGems('PRAYER', { location, onTime: false });
        gamification = await handleGemsAndLevel(userId, gemsAmount, tx);
    }

    return { 
      prayerRecord, 
      dayCompleted, 
      streak: currentStreak,
      gamification
    }; 
  })
}

export const MissedPrayers = async(userId, latitude, longitude, tx = null) => {
  const db = tx || prisma;
  const timings = await getAllPrayerTimes(latitude, longitude);
  const currentActive = activePrayer(timings);
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const currentIndex = prayers.indexOf(currentActive);
  const pastPrayers = prayers.slice(0, currentIndex); 

  const today = getStartOfToday();

  const recordedPrayers = await db.prayer.findMany({
    where: {user_id: userId, date: today}
  })

  const recordedPrayerNames = new Set(recordedPrayers.map(p => p.prayer_name));

  const missedPrayers = pastPrayers.filter(p => !recordedPrayerNames.has(p));

   if (missedPrayers.length > 0) {
    await db.prayer.createMany({
      data: missedPrayers.map(prayerName => ({
        user_id: userId,
        prayer_name: prayerName,
        date: today,
        status: "MISSED",
        location: "HOME"
      })),
      skipDuplicates: true
    })
    return {message: `تم تسجيل ${missedPrayers.length} صلاة مفقودة بنجاح!`}
  }
  return {message: "لا توجد صلوات مفقودة"}
}

export const getPrayerDashboardData = async (userId, latitude, longitude) => {
  const today = getStartOfToday();
  const sevenDays = getLastSevenDays();
  const sevenDaysAgo = sevenDays[0];

  const prayers = await prisma.prayer.findMany({
    where: {
      user_id: userId,
      date: { gte: sevenDaysAgo, lte: today }
    }
  });

  const todaysRecords = prayers.filter(p => p.date.getTime() === today.getTime());
  const completedCount = todaysRecords.filter(p => p.status === 'COMPLETED' || p.status === 'QADAA').length;
  const dailyProgress = (completedCount / 5) * 100;

  const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const weeklyGrid = {};

  for (const d of sevenDays) {
    const dateKey = formatDateToYYYYMMDD(d);
    
    weeklyGrid[dateKey] = {};
    prayerNames.forEach(name => {
      const record = prayers.find(p => p.date.toISOString().split('T')[0] === dateKey && p.prayer_name === name);
      weeklyGrid[dateKey][name] = record ? { status: record.status, location: record.location } : { status: 'PENDING' };
    });
  }

  const prayerStreak = await prisma.activityStreak.findUnique({
    where: {
      user_id_activity_type: { user_id: userId, activity_type: 'PRAYER' }
    }
  });
  
  const achievements = await prisma.achievement.findMany({
    where: { user_id: userId }
  });

   const weeklyCompletedCount = prayers.filter(p => p.status === 'COMPLETED' || p.status === 'QADAA').length;

  const timings = await getAllPrayerTimes(latitude, longitude);
  const currentMinutes = getCurrentMinutes();
  
  let nextPrayer = null;
  for (const name of prayerNames) {
    if (timeToMinutes(timings[name]) > currentMinutes) {
      nextPrayer = {
        name,
        time: timings[name],
        remainingMinutes: timeToMinutes(timings[name]) - currentMinutes
      };
      break;
    }
  }

  // If the current time is after Isha, the next prayer is tomorrow's Fajr
  if (!nextPrayer) {
    const minutesUntilMidnight = 24 * 60 - currentMinutes;
    nextPrayer = {
      name: 'Fajr',
      time: timings['Fajr'],
      remainingMinutes: minutesUntilMidnight + timeToMinutes(timings['Fajr'])
    };
  }

  return {
    dailyProgress,
    completedCount,
    weeklyGrid,
    nextPrayer,
    todayTimeline: weeklyGrid[formatDateToYYYYMMDD(today)],
    streak: prayerStreak ? prayerStreak.streak_count : 0,
    achievements: achievements.map(a => a.badge_name),
    weeklyCompletedCount
  };
};
