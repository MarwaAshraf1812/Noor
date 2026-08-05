import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AppRouter } from './routes';
import useAuthStore from './store/authStore';
import avatarGreenBoy from './assets/avatar_green_boy.png';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e0f2fe] via-[#eff6ff] to-white flex flex-col items-center justify-center overflow-hidden" dir="rtl">
        <div className="relative flex flex-col items-center justify-center gap-6">
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-white rounded-full shadow-2xl border-4 border-blue-200/50 animate-bounce">
            <img 
              src={avatarGreenBoy} 
              alt="نور" 
              className="w-24 h-24 md:w-30 md:h-30 object-contain"
            />
            <div className="absolute -inset-2 rounded-full border-4 border-blue-400/20 animate-ping" style={{ animationDuration: '2.5s' }} />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-black text-[#3b82f6] tracking-wide drop-shadow-sm">
              نور
            </h1>
            <span className="text-slate-500 font-bold animate-pulse text-sm">
              جاري فتح المغامرة...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppRouter />
      <Analytics />
    </Router>
  );
}

export default App;
