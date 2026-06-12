import React, { useEffect } from 'react';
import DiamondProgress from '../../UI/DiamondProgress';
import useQuranStore from '../../../store/quranStore';
import quranImg from '../../../assets/quran_2.png';
import blueGem from '../../../assets/blue_gem.png';
import { Check } from 'lucide-react';
import QuranBadge from './QuranBadge';

export default function QuranCard() {
  const { dashboardData, fetchDashboard, submitSession, loading } = useQuranStore();

  useEffect(() => {
    fetchDashboard().catch(e => console.error(e));
  }, [fetchDashboard]);

  const analytics = dashboardData?.analytics;
  const currentSurah = dashboardData?.currentSurah;

  const hifzTarget = analytics?.todayHifz?.target || 5;
  const currentProgress = analytics?.todayHifz?.verse_count || 0;

  const items = Array.from({ length: hifzTarget }, (_, i) => ({
    key: i + 1,
    label: (i + 1).toString(),
    isCompleted: i < currentProgress
  }));

  const handleMemorized = async () => {
    try {
      const surahName = currentSurah?.surahName || 'الفاتحة';
      await submitSession(surahName, 1, 'HIFZ');
    } catch (err) {
      console.error('Failed to record verse:', err);
      alert(err.response?.data?.error || err.message || 'حدث خطأ أثناء حفظ الآية.');
    }
  };

  return (
    <div className="w-full p-6 rounded-[32px] border-2 border-[#FFD56B] bg-[#FFFDF0] shadow-md shadow-yellow-100/20 flex flex-col gap-4 select-none transition-all duration-300 ease-out hover:scale-[1.015] hover:shadow-xl hover:shadow-yellow-100/35" dir="rtl">
      
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
          disabled={loading}
          className="w-full max-w-[280px] py-3.5 px-6 rounded-3xl bg-[#4A90E2] hover:bg-[#357ABD] text-white font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 active:scale-95 disabled:opacity-50 transition-all duration-200"
        >
          {loading ? (
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

    </div>
  );
}