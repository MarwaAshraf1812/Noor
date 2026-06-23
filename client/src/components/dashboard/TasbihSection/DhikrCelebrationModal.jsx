import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function DhikrCelebrationModal({
  isOpen,
  earnedGems,
  activePhrase,
  target,
  name,
  blueGem,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 360 }}
        className="bg-white rounded-[32px] p-6 sm:p-8 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 flex flex-col items-center text-center gap-4 select-none"
      >
        {}
        <div className="border border-amber-300 bg-amber-50/80 rounded-full px-5 py-1.5 flex items-center gap-1.5 text-amber-700 font-extrabold text-xs sm:text-sm shadow-sm">
          <img src={blueGem} alt="gem" className="w-5 h-5 object-contain animate-bounce" />
          <span>+{earnedGems} جواهر 💎</span>
        </div>

        {}
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
            أحسنت! قلت {activePhrase} {target} مرات 🌿
          </h3>
          <span className="text-3xl animate-bounce mt-1">🎉</span>
        </div>

        {}
        <p className="text-slate-500 font-bold text-xs sm:text-sm max-w-[290px] leading-relaxed">
          قلت {activePhrase} {target} مرات بنجاح - ذكرك وصل السماء يا {name}! 🌙
        </p>

        {}
        <div className="flex flex-wrap justify-center gap-2 my-1">
          <span className="px-3.5 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 font-black text-[10px] sm:text-xs">
            {activePhrase}
          </span>
          <span className="px-3.5 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-purple-600 font-black text-[10px] sm:text-xs">
            {target} مرات
          </span>
          <span className="px-3.5 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-600 font-black text-[10px] sm:text-xs flex items-center gap-1 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
            <span>متواصل 🔥</span>
          </span>
        </div>

        {}
        <div className="flex flex-col items-center gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-800 font-black text-sm sm:text-base shadow-lg shadow-amber-200/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            بارك الله فيك! واصل 🌿
          </button>

          <button
            onClick={onClose}
            className="text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
}
