'use client'

import { useState, useRef, useEffect } from 'react'

type HeroBlueprintCardProps = {
  headingFontClass: string
  bodyFontClass: string
  monoFontClass: string
}

export function HeroBlueprintCard({ headingFontClass, bodyFontClass, monoFontClass }: HeroBlueprintCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  useEffect(() => {
    const cursor = document.getElementById('custom-cursor')
    if (isHovered) {
      cursor?.classList.add('is-magnifying')
    } else {
      cursor?.classList.remove('is-magnifying')
    }
    return () => {
      cursor?.classList.remove('is-magnifying')
    }
  }, [isHovered])

  const CardContent = () => (
    <div className="relative flex h-full w-full flex-col gap-3">
      <div className="flex flex-col">
        {/* Before card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
          <div className="h-full bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))] px-6 pb-9 pt-6">
            <div className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-white/30 ${monoFontClass}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              Before
            </div>
            <p className={`mt-2.5 text-[16px] font-medium leading-snug text-white/55 ${headingFontClass}`}>
              A good idea sitting in your head
            </p>
            <p className={`mt-1.5 text-[13px] leading-relaxed text-white/28 ${bodyFontClass}`}>
              No clarity on what to build, what it costs, or where to start
            </p>
          </div>
        </div>

        {/* Animated arrow */}
        <div className="relative z-10 -my-5 flex items-center justify-center">
          <svg width="24" height="46" viewBox="0 0 24 46" fill="none" overflow="visible">
            <defs>
              <filter id="blueprint-glow" x="-120%" y="-30%" width="340%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M12 0 C11 9, 13 18, 12 30"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="3 4.5"
              strokeOpacity="0.3"
              filter="url(#blueprint-glow)"
              className="arrow-flow"
            />
            <path
              d="M4 27 L12 38 L20 27"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.7"
              filter="url(#blueprint-glow)"
              className="arrow-bob"
            />
          </svg>
        </div>

        {/* After card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
          <div className="h-full bg-[linear-gradient(145deg,rgba(255,181,155,0.09),rgba(255,181,155,0.015))] px-6 pb-6 pt-9">
            <div className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[#FFB59B] ${monoFontClass}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFB59B] shadow-[0_0_8px_rgba(255,181,155,0.75)]" />
              After
            </div>
            <p className={`mt-2.5 text-[16px] font-semibold leading-snug text-white ${headingFontClass}`}>
              A launch-ready blueprint in 2 minutes
            </p>
            <p className={`mt-1.5 text-[13px] leading-relaxed text-white/45 ${bodyFontClass}`}>
              What to build, how much it costs, and exactly what to do next
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-1">
        {[
          { value: '2 min', label: 'Full blueprint', accent: true },
          { value: 'Free', label: 'No sign up', accent: false },
          { value: '5 steps', label: 'Idea to launch', accent: false },
        ].map(({ value, label, accent }) => (
          <div
            key={value}
            className={`rounded-xl border border-white/[0.08] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${
              accent
                ? 'bg-[linear-gradient(145deg,rgba(255,181,155,0.1),rgba(255,181,155,0.02))]'
                : 'bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]'
            }`}
          >
            <p className={`text-[24px] font-bold leading-none ${accent ? 'text-[#FFB59B]' : 'text-white'} ${headingFontClass}`}>
              {value}
            </p>
            <p className={`mt-2 text-[11px] leading-tight text-white/30 ${bodyFontClass}`}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        .is-magnifying .cursor-dot {
          transform: scale(10) !important;
          background-color: transparent !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative mx-auto mt-2 w-full max-w-[500px] cursor-none overflow-hidden rounded-3xl bg-[#0C0C0C] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_20px_48px_-8px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-[1.02] lg:mt-0 lg:self-center lg:justify-self-end"
      >
        {/* Glass edge shimmer */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />

        {/* Warm ambient glow */}
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-36 w-64 -translate-x-1/2 rounded-full bg-[#FFB59B]/[0.14] blur-3xl" />

        {/* Base Layer */}
        <div className="transition-opacity duration-200" style={{ opacity: isHovered ? 0.3 : 1 }}>
          <CardContent />
        </div>

        {/* Magnified Layer (Lens effect) */}
        <div 
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-3xl bg-[#0C0C0C] transition-opacity duration-200"
          style={{
            opacity: isHovered ? 1 : 0,
            clipPath: `circle(50px at ${mousePos.x}px ${mousePos.y}px)`
          }}
        >
          <div 
            className="absolute inset-0 p-4"
            style={{
              transform: `scale(1.25)`,
              transformOrigin: `${mousePos.x}px ${mousePos.y}px`
            }}
          >
            <CardContent />
          </div>
        </div>
      </div>
    </>
  )
}
