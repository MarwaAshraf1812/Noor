import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from './routes';
import useAuthStore from './store/authStore';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#a9d8ff] via-[#eff6ff] to-white flex flex-col items-center justify-center" dir="rtl">
        <div className="relative flex flex-col items-center justify-center gap-4">
          <div className="relative w-20 h-20">
            <div className="animate-spin rounded-full w-20 h-20 border-4 border-slate-200 border-t-[#3b82f6]"></div>
            <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-[#3b82f6]">
              نور
            </div>
          </div>
          <span className="text-slate-500 font-bold animate-pulse text-sm">
            جاري فتح المغامرة...
          </span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
