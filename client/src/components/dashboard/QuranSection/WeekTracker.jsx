import React from 'react';
import { Trophy, Check } from 'lucide-react';

export default function WeekTracker({
  user,
  weekDays,
  handleDayClick,
  handleOpenLog
}) {
  return (
    <div className="w-full bg-gradient-to-br from-[#A8E45C] to-[#7CB342] rounded-[36px] p-6 sm:p-8 shadow-lg shadow-[#A8E45C]/15 relative overflow-hidden flex flex-col items-center select-none" dir="rtl">
      
      {}
      <div className="text-center text-white z-10 flex flex-col items-center">
        <h3 className="text-lg sm:text-2xl font-black flex items-center gap-2 drop-shadow-sm">
          <span>📦</span> أسبوع القرآن
        </h3>
        <p className="text-xs sm:text-base font-extrabold text-white/95 mt-2 max-w-md leading-relaxed">
          أهلاً بك يا <span className="font-black underline underline-offset-4">{user?.name || 'بطلنا'}</span> في رحلة القرآن اليوم.
          <br />
          هل حفظت اليوم آيات جديدة؟
        </p>
      </div>

      {}
      <div className="grid grid-cols-7 gap-1.5 xs:gap-3 sm:gap-4 w-full max-w-3xl mt-6 sm:mt-8 z-10 justify-items-center">
        {weekDays.map((day) => (
          <div 
            key={day.dayName} 
            className="flex flex-col items-center gap-2.5 cursor-pointer group"
            onClick={() => handleDayClick(day)}
          >
            <span className="text-white/90 group-hover:text-white font-black text-[10px] sm:text-sm transition-colors">
              {day.dayName}
            </span>
            
            <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 relative ${
              day.isCompleted
                ? 'bg-emerald-500 text-white border-2 border-white shadow-md shadow-emerald-800/10 hover:scale-110'
                : 'bg-white/90 hover:bg-white border-2 border-transparent shadow-inner hover:scale-105'
            }`}>
              {day.isCompleted ? (
                <Trophy className="w-4 h-4 sm:w-5.5 sm:h-5.5 text-yellow-300 drop-shadow-sm animate-pulse" />
              ) : (
                <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-300/70" />
              )}

              {}
              {day.isToday && !day.isCompleted && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {}
      <div className="flex flex-col xs:flex-row items-center gap-3 sm:gap-4 mt-8 w-full max-w-md z-10">
        <button
          onClick={() => handleOpenLog('HIFZ')}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#7CB342] hover:bg-[#689F38] border-2 border-white/40 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
          <span>تسجيل حفظ جديد</span>
        </button>
        <button
          onClick={() => handleOpenLog('REVISION')}
          className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-[#7CB342] font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <span>تسجيل مراجعه جديده</span>
        </button>
      </div>

      {}
      <div className="absolute -bottom-2 right-2 sm:right-6 w-20 h-20 sm:w-28 sm:h-28 z-0 pointer-events-none opacity-90 select-none animate-float">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          {}
          <circle cx="50" cy="50" r="32" fill="#FFE359" />
          {}
          <circle cx="28" cy="53" r="5.5" fill="#FFA5A5" />
          <circle cx="72" cy="53" r="5.5" fill="#FFA5A5" />
          {}
          <path d="M 28 47 Q 32 44 36 47" stroke="#42342A" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 64 47 Q 68 44 72 47" stroke="#42342A" strokeWidth="4" strokeLinecap="round" fill="none" />
          {}
          <polygon points="45,49 55,49 50,56" fill="#F39C12" />
          {}
          <path d="M 40 82 Q 40 87 43 88" stroke="#F39C12" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 60 82 Q 60 87 57 88" stroke="#F39C12" strokeWidth="4.5" strokeLinecap="round" />
          {}
          <ellipse cx="15" cy="54" rx="4" ry="8.5" fill="#FFE359" transform="rotate(-15 15 54)" />
          <ellipse cx="85" cy="54" rx="4" ry="8.5" fill="#FFE359" transform="rotate(15 85 54)" />
        </svg>
      </div>

    </div>
  );
}
