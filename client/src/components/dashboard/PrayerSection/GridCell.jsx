import React, { memo } from 'react';
import gemBlue from '../../../assets/blue_gem.png';
import gemRed from '../../../assets/Diamond red.png';
import { playTickSound } from '../../../utils/audio';

const GridCell = memo(({ day, prayer, dayData, record, onCellClick, todayStr, nextPrayer }) => {
  const isPast = dayData?.dateStr ? dayData.dateStr < todayStr : false;
  const isToday = dayData?.dateStr ? dayData.dateStr === todayStr : false;
  const isFutureDay = dayData?.dateStr ? dayData.dateStr > todayStr : false;

  const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const nextPrayerName = nextPrayer?.name;
  let isTodayPrayerFuture = false;
  if (isToday && nextPrayerName) {
    const isTomorrowFajr = nextPrayerName === 'Fajr' && new Date().getHours() >= 6;
    if (!isTomorrowFajr) {
      const nextPrayerIndex = prayerNames.indexOf(nextPrayerName);
      const thisPrayerIndex = prayerNames.indexOf(prayer.key);
      isTodayPrayerFuture = thisPrayerIndex >= nextPrayerIndex;
    }
  }

  const isFuture = isFutureDay || isTodayPrayerFuture;
  const isCompleted = record?.status === 'COMPLETED' || record?.status === 'QADAA';
  
  const isMissed = !isFuture && (record?.status === 'MISSED' || (isPast && !isCompleted));
  const isPending = !isCompleted && !isMissed;
  
  const isActive = !isFuture;

  const isSuggested = isToday && !isFuture && (isPending || record?.status === 'MISSED');

  const handleClick = (e) => {
    if (!isActive) return;
    onCellClick({
      prayerName: prayer.key,
      prayerLabel: prayer.label,
      dateStr: dayData?.dateStr,
      dayLabel: day.label,
      status: record?.status || 'PENDING',
      event: e
    });
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => {
        if (isActive) playTickSound();
      }}
      disabled={!isActive}
      className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm relative shrink-0 ${
        isActive 
          ? 'bg-white cursor-pointer hover:scale-105 active:scale-95 hover:shadow-md' 
          : 'bg-white/95 border border-blue-100/30 cursor-default opacity-60'
      } ${
        isSuggested 
          ? 'border-2 border-blue-400 shadow-md shadow-blue-500/20' 
          : 'border border-blue-200/50'
      }`}
    >
      {isSuggested && (
        <span className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-blue-400 animate-ping opacity-25 pointer-events-none" />
      )}
      
      {isCompleted && (
        <img 
          src={record.location === 'MOSQUE' ? gemBlue : gemRed} 
          alt="جوهرة" 
          className="w-7 h-7 sm:w-10 sm:h-10 object-contain hover:scale-110 transition-transform duration-150 animate-bounce-slow" 
        />
      )}
      
      {isMissed && (
        <span className="text-xl sm:text-2xl filter drop-shadow-sm select-none">🖤</span>
      )}
      
      {isPending && !isToday && !isFuture && (
        <div className="w-2.5 h-2.5 rounded-full bg-blue-200/40" />
      )}
      
      {isPending && isToday && !isFuture && (
        <span className="text-blue-500 font-black text-lg sm:text-xl select-none animate-pulse">+</span>
      )}
    </button>
  );
});

GridCell.displayName = 'GridCell';

export default GridCell;
