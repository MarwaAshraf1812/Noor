import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DhikrMascot = memo(({ heroOfTasbih, name, currentCount = 0, target = 33 }) => {
  const getMoodBubble = () => {
    if (currentCount === 0) {
      return {
        text: `أهلاً بك يا ${name}! جاهز للبدء؟ اضغط على الدائرة! 🚀`,
        emoji: '👋',
      };
    }
    if (currentCount >= target) {
      return {
        text: `الله أكبر! لقد حققت الهدف يا بطل! 🏆💎`,
        emoji: '🎉',
      };
    }
    const percent = Math.round((currentCount / target) * 100);
    if (percent > 80) {
      return {
        text: `اكتملت تقريباً يا ${name}! لم يتبق سوى القليل! 🚀`,
        emoji: '🔥',
      };
    }
    if (percent > 50) {
      return {
        text: `نصف الطريق تم بنجاح! أنت مذهل! ⚡`,
        emoji: '✨',
      };
    }
    return {
      text: `رائع! ${currentCount} من ${target}.. استمر! 💪`,
      emoji: '⭐',
    };
  };

  const bubble = getMoodBubble();

  return (
    <div className="md:col-span-3 flex flex-col items-center justify-center gap-3">
      {}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentCount === 0 ? 'idle' : currentCount >= target ? 'done' : 'counting'}
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative bg-white/90 border border-indigo-100 py-2.5 px-4 rounded-3xl text-xs sm:text-sm font-black text-slate-700 shadow-md text-center max-w-[200px]"
        >
          <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-indigo-100 rotate-45" />
          <span>{bubble.emoji} {bubble.text}</span>
        </motion.div>
      </AnimatePresence>

      {}
      <motion.div 
        key={currentCount} 
        initial={{ scale: 0.9, y: 15 }}
        animate={currentCount >= target 
          ? { y: [0, -18, 0], scale: [1, 1.1, 0.95, 1], rotate: [0, -5, 5, 0] }
          : currentCount > 0 
            ? { y: [0, -10, 0], scale: [1, 1.05, 0.97, 1] }
            : { y: [0, -6, 0] } 
        }
        transition={currentCount > 0 
          ? { type: "spring", stiffness: 350, damping: 10 } 
          : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative flex flex-col items-center"
      >
        <img 
          src={heroOfTasbih} 
          alt="Mascot" 
          className="w-40 sm:w-48 h-auto drop-shadow-2xl select-none pointer-events-none"
        />
        
        {}
        {currentCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.12, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-full -z-10"
          />
        )}
      </motion.div>
    </div>
  );
});

DhikrMascot.displayName = 'DhikrMascot';

export default DhikrMascot;
