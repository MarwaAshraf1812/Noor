import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

export default function DhikrCounterRing({
  currentCount,
  target,
  activePhrase,
  theme,
  isSubmitting,
  handleCircleClick,
  handleReset,
  floatingParticles,
  strokeDashoffset,
  circumference,
  radius,
  strokeWidth
}) {
  return (
    <div className="md:col-span-6 flex flex-col items-center gap-4">
      <div className="relative">
        
        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="absolute -top-1 -right-1 z-10 w-9 h-9 rounded-full bg-white hover:bg-red-50 text-slate-500 hover:text-red-500 border border-slate-200 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md"
          title="إعادة التعديد"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleCircleClick}
          disabled={isSubmitting}
          className="w-72 h-72 rounded-full bg-white flex items-center justify-center relative outline-none border-[6px] border-slate-50 glow-circle-interactive cursor-pointer overflow-visible"
        >
          {/* Dynamic SVG stroke progress */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 p-1" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              className="stroke-slate-100/70"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke={theme.strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
            />
          </svg>

          {/* Display text and fractions */}
          <div className="z-10 flex flex-col items-center gap-2">
            <span className={`px-4.5 py-1.5 rounded-full font-black text-sm sm:text-base shadow-sm ${theme.badgeBg}`}>
              {activePhrase}
            </span>
            
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black text-slate-800 tracking-tight">
                {currentCount}
              </span>
              <span className="text-sm font-black text-slate-400 border-t border-slate-100 pt-1 mt-0.5 px-4">
                {currentCount} / {target}
              </span>
            </div>
          </div>

          {/* Click floating particles */}
          <AnimatePresence>
            {floatingParticles.map((p) => (
              <span
                key={p.id}
                className={`absolute font-black text-xl ${theme.textClass} pointer-events-none select-none`}
                style={{
                  left: p.x,
                  top: p.y,
                  animation: 'floatUp 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards'
                }}
              >
                +1
              </span>
            ))}
          </AnimatePresence>

        </motion.button>
      </div>

      <span className="text-xs sm:text-sm font-black text-slate-400 flex items-center gap-1 select-none animate-pulse">
        <span>👇 اضغط على الدائرة عشان تعد!</span>
      </span>
    </div>
  );
}
