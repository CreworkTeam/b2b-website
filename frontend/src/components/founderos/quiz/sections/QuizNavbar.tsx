type QuizNavbarProps = {
  titleFontClass?: string
}

export function QuizNavbar({ titleFontClass = '' }: QuizNavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#E7E2D7] bg-[#FEF9ED]/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 w-full max-w-240 items-center px-5 sm:px-8">
        <a href="/lead-magnet" className="inline-flex items-center gap-3">
          <img src="/logo.svg" alt="Crework Labs" className="h-4.5 w-auto" />
          <div className="leading-none">
            <p className={`text-[16px] font-semibold tracking-[-0.02em] text-[#1c1b18] ${titleFontClass}`}>Founder OS</p>
            <p className="mt-1 text-[9px] uppercase tracking-widest text-[#6f6b63]">A Product of CREWORK LABS</p>
          </div>
        </a>
      </nav>
    </header>
  )
}
