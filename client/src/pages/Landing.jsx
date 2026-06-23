import React from 'react';
import { Navbar } from '../components/shared/Navbar';
import { Hero } from '../components/landing/Hero';
import { About } from '../components/landing/About';
import { Features } from '../components/landing/Features';
import { Badges } from '../components/landing/Badges';
import { Footer } from '../components/shared/Footer';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#f0f9ff]/30 text-slate-800">
      {}
      <Navbar />

      {}
      <Hero />

      {}
      <About />

      {}
      <Features />

      {}
      <Badges />

      {}
      <Footer />
    </div>
  );
}