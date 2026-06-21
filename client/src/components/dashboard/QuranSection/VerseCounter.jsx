import React from 'react';
import { BookOpen } from 'lucide-react';

export default function VerseCounter({
  verseCount,
  setVerseCount,
  selectedSurah,
  activeTheme,
  playPopSound
}) {
  const maxVal = selectedSurah ? selectedSurah.numberOfAyahs : 286;

  return (
    <div>
      <label className="block text-right font-black text-slate-600 text-xs sm:text-sm mb-1.5">
        كم آية أنجزت يا بطل؟ 🌟
      </label>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => { setVerseCount(Math.max(1, verseCount - 1)); playPopSound(); }}
          className="w-12 h-12 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 font-black text-xl flex items-center justify-center border-2 border-slate-200 shadow-sm transition-all active:scale-90 cursor-pointer"
        >
          -
        </button>
        
        <input
          type="number"
          min="1"
          max={maxVal}
          value={verseCount}
          onChange={(e) => setVerseCount(Math.max(1, Math.min(maxVal, Number(e.target.value))))}
          className={`flex-1 py-3 px-4 rounded-2xl border-2 border-slate-200/85 text-center font-black text-lg focus:outline-none text-slate-800 bg-white ${activeTheme.inputFocus}`}
        />
        
        <button
          type="button"
          onClick={() => {
            setVerseCount(Math.min(maxVal, verseCount + 1));
            playPopSound();
          }}
          className="w-12 h-12 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 font-black text-xl flex items-center justify-center border-2 border-slate-200 shadow-sm transition-all active:scale-90 cursor-pointer"
        >
          +
        </button>
      </div>
      
      {selectedSurah && (
        <div className="text-left text-[10px] text-slate-400 font-extrabold mt-1.5 mr-1 flex items-center justify-end gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>أقصى حد لهذه السورة: {selectedSurah.numberOfAyahs} آية</span>
        </div>
      )}
    </div>
  );
}
