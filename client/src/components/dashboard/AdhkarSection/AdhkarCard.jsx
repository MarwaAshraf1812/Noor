import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from '../../UI/TiltCard';

export default function AdhkarCard({ item, remaining, onDhikrClick }) {
  const isDone = remaining === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <TiltCard
        onClick={(e) => onDhikrClick(item, e)}
        className={`relative p-5 rounded-3xl border-2 shadow-md cursor-pointer select-none transition-all duration-200 hover:scale-[1.015] hover:shadow-lg min-h-[140px] flex items-center justify-center ${item.color} ${
          isDone ? 'opacity-70 grayscale-[30%] line-through border-emerald-300' : ''
        }`}
      >
        <p className="font-extrabold text-sm sm:text-base leading-relaxed text-right pr-6 w-full">
          {item.text}
        </p>

        {/* Top-left Counter Ring Indicator */}
        <div className="absolute top-2.5 left-2.5 flex items-center justify-center">
          {isDone ? (
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-bounce-slow border-2 border-white font-black text-sm">
              ✓
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border-2 border-current flex items-center justify-center font-black text-xs shadow-sm">
              {remaining}
            </div>
          )}
        </div>
      </TiltCard>
    </motion.div>
  );
}
