import React, { memo } from 'react';
import heroFagr from '../../../assets/hero_of_fagr.png';
import heroWeek from '../../../assets/hero_of_week.png';
import friendQuran from '../../../assets/friend_of_quran.png';

const AchievementsCard = memo(({ achievements = [] }) => {
  const badgeList = [
    { name: 'فارس الفجر', image: heroFagr, desc: 'صلاة الفجر بالمسجد 7 أيام' },
    { name: 'بطل الأسبوع', image: heroWeek, desc: 'الحفاظ على الصلوات لـ 7 أيام' },
    { name: 'صديق القرآن', image: friendQuran, desc: 'ملازمة قراءة القرآن' },
  ];

  return (
    <div className="bg-gradient-to-br from-[#ffd54f] via-[#ffb300] to-[#ff8f00] text-amber-950 shadow-xl shadow-amber-200/25 rounded-3xl p-6 w-full text-center relative border-4 border-amber-200/50 hover:scale-[1.02] transition-transform duration-300">
      
      <h3 className="text-xl sm:text-2xl font-black drop-shadow-sm flex items-center gap-2 justify-center mb-5 text-amber-950">
        <span>الانجازات</span>
        <span>🏆</span>
      </h3>

      <div className="flex justify-around items-center gap-3 py-2">
        {badgeList.map((badge) => {
          const isUnlocked = achievements.includes(badge.name);
          return (
            <div key={badge.name} className="flex flex-col items-center gap-2 relative group">
              
              <div className="relative">
                <img 
                  src={badge.image} 
                  alt={badge.name} 
                  className={`w-16 h-16 sm:w-20 sm:h-20 object-contain transition-all duration-300 select-none ${
                    isUnlocked 
                      ? 'drop-shadow-[0_4px_10px_rgba(245,158,11,0.65)] hover:scale-110' 
                      : 'grayscale opacity-40 hover:scale-105'
                  }`}
                />
                
                {!isUnlocked && (
                  <div className="absolute -bottom-1 -left-1 bg-amber-900 border border-amber-100 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-md">
                    🔒
                  </div>
                )}
              </div>

              <span className="text-xs sm:text-sm font-black text-amber-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                {badge.name}
              </span>

              <div className="absolute bottom-full mb-2 bg-slate-900/90 text-white text-[10px] sm:text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-md z-30">
                {badge.desc}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
});

AchievementsCard.displayName = 'AchievementsCard';

export default AchievementsCard;
