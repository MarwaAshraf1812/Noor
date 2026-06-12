import React, { useEffect, useState } from 'react';
import useTasbihStore from '../../../store/tasbihStore';
import TasbihCircle from './TasbihCircle';
import { playPopSound, playChimeSound } from '../../../utils/audio';
import { spawnFlyingGems } from '../../../utils/effects';

export default function TasbihCard() {
  const { dashboardData, fetchDashboard, submitSession } = useTasbihStore();

  const [localCounts, setLocalCounts] = useState({
    "الله أكبر": 0,
    "سبحان الله": 0,
    "الحمدلله": 0
  });

  useEffect(() => {
    fetchDashboard().catch(e => console.error(e));
  }, [fetchDashboard]);

  useEffect(() => {
    if (dashboardData?.todayProgress) {
      setLocalCounts({
        "الله أكبر": dashboardData.todayProgress["الله أكبر"] || 0,
        "سبحان الله": dashboardData.todayProgress["سبحان الله"] || 0,
        "الحمدلله": dashboardData.todayProgress["الحمدلله"] || 0
      });
    }
  }, [dashboardData]);

  const handleIncrement = async (displayName, dbName, event) => {
    const currentCount = localCounts[dbName] || 0;
    const newCount = currentCount + 1;
    const isCompleted = newCount > 0 && newCount % 33 === 0;

    if (isCompleted) {
      playChimeSound();
      if (event?.currentTarget) {
        spawnFlyingGems(event.currentTarget);
      }
    } else {
      playPopSound();
    }

    setLocalCounts(prev => ({
      ...prev,
      [dbName]: newCount
    }));

    try {
      await submitSession(dbName, 1, isCompleted);
    } catch (err) {
      console.error('Failed to submit tasbih increment:', err);
      setLocalCounts(prev => ({
        ...prev,
        [dbName]: currentCount
      }));
    }
  };

  return (
    <div className="w-full p-3.5 xs:p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-[#A2E057] to-[#6BA82D] shadow-lg shadow-[#A2E057]/15 flex flex-col gap-3 sm:gap-4 select-none transition-all duration-300 ease-out hover:scale-[1.015] hover:shadow-xl hover:shadow-[#A2E057]/25" dir="rtl">
      
      <h4 className="text-sm xs:text-base sm:text-xl font-black text-white text-center flex items-center justify-center gap-1 sm:gap-1.5">
        هيا بنا نجمع حسنات بالذكر! <span className="text-[#FFE54D] animate-pulse">✨</span>
      </h4>

      <div className="grid grid-cols-3 gap-1.5 xs:gap-3 sm:gap-4 w-full justify-items-center mt-1 sm:mt-2">
        <TasbihCircle 
          displayName="الله اكبر" 
          count={localCounts["الله أكبر"]}
          target={33}
          trackColor="#FCD34D30"
          strokeColor="#FBC02D"
          textColor="#B45309"
          onClick={(e) => handleIncrement("الله اكبر", "الله أكبر", e)}
        />

        <TasbihCircle 
          displayName="سبحان الله" 
          count={localCounts["سبحان الله"]}
          target={33}
          trackColor="#3B82F630"
          strokeColor="#3B82F6"
          textColor="#1D4ED8"
          onClick={(e) => handleIncrement("سبحان الله", "سبحان الله", e)}
        />

        <TasbihCircle 
          displayName="الحمد لله" 
          count={localCounts["الحمدلله"]}
          target={33}
          trackColor="#4ADE8030"
          strokeColor="#22C55E"
          textColor="#15803D"
          onClick={(e) => handleIncrement("الحمد لله", "الحمدلله", e)}
        />
      </div>

    </div>
  );
}