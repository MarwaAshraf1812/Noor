import React, { useState, useEffect, useCallback, useMemo } from 'react';
import usePrayerStore from '../../../store/prayerStore';
import useAuthStore from '../../../store/authStore';
import { playPopSound, playChimeSound } from '../../../utils/audio';
import { spawnFlyingGems } from '../../../utils/effects';

import HeroCard from './HeroCard';
import WeeklyGrid from './WeeklyGrid';
import AchievementsCard from './AchievementsCard';
import PrayerLogModal from './PrayerLogModal';

import standingMascot from '../../../assets/noor_avatar_bye_1.png';

const getLocalDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function PrayerSection() {
  const { dashboardData, fetchDashboard, recordPrayer } = usePrayerStore();
  const { user } = useAuthStore();
  
  const [showLogModal, setShowLogModal] = useState(false);
  const [activePrayerToLog, setActivePrayerToLog] = useState(null);

  useEffect(() => {
    fetchDashboard().catch((err) => console.error('Error fetching dashboard:', err));
  }, [fetchDashboard]);

  const todayStr = useMemo(() => getLocalDateString(new Date()), []);

  const weeklyDataMapped = useMemo(() => {
    if (!dashboardData?.weeklyGrid) return {};
    
    const mapped = {};
    Object.entries(dashboardData.weeklyGrid).forEach(([dateStr, prayers]) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      const dayIndex = dateObj.getDay();
      
      mapped[dayIndex] = {
        dateStr,
        prayers,
        isToday: dateStr === todayStr
      };
    });
    return mapped;
  }, [dashboardData?.weeklyGrid, todayStr]);

  const completedCount = dashboardData?.completedCount ?? 0;
  const weeklyCompletedCount = dashboardData?.weeklyCompletedCount ?? 0;
  const achievements = dashboardData?.achievements ?? [];

  const heroOfTodayMessage = useMemo(() => {
    if (completedCount === 5) return 'أنت بطل اليوم! 🎉';
    if (completedCount === 4) return 'باقي صلاة واحدة لبطل اليوم ⭐';
    if (completedCount === 3) return 'باقي صلاتين لبطل اليوم ⭐';
    return `باقي ${5 - completedCount} صلوات لبطل اليوم ⭐`;
  }, [completedCount]);

  const handleCellClick = useCallback((cellInfo) => {
    setActivePrayerToLog(cellInfo);
    setShowLogModal(true);
  }, []);

  const handleRecord = useCallback(async (selectedLocation, isMissedAction = false, clickEvent = null) => {
    if (!activePrayerToLog) return;
    const { prayerName, dateStr } = activePrayerToLog;

    const statusToRecord = isMissedAction ? 'MISSED' : 'COMPLETED';

    try {
      if (clickEvent?.currentTarget && !isMissedAction) {
        spawnFlyingGems(clickEvent.currentTarget, 12);
      }

      if (isMissedAction) {
        playPopSound(300);
      } else {
        playChimeSound();
      }

      await recordPrayer(prayerName, statusToRecord, selectedLocation, dateStr);
      setShowLogModal(false);
    } catch (err) {
      console.error('Failed to record prayer:', err);
      alert(err.response?.data?.message || err.message || 'حدث خطأ ما');
    }
  }, [activePrayerToLog, recordPrayer]);

  const handleCloseModal = useCallback(() => {
    setShowLogModal(false);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-6 mt-1 sm:mt-2 relative select-none" dir="rtl">
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.01); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
      `}</style>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          <HeroCard completedCount={completedCount} heroOfTodayMessage={heroOfTodayMessage} />

          <WeeklyGrid 
            weeklyCompletedCount={weeklyCompletedCount}
            weeklyDataMapped={weeklyDataMapped}
            todayStr={todayStr}
            nextPrayer={dashboardData?.nextPrayer}
            onCellClick={handleCellClick}
          />

        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 items-center">
          
          <AchievementsCard achievements={achievements} />

          <div className="w-full flex justify-center mt-2">
            <img 
              src={standingMascot} 
              alt="نور بطل صلاتي" 
              className="w-48 sm:w-60 h-auto object-contain select-none animate-float filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.06)]"
            />
          </div>

        </div>

      </div>

      <PrayerLogModal 
        isOpen={showLogModal}
        activePrayer={activePrayerToLog}
        onRecord={handleRecord}
        onClose={handleCloseModal}
      />

    </div>
  );
}