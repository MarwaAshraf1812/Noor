import React from 'react';
import usePrayerStore from '../../store/prayerStore';


const GemIcon = ({ color = 'pink' }) => {
  let outerFill = '#ff4d6d';
  let innerFill = '#ff758f';
  let strokeColor = '#800f2f';
  let shadowColor = 'rgba(219,39,119,0.4)';

  if (color === 'blue') {
    outerFill = '#2563eb';
    innerFill = '#60a5fa';
    strokeColor = '#1e3a8a';
    shadowColor = 'rgba(37,99,235,0.4)';
  } else if (color === 'green') {
    outerFill = '#16a34a';
    innerFill = '#4ade80';
    strokeColor = '#14532d';
    shadowColor = 'rgba(22,163,74,0.4)';
  } else if (color === 'yellow') {
    outerFill = '#d97706';
    innerFill = '#fcd34d';
    strokeColor = '#78350f';
    shadowColor = 'rgba(217,119,6,0.4)';
  }

  return (
    <svg 
      className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse hover:scale-110 transition-transform duration-300 select-none z-10" 
      style={{ filter: `drop-shadow(0 3px 5px ${shadowColor})` }}
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M32 2L8 22L32 62L56 22L32 2Z" fill={outerFill} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 2L20 22L32 62L44 22L32 2Z" fill={innerFill} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
      <path d="M20 22H44" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 2V22" stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 2L26 22" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
      <path d="M32 2L38 22" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
    </svg>
  );
};

const PendingIcon = () => (
  <div className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] rounded-full bg-white border-2 border-white/95 shadow-md shadow-blue-900/10 hover:scale-110 transition-transform duration-300 z-10" />
);

export default function DiamondProgress({ 
  items = [], 
  gemColor = 'pink', 
  gemImg = '', 
  textColor = 'text-white',
  lineColor = 'bg-yellow-300'
}) {
  const { dashboardData } = usePrayerStore();
  const todayTimeline = dashboardData?.todayTimeline || {};

  const displayItems = items.length > 0 ? items : [
    { key: 'Fajr', label: 'الفجر', isCompleted: todayTimeline['Fajr']?.status === 'COMPLETED' || todayTimeline['Fajr']?.status === 'QADAA' },
    { key: 'Dhuhr', label: 'الظهر', isCompleted: todayTimeline['Dhuhr']?.status === 'COMPLETED' || todayTimeline['Dhuhr']?.status === 'QADAA' },
    { key: 'Asr', label: 'العصر', isCompleted: todayTimeline['Asr']?.status === 'COMPLETED' || todayTimeline['Asr']?.status === 'QADAA' },
    { key: 'Maghrib', label: 'المغرب', isCompleted: todayTimeline['Maghrib']?.status === 'COMPLETED' || todayTimeline['Maghrib']?.status === 'QADAA' },
    { key: 'Isha', label: 'العشاء', isCompleted: todayTimeline['Isha']?.status === 'COMPLETED' || todayTimeline['Isha']?.status === 'QADAA' }
  ];

  return (
    <div className="relative w-full py-2 select-none" dir="rtl">
      
      <div className="relative z-10 flex justify-between items-center w-full px-4 sm:px-6">
        <div className={`absolute top-4 left-8 right-8 h-[2.5px] ${lineColor} z-0 rounded-full shadow-sm opacity-90`} />

        {displayItems.map((item, index) => {
          const isCompleted = item.isCompleted;

          return (
            <div key={item.key || index} className="flex flex-col items-center gap-2 z-10">
              <div className="h-8 w-8 flex items-center justify-center">
                {isCompleted ? (
                  gemImg ? (
                    <img 
                      src={gemImg} 
                      alt="Gem" 
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain animate-pulse hover:scale-110 transition-transform duration-300" 
                    />
                  ) : (
                    <GemIcon color={gemColor} />
                  )
                ) : (
                  <PendingIcon />
                )}
              </div>

              {}
              <span className={`text-[11px] sm:text-xs font-black tracking-wide ${isCompleted ? `${textColor}` : `${textColor}/60`}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}