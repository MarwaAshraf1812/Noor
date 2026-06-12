import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import defaultAvatar from '../../../assets/avatar_green_boy.png';

export default function WelcomeNotification({
  show,
  onClose,
  avatarSrc,
  level,
  message
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-[90%] sm:w-[320px] bg-white border-2 border-blue-100 rounded-2xl shadow-2xl p-4 flex items-start gap-3 select-none"
          dir="rtl"
        >
          <button
            onClick={onClose}
            className="absolute top-2 left-2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer transition-colors duration-150"
          >
            <X className="w-4 h-4" strokeWidth={3} />
          </button>

          <div className="relative flex-shrink-0 mt-2">
            <div className="w-12 h-12 rounded-full border-2 border-blue-200 bg-white overflow-hidden shadow-sm flex items-center justify-center">
              <img
                src={avatarSrc}
                alt="أفاتار البطل"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
            </div>
            <span className="absolute -bottom-1 -left-1 bg-amber-400 text-white font-black text-[9px] px-1.5 rounded-full border border-white">
              {level}
            </span>
          </div>

          <div className="flex-1 text-right mt-1 pl-4">
            <h4 className="text-xs font-black text-blue-500 uppercase tracking-wider mb-0.5">
              مغامرة اليوم 🌟
            </h4>
            <p className="text-xs sm:text-sm font-extrabold text-slate-700 leading-relaxed">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
