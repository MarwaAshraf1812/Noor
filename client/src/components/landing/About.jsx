import React from 'react';
import { motion } from 'framer-motion';
import aboutImg from '../../assets/noor_about_1.png';

export const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white via-amber-50/20 to-amber-100/10 px-6 sm:px-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.15 }}
            className="md:col-span-7 text-right space-y-6"
          >
            <span className="text-[#3b82f6] text-xl font-bold block">
              ما هو مشروع <span className="text-[#f59e0b]">نور</span>؟
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a8a] leading-tight">
              رفيق طفلك في رحلة الإيمان.
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              نور ليس مجرد موقع لتتبع العبادات، بل هو عالم تفاعلي صمم خصيصاً ليأخذ بيد طفلك نحو بناء عادات دينية مستدامة، من خلال نظام تحفيزي ممتع يعتمد على النجوم والأوسمة، نساعد أبطالنا الصغار على الالتزام بصلواتهم، وحفظ كتاب الله، وترطيب ألسنتهم بالأذكار اليومية.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-center justify-start text-sm font-black text-slate-600 select-none">
              
              <div className="bg-blue-50/50 border border-blue-100 px-4 py-2.5 rounded-2xl flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="text-lg">🕌</span>
                <span>أدِّ عباداتك</span>
              </div>
              
              <span className="hidden sm:inline text-blue-300 text-lg font-bold">←</span>
              <span className="inline sm:hidden text-blue-300 text-lg font-bold">↓</span>
              
              <div className="bg-yellow-50/50 border border-yellow-100 px-4 py-2.5 rounded-2xl flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="text-lg">🌟</span>
                <span>اجمع نجومك</span>
              </div>
              
              <span className="hidden sm:inline text-yellow-300 text-lg font-bold">←</span>
              <span className="inline sm:hidden text-yellow-300 text-lg font-bold">↓</span>
              
              <div className="bg-emerald-50/50 border border-emerald-100 px-4 py-2.5 rounded-2xl flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="text-lg">🏆</span>
                <span>افتح أوسمتك</span>
              </div>

            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.15 }}
            className="md:col-span-5 flex justify-center"
          >
            <motion.img 
              src={aboutImg} 
              alt="عن مشروع نور" 
              className="w-full max-w-[340px] h-auto object-contain select-none"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  duration: 4.5,
                  ease: 'easeInOut'
                }
              }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
