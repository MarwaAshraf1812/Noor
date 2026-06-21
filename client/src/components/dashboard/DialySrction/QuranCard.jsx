import React, { useState, useEffect } from 'react';
import DiamondProgress from '../../UI/DiamondProgress';
import useQuranStore from '../../../store/quranStore';
import CelebrationModal from '../../UI/CelebrationModal';
import TiltCard from '../../UI/TiltCard';
import quranImg from '../../../assets/quran_2.png';
import blueGem from '../../../assets/blue_gem.png';
import { Check } from 'lucide-react';
import QuranBadge from './QuranBadge';

export default function QuranCard() {
  const { dashboardData, fetchDashboard, submitSession } = useQuranStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationConfig, setCelebrationConfig] = useState(null);

  useEffect(() => {
    fetchDashboard().catch(e => console.error(e));
  }, [fetchDashboard]);

  const analytics = dashboardData?.analytics;
  const currentSurah = dashboardData?.currentSurah;

  const hifzTarget = analytics?.todayHifz?.target || 5;
  const currentProgress = analytics?.todayHifz?.verse_count || 0;

  useEffect(() => {
    if (currentProgress > 0 && currentProgress >= hifzTarget) {
      const todayStr = new Date().toISOString().split('T')[0];
      const key = `noor_quran_celebrated_${todayStr}`;
      const alreadyShown = localStorage.getItem(key);
      if (!alreadyShown) {
        setCelebrationConfig({
          badgeText: '+10 جواهر',
          title: 'أحسنت يا بطل القرآن! 📖',
          description: `لقد حققت هدف اليوم بحفظ ${hifzTarget} آيات كريمة من كتاب الله!`,
          stats: [
            { value: `${currentProgress}/${hifzTarget}`, label: 'آيات اليوم', color: 'text-slate-700' },
            { value: 'متواصل 🔥', label: 'الاستمرار', color: 'text-orange-600' },
            { value: '+100', label: 'نقطة خبرة', color: 'text-[#3b82f6]' }
          ]
        });
        setShowCelebration(true);
        localStorage.setItem(key, 'true');
      }
    }
  }, [currentProgress, hifzTarget]);

  const maxVisible = 5;
  let items = [];

  if (hifzTarget <= maxVisible) {
    items = Array.from({ length: hifzTarget }, (_, i) => ({
      key: i + 1,
      label: (i + 1).toString(),
      isCompleted: i < currentProgress
    }));
  } else {
    // Determine the window start position to center the current progress
    const startItem = Math.max(1, Math.min(currentProgress - 1, hifzTarget - maxVisible + 1));
    items = Array.from({ length: maxVisible }, (_, idx) => {
      const itemNum = startItem + idx;
      return {
        key: itemNum,
        label: itemNum.toString(),
        isCompleted: itemNum <= currentProgress
      };
    });
  }

  const handleMemorized = async () => {
    try {
      setIsSubmitting(true);
      const surahName = currentSurah?.surahName || 'الفاتحة';
      await submitSession(surahName, 1, 'HIFZ');
    } catch (err) {
      console.error('Failed to record verse:', err);
      alert(err.response?.data?.error || err.message || 'حدث خطأ أثناء حفظ الآية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TiltCard className="w-full p-6 rounded-[32px] border-2 border-[#FFD56B] bg-[#FFFDF0] shadow-md shadow-yellow-100/20 flex flex-col gap-4 select-none">
      
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <h4 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-1.5">
            هيا بنا نحفظ آيه جديده <span className="text-yellow-500 animate-pulse">✨</span>
          </h4>
          <p className="text-sm sm:text-base font-extrabold text-[#3a86c8]">
            هدف اليوم: <span className="font-black underline underline-offset-4">{hifzTarget} آيات</span>
          </p>
        </div>

        <QuranBadge />
      </div>

      <div className="w-full border-t border-[#D5E6F6]" />

      <div className="w-full px-2">
        <DiamondProgress 
          items={items} 
          gemImg={blueGem} 
          textColor="text-slate-500" 
          lineColor="bg-[#A0D568]" 
        />
      </div>

      <div className="flex justify-center mt-2">
        <button
          onClick={handleMemorized}
          disabled={isSubmitting}
          className="w-full max-w-[280px] py-3.5 px-6 rounded-3xl bg-[#4A90E2] hover:bg-[#357ABD] text-white font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 active:scale-95 disabled:opacity-50 transition-all duration-200"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-4.5 h-4.5 text-white" strokeWidth={3.5} />
              </div>
              <span>حفظت أيه</span>
            </>
          )}
        </button>
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        {...celebrationConfig}
      />

    </TiltCard>
  );
}