type LandingHeaderProps = {
  fontClass: string
}

export function LandingHeader({ fontClass }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E7E2D7] bg-[#FEF9ED]/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-15.5 w-full max-w-300 items-center justify-between px-5 sm:px-8">
        <div className="gap-3 flex items-center ">
          <img src="/logo.svg" alt="Crework Labs" className="h-6.5 w-auto" />
        <div className="leading-none">
          <p className={`text-[20px] font-extrabold tracking-[-0.03em] text-[#020617] ${fontClass}`}>Founder OS</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-[#6f6b63]">A Product of CREWORK LABS</p>
        </div>
        </div>

        <div className={`hidden items-center gap-7 md:flex ${fontClass}`}>
          <a href="#blueprint" className="border-b-2 border-[#020617] pb-1 text-[14px] font-bold leading-6 text-[#020617]">
            Our Blueprint
          </a>
          <a href="#success-stories" className="text-[14px] font-medium leading-6 text-[#919191] transition hover:text-[#020617]">
            Success Stories
          </a>
          <a href="#about" className="text-[14px] font-medium leading-6 text-[#919191] transition hover:text-[#020617]">
            About
          </a>
        </div>

        <a
          href="/lead-magnet/quiz"
          className={`rounded-md bg-[#020617] px-3.5 py-1.75 text-[13px] font-bold text-white transition hover:bg-[#111827] ${fontClass}`}
        >
          Start Quiz
        </a>
      </nav>
    </header>
  )
}
