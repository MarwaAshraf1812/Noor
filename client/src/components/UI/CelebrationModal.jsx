import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playGemCollectSound } from '../../utils/audio';

export default function CelebrationModal({ 
  isOpen, 
  onClose, 
  badgeText = '+5 جواهر', 
  title = 'ما شاء الله! أتممت صلاتك',
  description = 'صليت كل الصلوات الخمس اليوم. استمر وحافظ على هذه العادة الجميلة!',
  stats = [
    { value: '5/5', label: 'صلوات', color: 'text-slate-700' },
    { value: '7 🔥', label: 'أيام متتالية', color: 'text-slate-700' },
    { value: '+50', label: 'نقطة', color: 'text-[#3b82f6]' }
  ],
  primaryButtonText = 'رائع استمر 🚀',
  onPrimaryClick
}) {

  useEffect(() => {
    if (isOpen) {
      playGemCollectSound();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 370 }}
          className="bg-white rounded-[32px] p-6 sm:p-8 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 flex flex-col items-center text-center gap-4 select-none"
        >
          <div className="border border-amber-300 bg-amber-50/50 rounded-full px-4.5 py-1.5 flex items-center gap-1.5 text-amber-600 font-extrabold text-xs sm:text-sm shadow-sm">
            <svg viewBox="0 0 64 64" className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 2L8 22L32 62L56 22L32 2Z" fill="#2563eb" stroke="#1e3a8a" strokeWidth="3" strokeLinejoin="round" />
              <path d="M32 2L20 22L32 62L44 22L32 2Z" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="3" strokeLinejoin="round" />
              <path d="M20 22H44" stroke="#1e3a8a" strokeWidth="3" strokeLinejoin="round" />
              <path d="M32 2V22" stroke="#1e3a8a" strokeWidth="3" strokeLinejoin="round" />
            </svg>
            <span>{badgeText}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
              {title}
            </h3>
            <span className="text-2xl sm:text-3xl animate-bounce mt-1">🎉</span>
          </div>

          <p className="text-slate-500 font-bold text-xs sm:text-sm max-w-[280px] leading-relaxed">
            {description}
          </p>

          <div className="grid grid-cols-3 gap-2 w-full max-w-[300px] bg-slate-50/80 border border-slate-100/50 rounded-2xl py-3 px-2 my-1">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <span className={`text-sm sm:text-base font-black ${stat.color || 'text-slate-700'} flex items-center justify-center gap-1`}>
                  {stat.value}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-black mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 w-full mt-2">
            <button
              onClick={onPrimaryClick || onClose}
              className="w-full max-w-[240px] py-3 px-5 rounded-2xl bg-[#4A90E2] hover:bg-[#357ABD] text-white font-black text-sm sm:text-base shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {primaryButtonText}
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
    </AnimatePresence>
  );
}
