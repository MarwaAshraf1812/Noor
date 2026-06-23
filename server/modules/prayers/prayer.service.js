import { handleGemsAndLevel, updateActivityStreak, calculateActivityGems, checkAndAwardBadges } from '../gamification/gamification.service.js';
import { prisma } from "../../config/prisma.config.js";
import { timeToMinutes, getStartOfToday, getLastSevenDays, formatDateToYYYYMMDD, getCurrentMinutes } from '../../utils/date.utils.js';
import { getAllPrayerTimes, activePrayer } from '../../utils/prayerTimes.js';

export const recordPrayer = async(userId, prayerName, status, location, latitude, longitude, dateStr = null) => {
  return await prisma.$transaction(async(tx) => {
    const timings = await getAllPrayerTimes(latitude, longitude);
    const timezone = timings?.meta_timezone;
    const currentActive = activePrayer(timings);
    
    let targetDate = getStartOfToday(timezone);
    let isTodayCheck = true;
    if (dateStr) {
      const [year, month, day] = dateStr.split('-').map(Number);
      targetDate = new Date(year, month - 1, day);
      targetDate.setHours(0, 0, 0, 0);
      
      const nowStr = new Date().toLocaleString("en-US", { timeZone: timezone });
      const todayStr = formatDateToYYYYMMDD(new Date(nowStr));
      isTodayCheck = (dateStr === todayStr);
    }

    if (isTodayCheck) {
      const prayerTimesInMinutes = timeToMinutes(timings[prayerName])
      const currentMinutes = getCurrentMinutes(timezone);
      
      if (currentMinutes < prayerTimesInMinutes) {
        throw new Error("لا يمكنك تسجيل صلاة قبل موعدها!");
      }
    }

    const isOnTime = isTodayCheck && (currentActive === prayerName);

    const existingRecord = await tx.prayer.findFirst({
      where: {
        user_id: userId,
        prayer_name: prayerName,
        date: targetDate
      }
    });

    if (existingRecord) {
      const oldStatus = existingRecord.status;
      const updatedRecord = await tx.prayer.update({
        where: { id: existingRecord.id },
        data: { status, location }
      });

      let dayCompleted = false;
      let currentStreak = 0;
      let gamification = null;

      if (status === 'COMPLETED' && oldStatus !== 'COMPLETED' && oldStatus !== 'QADAA') {
        const gemsAmount = calculateActivityGems('PRAYER', { location, onTime: isOnTime });
        gamification = await handleGemsAndLevel(userId, gemsAmount, tx);
        
        const streakRecord = await updateActivityStreak(userId, 'PRAYER', tx);
        currentStreak = streakRecord.streak_count;

        // Check if Hero of the Day (5/5)
        const countToday = await tx.prayer.count({
          where: { user_id: userId, date: targetDate, status: 'COMPLETED' }
        });
        if (countToday === 5) dayCompleted = true;

        // Award Badge: فارس الفجر (Prayed Fajr on time for 7 days)
        if (prayerName === 'Fajr') {
          await checkAndAwardBadges(userId, 'فارس الفجر', async (db) => {
            const sevenDaysAgo = new Date(targetDate);
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

        // Award Badge: بطل الأسبوع (Prayer Streak hits 7 days)
        if (currentStreak >= 7) {
          await checkAndAwardBadges(userId, 'بطل الأسبوع', async () => true, tx);
        }
      } else if (status === 'QADAA' && oldStatus !== 'QADAA' && oldStatus !== 'COMPLETED') {
        const gemsAmount = calculateActivityGems('PRAYER', { location, onTime: false });
        gamification = await handleGemsAndLevel(userId, gemsAmount, tx);
      }

      const responsePayload = { 
        prayerRecord: updatedRecord, 
        dayCompleted, 
        streak: currentStreak,
        gamification
      };

      // Notify the user's connected devices to update their dashboard in real-time
      import('../../config/socket.config.js').then(({ emitToUser }) => {
         emitToUser(userId, 'dashboard_updated', responsePayload);
      }).catch(e => console.error('Failed to emit dashboard update:', e));

      return responsePayload;
    }

    const prayerRecord = await tx.prayer.create({
      data: {
        user_id: userId,
        prayer_name: prayerName,
        date: targetDate,
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
        where: { user_id: userId, date: targetDate, status: 'COMPLETED' }
      });
      if (countToday === 5) dayCompleted = true;

      // 2. Award Badge: فارس الفجر (Prayed Fajr on time for 7 days)
      if (prayerName === 'Fajr') {
        await checkAndAwardBadges(userId, 'فارس الفجر', async (db) => {
          const sevenDaysAgo = new Date(targetDate);
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

    const responsePayload = { 
      prayerRecord, 
      dayCompleted, 
      streak: currentStreak,
      gamification
    }; 
    
    // Notify the user's connected devices to update their dashboard in real-time
    import('../../config/socket.config.js').then(({ emitToUser }) => {
       emitToUser(userId, 'dashboard_updated', responsePayload);
    }).catch(e => console.error('Failed to emit dashboard update:', e));

    return responsePayload;
  })
}

export const MissedPrayers = async(userId, latitude, longitude, tx = null) => {
  const db = tx || prisma;
  const timings = await getAllPrayerTimes(latitude, longitude);
  const timezone = timings?.meta_timezone;
  const currentActive = activePrayer(timings);
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const currentIndex = prayers.indexOf(currentActive);
  const currentTime = getCurrentMinutes(timezone);
  const fajrTime = timeToMinutes(timings.Fajr);


  let pastPrayers = [];
  if (currentTime >= fajrTime) {
    pastPrayers = prayers.slice(0, currentIndex);
  }

  const today = getStartOfToday(timezone);

  await db.prayer.deleteMany({
    where: {
      user_id: userId,
      date: today,
      status: "MISSED",
      prayer_name: { notIn: pastPrayers }
    }
  });

  const recordedPrayers = await db.prayer.findMany({
    where: {user_id: userId, date: today}
  });

  const recordedPrayerNames = new Set(recordedPrayers.map(p => p.prayer_name));

  // Get user registration timestamp
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { created_at: true }
  });
  const userCreatedAt = user?.created_at || new Date();

  // Filter missed prayers so we only mark them missed if the prayer time today is after the registration time
  const missedPrayers = pastPrayers.filter(p => {
    if (recordedPrayerNames.has(p)) return false;
    if (!timings || !timings[p]) return true;

    const [pHour, pMin] = timings[p].split(':').map(Number);
    const prayerTimeToday = new Date(today);
    prayerTimeToday.setHours(pHour, pMin, 0, 0);

    return prayerTimeToday >= userCreatedAt;
  });

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
  const timings = await getAllPrayerTimes(latitude, longitude);
  const timezone = timings?.meta_timezone;

  const today = getStartOfToday(timezone);
  const sevenDays = getLastSevenDays(timezone);
  const sevenDaysAgo = sevenDays[0];

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { created_at: true }
  });
  const userCreatedAt = user?.created_at || new Date();

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
      const record = prayers.find(p => formatDateToYYYYMMDD(p.date) === dateKey && p.prayer_name === name);
      if (record) {
        weeklyGrid[dateKey][name] = { status: record.status, location: record.location };
      } else {
        let isBeforeReg = false;
        if (timings && timings[name]) {
          const [pHour, pMin] = timings[name].split(':').map(Number);
          const prayerTime = new Date(d);
          prayerTime.setHours(pHour, pMin, 0, 0);
          if (prayerTime < userCreatedAt) {
            isBeforeReg = true;
          }
        } else {
          const dateOnly = new Date(d);
          dateOnly.setHours(0,0,0,0);
          const regDateOnly = new Date(userCreatedAt);
          regDateOnly.setHours(0,0,0,0);
          if (dateOnly < regDateOnly) {
            isBeforeReg = true;
          }
        }

        weeklyGrid[dateKey][name] = { status: isBeforeReg ? 'BEFORE_REGISTRATION' : 'PENDING' };
      }
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

  const currentMinutes = getCurrentMinutes(timezone);
  
  const completedPrayers = new Set(todaysRecords.filter(p => p.status === 'COMPLETED' || p.status === 'QADAA').map(p => p.prayer_name));

  let nextPrayer = null;
  for (const name of prayerNames) {
    if (completedPrayers.has(name)) {
      continue;
    }

    if (timeToMinutes(timings[name]) + 10 > currentMinutes) {
      nextPrayer = {
        name,
        time: timings[name],
        remainingMinutes: timeToMinutes(timings[name]) - currentMinutes
      };
      break;
    }
  }

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
