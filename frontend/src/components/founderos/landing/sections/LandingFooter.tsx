type LandingFooterProps = {
  headingFontClass: string
  bodyFontClass: string
}

export function LandingFooter({ headingFontClass, bodyFontClass }: LandingFooterProps) {
  return (
    <footer className="border-t border-[#E7E2D7] bg-white px-5 py-8 sm:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-300 flex-col items-center gap-5 text-center lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:text-left">
        <div className="flex flex-col items-center lg:items-start gap-1 lg:justify-self-start">
          <p className={`text-[24px] font-bold leading-none ${headingFontClass}`}>Founder OS</p>
          <p className={`text-[9px] uppercase tracking-widest text-[#919191] ${bodyFontClass}`}>A Product of Crework Labs</p>
        </div>

        <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest text-[#919191] lg:justify-self-center ${bodyFontClass}`}>
          <a href="#" className="transition hover:text-[#1D1C15]">
            Contact
          </a>
          <a href="#" className="transition hover:text-[#1D1C15]">
            LinkedIn
          </a>
        </div>

        <p className={`text-[11px] uppercase tracking-widest text-[#919191] lg:justify-self-end lg:text-right ${bodyFontClass}`}>
          © 2026 Founder OS. The Editorial Architect.
        </p>
      </div>
    </footer>
  )
}