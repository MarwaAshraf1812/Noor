import axios from "axios";
import { formatDateToYYYYMMDD, getCurrentMinutes, timeToMinutes } from './date.utils.js';

let cachedPrayerTimes = null;
let lastFetchedDate = null;

export const getAllPrayerTimes = async (latitude, longitude) => {
  const today = formatDateToYYYYMMDD(new Date());

  if (lastFetchedDate === today && cachedPrayerTimes) {
    return cachedPrayerTimes;
  }

  let attempts = 3;
  while (attempts > 0) {
    try {
      const response = await axios.get(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=5`, { timeout: 5000 });

      const allTimings = response.data.data.timings;
      const { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha } = allTimings;

      lastFetchedDate = today;
      cachedPrayerTimes = { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha };
      return cachedPrayerTimes;
    } catch (error) {
      attempts--;
      console.warn(`Aladhan API attempt failed (${3 - attempts}/3). Error: ${error.message}`);
      
      if (attempts === 0) {
        console.error("Aladhan API totally failed. Using default fallback timings.");
        // Fallback to default timings so the app stays functional
        return DEFAULT_TIMINGS;
      }
      // Wait 1s before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export const getCachedPrayerTimes = async () => {
  const currentDate = formatDateToYYYYMMDD(new Date());

  if (lastFetchedDate === currentDate) {
    return cachedPrayerTimes;
  } else {
    return null;
  }
}

export const activePrayer = (timings) => {
  const currentTime = getCurrentMinutes();
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
