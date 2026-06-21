import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import useTasbihStore from '../../../store/tasbihStore';
import useAuthStore from '../../../store/authStore';
import heroOfTasbih from '../../../assets/noor_register.png';
import blueGem from '../../../assets/blue_gem.png';
import { playPopSound, playChimeSound } from '../../../utils/audio';
import DhikrProgressTrack from './DhikrProgressTrack';
import DhikrMascot from './DhikrMascot';
import DhikrCounterRing from './DhikrCounterRing';
import DhikrGoalSelector from './DhikrGoalSelector';
import DhikrPhraseSelector from './DhikrPhraseSelector';
import DhikrCelebrationModal from './DhikrCelebrationModal';

const PHRASES = [
  {
    name: 'سبحان الله',
    colorToken: 'green',
    strokeColor: '#84cc16',
    glowColor: 'rgba(132, 204, 22, 0.35)',
    buttonBg: 'bg-[#84cc16] hover:bg-[#72b012] text-white',
    badgeBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    activeBorder: 'border-[#84cc16]',
    textClass: 'text-[#84cc16]'
  },
  {
    name: 'الله و اكبر',
    colorToken: 'yellow',
    strokeColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.35)',
    buttonBg: 'bg-[#eab308] hover:bg-[#ca8a04] text-white',
    badgeBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    activeBorder: 'border-[#eab308]',
    textClass: 'text-[#eab308]'
  },
  {
    name: 'الحمد لله',
    colorToken: 'purple',
    strokeColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    buttonBg: 'bg-[#a855f7] hover:bg-[#9333ea] text-white',
    badgeBg: 'bg-purple-50 text-purple-600 border border-purple-100',
    activeBorder: 'border-[#a855f7]',
    textClass: 'text-[#a855f7]'
  },
  {
    name: 'سبحان الله وبحمده',
    colorToken: 'orange',
    strokeColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.35)',
    buttonBg: 'bg-[#f97316] hover:bg-[#ea580c] text-white',
    badgeBg: 'bg-orange-50 text-orange-600 border border-orange-100',
    activeBorder: 'border-[#f97316]',
    textClass: 'text-[#f97316]'
  }
];

export default function TasbihSection() {
  const { user } = useAuthStore();
  const { dashboardData, fetchDashboard, submitSession } = useTasbihStore();

  const [activePhrase, setActivePhrase] = useState('اختر الذكر');
  const [target, setTarget] = useState(33);
  const [currentCount, setCurrentCount] = useState(0);
  const [floatingParticles, setFloatingParticles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedGems, setEarnedGems] = useState(1);

  const activePhraseRef = useRef(activePhrase);
  activePhraseRef.current = activePhrase;

  useEffect(() => {
    fetchDashboard().catch(e => console.error(e));
  }, [fetchDashboard]);

  const phrases = PHRASES;

  const theme = useMemo(() => {
    const found = PHRASES.find(p => p.name === activePhrase);
    if (found) return found;
    return {
      name: 'اختر الذكر',
      colorToken: 'blue',
      strokeColor: '#3b82f6',
      glowColor: 'rgba(59, 130, 246, 0.3)',
      buttonBg: 'bg-blue-500 hover:bg-blue-600 text-white',
      badgeBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      activeBorder: 'border-blue-500',
      textClass: 'text-blue-500'
    };
  }, [activePhrase]);

  const handlePhraseChange = useCallback((phraseName) => {
    playPopSound();
    setActivePhrase(phraseName);
    setCurrentCount(0);
    setFloatingParticles([]);
  }, []);

  const handleTargetChange = useCallback((t) => {
    playPopSound();
    setTarget(t);
    setCurrentCount(0);
    setFloatingParticles([]);
  }, []);

  const handleReset = useCallback(() => {
    playPopSound();
    setCurrentCount(0);
    setFloatingParticles([]);
  }, []);

  const handleSubmitSession = useCallback(async (completedTarget, phraseName) => {
    try {
      setIsSubmitting(true);
      playChimeSound();
      let dbName = phraseName;
      if (phraseName === 'الله و اكبر') dbName = 'الله اكبر';
      const res = await submitSession(dbName, completedTarget, true);
      setEarnedGems(res.gemsEarned || 1);
      setShowCelebration(true);
    } catch (err) {
      console.error(err);
      setEarnedGems(1);
      setShowCelebration(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [submitSession]);

  const handleCircleClick = useCallback((e) => {
    if (isSubmitting) return;

    let currentPhrase = activePhraseRef.current;
    if (currentPhrase === 'اختر الذكر') {
      currentPhrase = 'سبحان الله';
      setActivePhrase('سبحان الله');
    }

    playPopSound();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const particleId = Date.now() + Math.random();

    setFloatingParticles(prev => [...prev, { id: particleId, x, y }]);
    setTimeout(() => {
      setFloatingParticles(prev => prev.filter(p => p.id !== particleId));
    }, 800);

    setCurrentCount(prev => {
      const nextCount = prev + 1;
      if (nextCount >= target) {
        setTimeout(() => handleSubmitSession(target, currentPhrase), 300);
      }
      return nextCount;
    });
  }, [isSubmitting, target, handleSubmitSession]);

  const todayProgress = dashboardData?.todayProgress || {};
  const totalTasbihToday = Object.values(todayProgress).reduce((sum, val) => sum + val, 0);
  const dailyTotalGoal = 100;
  const progressPercentage = Math.min(100, Math.round((totalTasbihToday / dailyTotalGoal) * 100));

  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentCount / target) * circumference;

  return (
    <div className="w-full flex flex-col items-center gap-6 p-5 sm:p-8 bg-gradient-to-b from-[#F0F8FF] via-[#F5FCFF] to-[#FFFDF0] rounded-[36px] relative select-none overflow-hidden" dir="rtl">

      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0) scale(0.9);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-90px) scale(1.3);
          }
        }
        .glow-circle-interactive {
          box-shadow: 0 12px 35px -5px ${theme.glowColor};
        }
      `}</style>

      <DhikrProgressTrack
        totalTasbihToday={totalTasbihToday}
        dailyTotalGoal={dailyTotalGoal}
        progressPercentage={progressPercentage}
        theme={theme}
      />

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-2">


        <DhikrGoalSelector
          target={target}
          handleTargetChange={handleTargetChange}
        />

        <DhikrCounterRing
          currentCount={currentCount}
          target={target}
          activePhrase={activePhrase}
          theme={theme}
          isSubmitting={isSubmitting}
          handleCircleClick={handleCircleClick}
          handleReset={handleReset}
          floatingParticles={floatingParticles}
          strokeDashoffset={strokeDashoffset}
          circumference={circumference}
          radius={radius}
          strokeWidth={strokeWidth}
        />

        <DhikrMascot
          heroOfTasbih={heroOfTasbih}
          name={user?.name || 'عمر'}
        />

      </div>

      <DhikrPhraseSelector
        phrases={phrases}
        activePhrase={activePhrase}
        handlePhraseChange={handlePhraseChange}
      />

      <DhikrCelebrationModal
        isOpen={showCelebration}
        earnedGems={earnedGems}
        activePhrase={activePhrase}
        target={target}
        name={user?.name || 'عمر'}
        blueGem={blueGem}
        onClose={() => {
          playPopSound();
          setShowCelebration(false);
          setCurrentCount(0);
          fetchDashboard().catch(e => console.error(e));
        }}
      />

    </div>
  );
}