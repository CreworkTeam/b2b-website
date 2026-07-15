'use client'
import { cn } from '@/lib/utils'
import type { DeliveryMode } from '@/founderos/types'

const OPTIONS: { value: DeliveryMode; label: string; desc: string }[] = [
  { value: 'digital_product', label: 'Digital Product', desc: 'App, Website, SaaS, or Platform' },
  { value: 'physical_or_local', label: 'Real-world / Offline', desc: 'Physical product, local business, or service' },
  { value: 'hybrid', label: 'Hybrid', desc: 'Requires both an online platform and physical components' },
]

export function Q5DeliveryMode({ value, onChange }: { value: DeliveryMode | undefined; onChange: (val: DeliveryMode) => void }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-black text-[11px] font-bold text-white">02</span>
        <h3 className="font-space-grotesk text-[24px] font-semibold leading-7 tracking-[-0.02em] text-[#000000] sm:text-[26px]">
          Does this idea require an app/website to function, or is it primarily real-world/offline?
        </h3>
      </div>

      <div className="space-y-2.5">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                'flex w-full flex-col rounded-[4px] border px-4 py-3.5 text-left transition-all duration-150 active:scale-[0.99]',
                selected
                  ? 'border-[#171717] bg-white'
                  : 'border-[#eaeaea] bg-[#f9f9f9] hover:border-[#cccccc]'
              )}
            >
              <p className="text-[14px] font-semibold leading-6 text-black">{opt.label}</p>
              <p className="text-[13px] text-[#666666] mt-0.5">{opt.desc}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
