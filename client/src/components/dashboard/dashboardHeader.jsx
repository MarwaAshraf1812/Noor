import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import GemIMg from '../../assets/blue_gem.png';
import defaultAvatar from '../../assets/avatar_green_boy.png';

export default function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const gemsCount = user?.gems?.total ?? user?.gems ?? 0;
  const avatarSrc = user?.avatar_url || defaultAvatar;

  const isGirl = avatarSrc.toLowerCase().includes('girl');
  const greetingTitle = isGirl ? 'بطلة' : 'بطل';

  const level = user?.level ?? 1;
  const currentLevelProgress = gemsCount % 500;
  const levelPercentage = Math.round((currentLevelProgress / 500) * 100);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <header className="w-full flex justify-between items-center gap-3 py-3 px-4 sm:py-4 sm:px-6 md:px-12 bg-white/40 backdrop-blur-sm border-b border-slate-100/80 select-none relative" dir="rtl">
      
      <div className="flex items-center gap-2 sm:gap-3">
        <h2 className="text-base sm:text-2xl font-black text-[#3b82f6] tracking-tight flex items-center gap-1">
          <span>مرحبا يا {greetingTitle}</span>
          <span className="text-[#f59e0b] inline-block max-w-[70px] sm:max-w-none truncate align-bottom">
            {user?.name || 'عمر'}
          </span>
          <span>!</span>
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
              
              <div className="absolute left-0 sm:right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl shadow-xl z-40 py-2 text-right">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-black text-slate-800">{user?.name || 'عمر'}</p>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">المستوى {user?.level || 1}</p>
                </div>
                
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
        <div id="header-gems-badge" className="flex items-center gap-1 sm:gap-2 bg-blue-50/50 px-2 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-blue-100/50 shadow-sm hover:scale-105 transition-transform duration-200">
          <img 
            src={GemIMg} 
            alt="جوهرة" 
            className="w-4 h-4 sm:w-6 sm:h-6 object-contain animate-bounce" 
          />
          <span className="text-[#3b82f6] font-black text-sm sm:text-xl leading-none">
            {gemsCount}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 bg-amber-50/50 px-2 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-amber-100/50 shadow-sm hover:scale-105 transition-all duration-200">
          <div className="relative flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 text-amber-500 hover:scale-110 transition-transform duration-200 shrink-0">
            <svg className="absolute w-full h-full drop-shadow-[0_1.5px_3px_rgba(245,158,11,0.2)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.209l8.2-1.191L12 .587z" />
            </svg>
            <span className="absolute text-white font-black text-[9px] sm:text-sm z-10 pb-0.5">
              {level}
            </span>
          </div>

          <div className="hidden min-[380px]:flex flex-col text-right justify-center">
            <span className="text-amber-700 font-black text-[9px] sm:text-xs leading-none">
              المستوى {level}
            </span>
            <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
              <div className="w-12 sm:w-24 h-1 sm:h-1.5 bg-amber-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${levelPercentage}%` }}
                />
              </div>
              <span className="text-amber-600 font-extrabold text-[7px] sm:text-[9px] whitespace-nowrap">
                {currentLevelProgress}/500
              </span>
            </div>
          </div>
        </div>
      </div>

    </header>
  );
}