import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { About } from '../components/landing/About';
import { Features } from '../components/landing/Features';
import { Badges } from '../components/landing/Badges';
import { Footer } from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#f0f9ff]/30 text-slate-800">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Features / Treasures Section */}
      <Features />

      {/* Badges Section */}
      <Badges />

      {/* Footer */}
      <Footer />
    </div>
  );
}