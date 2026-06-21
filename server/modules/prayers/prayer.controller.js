import { recordPrayer, getPrayerDashboardData, MissedPrayers } from './prayer.service.js';
import { getAllPrayerTimes } from '../../utils/prayerTimes.js';
import { scheduleDailyReminders } from './notification.service.js';

export const recordPrayerHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { prayerName, status, location, latitude, longitude, dateStr } = req.body;

    if (!prayerName || !status || !latitude || !longitude) {
      return res.status(400).json({ message: "يرجى توفير جميع البيانات المطلوبة (prayerName, status, latitude, longitude)" });
    }

    const result = await recordPrayer(userId, prayerName, status, location, latitude, longitude, dateStr);

    res.status(200).json({
      message: "تم تسجيل الصلاة بنجاح!",
      data: result
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "حدث خطأ أثناء تسجيل الصلاة." });
  }
};

export const getDashboardHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "يرجى توفير خطوط الطول والعرض في الـ Query Parameters (latitude, longitude)" });
    }

    await MissedPrayers(userId, parseFloat(latitude), parseFloat(longitude));

    const dashboardData = await getPrayerDashboardData(userId, parseFloat(latitude), parseFloat(longitude));

    // Schedule daily reminders for this user
    const timings = await getAllPrayerTimes(parseFloat(latitude), parseFloat(longitude));
    if (timings) {
      scheduleDailyReminders(timings, userId).catch(e => console.error(`Failed to schedule reminders for user ${userId}:`, e));
    }

    res.status(200).json({
      message: "تم جلب بيانات الصلاة بنجاح!",
      data: dashboardData
    });
  } catch (error) {
    console.error("Error in getDashboardHandler:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات الصلاة." });
  }
};
