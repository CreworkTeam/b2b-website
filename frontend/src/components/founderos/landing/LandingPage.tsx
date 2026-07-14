import { LandingHeader } from './sections/LandingHeader'
import { HeroSection } from './sections/HeroSection'
import { ProblemSection } from './sections/ProblemSection'
import { FinalCtaSection } from './sections/FinalCtaSection'
import { LandingFooter } from './sections/LandingFooter'

export function LandingPage() {
  // Using Tailwind generic font families mapped to Astro imported fonts
  const headingFontClass = 'font-space-grotesk'
  const serifFontClass = 'font-instrument-serif'
  const bodyFontClass = 'font-manrope'
  const monoFontClass = 'font-dm-mono'
  const uiFontClass = 'font-inter'

  return (
    <main
      className={`bg-[#FEF9ED] text-[#1D1C15] font-inter`}
    >
      <LandingHeader fontClass={headingFontClass} />

      <HeroSection
        headingFontClass={headingFontClass}
        serifFontClass={serifFontClass}
        bodyFontClass={bodyFontClass}
        monoFontClass={monoFontClass}
        uiFontClass={uiFontClass}
      />

      <ProblemSection headingFontClass={headingFontClass} bodyFontClass={bodyFontClass} />

      <FinalCtaSection
        headingFontClass={headingFontClass}
        serifFontClass={serifFontClass}
        bodyFontClass={bodyFontClass}
      />

      <LandingFooter headingFontClass={headingFontClass} bodyFontClass={bodyFontClass} />
    </main>
  )
}
