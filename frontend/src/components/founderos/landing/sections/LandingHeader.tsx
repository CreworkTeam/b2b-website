import React, { useState } from 'react';
import './landing-header.css';

interface LandingHeaderProps {
  fontClass?: string;
}

export function LandingHeader({ fontClass = 'font-space-grotesk' }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E2D7]">
      <div className="landing-header-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Crework Labs" className="h-7 w-auto" />
          <span className={`text-lg font-bold tracking-tight text-[#1D1C15] ${fontClass}`}>
            FounderOS
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/founderos" className="text-sm font-medium text-[#464646] hover:text-black transition-colors">
            Overview
          </a>
          <a href="/founderos/quiz" className="text-sm font-medium text-[#464646] hover:text-black transition-colors">
            Audit Quiz
          </a>
          <a
            href="/book-a-call"
            className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800 transition-all"
          >
            Book Strategy Call
          </a>
        </nav>

        <button
          className="landing-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`landing-mobile-menu md:hidden ${mobileMenuOpen ? 'open' : ''}`}>
          <a
            href="/founderos"
            className="text-sm font-medium text-[#464646] hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Overview
          </a>
          <a
            href="/founderos/quiz"
            className="text-sm font-medium text-[#464646] hover:text-black transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Audit Quiz
          </a>
          <a
            href="/book-a-call"
            className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800 transition-all text-center w-full"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book Strategy Call
          </a>
        </div>
      </div>
    </header>
  );
}
