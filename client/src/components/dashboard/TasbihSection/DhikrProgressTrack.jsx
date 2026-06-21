import React from 'react';
import { Sparkles } from 'lucide-react';

export default function DhikrProgressTrack({ totalTasbihToday, dailyTotalGoal, progressPercentage, theme }) {
  const fillColor = theme?.strokeColor || '#3b82f6';
  const glowColor = theme?.glowColor || 'rgba(59,130,246,0.3)';

  return (
    <div className="w-full bg-white/75 backdrop-blur-sm border border-slate-100 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 shadow-sm">
      <div className="flex flex-col gap-1 text-center sm:text-right">
        <h4 className="text-lg sm:text-xl font-black text-slate-800 flex items-center justify-center sm:justify-start gap-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 animate-pulse" />
          <span>يلا نجمع حسنات و مجوهرات</span>
        </h4>
        <p className="text-xs sm:text-sm font-extrabold text-slate-400">
6          تقدمك اليوم: <span className="font-black" style={{ color: fillColor }}>{totalTasbihToday}</span> / {dailyTotalGoal} تسبيحة 🌟
        </p>
      </div>

      <div className="w-full sm:flex-1 max-w-sm h-6 sm:h-7 bg-slate-100 rounded-full relative overflow-visible border border-slate-200/50">
        <div
          className="h-full rounded-full transition-all duration-500 relative"
          style={{
            width: `${progressPercentage}%`,
            background: `linear-gradient(to right, ${fillColor}cc, ${fillColor})`,
            boxShadow: progressPercentage > 5 ? `0 0 10px 1px ${glowColor}` : 'none',
          }}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-amber-400 hover:bg-amber-500 rounded-full flex items-center justify-center border-2 border-white shadow-md cursor-pointer animate-bounce">
            <span className="text-xs sm:text-sm">⭐</span>
          </div>
        </div>
        <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-black text-[9px] sm:text-xs transition-colors duration-300 ${
          progressPercentage > 15 ? 'text-white' : 'text-slate-500'
        }`}>
          {progressPercentage}%
        </span>
      </div>
    </div>
  );
}

