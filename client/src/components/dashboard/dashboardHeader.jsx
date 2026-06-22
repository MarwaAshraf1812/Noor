import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import LevelUpModal from '../UI/LevelUpModal';
import EditProfileModal from '../UI/EditProfileModal';
import GemIMg from '../../assets/blue_gem.png';
import defaultAvatar from '../../assets/avatar_green_boy.png';

const getRankName = (lvl) => {
  if (lvl <= 1) return 'بطل مبتدئ 🌱';
  if (lvl <= 3) return 'مستكشف نور 🧭';
  if (lvl <= 5) return 'حارس الصلوات 🛡️';
  if (lvl <= 8) return 'بطل المساجد 🕌';
  return 'فارس النور الخارق 👑';
};

export default function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Auto-open Edit Profile modal if user has a Google/external profile photo 
  // and hasn't chosen one of our local companions yet
  useEffect(() => {
    if (user && user.avatar_url && !user.avatar_url.includes('avatar_') && !user.avatar_url.includes('avtar_')) {
      setShowEditProfile(true);
    }
  }, [user]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setShowInstallBtn(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };
  
  const gemsCount = user?.gems?.total ?? user?.gems ?? 0;
  const avatarSrc = user?.avatar_url || defaultAvatar;

  const isGirl = avatarSrc.toLowerCase().includes('girl');
  const greetingTitle = isGirl ? 'بطلة' : 'بطل';

  const level = user?.level ?? 1;
  const currentLevelProgress = gemsCount % 1000;
  const levelPercentage = Math.round((currentLevelProgress / 1000) * 100);

  useEffect(() => {
    const storedLevel = localStorage.getItem('noor_user_level');
    if (storedLevel) {
      const parsedStored = parseInt(storedLevel, 10);
      if (level > parsedStored) {
        setShowLevelUp(true);
      }
    }
    localStorage.setItem('noor_user_level', String(level));
  }, [level]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <header className="w-full flex justify-between items-center gap-3 py-3 px-4 sm:py-4 sm:px-6 md:px-12 bg-white/40 backdrop-blur-sm border-b z-50 border-slate-100/80 select-none relative" dir="rtl">
      
      <div className="flex items-center gap-2 sm:gap-3">
        <h2 className="text-base sm:text-2xl font-black text-[#3b82f6] tracking-tight flex items-center gap-1">
          <span className="hidden sm:inline">مرحبا يا {greetingTitle}</span>
          <span className="text-[#f59e0b] inline-block max-w-[70px] sm:max-w-none truncate align-bottom">
            {user?.name || 'عمر'}
          </span>
          <span className="hidden sm:inline">!</span>
        </h2>
        
        <div className="relative shrink-0">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="focus:outline-none cursor-pointer block"
            aria-expanded={showDropdown}
          >
            <img 
              src={avatarSrc} 
              alt="صورة البطل" 
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 sm:border-4 border-blue-100 shadow-sm hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
          </button>

          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setShowDropdown(false)}
              />
              
              <div className="absolute left-auto right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl shadow-xl z-40 py-2 text-right">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-black text-slate-800">{user?.name || 'عمر'}</p>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">المستوى {user?.level || 1}</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowEditProfile(true);
                    setShowDropdown(false);
                  }}
                  className="w-full text-right px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors duration-150 flex items-center gap-2 cursor-pointer border-b border-slate-100/60"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  <span>تعديل الملف الشخصي</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {showInstallBtn && (
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer animate-pulse shrink-0"
          >
            <svg className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="hidden xs:inline">تنزيل التطبيق</span>
          </button>
        )}

        <div id="header-gems-badge" className="flex items-center gap-2 sm:gap-3 bg-blue-50/50 px-2.5 py-1.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-blue-100/50 shadow-sm hover:scale-105 transition-transform duration-200">
          <img 
            src={GemIMg} 
            alt="جوهرة" 
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain animate-bounce" 
          />
          <span className="text-[#3b82f6] font-black text-lg sm:text-xl leading-none">
            {gemsCount}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-500/10 to-amber-600/5 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-2xl border-2 border-amber-200/60 shadow-sm hover:scale-[1.02] transition-all duration-200">
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 text-amber-500 hover:scale-110 transition-transform duration-200 shrink-0">
            <svg className="absolute w-full h-full drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.209l8.2-1.191L12 .587z" />
            </svg>
            <span className="absolute text-white font-black text-xs sm:text-base z-10 pb-0.5 drop-shadow-sm">
              {level}
            </span>
          </div>

          <div className="hidden sm:flex flex-col text-right justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-800 font-black text-xs sm:text-sm leading-none">
                المستوى {level}
              </span>
              <span className="bg-amber-100 text-amber-800 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md border border-amber-200/50">
                {getRankName(level)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-16 sm:w-32 h-1.5 sm:h-2 bg-amber-100/60 rounded-full overflow-hidden border border-amber-200/20">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${levelPercentage}%` }}
                />
              </div>
              <span className="text-amber-600 font-extrabold text-[8px] sm:text-[10px] whitespace-nowrap">
                {currentLevelProgress}/1000 XP
              </span>
            </div>
          </div>
        </div>
      </div>

      <LevelUpModal
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        level={level}
        rank={getRankName(level)}
      />

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />

    </header>
  );
}