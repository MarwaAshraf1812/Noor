import React from 'react';
import { motion } from 'framer-motion';
import friendOfQuran from '../../assets/friend_of_quran.png';
import heroOfFagr from '../../assets/hero_of_fagr.png';
import heroOfTasbih from '../../assets/hero_of_tasbih.png';
import heroOfWeek from '../../assets/hero_of_week.png';

export const Badges = () => {
  const badgesList = [
    {
      img: heroOfWeek,
      subtext: 'أكمل أسبوع كامل من الالتزام'
    },
    {
      img: heroOfTasbih,
      subtext: 'أتمم أذكار الصباح والمساء يوم كامل'
    },
    {
      img: friendOfQuran,
      subtext: 'احفظ صفحة كاملة جديدة في المصحف'
    },
    {
      img: heroOfFagr,
      subtext: 'صلي الفجر في وقتها لـ 3 أيام متتالية'
    }
  ];

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.75 },
    visible: (index) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.12,
        type: 'spring',
        stiffness: 90,
        damping: 12
      }
    }),
    hover: {
      scale: 1.15,
      rotate: [0, -6, 6, -6, 6, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="badges" className="py-20 bg-gradient-to-b from-emerald-100/10 via-violet-50/10 to-sky-100/15 px-6 sm:px-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3b82f6] mb-3">
            أوسمة الأبطال
          </h2>
          <p className="text-lg text-slate-500 font-semibold">
            التزم بعبادتك واجمع أوسمة مميزة لتزين بها ملفك الشخصي!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center mb-12">
          {badgesList.map((badge, index) => (
            <motion.div 
              key={index} 
              custom={index}
              variants={badgeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              whileHover="hover"
              className="flex flex-col items-center text-center max-w-[200px] cursor-pointer"
            >
              <div className="mb-4 h-36 flex items-center justify-center">
                <img 
                  src={badge.img} 
                  alt="وسام" 
                  className="max-h-32 w-auto object-contain select-none"
                />
              </div>
              
              <p className="text-slate-600 font-bold text-sm leading-relaxed">
                {badge.subtext}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
        </div>

      </div>
    </section>
  );
};
