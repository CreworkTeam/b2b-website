import { useState } from 'react'
import './landing-header.css'

type LandingHeaderProps = {
  fontClass: string
}

export function LandingHeader({ fontClass }: LandingHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-[#E7E2D7] bg-[#FEF9ED]/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-auto min-h-[62px] w-full max-w-300 flex-wrap items-start md:items-center justify-between px-5 py-3 sm:px-8 landing-header-container">
        <a href="/" className="gap-1.5 md:gap-3 flex flex-col md:flex-row items-start md:items-center mt-1 md:mt-0">
          <img src="/logo.svg" alt="Crework Labs" className="h-4.5 md:h-6.5 w-auto" style={{ height: '18px' }} />
          <div className="flex flex-row md:flex-col items-baseline md:items-start gap-1.5 md:gap-0 leading-none">
            <p className={`text-[15px] md:text-[20px] font-extrabold tracking-[-0.03em] text-[#020617] ${fontClass}`}>Founder OS</p>
            <p className="text-[8px] md:text-[10px] md:mt-1 uppercase tracking-widest text-[#6f6b63]">A Product of CREWORK LABS</p>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className={`hidden items-center gap-7 md:flex ${fontClass}`}>
          <a href="#blueprint" className="border-b-2 border-[#020617] pb-1 text-[14px] font-bold leading-6 text-[#020617]">
            Our Blueprint
          </a>
          <a href="#about" className="text-[14px] font-medium leading-6 text-[#919191] transition hover:text-[#020617]">
            About
          </a>
          <a
            href="/lead-magnet/quiz"
            className={`rounded-md bg-[#020617] px-3.5 py-1.75 text-[13px] font-bold text-white transition hover:bg-[#111827]`}
          >
            Start Quiz
          </a>
        </div>

        {/* Hamburger Button */}
        <button 
          className="landing-hamburger-btn md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          style={{ marginTop: '-4px' }}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Menu */}
        <div className={`landing-mobile-menu md:hidden ${isOpen ? 'open' : ''} ${fontClass}`}>
          <a href="#blueprint" onClick={() => setIsOpen(false)} className="text-[14px] font-bold text-[#020617] py-2">
            Our Blueprint
          </a>
          <a href="#about" onClick={() => setIsOpen(false)} className="text-[14px] font-medium text-[#919191] py-2">
            About
          </a>
          <a
            href="/lead-magnet/quiz"
            className={`inline-block text-center mt-2 rounded-md bg-[#020617] px-3.5 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#111827]`}
          >
            Start Quiz
          </a>
        </div>
      </nav>
    </header>
  )
}
