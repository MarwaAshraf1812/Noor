import React, { useEffect } from 'react';
import CircularProgress from '../../UI/CircularProgress';
import usePrayerStore from '../../../store/prayerStore';
import useQuranStore from '../../../store/quranStore';
import useAdhkarStore from '../../../store/adhkarStore';
import useTasbihStore from '../../../store/tasbihStore';

export default function DashboardProgress() {
  const { fetchDashboard: fetchPrayer, dashboardData: prayerData } = usePrayerStore();
  const { fetchDashboard: fetchQuran, dashboardData: quranData } = useQuranStore();
  const { fetchDashboard: fetchAdhkar, dashboardData: adhkarData } = useAdhkarStore();
  const { fetchDashboard: fetchTasbih, dashboardData: tasbihData } = useTasbihStore();

  useEffect(() => {
    fetchPrayer().catch(e => console.error(e));
    fetchQuran().catch(e => console.error(e));
    fetchAdhkar().catch(e => console.error(e));
    fetchTasbih().catch(e => console.error(e));
  }, [fetchPrayer, fetchQuran, fetchAdhkar, fetchTasbih]);

  const prayerPercentage = prayerData?.dailyProgress ?? 0;
  const prayerSublabel = `${prayerData?.completedCount ?? 0} من 5`;

  const status = adhkarData?.todayStatus || {};
  const completedAdhkar = [status.MORNING, status.NIGHT || status.EVENING, status.SLEEP].filter(Boolean).length;
  const adhkarPercentage = Math.round((completedAdhkar / 3) * 100);
  const adhkarSublabel = `${adhkarPercentage}%`;

  const hifzProgress = quranData?.analytics?.todayHifz?.progress ?? 0;
  const revisionProgress = quranData?.analytics?.todayRevision?.progress ?? 0;
  const targetsCount = (quranData?.analytics?.todayHifz?.target ? 1 : 0) + (quranData?.analytics?.todayRevision?.target ? 1 : 0);
  const quranPercentage = targetsCount > 0
    ? Math.round((hifzProgress + revisionProgress) / targetsCount)
    : (hifzProgress || revisionProgress || 0);
  const quranSublabel = `${quranPercentage}%`;

  const tasbihProgress = tasbihData?.todayProgress || {};
  const count1 = Math.min(tasbihProgress["الله أكبر"] || 0, 33);
  const count2 = Math.min(tasbihProgress["سبحان الله"] || 0, 33);
  const count3 = Math.min(tasbihProgress["الحمدلله"] || 0, 33);
  const totalTasbihCount = count1 + count2 + count3;
  const tasbihPercentage = Math.round((totalTasbihCount / 99) * 100);
  const tasbihSublabel = `${totalTasbihCount} من 99`;

  const overallPercentage = Math.round((prayerPercentage + adhkarPercentage + quranPercentage + tasbihPercentage) / 4);
  const overallSublabel = `${overallPercentage}%`;

  return (
    <div className="w-full flex justify-center items-center py-0.5 sm:py-2 select-none" dir="rtl">
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-2 sm:gap-6 px-2 justify-items-center">
        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={prayerPercentage}
            color="#3b82f6"
            trailColor="#3b82f6"
            label="الصلوات"
            sublabel={prayerSublabel}
            size="w-24 h-24 min-[390px]:w-28 min-[390px]:h-28 sm:w-28 sm:h-28 md:w-32 md:h-32"
          />
          {prayerPercentage === 100 && (
            <span className="mt-2 text-[10px] sm:text-xs font-black text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-full select-none">
              تم! 🎉
            </span>
          )}
        </div>

        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={adhkarPercentage}
            color="#84cc16"
            trailColor="#84cc16"
            label="الأذكار"
            sublabel={adhkarSublabel}
            size="w-24 h-24 min-[390px]:w-28 min-[390px]:h-28 sm:w-28 sm:h-28 md:w-32 md:h-32"
          />
          {adhkarPercentage === 100 && (
            <span className="mt-2 text-[10px] sm:text-xs font-black text-lime-600 bg-lime-50/80 px-2 py-0.5 rounded-full select-none">
              تم! 🎉
            </span>
          )}
        </div>

        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={quranPercentage}
            color="#eab308"
            trailColor="#eab308"
            label="الآيات"
            sublabel={quranSublabel}
            size="w-24 h-24 min-[390px]:w-28 min-[390px]:h-28 sm:w-28 sm:h-28 md:w-32 md:h-32"
          />
          {quranPercentage === 100 && (
            <span className="mt-2 text-[10px] sm:text-xs font-black text-yellow-600 bg-yellow-50/80 px-2 py-0.5 rounded-full select-none">
              تم! 🎉
            </span>
          )}
        </div>

        <div className="flex flex-col items-center">
          <CircularProgress
            percentage={overallPercentage}
            color="#f97316"
            trailColor="#f97316"
            label="اليوم"
            sublabel={overallSublabel}
            size="w-24 h-24 min-[390px]:w-28 min-[390px]:h-28 sm:w-28 sm:h-28 md:w-32 md:h-32"
          />
          {overallPercentage === 100 && (
            <span className="mt-2 text-[10px] sm:text-xs font-black text-orange-600 bg-orange-50/80 px-2 py-0.5 rounded-full select-none animate-pulse">
              بطل! 🏆
            </span>
          )}
        </div>

      </div>
    </div>
  );
}