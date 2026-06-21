import React from 'react';
import TiltCard from '../../UI/TiltCard';
import starImg from '../../../assets/Star.png';
import quranImg from '../../../assets/quran_2.png';

export default function QuranCard({
  type, // 'revision' | 'total_stats' | 'hifz'
  title,
  subtitle,
  target,
  verseCount = 0,
  progress = 0,
  remaining = 0,
  value,
  mascot,
  onAction,
  colorTheme = 'blue' // 'blue' | 'yellow' | 'green'
}) {
  const progressPercent = Math.max(0, Math.min(100, progress || 0));

  // Style configurations based on theme
  const themes = {
    blue: {
      border: 'border-[#4A90E2]/40 hover:border-[#4A90E2]/70',
      bg: 'bg-[#F5F9FF]',
      title: 'text-[#2F5E97]',
      text: 'text-[#3B75B8]',
      progressBg: 'bg-[#4A90E2]/15',
      progressFill: 'bg-[#4A90E2]',
    },
    yellow: {
      border: 'border-[#F5B041]/40 hover:border-[#F5B041]/70',
      bg: 'bg-[#FFFDF0]',
      title: 'text-[#B45309]',
      text: 'text-[#D97706]',
      progressBg: 'bg-[#F5B041]/15',
      progressFill: 'bg-[#F5B041]',
    },
    green: {
      border: 'border-[#2ECC71]/40 hover:border-[#2ECC71]/70',
      bg: 'bg-[#F4FCF4]',
      title: 'text-[#227143]',
      text: 'text-[#2E7D32]',
      progressBg: 'bg-[#2ECC71]/15',
      progressFill: 'bg-[#2ECC71]',
    }
  };

  const currentTheme = themes[colorTheme] || themes.blue;

  if (type === 'total_stats') {
    return (
      <TiltCard className={`w-full p-5 rounded-[28px] border-2 shadow-sm ${currentTheme.border} ${currentTheme.bg} flex flex-col justify-between min-h-[160px] select-none transition-all duration-300`}>
        <div className="flex items-center justify-between w-full">
          <span className="text-xl sm:text-2xl">🟢</span>
          <h4 className={`text-base sm:text-lg font-black ${currentTheme.title}`}>
            {title}
          </h4>
        </div>

        <div className="flex items-center justify-between mt-2 w-full">
          <div className="flex items-center gap-2 bg-[#FFF9E6] px-4 py-2 rounded-2xl border border-amber-200/50 shadow-sm">
            <span className="text-xl sm:text-2xl animate-pulse">🔥</span>
            <span className="text-lg sm:text-2xl font-black text-amber-800">
              {value} آية
            </span>
          </div>

          {mascot && (
            <img 
              src={mascot} 
              alt="Noor Mascot" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain -mb-2 transform hover:scale-110 transition-transform duration-200"
            />
          )}
        </div>
      </TiltCard>
    );
  }

  return (
    <TiltCard className={`w-full p-5 rounded-[28px] border-2 shadow-sm ${currentTheme.border} ${currentTheme.bg} flex flex-col justify-between min-h-[160px] select-none transition-all duration-300`}>
      {/* Top Header */}
      <div className="flex items-center justify-between w-full">
        <img 
          src={quranImg} 
          alt="Quran" 
          className="w-6 h-6 object-contain"
        />
        <h4 className={`text-base sm:text-lg font-black ${currentTheme.title}`}>
          {title}
        </h4>
      </div>

      {/* Subtitle / Middle Content */}
      <div className="mt-2 text-right">
        {subtitle ? (
          <p className="text-xs sm:text-sm font-extrabold text-slate-700">
            {subtitle.split(' ').map((word, idx) => 
              word === 'نَّبَأَ' || word === 'النَّبَأِ' || word === 'النَّبَأَ' ? (
                <span key={idx} className={`text-sm sm:text-base font-black ${currentTheme.title} mx-1 underline underline-offset-4 decoration-2`}>{word}</span>
              ) : (
                <span key={idx} className="mx-0.5">{word}</span>
              )
            )}
          </p>
        ) : (
          <p className={`text-xs sm:text-sm font-black ${currentTheme.title}`}>
            {type === 'revision' ? `هدف المراجعة ${target} آية` : `هدف الحفظ ${target} آية`}
          </p>
        )}
      </div>

      {/* Progress Bar Row */}
      <div className="flex items-center gap-3 w-full mt-3">
        {/* Remaining label */}
        <span className="text-[10px] sm:text-xs font-black text-slate-500 whitespace-nowrap min-w-[70px] text-right">
          باقي {remaining} آيات 🏁
        </span>

        {/* Progress Bar track */}
        <div className={`flex-1 relative h-3 ${currentTheme.progressBg} rounded-full border border-slate-200/10 overflow-visible`}>
          <div 
            className={`absolute right-0 top-0 h-full rounded-full transition-all duration-700 ease-out ${currentTheme.progressFill}`}
            style={{ width: `${progressPercent}%` }}
          />
          {/* Star Handle indicator */}
          <img 
            src={starImg} 
            alt="Star Indicator" 
            className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 object-contain z-10 transition-all duration-700 ease-out filter drop-shadow-[0_2px_3px_rgba(245,158,11,0.4)]"
            style={{ right: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Footer link / Goal info */}
      <div className="mt-3 w-full">
        {type === 'revision' ? (
          <button 
            onClick={onAction}
            className="text-[#4A90E2] hover:text-blue-700 font-black text-xs sm:text-sm underline underline-offset-4 hover:scale-[1.03] active:scale-95 transition-all w-full text-center block cursor-pointer"
          >
            سجل مراجعتك
          </button>
        ) : (
          <div className="flex flex-col gap-1 items-center">
            <button 
              onClick={onAction}
              className="text-[#2ECC71] hover:text-emerald-700 font-black text-xs sm:text-sm underline underline-offset-4 hover:scale-[1.03] active:scale-95 transition-all w-full text-center block cursor-pointer"
            >
              سجل حفظك
            </button>
            <div className="text-center font-extrabold text-[10px] sm:text-xs text-slate-400">
              هدف الحفظ {target} آية
            </div>
          </div>
        )}
      </div>

    </TiltCard>
  );
}