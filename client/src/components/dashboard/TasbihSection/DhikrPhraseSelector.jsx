import React from 'react';

export default function DhikrPhraseSelector({ phrases, activePhrase, handlePhraseChange }) {
  return (
    <div className="w-full bg-white/60 backdrop-blur-sm border border-slate-100 rounded-3xl p-4 mt-3 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {phrases.map((phrase) => {
          const isSelected = activePhrase === phrase.name;
          return (
            <button
              key={phrase.name}
              onClick={() => handlePhraseChange(phrase.name)}
              className={`py-4 px-3 rounded-2xl font-black text-sm sm:text-base text-center transition-all duration-200 active:scale-[0.96] cursor-pointer border ${
                isSelected
                  ? `${phrase.buttonBg} shadow-lg`
                  : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border-slate-200'
              }`}
            >
              {phrase.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
