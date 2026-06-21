import React, { useEffect, useState, useRef } from 'react';
import useTasbihStore from '../../../store/tasbihStore';
import TasbihCircle from './TasbihCircle';
import CelebrationModal from '../../UI/CelebrationModal';
import TiltCard from '../../UI/TiltCard';
import { playPopSound, playChimeSound } from '../../../utils/audio';
import { spawnFlyingGems } from '../../../utils/effects';

export default function TasbihCard() {
  const { dashboardData, fetchDashboard, submitSession } = useTasbihStore();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationConfig, setCelebrationConfig] = useState(null);

  const [localCounts, setLocalCounts] = useState({
    "الله أكبر": 0,
    "سبحان الله": 0,
    "الحمدلله": 0
  });

  const pendingUpdates = useRef({
    "الله أكبر": { count: 0, completed: false, timeout: null },
    "سبحان الله": { count: 0, completed: false, timeout: null },
    "الحمدلله": { count: 0, completed: false, timeout: null }
  });

  const inFlightUpdates = useRef({
    "الله أكبر": 0,
    "سبحان الله": 0,
    "الحمدلله": 0
  });

  useEffect(() => {
    fetchDashboard().catch(e => console.error(e));
  }, [fetchDashboard]);

  useEffect(() => {
    if (dashboardData?.todayProgress) {
      setLocalCounts(prev => {
        const getMergedCount = (dbName) => {
          const serverCount = dashboardData.todayProgress[dbName] || 0;
          const pendingCount = pendingUpdates.current[dbName]?.count || 0;
          const inFlightCount = inFlightUpdates.current[dbName] || 0;
          return Math.max(prev[dbName], serverCount + pendingCount + inFlightCount);
        };
        return {
          "الله أكبر": getMergedCount("الله أكبر"),
          "سبحان الله": getMergedCount("سبحان الله"),
          "الحمدلله": getMergedCount("الحمدلله")
        };
      });
    }
  }, [dashboardData]);

  useEffect(() => {
    const currentPending = pendingUpdates.current;
    return () => {
      Object.entries(currentPending).forEach(([dbName, data]) => {
        if (data.timeout) {
          clearTimeout(data.timeout);
          if (data.count > 0) {
            submitSession(dbName, data.count, data.completed).catch(e => 
              console.error('Failed to flush tasbih update on unmount:', e)
            );
          }
        }
      });
    };
  }, [submitSession]);

  const handleIncrement = (displayName, dbName, event) => {
    const currentCount = localCounts[dbName] || 0;
    const newCount = currentCount + 1;
    const isCompleted = newCount > 0 && newCount % 33 === 0;

    if (isCompleted) {
      playChimeSound();
      if (event?.currentTarget) {
        spawnFlyingGems(event.currentTarget);
      }
      setCelebrationConfig({
        badgeText: '+5 جواهر',
        title: `الحمد لله! أكملت التسبيح 📿`,
        description: `لقد أتممت 33 مرة من ذكر "${displayName}"! حافظ على رطوبة لسانك بذكر الله.`,
        stats: [
          { value: '33/33', label: displayName, color: 'text-slate-700' },
          { value: 'مستمر 🔥', label: 'الذكر اليومي', color: 'text-orange-600' },
          { value: '+30', label: 'نقاط حسنات', color: 'text-[#3b82f6]' }
        ]
      });
      setShowCelebration(true);
    } else {
      playPopSound();
    }

    setLocalCounts(prev => ({
      ...prev,
      [dbName]: newCount
    }));

    pendingUpdates.current[dbName].count += 1;
    if (isCompleted) {
      pendingUpdates.current[dbName].completed = true;
    }

    if (pendingUpdates.current[dbName].timeout) {
      clearTimeout(pendingUpdates.current[dbName].timeout);
    }

    pendingUpdates.current[dbName].timeout = setTimeout(async () => {
      const { count, completed } = pendingUpdates.current[dbName];
      pendingUpdates.current[dbName] = { count: 0, completed: false, timeout: null };

      inFlightUpdates.current[dbName] += count;

      try {
        await submitSession(dbName, count, completed);
      } catch (err) {
        console.error('Failed to submit tasbih increment:', err);
        setLocalCounts(prev => ({
          ...prev,
          [dbName]: Math.max(0, prev[dbName] - count)
        }));
      } finally {
        inFlightUpdates.current[dbName] = Math.max(0, inFlightUpdates.current[dbName] - count);
      }
    }, 1500);
  };

  return (
    <TiltCard className="w-full p-3.5 xs:p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-[#A2E057] to-[#6BA82D] shadow-lg shadow-[#A2E057]/15 flex flex-col gap-3 sm:gap-4 select-none">
      
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

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        {...celebrationConfig}
      />

    </TiltCard>
  );
}