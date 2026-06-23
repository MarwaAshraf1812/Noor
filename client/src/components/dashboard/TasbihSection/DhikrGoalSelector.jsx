import React, { memo } from 'react';
import { Hourglass, Check } from 'lucide-react';

const DhikrGoalSelector = memo(({ target, handleTargetChange }) => {
  return (
    <div className="md:col-span-3 flex flex-col gap-3">
      <div className="bg-white/70 border border-slate-100 rounded-3xl p-4 flex flex-col gap-3.5 shadow-sm">
        <h5 className="text-sm sm:text-base font-black text-slate-700 text-center flex flex-col items-center gap-1">
          <span>تحديد هدف البطل</span>
          <span className="text-[10px] text-slate-400">تحديد عدد المرات الكلية للبدء</span>
        </h5>
        
        <div className="flex flex-col gap-2.5">
          {[
            { count: 5, label: '5 مرات', color: 'text-purple-500' },
            { count: 10, label: '10 مرات', color: 'text-blue-500' },
            { count: 33, label: '33 مره', color: 'text-pink-500' }
          ].map((item) => {
            const isSelected = target === item.count;
            return (
              <button
                key={item.count}
                onClick={() => handleTargetChange(item.count)}
                className={`w-full py-3 px-4 rounded-2xl flex items-center justify-between border-2 transition-all duration-200 active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-50/40 shadow-md shadow-indigo-100/50'
                    : 'border-slate-200/70 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Hourglass className={`w-5 h-5 transition-transform ${isSelected ? `${item.color} animate-spin-slow` : 'text-slate-400'}`} />
                  <span className={`text-xs sm:text-sm font-black ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>
                    {item.label}
                  </span>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

DhikrGoalSelector.displayName = 'DhikrGoalSelector';

export default DhikrGoalSelector;
