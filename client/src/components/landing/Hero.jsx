import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '../../assets/noor_hero-1.png';
import starImg from '../../assets/Star.png';
import blueGem from '../../assets/blue_gem.png';
import diamondRed from '../../assets/Diamond red.png';

export const Hero = () => {
  return (
    <section id="hero" className="relative pt-36 pb-16 flex flex-col items-center justify-center bg-gradient-to-b from-[#f0f9ff] to-white overflow-hidden text-center px-4">
      
      <motion.img 
        src={starImg} 
        alt="" 
        className="absolute top-24 right-12 sm:right-20 w-5 h-5 sm:w-6 sm:h-6 pointer-events-none opacity-80 select-none"
        animate={{ rotate: 360, y: [0, -6, 0] }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
        }}
      />
      <motion.img 
        src={starImg} 
        alt="" 
        className="absolute top-44 left-1/4 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none opacity-75 select-none animate-float-delayed"
      />
      <motion.img 
        src={starImg} 
        alt="" 
        className="absolute bottom-52 right-1/4 w-5 h-5 sm:w-6 sm:h-6 pointer-events-none opacity-80 select-none animate-float"
      />

      <motion.img 
        src={blueGem} 
        alt="" 
        className="absolute top-36 left-12 sm:left-20 w-5 h-5 sm:w-6 sm:h-6 pointer-events-none opacity-80 select-none"
        animate={{ y: [0, 8, 0], rotate: 45 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.img 
        src={blueGem} 
        alt="" 
        className="absolute bottom-40 left-16 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none opacity-80 select-none animate-float-delayed"
      />

      <motion.img 
        src={diamondRed} 
        alt="" 
        className="absolute top-32 left-1/3 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none opacity-80 select-none animate-float"
      />
      <motion.img 
        src={diamondRed} 
        alt="" 
        className="absolute bottom-36 right-16 w-5 h-5 sm:w-6 sm:h-6 pointer-events-none opacity-80 select-none"
        animate={{ y: [0, -8, 0], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.h1 
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 12 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1e3a8a] mb-6 leading-tight select-none z-10"
      >
        <span className="text-[#f59e0b]">نُور..</span> رفيقك في رحلة الجنة
      </motion.h1>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg sm:text-xl text-slate-500 font-medium mb-8 max-w-2xl leading-relaxed select-none z-10"
      >
        علّم الصلاة، احفظ القرآن، واجمع النجوم مع بطلك المفضل!
      </motion.p>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12 z-10"
      >
        <motion.a
          href="/auth"
          className="px-8 py-4 bg-[#3b82f6] hover:bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg transition-colors inline-block"
          whileHover={{ 
            scale: 1.08,
            boxShadow: "0px 15px 30px rgba(59, 130, 246, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            scale: {
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut"
            }
          }}
        >
          ابدأ مغامرتك الآن
        </motion.a>
      </motion.div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ 
          y: [0, -15, 0],
          opacity: 1
        }}
        transition={{
          y: {
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut"
          },
          opacity: { duration: 0.8, delay: 0.5 }
        }}
        className="w-full max-w-2xl flex justify-center mt-4 z-10"
      >
        <img 
          src={heroImg} 
          alt="رحلة الجنة" 
          className="w-full max-w-[460px] h-auto object-contain select-none"
        />
      </motion.div>

    </section>
  );
};
