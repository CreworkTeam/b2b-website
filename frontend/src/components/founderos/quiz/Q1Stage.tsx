'use client'
import { cn } from '@/lib/utils'
import type { Q1Answer } from '@/founderos/types'
import { Lightbulb, Target, Rocket } from 'lucide-react'

const OPTIONS: { value: Q1Answer; label: string; sub: string; num: string }[] = [
  { value: 'idea', num: '01', label: 'Still figuring out', sub: 'Exploring multiple concepts and market gaps.' },
  { value: 'validation', num: '02', label: 'Know demand', sub: 'Identified a specific problem with high urgency.' },
  { value: 'build', num: '03', label: 'Ready to start', sub: 'Infrastructure is ready for initial execution.' },
]

export function Q1Stage({ value, onChange }: { value: Q1Answer | null; onChange: (val: Q1Answer) => void }) {
  const iconMap = {
    idea: Lightbulb,
    validation: Target,
    build: Rocket,
  } as const

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-black text-[11px] font-bold text-white">01</span>
        <h3 className="font-space-grotesk text-[24px] font-semibold leading-7 tracking-[-0.02em] text-[#000000] sm:text-[26px]">
          Where are you currently in the journey?
        </h3>
      </div>

      <div className="grid gap-2.5 md:grid-cols-3">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value
          const Icon = iconMap[opt.value]
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                'font-space-grotesk rounded-md border p-4 text-left transition-all duration-150 active:scale-[0.99]',
                selected
                  ? 'border-[#e5e5e5] border-b-2 border-b-black bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]'
                  : 'border-[#eaeaea] bg-[#f9f9f9] hover:border-[#cccccc]'
              )}
            >
              <Icon className="h-4.5 w-4.5 text-black" strokeWidth={1.9} />
              <p className="mt-4 text-[16px] font-semibold leading-6 text-black">{opt.label}</p>
              <p className="mt-1.5 text-[12px] leading-5 text-[#444748]">{opt.sub}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
