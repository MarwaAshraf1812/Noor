import React, { useState, useEffect } from 'react';
import usePrayerStore from '../../../store/prayerStore';
import DiamondProgress from '../../UI/DiamondProgress';
import PrayerAction from './PrayerAction';
import PrayerMascot from './PrayerMascot';
import TiltCard from '../../UI/TiltCard';
import { spawnFlyingGems } from '../../../utils/effects';

const prayerNamesAr = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء'
};

export default function PrayerCard() {
  const { dashboardData, fetchDashboard, recordPrayer, loading } = usePrayerStore();
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const [countdownText, setCountdownText] = useState('');
  const [isGracePeriod, setIsGracePeriod] = useState(false);

  const completedCount = dashboardData?.completedCount ?? 0;
  const nextPrayer = dashboardData?.nextPrayer;
  const nextPrayerNameAr = nextPrayer ? (prayerNamesAr[nextPrayer.name] || nextPrayer.name) : '';

  useEffect(() => {
    if (!dashboardData) {
      fetchDashboard().catch(e => console.error(e));
    }
  }, [dashboardData, fetchDashboard]);

  const getDynamicTip = () => {
    if (!dashboardData) return "جاري التحميل يا بطل...";
    if (completedCount === 5) {
      return "مذهل! لقد صليت كل الصلوات الخمس اليوم، أنت بطل حقيقي ومستعد لمغامرات الغد! 🏆🌟";
    }

    const timeline = dashboardData.todayTimeline || {};
    const prayersOrdered = ['Isha', 'Maghrib', 'Asr', 'Dhuhr', 'Fajr'];
    let lastCompleted = null;
    for (const key of prayersOrdered) {
      if (timeline[key]?.status === 'COMPLETED') {
        lastCompleted = { key, ...timeline[key] };
        break;
      }
    }

    if (lastCompleted) {
      const nameAr = prayerNamesAr[lastCompleted.key];
      let locAr = 'المنزل بمفردك';
      let gems = 10;
      if (lastCompleted.location === 'MOSQUE') {
        locAr = 'المسجد 🕌';
        gems = 20;
      } else if (lastCompleted.location === 'CONGREGATION') {
        locAr = 'البيت جماعة 👨‍👩‍👦';
        gems = 15;
      }
      
      if (isGracePeriod) {
        return `حان الآن موعد صلاة ${nextPrayerNameAr}! هيا لنتوضأ ونصلي جماعة 🕌✨`;
      }
      return `ما شاء الله! صلاتك ${nameAr} في ${locAr} منحتك ${gems} جوهرة إضافية! 💎✨`;
    }

    if (isGracePeriod) {
      return `حان الآن موعد صلاة ${nextPrayerNameAr}! هيا لنتوضأ ونصلي جماعة 🕌✨`;
    }
    if (nextPrayerNameAr) {
      return `هيا يا بطل، اقترب أذان ${nextPrayerNameAr}! هل أنت مستعد للذهاب للمسجد؟ 🕌`;
    }
    return "الصلاة هي صلتك بالله سبحانه وتعالى، حافظ عليها لتسعد! ✨";
  };

  useEffect(() => {
    if (!nextPrayer) return;

    const serverFetchedAt = Date.now();
    const targetTimestamp = serverFetchedAt + nextPrayer.remainingMinutes * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diffMs = targetTimestamp - now;

      if (diffMs > 0) {
        setIsGracePeriod(false);
        const diffSecs = Math.floor(diffMs / 1000);
        const hours = Math.floor(diffSecs / 3600);
        const mins = Math.floor((diffSecs % 3600) / 60);
        const secs = diffSecs % 60;

        const pad = (n) => String(n).padStart(2, '0');
        if (hours > 0) {
          setCountdownText(`${pad(hours)}:${pad(mins)}:${pad(secs)}`);
        } else {
          setCountdownText(`${pad(mins)}:${pad(secs)}`);
        }
      } else {
        const graceLimitMs = targetTimestamp + 10 * 60 * 1000;
        const graceDiffMs = graceLimitMs - now;

        if (graceDiffMs > 0) {
          setIsGracePeriod(true);
          const diffSecs = Math.floor(graceDiffMs / 1000);
          const mins = Math.floor(diffSecs / 60);
          const secs = diffSecs % 60;
          const pad = (n) => String(n).padStart(2, '0');
          setCountdownText(`${pad(mins)}:${pad(secs)}`);
        } else {
          setIsGracePeriod(false);
          setCountdownText('00:00');
          fetchDashboard().catch(e => console.error(e));
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer, fetchDashboard]);

  const handleRecord = async (location, event) => {
    if (!nextPrayer) return;
    try {
      if (event?.currentTarget) {
        spawnFlyingGems(event.currentTarget, 10);
      }
      await recordPrayer(nextPrayer.name, 'COMPLETED', location);
      setShowLocationSelect(false);
    } catch (err) {
      console.error('Failed to record prayer:', err);
      alert(err.response?.data?.message || err.message || 'حدث خطأ ما');
    }
  };

  return (
    <TiltCard className="w-full rounded-[24px] sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-r from-[#557AA7] to-[#ACCCF2] shadow-xl shadow-blue-100/30 flex flex-col gap-4 sm:gap-6 select-none text-white">
      
      <div className="w-full">
        <DiamondProgress />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center mt-1 sm:mt-2">
        
        <div className="w-full flex justify-center md:justify-start">
          <PrayerAction
            completedCount={completedCount}
            showLocationSelect={showLocationSelect}
            setShowLocationSelect={setShowLocationSelect}
            isGracePeriod={isGracePeriod}
            nextPrayerNameAr={nextPrayerNameAr}
            countdownText={countdownText}
            loading={loading}
            onRecord={handleRecord}
          />
        </div>

        <PrayerMascot tip={getDynamicTip()} />

      </div>

    </TiltCard>
  );
}