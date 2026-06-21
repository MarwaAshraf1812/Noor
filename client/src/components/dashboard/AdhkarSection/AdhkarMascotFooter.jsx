import React from 'react';
import mascotImg from '../../../assets/noor_avatar_bye_1.png';

export default function AdhkarMascotFooter({ percentage }) {
  return (
    <div className="w-full flex items-end justify-between mt-4 z-10 select-none">
      <div className="flex items-center gap-2.5">
        <img
          src={mascotImg}
          alt="مرشد نور"
          className="w-20 sm:w-24 h-auto object-contain animate-bounce-slow"
        />
        <div className="bg-white/95 border border-slate-100 rounded-2xl p-3 max-w-[200px] shadow-md text-right relative">
          <div className="absolute bottom-4 -right-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white/95" />
          <p className="text-[11px] sm:text-xs font-black text-slate-700 leading-normal">
            {percentage === 100
              ? "أحسنت يا بطل! أتممت أذكارك بنجاح وجمعت الجواهر! 🏆"
              : "باقي القليل من الأذكار لتكمل مغامرة اليوم! 🚀"}
          </p>
        </div>
      </div>
    </div>
  );
}
