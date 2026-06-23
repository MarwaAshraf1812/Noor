import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import avatarBlueGirl from '../../assets/avatar_blue_girl.png';
import avatarGreenBoy from '../../assets/avatar_green_boy.png';
import avatarYellowBoy from '../../assets/avatar_yellow_boy.png';
import avatarYellowGirl from '../../assets/avatar_yellow_girl.png';
import avatarBlueBoy from '../../assets/avtar_blue_boy.png';
import avatarGreenGirl from '../../assets/avtar_green_girl.png';
import starImg from '../../assets/Star.png';
import gemBlueImg from '../../assets/blue_gem.png';

export const Avatars = () => {
  const avatarsList = [
    {
      name: 'أنس البطل',
      role: 'رفيق الصلاة',
      message: 'مرحباً يا بطل! هل أنت جاهز لنصلي الفجر معاً ونكسب أوسمة اليوم؟ صلاتنا هي سر سعادتنا!',
      img: avatarGreenBoy,
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      tagColor: 'bg-emerald-500 text-white'
    },
    {
      name: 'نورة الذكية',
      role: 'رفيقة القرآن',
      message: 'أهلاً بك يا صديقي! سأكون رفيقتك في تلاوة القرآن الكريم وحفظ السور ليزداد نور قلبنا!',
      img: avatarBlueGirl,
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
      tagColor: 'bg-cyan-500 text-white'
    },
    {
      name: 'سلمان المفكر',
      role: 'رفيق التسبيح',
      message: 'السلام عليكم! دعنا نسبح ونستغفر الله معاً لنملاً ميزان حسناتنا بالجواهر والكنوز!',
      img: avatarYellowBoy,
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      tagColor: 'bg-amber-500 text-slate-900'
    },
    {
      name: 'مريم اللطيفة',
      role: 'رفيقة الأذكار',
      message: 'أهلاً بكِ! أذكار الصباح والمساء تحفظنا طوال اليوم وتملأ حياتنا بالبهجة والأمان!',
      img: avatarYellowGirl,
      bgColor: 'bg-pink-500/10 border-pink-500/20',
      tagColor: 'bg-brand-pink text-white'
    },
    {
      name: 'يوسف الشجاع',
      role: 'بطل التحديات',
      message: 'هيا يا أصدقاء! لننافس جميعاً بشرف وهمة عالية ونصل إلى قمة لوحة الصدارة لنكون أبطال الأسبوع!',
      img: avatarBlueBoy,
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      tagColor: 'bg-indigo-600 text-white'
    },
    {
      name: 'جوري المرحة',
      role: 'نجمة الذكر',
      message: 'الذكر يملأ القلوب بالسرور والابتسامة! ما رأيك أن نردد "سبحان الله وبحمده" عشر مرات الآن؟',
      img: avatarGreenGirl,
      bgColor: 'bg-teal-500/10 border-teal-500/20',
      tagColor: 'bg-teal-500 text-white'
    }
  ];

  const [activeAvatar, setActiveAvatar] = useState(0);

  return (
    <section id="avatars" className="py-20 bg-gradient-to-b from-sky-100/50 via-sky-50 to-white relative overflow-hidden">
      
      {}
      <img src={starImg} alt="نجمة" className="absolute top-10 right-10 w-8 h-8 opacity-30 animate-pulse" />
      <img src={gemBlueImg} alt="جوهرة" className="absolute bottom-16 left-16 w-8 h-8 opacity-30 animate-float" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-pink font-extrabold text-lg bg-brand-pink/10 px-4 py-1.5 rounded-full">
            👾 أصدقاء الرحلة
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mt-4 mb-4">
            اختر صديقك المفضل في رحلة النور!
          </h2>
          <p className="text-lg text-slate-600 font-bold">
            اضغط على أي صديق ليتحدث إليك ويوجه لك نصيحة لطيفة! اختر رفيقك المفضل وابدأ رحلتك معه الآن.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeAvatar}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center"
              >
                {}
                <div className="relative bg-white p-6 rounded-[32px] border-4 border-brand-purple shadow-xl text-center max-w-md w-full mb-8">
                  <div className="absolute -bottom-4 right-1/2 translate-x-1/2 w-8 h-8 bg-white border-r-4 border-b-4 border-brand-purple rotate-45"></div>
                  <p className="text-slate-700 font-bold text-lg leading-relaxed">
                    "{avatarsList[activeAvatar].message}"
                  </p>
                </div>

                {}
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-purple/10 rounded-full blur-2xl transform scale-125 -z-10"></div>
                  <motion.img 
                    src={avatarsList[activeAvatar].img} 
                    alt={avatarsList[activeAvatar].name} 
                    className="w-64 h-64 object-contain drop-shadow-2xl"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                <div className="mt-4 text-center">
                  <h3 className="text-2xl font-black text-slate-800">{avatarsList[activeAvatar].name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black mt-1 ${avatarsList[activeAvatar].tagColor}`}>
                    {avatarsList[activeAvatar].role}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {avatarsList.map((avatar, index) => {
                const isActive = activeAvatar === index;
                return (
                  <motion.button
                    key={index}
                    onClick={() => setActiveAvatar(index)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-3xl border-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-brand-purple/15 border-brand-purple shadow-lg shadow-brand-purple/10 scale-102' 
                        : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <img 
                      src={avatar.img} 
                      alt={avatar.name} 
                      className={`w-24 h-24 object-contain mb-3 transition-transform ${
                        isActive ? 'scale-110 drop-shadow-md' : 'opacity-85 hover:opacity-100'
                      }`}
                    />
                    <span className="font-extrabold text-slate-800">{avatar.name}</span>
                    <span className="text-xs text-slate-500 font-semibold mt-0.5">{avatar.role}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

        </div>

        {}
        <div className="mt-16 text-center">
          <motion.a
            href="/auth"
            className="inline-block px-10 py-5 bg-gradient-to-r from-brand-pink to-brand-purple text-white text-2xl font-black rounded-3xl shadow-xl shadow-brand-pink/20 border-b-6 border-purple-800 active:border-b-0 active:translate-y-1 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            سجل الآن واختر رفيقك! 🎮
          </motion.a>
        </div>

      </div>
    </section>
  );
};
