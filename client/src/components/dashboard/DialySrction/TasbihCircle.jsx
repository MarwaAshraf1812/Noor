import React from 'react';

export default function TasbihCircle({ 
  displayName, 
  count, 
  target = 33, 
  trackColor, 
  strokeColor, 
  textColor, 
  onClick 
}) {
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  
  const displayProgress = count % target;
  const displayCount = count > 0 && displayProgress === 0 ? target : displayProgress;
  const rounds = Math.floor(count / target);
  
  const progressPercent = count > 0 && displayProgress === 0 ? 100 : (displayProgress / target) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2 select-none w-full max-w-[120px]">
      <button 
        onClick={onClick}
        className="relative w-20 h-20 min-[380px]:w-24 min-[380px]:h-24 sm:w-[108px] sm:h-[108px] rounded-full flex items-center justify-center bg-white/60 hover:bg-white/85 shadow-md active:scale-90 hover:scale-105 hover:rotate-3 transition-all duration-200 focus:outline-none cursor-pointer"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl min-[380px]:text-2xl sm:text-3xl font-black" style={{ color: textColor }}>
            {displayCount}
          </span>
          <span className="text-[10px] min-[380px]:text-xs sm:text-sm font-extrabold text-slate-500/80 -mt-0.5 select-none" dir="ltr">
            /{target}
          </span>
        </div>
      </button>

      <span className="text-[10px] min-[380px]:text-xs sm:text-base font-black text-white select-none text-center leading-tight">
        {displayName}
      </span>
    </div>
  );
}
