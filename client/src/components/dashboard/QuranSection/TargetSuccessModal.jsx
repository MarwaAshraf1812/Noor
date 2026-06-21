import React from 'react';
import { X } from 'lucide-react';
import { playPopSound } from '../../../utils/audio';

export default function TargetSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn" dir="rtl">
      <div className="bg-gradient-to-b from-[#FFFFFF] to-[#E4FACC] w-full max-w-sm rounded-[32px] border-4 border-[#7CB342]/15 shadow-2xl p-6 relative flex flex-col items-center text-center">
        
        <button 
          onClick={() => { playPopSound(); onClose(); }}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all cursor-pointer active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot Chick in popup */}
        <div className="mb-4 mt-2">
          <svg className="w-20 h-20 animate-bounce" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="32" fill="#FFE359" />
            <circle cx="28" cy="53" r="5.5" fill="#FFA5A5" />
            <circle cx="72" cy="53" r="5.5" fill="#FFA5A5" />
            <path d="M 28 47 Q 32 44 36 47" stroke="#42342A" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 64 47 Q 68 44 72 47" stroke="#42342A" strokeWidth="4" strokeLinecap="round" fill="none" />
            <polygon points="45,49 55,49 50,56" fill="#F39C12" />
            <ellipse cx="15" cy="54" rx="4" ry="8.5" fill="#FFE359" transform="rotate(-15 15 54)" />
            <ellipse cx="85" cy="54" rx="4" ry="8.5" fill="#FFE359" transform="rotate(15 85 54)" />
          </svg>
        </div>

        <h4 className="text-xl font-black text-slate-800">
          تم تحديث الأهداف بنجاح! 🎯
        </h4>

        <div className="flex flex-col gap-2 mt-2 w-full">
          <span className="text-emerald-700 font-black text-sm bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100 self-center">
            الأهداف الجديدة جاهزة! 🚀
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-2 leading-relaxed px-2">
            رائع يا بطل! تم تعديل ورد الحفظ والمراجعة بنجاح. هيا ابدأ يومك بكل حماس لتحصد المزيد من الجواهر والنجوم! 💎✨
          </p>
        </div>

        <button
          onClick={() => { playPopSound(); onClose(); }}
          className="w-full mt-6 py-3 rounded-2xl bg-[#7CB342] hover:bg-[#689F38] text-white font-black text-sm sm:text-base shadow-md transition-all cursor-pointer active:scale-95"
        >
          انطلق يا بطل! 🚀
        </button>
      </div>
    </div>
  );
}
