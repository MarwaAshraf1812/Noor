import React from 'react';
import { Search } from 'lucide-react';
import { normalizeArabic } from '../../../utils/normalize';

export default function SurahSelector({
  surahsList,
  searchQuery,
  setSearchQuery,
  selectedSurah,
  setSelectedSurah,
  showDropdown,
  setShowDropdown,
  handleSelectSurah,
  quickSurahs,
  handleQuickSelect,
  activeTheme
}) {
  const filteredSurahs = surahsList.filter(s => {
    const normName = normalizeArabic(s.name);
    const normSearch = normalizeArabic(searchQuery);
    return normName.includes(normSearch) ||
           s.englishName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="relative">
      <label className="block text-right font-black text-slate-600 text-xs sm:text-sm mb-1.5 flex items-center gap-1">
        <span>اسم السورة الكريمة:</span>
      </label>
      
      <div className="relative">
        <input
          type="text"
          placeholder="ابحث عن السورة (مثلاً: النبأ)..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className={`w-full py-3.5 px-4 pl-10 rounded-2xl border-2 border-slate-200/80 bg-white font-bold text-slate-700 text-sm transition-all outline-none ${activeTheme.inputFocus}`}
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
      </div>

      {}
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        <span className="text-[10px] sm:text-xs font-black text-slate-400">سُوَر مقترحة:</span>
        {quickSurahs.map((qs) => (
          <button
            key={qs.name}
            type="button"
            onClick={() => handleQuickSelect(qs.searchKey)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border border-slate-200/60 font-bold text-[10px] sm:text-xs shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
          >
            {qs.name}
          </button>
        ))}
      </div>

      {}
      {showDropdown && filteredSurahs.length > 0 && (
        <div className="absolute right-0 left-0 mt-2 max-h-52 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl z-50 scrollbar-thin">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              type="button"
              onClick={() => handleSelectSurah(surah)}
              className="w-full text-right py-2.5 px-4 hover:bg-slate-50 font-bold text-slate-700 text-sm border-b border-slate-100 last:border-0 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-md ${activeTheme.accentBg} ${activeTheme.textTheme} font-black text-[10px] flex items-center justify-center`}>
                  {surah.number}
                </span>
                <span>{surah.name}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">({surah.numberOfAyahs} آية)</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
