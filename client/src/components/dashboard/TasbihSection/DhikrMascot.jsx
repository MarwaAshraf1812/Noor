import React from 'react';
import { motion } from 'framer-motion';

export default function DhikrMascot({ heroOfTasbih, name }) {
  return (
    <div className="md:col-span-3 flex justify-center">
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex flex-col items-center gap-2"
      >
        <img 
          src={heroOfTasbih} 
          alt="Mascot" 
          className="w-40 sm:w-48 h-auto drop-shadow-xl select-none pointer-events-none"
        />
        <div className="bg-white/80 border border-slate-200/50 py-1.5 px-3.5 rounded-full text-xs font-black text-slate-700 shadow-sm">
          أنت بطل رائع يا {name}! 🌟
        </div>
      </motion.div>
    </div>
  );
}
