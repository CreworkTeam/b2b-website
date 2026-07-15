import { useState } from 'react'
import './landing-header.css'

type LandingHeaderProps = {
  fontClass: string
}

export function LandingHeader({ fontClass }: LandingHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-[#E7E2D7] bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-auto min-h-[62px] w-full max-w-300 flex-wrap items-start md:items-center justify-between px-5 py-3 sm:px-8 landing-header-container">
        <a href="/" className="flex items-center mt-1 md:mt-0">
          <span className={`text-[20px] md:text-[26px] font-extrabold tracking-[-0.03em] text-[#020617] ${fontClass}`}>
            Founder OS
          </span>
        </a>

        {/* Desktop Nav */}
        <div className={`hidden items-center gap-7 md:flex ${fontClass}`}>
          <a href="/agentic-ai-systems" className="text-[14px] font-medium leading-6 text-[#919191] transition hover:text-[#020617]">
            Agentic AI systems
          </a>
          <a href="/overnight-cto" className="text-[14px] font-medium leading-6 text-[#919191] transition hover:text-[#020617]">
            Overnight CTO
          </a>
          <a href="/blog" className="text-[14px] font-medium leading-6 text-[#919191] transition hover:text-[#020617]">
            Blog
          </a>
          <a
            href="https://calendly.com/creworklabs/30mins"
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-md bg-[#020617] px-3.5 py-1.75 text-[13px] font-bold text-white transition hover:bg-[#111827]`}
          >
            Book a call
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
          <a href="/agentic-ai-systems" onClick={() => setIsOpen(false)} className="text-[14px] font-medium text-[#919191] py-2">
            Agentic AI systems
          </a>
          <a href="/overnight-cto" onClick={() => setIsOpen(false)} className="text-[14px] font-medium text-[#919191] py-2">
            Overnight CTO
          </a>
          <a href="/blog" onClick={() => setIsOpen(false)} className="text-[14px] font-medium text-[#919191] py-2">
            Blog
          </a>
          <a
            href="https://calendly.com/creworklabs/30mins"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block text-center mt-2 rounded-md bg-[#020617] px-3.5 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#111827]`}
          >
            Book a call
          </a>
        </div>
      </nav>
    </header>
  )
}
