import React from 'react';
import byeImg from '../../../assets/noor_avatar_bye_1.png';

export default function PrayerMascot({ tip }) {
  return (
    <div className="flex items-end gap-2.5 sm:gap-3 justify-center md:justify-end px-2 mt-4 md:mt-0">
      <div className="relative bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-4 max-w-[220px] shadow-lg mb-2 order-1 md:order-1 text-right">
        {/* Mobile Tail (Points right to mascot on mobile) */}
        <div className="md:hidden absolute bottom-4 -right-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white/20" />
        
        {/* Desktop Tail (Points left to mascot on desktop) */}
        <div className="hidden md:block absolute bottom-4 -left-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white/20" />
        
        <p className="text-xs sm:text-sm font-black leading-relaxed text-white drop-shadow-sm">
          {tip}
        </p>
      </div>
      <img 
        src={byeImg} 
        alt="مرشد نور" 
        className="w-20 sm:w-28 h-auto object-contain select-none transform hover:scale-105 transition-transform duration-200 order-1 md:order-2 shrink-0"
      />
    </div>
  );
}
