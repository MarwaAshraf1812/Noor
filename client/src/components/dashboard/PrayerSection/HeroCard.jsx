import React, { memo } from 'react';
import DiamondProgress from '../../UI/DiamondProgress';
import TiltCard from '../../UI/TiltCard';
import avatarMascot from '../../../assets/noor_register_child.png';

const HeroCard = memo(({ completedCount, heroOfTodayMessage }) => {
  return (
    <TiltCard className="bg-gradient-to-l from-[#C4EB99] to-[#81A954] shadow-xl shadow-green-100/10 rounded-[28px] p-5 sm:p-6 w-full flex flex-col sm:flex-row items-center justify-between border-2 border-white/20 relative overflow-hidden" dir="rtl">
      
      <div className="shrink-0 mt-2 sm:mt-0 flex justify-center z-10 order-1 sm:order-2">
        <img 
          src={avatarMascot} 
          alt="نور" 
          className="w-28 h-28 sm:w-36 sm:h-36 object-contain select-none drop-shadow-md hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 flex flex-col gap-3 w-full text-right order-2 sm:order-1 pr-0 sm:pr-4">
        
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-[#234e15] drop-shadow-sm">
              بطل اليوم
            </h3>
          </div>
          
          <div className="bg-white/30 border border-white/20 text-[#234e15] font-extrabold px-3 py-1 rounded-full text-xs sm:text-sm select-none shadow-sm">
            {heroOfTodayMessage}
          </div>
        </div>

        <div className="w-full max-w-lg mt-1 select-none">
          <DiamondProgress textColor="text-[#234e15]" lineColor="bg-[#dfab52]" gemColor="pink" />
        </div>

      </div>

    </TiltCard>
  );
});

HeroCard.displayName = 'HeroCard';

export default HeroCard;
