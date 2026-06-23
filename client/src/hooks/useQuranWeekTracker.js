import { useMemo } from 'react';

export default function useQuranWeekTracker(weeklyActivity = []) {
  const getTodayLocalMidnightInEgypt = () => {
    const offsetMs = 3 * 60 * 60 * 1000;
    const localTime = new Date(new Date().getTime() + offsetMs);
    const year = localTime.getUTCFullYear();
    const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localTime.getUTCDate()).padStart(2, '0');
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  };

  const weekDays = useMemo(() => {
    const today = getTodayLocalMidnightInEgypt();
    const dayOfWeek = today.getUTCDay(); 

    
    const diffToSaturday = dayOfWeek === 6 ? 0 : -(dayOfWeek + 1);

    const weekDaysArr = [];
    const arabicNames = [
      { name: 'السبت', code: 6 },
      { name: 'الأحد', code: 0 },
      { name: 'الأثنين', code: 1 },
      { name: 'الثلاثاء', code: 2 },
      { name: 'الاربعاء', code: 3 },
      { name: 'الخميس', code: 4 },
      { name: 'الجمعه', code: 5 }
    ];

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today);
      targetDate.setUTCDate(today.getUTCDate() + diffToSaturday + i);

      const activeItem = weeklyActivity.find(w => {
        const itemDate = new Date(w.date);
        return itemDate.getTime() === targetDate.getTime();
      });

      weekDaysArr.push({
        dayName: arabicNames[i].name,
        date: targetDate,
        isCompleted: activeItem ? activeItem.active : false,
        isToday: targetDate.getTime() === today.getTime()
      });
    }

    return weekDaysArr;
  }, [weeklyActivity]);

  return { weekDays, todayStr: getTodayLocalMidnightInEgypt().toISOString().split('T')[0] };
}
