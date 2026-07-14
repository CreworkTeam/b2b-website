type QuizIntroProps = {
  titleFontClass?: string
  bodyFontClass?: string
}

export function QuizIntro({ titleFontClass = '', bodyFontClass = '' }: QuizIntroProps) {
  return (
    <header className="space-y-3">
      <p className={`text-[11px] uppercase tracking-[0.24em] text-[#246b3a] ${bodyFontClass}`}>Strategy Phase</p>
      <h1 className={`text-[34px] font-bold leading-[1.05] tracking-[-0.03em] text-[#000000] sm:text-[40px] ${titleFontClass}`}>
        Refining the <span className="font-normal italic">blueprint</span> of your venture.
      </h1>
      <p className={`max-w-[70ch] text-[14px] leading-6 text-[#444748] ${bodyFontClass}`}>
        Tell us your stage, idea, audience, and current traction to generate your personalized founder report.
      </p>
    </header>
  )
}
