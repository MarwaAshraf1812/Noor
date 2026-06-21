import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardHeader from '../components/dashboard/dashboardHeader';
import DashboardNav from '../components/dashboard/dashboardNav';
import DailySection from '../components/dashboard/DialySrction/DailySection';
import PrayerSection from '../components/dashboard/PrayerSection/prayerSection';
import QuranSection from '../components/dashboard/QuranSection/QuranSection';
import TasbihSection from '../components/dashboard/TasbihSection/TasbihSection';
import AdhkarSection from '../components/dashboard/AdhkarSection/AdhkarSection';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('yomy');
  
  const renderSection = () => {
    switch (activeTab) {
      case 'yomy':
        return <DailySection />;
      case 'prayers':
        return <PrayerSection />;
      case 'quran':
        return <QuranSection />;
      case 'tasbih':
        return <TasbihSection />;
      case 'adhkar':
        return <AdhkarSection />;
      default:
        return <DailySection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf6] flex flex-col pb-24 sm:pb-12" dir="rtl">
      <DashboardHeader />

      <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 sm:mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
