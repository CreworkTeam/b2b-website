import { QuizShell } from './QuizShell'
import { QuizIntro } from './sections/QuizIntro'
import { LandingHeader } from '../landing/sections/LandingHeader'

type QuizPageViewProps = {
  titleFontClass?: string
  bodyFontClass?: string
}

export function QuizPageView({ titleFontClass = '', bodyFontClass = '' }: QuizPageViewProps) {
  return (
    <main className="relative min-h-screen bg-[#FEF9ED] animate-in fade-in duration-700">
      <LandingHeader fontClass={titleFontClass} />

      <section className="mx-auto flex w-full max-w-7xl justify-center px-5 pb-16 pt-8 sm:px-8 lg:px-0">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col gap-12 px-0 sm:px-10 lg:px-10 lg:py-6">
            <QuizIntro titleFontClass={titleFontClass} bodyFontClass={bodyFontClass} />
            <QuizShell />
          </div>
        </div>
      </section>
    </main>
  )
}
