import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playChimeSound } from '../../utils/audio';

export default function LevelUpModal({ isOpen, onClose, level = 1, rank = 'بطل مبتدئ 🌱' }) {
  const [chestOpened, setChestOpened] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setChestOpened(false);
      const timer = setTimeout(() => {
        setChestOpened(true);
        playChimeSound();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-gradient-to-b from-[#FFFDF0] to-white rounded-[36px] p-5 sm:p-8 max-w-sm w-full shadow-2xl border-4 border-amber-400 relative z-10 text-center flex flex-col items-center gap-4 select-none"
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]">
            <div className="absolute top-10 left-10 text-yellow-400 animate-ping">⭐</div>
            <div className="absolute top-20 right-12 text-amber-500 animate-bounce">✨</div>
            <div className="absolute bottom-16 left-16 text-yellow-300 animate-pulse">⭐</div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#D97706] tracking-normal animate-bounce">
            مستوى جديد! 🎉
          </h2>

          <p className="text-slate-600 font-bold text-sm sm:text-base max-w-[280px]">
            أحسنت يا بطل! لقد جمعت الكثير من الجواهر وارتقيت للمستوى التالي! 🏆
          </p>

          <div className="relative w-40 h-40 flex items-center justify-center my-2">
            {!chestOpened ? (
              <motion.div
                animate={{
                  rotate: [0, -3, 3, -3, 3, 0],
                  scale: [1, 1.05, 1.05, 1.05, 1.05, 1]
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.8,
                  ease: "easeInOut"
                }}
                className="text-7xl sm:text-8xl select-none filter drop-shadow-lg"
              >
                📦🔒
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.6, rotate: 15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="text-7xl sm:text-8xl select-none filter drop-shadow-xl relative flex items-center justify-center"
              >
                <span>🔓🎁</span>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: -55, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="absolute text-4xl"
                >
                  💎
                </motion.div>
                <motion.div
                  initial={{ x: 0, y: 20, opacity: 0 }}
                  animate={{ x: -45, y: -35, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="absolute text-3xl"
                >
                  ✨
                </motion.div>
                <motion.div
                  initial={{ x: 0, y: 20, opacity: 0 }}
                  animate={{ x: 45, y: -35, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="absolute text-3xl"
                >
                  ⭐
                </motion.div>
              </motion.div>
            )}
          </div>

          <div className="flex flex-col items-center gap-1.5 mt-2">
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-black px-6 py-2 rounded-full text-base sm:text-lg shadow-md border-2 border-amber-300">
              المستوى {level} 🌟
            </div>
            
            <div className="text-sm font-extrabold text-[#D97706] mt-1 bg-amber-50 px-4 py-1.5 rounded-2xl border border-amber-200/50">
              اللقب الجديد: <span className="text-slate-800">{rank}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full max-w-[200px] py-3.5 px-6 mt-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm sm:text-base shadow-lg shadow-amber-200/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            رائع استمر 🚀
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
