import React, { useEffect, useState } from 'react';
import DashboardProgress from './dashboardProgress';
import PrayerCard from './PrayerCard';
import QuranCard from './QuranCard';
import TasbihCard from './TasbihCard';
import WelcomeNotification from './WelcomeNotification';
import useAuthStore from '../../../store/authStore';
import usePrayerStore from '../../../store/prayerStore';
import defaultAvatar from '../../../assets/avatar_green_boy.png';
import { playPopSound } from '../../../utils/audio';

export default function DailySection() {
  const user = useAuthStore((state) => state.user);
  const { dashboardData } = usePrayerStore();
  const [showNotification, setShowNotification] = useState(false);
  
  const completedCount = dashboardData?.completedCount ?? 0;
  const avatarSrc = user?.avatar_url || defaultAvatar;
  const level = user?.level ?? 1;

  useEffect(() => {
    const hasShown = sessionStorage.getItem('noor_welcome_shown');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setShowNotification(true);
        playPopSound(450);
        sessionStorage.setItem('noor_welcome_shown', 'true');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const getGreetingMessage = () => {
    if (completedCount === 0) {
      return `مرحباً يا بطل! 🌟 يوم جديد ومغامرة جديدة لجمع الجواهر والحسنات! هيا نبدأ بالصلاة والذكر! 🚀`;
    } else if (completedCount < 5) {
      return `أحسنت يا بطل! لقد جمعت ${completedCount} جواهر صلاة حتى الآن! 💎 هيا نكمل باقي الصلوات لنحصل على الكأس! 🏆`;
    } else {
      return `مذهل جداً يا بطل الأبطال! 🏆 لقد أتممت جميع صلواتك اليوم وجمعت كل الجواهر! أنت رائع بحق! 🌟`;
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1 relative bg-gradient-to-b from-[#F8FBFF] to-[#FFFDE7] p-3.5 sm:p-6 rounded-[28px] sm:rounded-[36px]" dir="rtl">
      
      <h3 className="text-base sm:text-xl md:text-2xl font-black text-[#1e3a8a] text-center mb-0 flex items-center gap-2 select-none">
        أهلاً يا بطل! كم جوهرة سنجمع اليوم؟ 💎
      </h3>
      
      <DashboardProgress />
      
      <div className="w-full grid grid-cols-12 gap-3 sm:gap-4 mt-1">
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          <QuranCard />
          <TasbihCard />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <PrayerCard />
        </div>
      </div>

      <WelcomeNotification
        show={showNotification}
        onClose={() => setShowNotification(false)}
        avatarSrc={avatarSrc}
        level={level}
        message={getGreetingMessage()}
      />

    </div>
  );
}
