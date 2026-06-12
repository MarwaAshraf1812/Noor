import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logoImg from '../../assets/logo.png';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'الرئيسية', href: '#hero' },
    { name: 'عن نور', href: '#about' },
    { name: 'المميزات', href: '#features' },
    { name: 'الأوسمة', href: '#badges' },
  ];

  return (
    <motion.header 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm' 
          : 'bg-transparent border-b-0 shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center">
            <motion.a 
              href="#hero" 
              className="flex items-center"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={logoImg} 
                alt="نور" 
                className="h-12 w-auto"
              />
            </motion.a>
          </div>

          <nav className={`hidden md:flex items-center gap-12 font-bold text-lg transition-colors duration-300 ${
            isScrolled ? 'text-slate-600' : 'text-[#1e3a8a]'
          }`}>
            {menuItems.map((item, index) => (
              <motion.a 
                key={index} 
                href={item.href}
                className="hover:text-blue-600 transition-colors duration-200 block"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <motion.a
              href="/auth"
              className="px-6 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white text-base font-bold rounded-xl shadow-md transition-all duration-200"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              دخول المغامرة
            </motion.a>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700 hover:text-blue-600 focus:outline-none p-2 rounded-lg bg-slate-50"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-inner py-4">
          <div className="px-6 space-y-3 font-bold text-center">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 px-4 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                {item.name}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full py-3 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl font-bold text-center shadow-sm"
              >
                دخول المغامرة
              </a>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
};
