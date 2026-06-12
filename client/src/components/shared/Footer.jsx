import React from 'react';
import { motion } from 'framer-motion';
import logoImg from '../../assets/logo.png';
import byeImg from '../../assets/noor_avatar_bye_1.png';

export const Footer = () => {
  const mascotVariants = {
    idle: {
      rotate: [0, 2, -2, 0],
      transition: {
        repeat: Infinity,
        duration: 3.5,
        ease: 'easeInOut'
      }
    },
    hover: {
      scale: 1.05,
      rotate: [0, -12, 12, -12, 12, 0],
      transition: { duration: 0.6 }
    }
  };

  return (
    <footer className="bg-[#101e3d] text-white pt-10 pb-6 relative px-6 sm:px-8">
      
      <motion.div 
        className="absolute bottom-0 left-4 sm:left-12 md:left-16 lg:left-24 cursor-pointer z-10"
        variants={mascotVariants}
        animate="idle"
        whileHover="hover"
      >
        <img 
          src={byeImg} 
          alt="مع السلامة" 
          className="h-36 sm:h-48 md:h-60 w-auto object-contain origin-bottom select-none"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-700/50 pb-6 mb-6 pl-24 sm:pl-32 md:pl-0">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-right">
          <img 
            src={logoImg} 
            alt="نور" 
            className="h-12 w-auto mb-2"
          />
          <p className="text-slate-300 font-medium text-sm">
            نور.. رفيقك الصغير في رحلة الإيمان
          </p>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-8 justify-center font-bold text-sm text-slate-300">
          <a href="#hero" className="hover:text-white transition-colors">الرئيسية</a>
          <a href="#about" className="hover:text-white transition-colors">عن نور</a>
          <a href="#features" className="hover:text-white transition-colors">المميزات</a>
          <a href="#badges" className="hover:text-white transition-colors">الأوسمة</a>
        </div>

        <div className="hidden md:block w-32 lg:w-48"></div>

      </div>

      <div className="text-center text-slate-400 font-semibold text-xs pl-24 sm:pl-32 md:pl-0">
        Copyright. All rights saved to noor
      </div>
    </footer>
  );
};
