import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { playPopSound, playChimeSound } from '../../../utils/audio';
import { spawnFlyingGems } from '../../../utils/effects';
import useAdhkarStore from '../../../store/adhkarStore';

import AdhkarTabNav from './AdhkarTabNav';
import AdhkarProgressBar from './AdhkarProgressBar';
import AdhkarCard from './AdhkarCard';
import AdhkarMascotFooter from './AdhkarMascotFooter';
import CelebrationModal from '../../UI/CelebrationModal';

const ADHKAR_DATA = {
  morning: {
    title: "أذكار الصباح",
    theme: "from-[#FFFDF0] to-[#FFF9D6] border-[#FFD56B]",
    textColor: "text-[#856404]",
    accentColor: "bg-[#FFF3CD]",
    progressBarColor: "bg-[#FBC02D]",
    illustration: "☀️",
    bgEmoji: "🐥",
    items: [
      { id: 'm1', text: "آية الكرسي", target: 1, color: "bg-[#F3E5F5] text-[#4A148C] border-[#E1BEE7]" },
      { id: 'm3', text: "سورة الاخلاص", target: 3, color: "bg-[#E8F5E9] text-[#1B5E20] border-[#C8E6C9]" },
      { id: 'm4', text: "سورة الفلق", target: 3, color: "bg-[#FFFDE7] text-[#F57F17] border-[#FFF9C4]" },
      { id: 'm2', text: "سورة الناس", target: 3, color: "bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]" },
      { id: 'm5', text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", target: 1, color: "bg-[#F3E5F5] text-[#4A148C] border-[#E1BEE7]" },
      { id: 'm6', text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", target: 3, color: "bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]" },
      { id: 'm7', text: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ، فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ", target: 3, color: "bg-[#FFFDE7] text-[#F57F17] border-[#FFF9C4]" },
      { id: 'm8', text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", target: 3, color: "bg-[#E8F5E9] text-[#1B5E20] border-[#C8E6C9]" },
      { id: 'm9', text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", target: 3, color: "bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]" },
    ]
  },
  evening: {
    title: "أذكار المساء",
    theme: "from-[#F0F4FF] to-[#DCE6FF] border-[#ADC4FF]",
    textColor: "text-[#1E3A8A]",
    accentColor: "bg-[#EDF2FF]",
    progressBarColor: "bg-[#3B82F6]",
    illustration: "🌙",
    bgEmoji: "🦉",
    items: [
      { id: 'e1', text: "آية الكرسي", target: 1, color: "bg-[#F3E5F5] text-[#4A148C] border-[#E1BEE7]" },
      { id: 'e3', text: "سورة الاخلاص", target: 3, color: "bg-[#E8F5E9] text-[#1B5E20] border-[#C8E6C9]" },
      { id: 'e4', text: "سورة الفلق", target: 3, color: "bg-[#FFFDE7] text-[#F57F17] border-[#FFF9C4]" },
      { id: 'e2', text: "سورة الناس", target: 3, color: "bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]" },
      { id: 'e5', text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", target: 1, color: "bg-[#F3E5F5] text-[#4A148C] border-[#E1BEE7]" },
      { id: 'e6', text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", target: 3, color: "bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]" },
      { id: 'e7', text: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ، فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ", target: 3, color: "bg-[#FFFDE7] text-[#F57F17] border-[#FFF9C4]" },
      { id: 'e8', text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", target: 3, color: "bg-[#E8F5E9] text-[#1B5E20] border-[#C8E6C9]" },
      { id: 'e9', text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", target: 3, color: "bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]" },
    ]
  },
  sleep: {
    title: "أذكار عند النوم",
    theme: "from-[#F5F3FF] to-[#EDE9FE] border-[#C084FC]",
    textColor: "text-[#5B21B6]",
    accentColor: "bg-[#F5F3FF]",
    progressBarColor: "bg-[#8B5CF6]",
    illustration: "🏠💤",
    bgEmoji: "🌙",
    items: [
      { id: 's1', text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ", target: 1, color: "bg-[#F3E5F5] text-[#4A148C] border-[#E1BEE7]" },
      { id: 's2', text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", target: 3, color: "bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]" },
      { id: 's3', text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", target: 1, color: "bg-[#FFFDE7] text-[#F57F17] border-[#FFF9C4]" },
    ]
  },
  home: {
    title: "الخروج من المنزل",
    theme: "from-[#F0FDF4] to-[#DCFCE7] border-[#86EFAC]",
    textColor: "text-[#166534]",
    accentColor: "bg-[#F0FDF4]",
    progressBarColor: "bg-[#22C55E]",
    illustration: "🌳🚪",
    bgEmoji: "🚗",
    items: [
      { id: 'h1', text: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", target: 1, color: "bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]" },
      { id: 'h2', text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ", target: 1, color: "bg-[#F3E5F5] text-[#4A148C] border-[#E1BEE7]" },
    ]
  },
  eating: {
    title: "عند الطعام",
    theme: "from-[#FFF7ED] to-[#FFEDD5] border-[#FDBA74]",
    textColor: "text-[#9A3412]",
    accentColor: "bg-[#FFF7ED]",
    progressBarColor: "bg-[#F97316]",
    illustration: "🍲🥗",
    bgEmoji: "🥕",
    items: [
      { id: 'f1', text: "عند البدء: بِسْمِ اللَّهِ (ولو نسي: بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ)", target: 1, color: "bg-[#F3E5F5] text-[#4A148C] border-[#E1BEE7]" },
      { id: 'f2', text: "عند الانتهاء: الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا، وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ", target: 1, color: "bg-[#FFFDE7] text-[#F57F17] border-[#FFF9C4]" },
    ]
  }
};

export default function AdhkarSection() {
  const [activeTab, setActiveTab] = useState('morning');
  const [progressCounts, setProgressCounts] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationConfig, setCelebrationConfig] = useState(null);

  const { dashboardData, fetchDashboard, submitSession } = useAdhkarStore();

  const currentCategory = ADHKAR_DATA[activeTab];
  const items = currentCategory.items;

  
  useEffect(() => {
    fetchDashboard().catch(e => console.error(e));
  }, [fetchDashboard]);

  
  useEffect(() => {
    const backendKey = activeTab.toUpperCase() === 'EVENING' ? 'NIGHT' : activeTab.toUpperCase();
    const isDbCompleted = dashboardData?.todayStatus?.[backendKey] === true;

    const initialProgress = {};
    items.forEach(item => {
      if (isDbCompleted) {
        initialProgress[item.id] = 0;
      } else {
        const key = `noor_adhkar_${item.id}`;
        const savedVal = localStorage.getItem(key);
        initialProgress[item.id] = savedVal !== null ? parseInt(savedVal, 10) : item.target;
      }
    });
    setProgressCounts(initialProgress);
  }, [activeTab, items, dashboardData]);

  
  const totalTargetCount = items.reduce((acc, item) => acc + item.target, 0);
  const currentCompletedCount = items.reduce((acc, item) => {
    const remaining = progressCounts[item.id] ?? item.target;
    return acc + (item.target - remaining);
  }, 0);
  
  const completionPercentage = totalTargetCount > 0 
    ? Math.round((currentCompletedCount / totalTargetCount) * 100) 
    : 0;

  
  const handleDhikrClick = async (item, event) => {
    const currentRemaining = progressCounts[item.id] ?? item.target;
    if (currentRemaining <= 0) return; 

    const newRemaining = currentRemaining - 1;
    
    
    setProgressCounts(prev => ({ ...prev, [item.id]: newRemaining }));
    localStorage.setItem(`noor_adhkar_${item.id}`, String(newRemaining));

    
    if (newRemaining === 0) {
      playChimeSound();
      if (event?.currentTarget) {
        spawnFlyingGems(event.currentTarget, 8);
      }
    } else {
      playPopSound(500);
    }

    
    const isAllCompleted = items.every(itm => {
      if (itm.id === item.id) return newRemaining === 0;
      return (progressCounts[itm.id] ?? itm.target) === 0;
    });

    if (isAllCompleted) {
      let gemsGained = 40; 
      let gemsText = '+4 جواهر';

      const backendKey = activeTab.toUpperCase() === 'EVENING' ? 'NIGHT' : activeTab.toUpperCase();
      const supportedCategories = ['MORNING', 'NIGHT', 'SLEEP'];

      if (supportedCategories.includes(backendKey)) {
        try {
          const res = await submitSession(activeTab);
          if (res) {
            gemsGained = res.gemsEarned || 40;
            gemsText = `+${gemsGained / 10} جواهر`;
          }
        } catch (err) {
          console.warn('Session already submitted or failed:', err.message);
        }
      }

      setCelebrationConfig({
        badgeText: gemsText,
        title: `ما شاء الله! أتممت ${currentCategory.title} 🎉`,
        description: `قلت كل أذكار ${currentCategory.title} بنجاح - يومك سيكون مباركاً إن شاء الله! 🤲`,
        stats: [
          { value: `${items.length}/${items.length}`, label: 'أذكار مقروءة', color: 'text-purple-700' },
          { value: 'مبارك 🌸', label: 'البركة اليومية', color: 'text-green-600' },
          { value: `+${gemsGained}`, label: 'نقطة حسنات', color: 'text-[#3b82f6]' }
        ]
      });

      setTimeout(() => {
        setShowCelebration(true);
      }, 600);
    }
  };

  const handleReset = () => {
    const resetProgress = {};
    items.forEach(item => {
      localStorage.setItem(`noor_adhkar_${item.id}`, String(item.target));
      resetProgress[item.id] = item.target;
    });
    setProgressCounts(resetProgress);
  };

  return (
    <div className="w-full flex flex-col gap-4" dir="rtl">
      
      {}
      <AdhkarTabNav
        activeTab={activeTab}
        onTabSelect={setActiveTab}
        categories={ADHKAR_DATA}
      />

      {}
      <div className={`w-full rounded-[36px] p-6 bg-gradient-to-br ${currentCategory.theme} border-4 transition-all duration-500 shadow-xl relative overflow-hidden select-none min-h-[480px] flex flex-col gap-6`}>
        
        {}
        <div className="absolute top-6 left-6 text-6xl opacity-30 select-none animate-pulse">
          {currentCategory.illustration}
        </div>
        <div className="absolute bottom-16 right-16 text-6xl opacity-20 select-none animate-bounce-slow">
          {currentCategory.bgEmoji}
        </div>

        {}
        <AdhkarProgressBar
          category={currentCategory}
          percentage={completionPercentage}
          onReset={handleReset}
        />

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 z-10 flex-1">
          <AnimatePresence mode="popLayout">
            {items.map(item => (
              <AdhkarCard
                key={item.id}
                item={item}
                remaining={progressCounts[item.id] ?? item.target}
                onDhikrClick={handleDhikrClick}
              />
            ))}
          </AnimatePresence>
        </div>

        {}
        <AdhkarMascotFooter percentage={completionPercentage} />

      </div>

      {}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        {...celebrationConfig}
      />

    </div>
  );
}
