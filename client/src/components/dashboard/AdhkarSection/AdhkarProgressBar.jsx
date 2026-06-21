import React from 'react';

export default function AdhkarProgressBar({ category, percentage, onReset }) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-white/40 shadow-sm z-10 select-none">
      <div className="flex items-center gap-2">
        <span className="text-xl">{category.illustration}</span>
        <h4 className={`text-base sm:text-lg font-black ${category.textColor}`}>
          تقدم {category.title}
        </h4>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md justify-end relative">
        <div className="w-full bg-white/60 h-4 rounded-full overflow-hidden border border-white/80 p-0.5 relative">
          <div
            className={`h-full ${category.progressBarColor} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <span className={`font-black text-sm whitespace-nowrap ${category.textColor}`}>
          {percentage}%
        </span>
      </div>

      <button
        onClick={onReset}
        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold bg-white/70 border border-slate-200 hover:bg-white transition-all cursor-pointer ${category.textColor}`}
      >
        إعادة البدء 🔄
      </button>
    </div>
  );
}
