import React, { useEffect, useState } from 'react';
import DashboardProgress from './dashboardProgress';
import PrayerCard from './PrayerCard';
import QuranCard from './QuranCard';
import TasbihCard from './TasbihCard';
import WelcomeNotification from './WelcomeNotification';
import CelebrationModal from '../../UI/CelebrationModal';
import useAuthStore from '../../../store/authStore';
import usePrayerStore from '../../../store/prayerStore';
import defaultAvatar from '../../../assets/avatar_green_boy.png';
import { playPopSound } from '../../../utils/audio';

export default function DailySection() {
  const user = useAuthStore((state) => state.user);
  const { dashboardData } = usePrayerStore();
  const [showNotification, setShowNotification] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationConfig, setCelebrationConfig] = useState(null);
  
  const completedCount = dashboardData?.completedCount ?? 0;
  const avatarSrc = user?.avatar_url || defaultAvatar;
  const level = user?.level ?? 1;

  useEffect(() => {
    if (completedCount === 5) {
      const todayStr = new Date().toISOString().split('T')[0];
      const key = `noor_salah_celebrated_${todayStr}`;
      const alreadyShown = localStorage.getItem(key);
      if (!alreadyShown) {
        setCelebrationConfig({
          badgeText: '+5 جواهر',
          title: 'ما شاء الله! أتممت صلاتك',
          description: 'صليت كل الصلوات الخمس اليوم. استمر وحافظ على هذه العادة الجميلة!',
          stats: [
            { value: '5/5', label: 'صلوات', color: 'text-slate-700' },
            { value: `${dashboardData?.streak || 0} 🔥`, label: 'أيام متتالية', color: 'text-orange-600' },
            { value: `+${(dashboardData?.streak || 0) * 10 || 50}`, label: 'نقطة', color: 'text-[#3b82f6]' }
          ]
        });
        setShowCelebration(true);
        localStorage.setItem(key, 'true');
      }
    }
  }, [completedCount, dashboardData?.streak]);

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

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        {...celebrationConfig}
      />

    </div>
  );
}
