import React from 'react';

export default function AdhkarTabNav({ activeTab, onTabSelect, categories }) {
  return (
    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 bg-white/60 p-2 rounded-2xl border border-slate-100/50 shadow-sm w-fit select-none">
      {Object.entries(categories).map(([key, value]) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onTabSelect(key)}
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-amber-100 text-amber-800 shadow-sm border border-amber-200/50 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="ml-1.5">{value.illustration}</span>
            {value.title}
          </button>
        );
      })}
    </div>
  );
}
