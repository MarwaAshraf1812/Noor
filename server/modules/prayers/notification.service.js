import schedule from 'node-schedule';
import { prisma } from '../../config/prisma.config.js';
import { getStartOfToday } from '../../utils/date.utils.js';

import { emitToUser } from '../../config/socket.config.js';
import { sendFCMNotification } from '../../config/firebase.config.js';

// Unified dual notification function
const sendPushNotification = async (userId, title, message) => {
  // 1. Send via Socket.io for Real-Time UI updates (if user is currently using the app)
  emitToUser(userId, 'new_notification', { title, message, timestamp: new Date() });
  
  // 2. Send via Firebase for Push Notifications (Background)
  // To do this for real, you'd fetch the user's FCM token from DB
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user && user.fcm_token) {
    await sendFCMNotification(user.fcm_token, title, message);
  } else {
    // console.log(`[FCM Mock]: User ${userId} has no fcm_token. Skipping Push.`);
  }

  console.log(`\n🔔 [DUAL NOTIFICATION - User ${userId}]: ${message}\n`);
};

const getPrayerDate = (timings) => {
  const [hours, minutes] = timings.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

const scheduledJobs = {}; // { userId: { pre: [Job], post: [Job] } }

export const cancelUserReminders = (userId) => {
  if (scheduledJobs[userId]) {
    scheduledJobs[userId].pre.forEach(job => { if (job) job.cancel() });
    scheduledJobs[userId].post.forEach(job => { if (job) job.cancel() });
    delete scheduledJobs[userId];
  }
}

export const scheduleDailyReminders = async (prayerTimings, userId) => {
  const today = getStartOfToday();
  
  // Cancel existing jobs for this user to prevent duplicates
  cancelUserReminders(userId);
  scheduledJobs[userId] = { pre: [], post: [] };
 
  Object.entries(prayerTimings).forEach(([prayerName, timings]) => {
     const prayerTime = getPrayerDate(timings);
 
     // 1. Pre-prayer alert (5 minutes before)
     const preTime  = new Date(prayerTime.getTime() - 5 * 60 * 1000);
     if(preTime > new Date()) {
       const preJob = schedule.scheduleJob(preTime, () => {
         sendPushNotification(userId, 'حان وقت الصلاة!', `استعد للوضوء يا بطل، صلاة ${prayerName} اقتربت! 💧`);
       });
       if (preJob) scheduledJobs[userId].pre.push(preJob);
     }
 
     // 2. Post-prayer check (10 minutes after)
     const postTime = new Date(prayerTime.getTime() + 10 * 60 * 1000);
     if(postTime > new Date()) {
       const postJob = schedule.scheduleJob(postTime, async () => {
         const hasPrayed = await prisma.prayer.findFirst({
           where: {
             user_id: userId,
             prayer_name: prayerName,
             date: today,
             status: { in: ['COMPLETED', 'QADAA'] }
           }
         });
         
         if (!hasPrayed) {
           sendPushNotification(userId, 'سؤال سريع', `هل صليت ${prayerName} يا بطل؟ 🕌`);
         } else {
            console.log(`✅ User ${userId} already prayed ${prayerName}. No post-notification sent.`);
         }
       });
       if (postJob) scheduledJobs[userId].post.push(postJob);
     }
  }); 
}