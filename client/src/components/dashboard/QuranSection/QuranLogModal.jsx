import React, { useState, useEffect } from 'react';
import useQuranStore from '../../../store/quranStore';
import { playPopSound, playChimeSound } from '../../../utils/audio';
import { spawnFlyingGems } from '../../../utils/effects';
import { X, Check, Sparkles } from 'lucide-react';
import CelebrationModal from '../../UI/CelebrationModal';
import SurahSelector from './SurahSelector';
import VerseCounter from './VerseCounter';
import { normalizeArabic } from '../../../utils/normalize';

export default function QuranLogModal({ isOpen, onClose, defaultType = 'HIFZ' }) {
  const { surahsList, fetchSurahs, submitSession } = useQuranStore();
  const [type, setType] = useState(defaultType);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verseCount, setVerseCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationConfig, setCelebrationConfig] = useState(null);

  
  const quickSurahs = [
    { name: 'الفاتحة', searchKey: 'الفاتحة' },
    { name: 'النبأ', searchKey: 'النبأ' },
    { name: 'الملك', searchKey: 'الملك' },
    { name: 'الإخلاص', searchKey: 'الإخلاص' },
    { name: 'الناس', searchKey: 'الناس' }
  ];

  
  useEffect(() => {
    if (isOpen) {
      fetchSurahs().catch(e => console.error(e));
      setType(defaultType);
      setVerseCount(1);
      setShowDropdown(false);
    }
  }, [isOpen, defaultType, fetchSurahs]);

  useEffect(() => {
    if (isOpen && surahsList.length > 0) {
      if (type === 'HIFZ') {
        const currentSurahName = useQuranStore.getState().dashboardData?.currentSurah?.surahName;
        if (currentSurahName) {
          const found = surahsList.find(s => s.name === currentSurahName);
          if (found) {
            setSelectedSurah(found);
            setSearchQuery(found.name);
            return;
          }
        }
      }
      setSelectedSurah(null);
      setSearchQuery('');
    }
  }, [type, isOpen, surahsList]);

  useEffect(() => {
    if (!searchQuery) {
      setSelectedSurah(null);
      return;
    }
    const normSearch = normalizeArabic(searchQuery);
    if (!normSearch) return;

    const exactMatch = surahsList.find(s => normalizeArabic(s.name) === normSearch);
    if (exactMatch) {
      setSelectedSurah(exactMatch);
    } else {
      setSelectedSurah(null);
    }
  }, [searchQuery, surahsList]);

  if (!isOpen) return null;

  const handleSelectSurah = (surah) => {
    setSelectedSurah(surah);
    setSearchQuery(surah.name);
    setShowDropdown(false);
    playPopSound();
  };

  const handleQuickSelect = (searchKey) => {
    const normKey = normalizeArabic(searchKey);
    const found = surahsList.find(s => normalizeArabic(s.name).includes(normKey));
    if (found) {
      handleSelectSurah(found);
    } else {
      setSearchQuery(searchKey);
      setShowDropdown(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSurah) {
      alert('الرجاء اختيار السورة الكريمة');
      return;
    }
    if (verseCount <= 0) {
      alert('عدد الآيات يجب أن يكون أكبر من الصفر');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await submitSession(selectedSurah.name, verseCount, type);
      
      playChimeSound();
      
      if (e.target) {
        spawnFlyingGems(e.target);
      }

      setCelebrationConfig({
        badgeText: `+${res.gemsEarned || 10} جوهرة`,
        title: type === 'HIFZ' ? 'أحسنت في الحفظ! 📖✨' : 'تقبل الله مراجعتك! 📿✨',
        description: res.message || `لقد سجلت بنجاح حفظ/مراجعة ${verseCount} آيات من ${selectedSurah.name}!`,
        stats: [
          { value: `${verseCount}`, label: 'عدد الآيات', color: 'text-[#4A90E2]' },
          { value: `${res.quranStreak || 1} أيام 🔥`, label: 'المتواصل', color: 'text-orange-600' },
          { value: `+${res.gemsEarned || 10}`, label: 'جواهر مكافأة', color: 'text-emerald-500' }
        ]
      });

      setShowCelebration(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || 'حدث خطأ أثناء تسجيل التقدم');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
    onClose();
  };

  const activeTheme = type === 'HIFZ' 
    ? {
        gradient: 'from-[#FFFFFF] to-[#E4FACC]',
        border: 'border-emerald-300/40',
        tabActive: 'bg-emerald-500 text-white shadow-md shadow-emerald-200/50',
        inputFocus: 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100',
        btnSubmit: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100 hover:shadow-emerald-200/50',
        textTheme: 'text-emerald-600',
        accentBg: 'bg-emerald-50'
      }
    : {
        gradient: 'from-[#FFFFFF] to-[#E6F4FF]',
        border: 'border-blue-300/40',
        tabActive: 'bg-[#4A90E2] text-white shadow-md shadow-blue-200/50',
        inputFocus: 'focus:border-[#4A90E2] focus:ring-2 focus:ring-blue-100',
        btnSubmit: 'bg-[#4A90E2] hover:bg-blue-600 shadow-blue-100 hover:shadow-blue-200/50',
        textTheme: 'text-blue-600',
        accentBg: 'bg-blue-50'
      };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fadeIn" dir="rtl">
        <div className={`bg-gradient-to-b ${activeTheme.gradient} w-full max-w-md rounded-[32px] border-4 ${activeTheme.border} shadow-2xl p-6 relative overflow-visible transition-all duration-300`}>
          
          {}
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all active:scale-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {}
          <div className="text-center mb-6 px-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
              <Sparkles className={`w-6 h-6 ${activeTheme.textTheme} animate-spin-slow`} />
              <span>سجل عملك الصالح في القرآن</span>
            </h3>
            <p className="text-xs sm:text-sm font-extrabold text-slate-400 mt-1">
              املأ البيانات لكي نكافئك بالجواهر ونقاط الخبرة! 💎✨
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
              <button
                type="button"
                onClick={() => { setType('HIFZ'); playPopSound(); }}
                className={`py-2.5 rounded-xl font-black text-sm transition-all duration-200 cursor-pointer ${
                  type === 'HIFZ' 
                    ? activeTheme.tabActive 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                📖 حفظ جديد
              </button>
              <button
                type="button"
                onClick={() => { setType('REVISION'); playPopSound(); }}
                className={`py-2.5 rounded-xl font-black text-sm transition-all duration-200 cursor-pointer ${
                  type === 'REVISION' 
                    ? activeTheme.tabActive 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                📿 مراجعة
              </button>
            </div>

            {}
            <SurahSelector
              surahsList={surahsList}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSurah={selectedSurah}
              setSelectedSurah={setSelectedSurah}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              handleSelectSurah={handleSelectSurah}
              quickSurahs={quickSurahs}
              handleQuickSelect={handleQuickSelect}
              activeTheme={activeTheme}
            />

            {}
            <VerseCounter
              verseCount={verseCount}
              setVerseCount={setVerseCount}
              selectedSurah={selectedSurah}
              activeTheme={activeTheme}
              playPopSound={playPopSound}
            />

            {}
            <button
              type="submit"
              disabled={isSubmitting || !selectedSurah}
              className={`w-full py-4 mt-2 rounded-3xl font-black text-lg text-white flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer ${
                !selectedSurah 
                  ? 'bg-slate-300 shadow-none cursor-not-allowed'
                  : activeTheme.btnSubmit
              }`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  <span>تأكيد وتسجيل العمل الصالح</span>
                </>
              )}
            </button>

          </form>
        </div>
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={handleCloseCelebration}
        {...celebrationConfig}
      />
    </>
  );
}
