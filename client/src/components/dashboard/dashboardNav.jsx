import React from 'react';

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PrayerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V10a7 7 0 00-14 0v11M3 21h18M12 3v4m-2-2h4" />
  </svg>
);

const AdhkarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const QuranIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const TasbihIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 5v4m0 4h.01" />
  </svg>
);

export default function DashboardNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'yomy', label: 'يومي', icon: <HomeIcon /> },
    { id: 'prayers', label: 'صلاتي', icon: <PrayerIcon /> },
    { id: 'adhkar', label: 'الاذكار', icon: <AdhkarIcon /> },
    { id: 'quran', label: 'القران', icon: <QuranIcon /> },
    { id: 'tasbih', label: 'تسبيح', icon: <TasbihIcon /> }
  ];

  return (
    <>
      <div className="hidden sm:flex w-full justify-center py-6 bg-white/40 border-b border-slate-100/50">
        <nav className="flex items-center gap-4 sm:gap-6 md:gap-8 justify-center select-none bg-transparent" dir="rtl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab?.(tab.id)}
              className={`px-5 py-2 rounded-2xl text-sm sm:text-base md:text-lg font-black whitespace-nowrap transition-all duration-200 cursor-pointer bg-transparent ${
                activeTab === tab.id
                  ? 'text-[#3b82f6] scale-110'
                  : 'text-[#475569] hover:text-[#1e293b]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <nav className="flex sm:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-100/80 shadow-xl shadow-slate-200/30 rounded-3xl py-2 px-3 justify-around items-center z-50 select-none max-w-lg mx-auto" dir="rtl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab?.(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3.5 rounded-xl transition-all duration-300 cursor-pointer bg-transparent ${
                isActive
                  ? 'text-[#3b82f6] scale-110 font-bold'
                  : 'text-[#64748b] hover:text-[#334155]'
              }`}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] font-black tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}