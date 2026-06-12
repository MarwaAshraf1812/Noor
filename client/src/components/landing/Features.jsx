import React from 'react';
import { motion } from 'framer-motion';
import quranKnooz from '../../assets/noor_knooz_quran.png';
import tasbihKnooz from '../../assets/noor_knooz_tasbih.png';
import prayerKnooz from '../../assets/noor_knooz_prayer.png';

export const Features = () => {
  const cards = [
    {
      title: 'صلاتي هي نوري',
      desc: 'سجل صلواتك الخمس في وقتها، وراقب بطلك وهو يرتقي في درجات الجنة مع كل صلاة تؤديها',
      img: prayerKnooz,
      reward: '+٥٠ نجمة 🌟',
      glowColor: 'hover:shadow-[0_20px_50px_rgba(59,130,246,0.18)] border-blue-100 hover:border-blue-300',
      titleColor: 'text-blue-600',
    },
    {
      title: 'تاجي القرآن',
      desc: 'رحلة حفظ ممتعة، حدد وردك اليومي، وسجل تقدمك في السور والآيات لتفتح صناديق الكنوز المخفية',
      img: quranKnooz,
      reward: '+١٠٠ نجمة 🌟',
      glowColor: 'hover:shadow-[0_20px_50px_rgba(245,158,11,0.18)] border-amber-100 hover:border-amber-300',
      titleColor: 'text-amber-600',
    },
    {
      title: 'حصنتي المسلم',
      desc: 'ابدأ يومك بذكر الله واختمه به، أذكارك هي درعك القوي الذي يحميك وتجمع بها آلاف الحسنات',
      img: tasbihKnooz,
      reward: '+٣٠ نجمة 🌟',
      glowColor: 'hover:shadow-[0_20px_50px_rgba(16,185,129,0.18)] border-emerald-100 hover:border-emerald-300',
      titleColor: 'text-emerald-600',
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.15,
        type: 'spring',
        stiffness: 80,
        damping: 12
      }
    }),
    hover: {
      scale: 1.04,
      y: -8,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  const imgVariants = {
    hover: { 
      scale: 1.1, 
      rotate: [0, -3, 3, -3, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-amber-100/10 via-emerald-50/10 to-emerald-100/15 px-6 sm:px-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3b82f6] mb-3">
            كنوز بطلنا الصغير
          </h2>
          <p className="text-lg text-slate-500 font-semibold">
            رحلة ممتة في طاعة الله
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              whileHover="hover"
              className={`bg-white border-2 border-slate-100 rounded-[32px] p-8 flex flex-col items-center text-center shadow-sm cursor-pointer transition-all duration-300 ${card.glowColor}`}
            >
              <div className="mb-6 flex items-center justify-center h-40">
                <motion.img 
                  variants={imgVariants}
                  src={card.img} 
                  alt={card.title} 
                  className="max-h-36 w-auto object-contain select-none"
                />
              </div>

              <h3 className={`text-xl font-extrabold mb-2 ${card.titleColor}`}>
                {card.title}
              </h3>

              <div className="mb-4 px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-black rounded-full shadow-sm flex items-center gap-1.5 select-none">
                <span>🏆</span>
                <span>الجائزة: {card.reward}</span>
              </div>

              <p className="text-slate-500 font-medium text-base leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
