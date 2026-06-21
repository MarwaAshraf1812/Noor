import axios from "axios";
import { formatDateToYYYYMMDD, getCurrentMinutes, timeToMinutes } from './date.utils.js';

const cachedPrayerTimes = new Map();

export const getAllPrayerTimes = async (latitude, longitude) => {
  const today = formatDateToYYYYMMDD(new Date());
  const cacheKey = `${today}-${latitude.toFixed(2)}-${longitude.toFixed(2)}`;

  if (cachedPrayerTimes.has(cacheKey)) {
    return cachedPrayerTimes.get(cacheKey);
  }

  let attempts = 3;
  while (attempts > 0) {
    try {
      const response = await axios.get(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=5`, { timeout: 5000 });

      const allTimings = response.data.data.timings;
      const timezone = response.data.data.meta.timezone;
      const { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha } = allTimings;

      const timings = { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, meta_timezone: timezone };
      cachedPrayerTimes.set(cacheKey, timings);
      return timings;
    } catch (error) {
      attempts--;
      console.warn(`Aladhan API attempt failed (${3 - attempts}/3). Error: ${error.message}`);
      
      if (attempts === 0) {
        console.error("Aladhan API totally failed. Using default fallback timings.");
        // Fallback to default timings so the app stays functional
        return null;
      }
      // Wait 1s before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export const getCachedPrayerTimes = async (latitude, longitude) => {
  const today = formatDateToYYYYMMDD(new Date());
  const cacheKey = `${today}-${latitude.toFixed(2)}-${longitude.toFixed(2)}`;
  
  return cachedPrayerTimes.get(cacheKey) || null;
}

export const activePrayer = (timings) => {
  const currentTime = getCurrentMinutes(timings.meta_timezone);
  const {Fajr, Dhuhr, Asr, Maghrib, Isha} = timings;

  const fajr = timeToMinutes(Fajr);
  const dhuhr = timeToMinutes(Dhuhr);
  const asr = timeToMinutes(Asr);
  const maghrib = timeToMinutes(Maghrib);
  const isha = timeToMinutes(Isha);

  if (currentTime >= fajr && currentTime < dhuhr) return 'Fajr';
  if (currentTime >= dhuhr && currentTime < asr) return 'Dhuhr';
  if (currentTime >= asr && currentTime < maghrib) return 'Asr';
  if (currentTime >= maghrib && currentTime < isha) return 'Maghrib';
  return 'Isha';
}
