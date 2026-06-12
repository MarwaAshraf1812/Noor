import React from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const user = useUserStore((state) => state.user);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl bg-white/80 backdrop-blur-md border-3 border-purple-200 rounded-full px-6 py-3 flex items-center justify-between shadow-lg z-50 transition-all duration-300 hover:shadow-xl hover:border-purple-300">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <img 
          src={logo} 
          alt="Noor Logo" 
          className="h-10 w-auto animate-bounce-slow group-hover:scale-110 transition-transform duration-300"
        />
        <span className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
          Noor <span className="font-sans text-brand-cyan">نُور</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8 font-semibold text-lg">
        <a href="#about" className="text-gray-600 hover:text-brand-purple hover:scale-105 transition-all duration-200">
          About
        </a>
        <a href="#treasures" className="text-gray-600 hover:text-brand-cyan hover:scale-105 transition-all duration-200">
          Treasures
        </a>
        <a href="#avatars" className="text-gray-600 hover:text-brand-orange hover:scale-105 transition-all duration-200">
          Friends
        </a>
        <a href="#badges" className="text-gray-600 hover:text-brand-pink hover:scale-105 transition-all duration-200">
          Achievements
        </a>
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center gap-3">
        {user ? (
          <Link 
            to="/dashboard" 
            className="bg-brand-purple hover:bg-brand-purple-dark text-white px-6 py-2.5 rounded-full font-bold text-md shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            My Dashboard
          </Link>
        ) : (
          <>
            <Link 
              to="/auth" 
              className="text-brand-purple hover:bg-purple-50 px-5 py-2.5 rounded-full font-bold text-md transition-all duration-200"
            >
              Sign In
            </Link>
            <Link 
              to="/auth" 
              className="bg-brand-yellow hover:bg-amber-400 text-purple-900 border-b-4 border-amber-600 hover:border-amber-700 active:border-b-0 px-6 py-2 rounded-full font-bold text-md shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200"
            >
              Join Free!
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
