type FinalCtaSectionProps = {
  headingFontClass: string
  serifFontClass: string
  bodyFontClass: string
}

export function FinalCtaSection({ headingFontClass, serifFontClass, bodyFontClass }: FinalCtaSectionProps) {
  return (
    <section id="about" className="mx-auto w-full max-w-300 px-5 pb-14 pt-9 text-center sm:px-8 lg:pb-20">
      <h2 className={`text-[36px] font-black leading-[1.03] tracking-[-0.03em] text-[#1D1C15] sm:text-[50px] ${headingFontClass}`}>
        Ready to build <span className={`font-normal italic ${serifFontClass}`}>the future?</span>
      </h2>

      <p className={`mx-auto mt-4.5 max-w-130 text-[15px] leading-7 text-[#494740] ${bodyFontClass}`}>
        Take our 2-minute Founder Readiness Quiz and get your personalized product blueprint instantly.
      </p>

      <a
        href="/lead-magnet/quiz"
        className={`mt-6 inline-flex rounded-md bg-[#020617] px-8 py-3.5 text-[15px] font-extrabold text-white shadow-[0px_0px_6px_0px_#00000040] transition hover:bg-[#111827] ${headingFontClass}`}
      >
        Start Your Blueprint
      </a>
    </section>
  )
}
