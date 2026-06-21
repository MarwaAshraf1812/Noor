import React, { memo } from 'react';
import GridCell from './GridCell';

const WEEKDAYS = [
  { key: 6, label: 'السبت' },
  { key: 0, label: 'الأحد' },
  { key: 1, label: 'الأثنين' },
  { key: 2, label: 'الثلاثاء' },
  { key: 3, label: 'الاربعاء' },
  { key: 4, label: 'الخميس' },
  { key: 5, label: 'الجمعه' },
];

const PRAYERS = [
  { key: 'Fajr', label: 'الفجر' },
  { key: 'Dhuhr', label: 'الظهر' },
  { key: 'Asr', label: 'العصر' },
  { key: 'Maghrib', label: 'المغرب' },
  { key: 'Isha', label: 'العشاء' },
];

const WeeklyGrid = memo(({ weeklyCompletedCount, weeklyDataMapped, todayStr, nextPrayer, onCellClick }) => {
  return (
    <div className="bg-gradient-to-r from-[#ACCCF2] to-[#557AA7] text-white shadow-xl shadow-blue-100/10 rounded-3xl p-5 sm:p-6 w-full relative overflow-hidden border-2 border-white/10 flex flex-col gap-6">
      
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        <div className="text-right">
          <h3 className="text-xl sm:text-2xl font-black drop-shadow-sm flex items-center gap-2 justify-start">
            <span>صلوات الأسبوع</span>
            <span>⚡</span>
          </h3>
          <p className="text-xs sm:text-sm font-bold text-blue-100 mt-1">
            كل صلاة ستصليها ستقربك من جوهره جديدة!
          </p>
        </div>

        <div className="self-start sm:self-center bg-[#2b4c73] border border-blue-300/30 text-white font-extrabold px-4 py-2 rounded-2xl text-xs sm:text-sm shadow-md transition-transform duration-200 hover:scale-[1.03] select-none">
          صلاة الاسبوع {weeklyCompletedCount}/35
        </div>

      </div>

      <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">

        <div className="flex-1 flex flex-col gap-3 overflow-x-auto pb-2">
          
          <div className="flex items-center gap-2 sm:gap-3 justify-start min-w-[340px]">
            <div className="w-20 sm:w-24 shrink-0" />
            
            {WEEKDAYS.map((day) => (
              <div key={day.key} className="w-10 sm:w-14 text-center text-xs sm:text-sm font-black text-blue-100 select-none shrink-0">
                {day.label}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 min-w-[340px]">
            {PRAYERS.map((prayer) => (
              <div key={prayer.key} className="flex items-center gap-2 sm:gap-3 justify-start">
                
                <div className="w-20 sm:w-24 py-2 bg-white text-[#2b4c73] font-black text-xs sm:text-sm rounded-xl shadow-md border border-blue-200/50 flex items-center justify-center gap-1 shrink-0 select-none">
                  <span>{prayer.label}</span>
                  <span className="text-[10px] sm:text-xs">🕌</span>
                </div>

                {WEEKDAYS.map((day) => {
                  const dayData = weeklyDataMapped[day.key];
                  const record = dayData?.prayers?.[prayer.key];
                  
                  return (
                    <GridCell
                      key={day.key}
                      day={day}
                      prayer={prayer}
                      dayData={dayData}
                      record={record}
                      onCellClick={onCellClick}
                      todayStr={todayStr}
                      nextPrayer={nextPrayer}
                    />
                  );
                })}

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
});

WeeklyGrid.displayName = 'WeeklyGrid';

export default WeeklyGrid;
export { WEEKDAYS, PRAYERS };
