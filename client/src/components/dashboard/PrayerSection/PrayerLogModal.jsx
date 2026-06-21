import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrayerLogModal({ isOpen, activePrayer, onRecord, onClose }) {
  if (!isOpen || !activePrayer) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 text-center"
        >
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
            تسجيل صلاة {activePrayer.prayerLabel} لليوم ({activePrayer.dayLabel}) 🌟
          </h3>
          
          <p className="text-slate-500 font-bold text-sm sm:text-base mb-6">
            أين صليت يا بطل؟ كل صلاة تقربك من مغامرة جديدة! 🚀
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={(e) => onRecord('MOSQUE', false, e)}
              className="w-full py-4 px-5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-100 rounded-2xl font-black text-sm sm:text-base flex items-center justify-between transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="text-2xl">🕌</span>
                <span>في المسجد</span>
              </span>
              <span className="bg-emerald-200/50 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-lg">
                +20 💎
              </span>
            </button>

            <button
              onClick={(e) => onRecord('CONGREGATION', false, e)}
              className="w-full py-4 px-5 bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-blue-100 rounded-2xl font-black text-sm sm:text-base flex items-center justify-between transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="text-2xl">👨‍👩‍👦</span>
                <span>جماعة بالبيت</span>
              </span>
              <span className="bg-blue-200/50 text-blue-800 text-xs font-black px-2.5 py-1 rounded-lg">
                +15 💎
              </span>
            </button>

            <button
              onClick={(e) => onRecord('HOME', false, e)}
              className="w-full py-4 px-5 bg-purple-50 hover:bg-purple-100 text-purple-700 border-2 border-purple-100 rounded-2xl font-black text-sm sm:text-base flex items-center justify-between transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <span>بمفردي في المنزل</span>
              </span>
              <span className="bg-purple-200/50 text-purple-800 text-xs font-black px-2.5 py-1 rounded-lg">
                +10 💎
              </span>
            </button>

            <button
              onClick={(e) => onRecord('HOME', true, e)}
              className="w-full py-4 px-5 bg-rose-50 hover:bg-rose-100 text-rose-600 border-2 border-rose-100 rounded-2xl font-black text-sm sm:text-base flex items-center justify-between transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="text-2xl">🖤</span>
                <span>لم أصلي</span>
              </span>
              <span className="bg-rose-200/50 text-rose-800 text-xs font-black px-2.5 py-1 rounded-lg font-bold">
                0 💎
              </span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            إلغاء
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
