'use client'

import { motion } from 'framer-motion'
import { painCards } from '../landing-data'

type ProblemSectionProps = {
  headingFontClass: string
  bodyFontClass: string
}

const icons = [
  // Wallet / Capital efficiency
  () => (
    <svg className="h-6 w-6 text-[#FFB59B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="3" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M16 14h2" />
    </svg>
  ),
  // Blocks / Modular building
  () => (
    <svg className="h-6 w-6 text-[#FFB59B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 3H4a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zM20 3h-6a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zM10 13H4a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-6a1 1 0 00-1-1zM20 13h-6a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-6a1 1 0 00-1-1z" />
    </svg>
  ),
  // SearchCheck / Market Validation
  () => (
    <svg className="h-6 w-6 text-[#FFB59B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM8.25 10.5l2.25 2.25 4.5-4.5" />
    </svg>
  ),
]

export function ProblemSection({ headingFontClass, bodyFontClass }: ProblemSectionProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mx-auto mt-6 w-full max-w-300 rounded-3xl bg-black px-6 py-10 sm:px-9 lg:px-16 lg:py-14"
    >
      <div className="max-w-190">
        <h2 className={`text-[34px] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-[44px] ${headingFontClass}`}>
          Stop Building in the Dark.
        </h2>
        <p className={`mt-4 max-w-145 text-[16px] leading-7 text-[#868380] ${bodyFontClass}`}>
          Do not throw money at code before you have clarity. We provide the technical leverage you need to succeed.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {painCards.map((card, index) => {
          const Icon = icons[index]
          return (
            <article
              key={card.title}
              className="rounded-xl border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] p-5 shadow-[0px_0px_6px_0px_#00000040]"
            >
              <Icon />
              <h3 className={`mt-4 text-[22px] font-bold leading-7 text-white ${headingFontClass}`}>{card.title}</h3>
              <p className={`mt-2.5 text-[14px] leading-[1.62] text-[#A8A29E] ${bodyFontClass}`}>{card.description}</p>
            </article>
          )
        })}
      </div>
    </motion.section>
  )
}
