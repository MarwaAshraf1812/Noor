import React from 'react';

export default function QuranBadge() {
  return (
    <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md animate-pulse" />
      <div className="relative w-18 h-18 bg-gradient-to-br from-[#FFE863] via-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center border-4 border-white shadow-lg shadow-amber-300/30 transform hover:scale-105 hover:rotate-3 transition-transform duration-300 cursor-pointer">
        <div className="absolute inset-1 rounded-xl border border-white/40" />
        <span className="absolute -top-1 -right-1 text-sm animate-bounce">✨</span>
        <svg viewBox="0 0 64 64" className="w-11 h-11 drop-shadow-[0_2px_3px_rgba(139,69,19,0.3)]">
          <path d="M12 48L32 38L52 48" stroke="#A0522D" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M22 52L42 52" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M32 38C22 34 10 38 8 22C10 12 22 10 32 18" fill="#10B981" stroke="#047857" strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 38C42 34 54 38 56 22C54 12 42 10 32 18" fill="#34D399" stroke="#047857" strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 18V38" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 38C34 44 30 46 32 48" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="21" cy="22" r="4" fill="#FFE54D" />
          <circle cx="23" cy="22" r="3.5" fill="#10B981" />
          <polygon points="41,20 42,22 44,22 42.5,23 43,25 41,24 39,25 39.5,23 38,22 40,22" fill="#FFE54D" />
        </svg>
      </div>
    </div>
  );
}
