'use client'
import { cn } from '@/lib/utils'
import type { Q3Answer } from '@/founderos/types'
import { Briefcase, Globe, Network, Users } from 'lucide-react'

const OPTIONS: { value: Q3Answer; label: string; mono: string }[] = [
  { value: 'consumer', label: 'EVERYDAY PEOPLE', mono: 'B2C' },
  { value: 'smb', label: 'SMBs', mono: 'SMB' },
  { value: 'enterprise', label: 'TEAMS', mono: 'B2B' },
  { value: 'other', label: 'OTHER', mono: 'OTHER' },
]

type Props = {
  value: Q3Answer | null
  onChange: (val: Q3Answer) => void
  otherText: string
  onOtherTextChange: (val: string) => void
}

export function Q3UserType({ value, onChange, otherText, onOtherTextChange }: Props) {
  const iconMap = {
    consumer: Users,
    smb: Briefcase,
    enterprise: Network,
    other: Globe,
  } as const

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-black text-[11px] font-bold text-white">03</span>
        <h3 className="font-space-grotesk text-[24px] font-semibold leading-7 tracking-[-0.02em] text-[#000000] sm:text-[26px]">
          Who is your primary target audience?
        </h3>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value
          const Icon = iconMap[opt.value]
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                'rounded-[4px] border px-4 py-3.5 text-center transition-all duration-150 active:scale-[0.99]',
                selected
                  ? 'border-[#171717] bg-white'
                  : 'border-[#eaeaea] bg-[#f9f9f9] hover:border-[#cccccc]'
              )}
            >
              <Icon className="mx-auto h-4.5 w-4.5 text-[#191C1D]" strokeWidth={2} />
              <p className="mt-2 text-[11px] font-bold tracking-[0.08em] text-[#191c1d]">{opt.label}</p>
            </button>
          )
        })}
      </div>

      {value === 'other' && (
        <div className="mt-1">
          <input
            type="text"
            value={otherText}
            onChange={(e) => onOtherTextChange(e.target.value)}
            placeholder="Describe your target group e.g. Healthcare professionals, Gen Z creators..."
            maxLength={120}
            className="w-full rounded-md border border-[#eaeaea] bg-white px-4 py-3 text-[14px] leading-6 text-[#0a0a0a] outline-none transition-colors duration-150 placeholder:text-[#a1a1aa] focus:border-[#171717]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          />
        </div>
      )}
    </section>
  )
}
