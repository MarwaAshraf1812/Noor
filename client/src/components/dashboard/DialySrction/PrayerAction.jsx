import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function PrayerAction({
  completedCount,
  showLocationSelect,
  setShowLocationSelect,
  isGracePeriod,
  nextPrayerNameAr,
  countdownText,
  loading,
  onRecord
}) {
  if (completedCount === 5) {
    return (
      <div className="w-full max-w-[320px] bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xl shadow-blue-900/10 text-slate-800 flex flex-col items-center gap-3 sm:gap-4 text-center transition-all duration-300">
        <div className="py-2 sm:py-4 flex flex-col items-center gap-2">
          <span className="text-3xl sm:text-4xl animate-bounce">🏆</span>
          <h4 className="text-base sm:text-lg font-black text-slate-800">أحسنت يا بطل! 🌟</h4>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">
            لقد حافظت على جميع صلواتك اليوم وجمعت كل الجواهر! 💎
          </p>
        </div>
      </div>
    );
  }

  if (!showLocationSelect) {
    return (
      <div className="w-full max-w-[320px] bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xl shadow-blue-900/10 text-slate-800 flex flex-col items-center gap-3 sm:gap-4 text-center transition-all duration-300">
        {isGracePeriod ? (
          <p className="text-rose-500 font-black text-sm sm:text-[17px] leading-relaxed max-w-[240px] animate-pulse">
            حان وقت صلاة {nextPrayerNameAr}! أسرع يا بطل لتسجيلها! ⏰
          </p>
        ) : (
          <p className="text-[#557aa7] font-black text-sm sm:text-[17px] leading-relaxed max-w-[240px]">
            تبقت خطوة واحدة ثم تاخذ جوهرة {nextPrayerNameAr}! هل مستعد؟ 💎
          </p>
        )}

        {countdownText && (
          <div className="flex flex-col items-center my-0.5 sm:my-1 select-none">
            <span className={`text-3xl sm:text-5xl font-black tracking-wide tabular-nums ${isGracePeriod ? 'text-rose-500' : 'text-[#557aa7]/95'}`}>
              {countdownText}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-extrabold mt-0.5 sm:mt-1">
              {isGracePeriod ? 'متبقي للتسجيل ⏱️' : `موعد صلاة ${nextPrayerNameAr}`}
            </span>
          </div>
        )}

        <button
          onClick={() => setShowLocationSelect(true)}
          disabled={loading || !isGracePeriod}
          className={`w-full max-w-[220px] py-3.5 sm:py-3 px-5 sm:px-6 font-black rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 shadow-sm ${
            (loading || !isGracePeriod)
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/30'
              : 'bg-[#4ba0ff] hover:bg-[#3b82f6] text-white shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
          }`}
        >
          <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${loading || !isGracePeriod ? 'text-slate-400' : 'text-white'}`} strokeWidth={3} />
          <span className="text-sm sm:text-base">صليت</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[320px] bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 shadow-xl shadow-blue-900/10 text-slate-800 flex flex-col items-center gap-3 sm:gap-4 text-center transition-all duration-300">
      <div className="w-full flex flex-col items-center gap-2 sm:gap-3 animate-fade-in">
        <h4 className="text-xs sm:text-base font-black text-slate-800">
          أين صليت صلاة <span className="text-[#3b82f6]">{nextPrayerNameAr}</span> يا بطل؟ 🤔
        </h4>

        <div className="w-full flex flex-col gap-2 justify-center mt-1 sm:mt-2">
          <button
            onClick={(e) => onRecord('MOSQUE', e)}
            className="py-3 px-3 sm:py-2.5 sm:px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-extrabold text-[11px] sm:text-sm rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 w-full"
          >
            <span>في المسجد 🕌</span>
            <span className="text-[9px] sm:text-[10px] bg-emerald-200/50 px-1.5 py-0.5 rounded-md">+20 💎</span>
          </button>

          <button
            onClick={(e) => onRecord('CONGREGATION', e)}
            className="py-3 px-3 sm:py-2.5 sm:px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-extrabold text-[11px] sm:text-sm rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 w-full"
          >
            <span>جماعة بالبيت 👨‍👩‍👦</span>
            <span className="text-[9px] sm:text-[10px] bg-blue-200/50 px-1.5 py-0.5 rounded-md">+15 💎</span>
          </button>

          <button
            onClick={(e) => onRecord('HOME', e)}
            className="py-3 px-3 sm:py-2.5 sm:px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-extrabold text-[11px] sm:text-sm rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 w-full"
          >
            <span>بمفردي 🏠</span>
            <span className="text-[9px] sm:text-[10px] bg-slate-200/50 px-1.5 py-0.5 rounded-md">+10 💎</span>
          </button>
        </div>

        <button
          onClick={() => setShowLocationSelect(false)}
          className="mt-1 sm:mt-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}
