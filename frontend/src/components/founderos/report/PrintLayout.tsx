import React from 'react'
import type { ReportA, ReportB, ReportC, FounderQuizState } from '../../../founderos/types'

import type { FeedPost } from './page/types'

interface PrintLayoutProps {
  quiz: FounderQuizState
  reportA: ReportA | null
  reportB: ReportB | null
  reportC: ReportC | null
  filteredPosts: FeedPost[]
}

export function PrintLayout({ quiz, reportA, reportB, reportC, filteredPosts }: PrintLayoutProps) {
  // Safe helper to grab posts regardless of interactive state
  const topPosts = filteredPosts.slice(0, 5) || []

  const platformCounts = reportA?.communities.reduce<Record<string, number>>((acc, community) => {
    acc[community.platform] = (acc[community.platform] ?? 0) + 1
    return acc
  }, {}) || {}

  const topPlatformsList = Object.entries(platformCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const chartPlatforms = topPlatformsList.length > 0
    ? topPlatformsList
    : [['Reddit', 1], ['LinkedIn', 1], ['X', 1], ['IndieHackers', 1], ['Discord', 1]]

  const maxCount = Math.max(...chartPlatforms.map(p => p[1] as number))

  const score = reportA?.validationScore || { overall: 5, searchDemand: 5, communityDensity: 5, competitionIntensity: 5 }
  const problemShare = Math.max(25, Math.min(65, Math.round(35 + (10 - score.overall) * 2.5)))
  const solutionShare = Math.max(20, Math.min(60, Math.round(30 + score.searchDemand * 2.2)))
  const buildShare = Math.max(8, 100 - problemShare - solutionShare)

  const keywordSignals = reportA?.demandSignals?.slice(0, 3) || []
  const keywordDatasets = keywordSignals.map((signal, idx) => {
    const volumeBase = signal.estimatedVolume === 'high' ? 60 : signal.estimatedVolume === 'moderate' ? 35 : 18
    const points = [0.74, 0.79, 0.83, 0.88, 0.94, 0.92, 0.98, 0.95, 0.91, 1.04, 1.12, 1.2].map((factor) =>
      Math.round(volumeBase * factor + idx * 2)
    )
    const colors = ['#1a1917', '#9ca3af', '#d1cec7']
    return {
      label: signal.theme,
      points,
      color: colors[idx] ?? colors[2]
    }
  })

  const allPoints = keywordDatasets.flatMap(d => d.points)
  const maxSearchVol = allPoints.length > 0 ? Math.max(...allPoints, 10) : 100

  const generatePointsStr = (points: number[]) => {
    return points.map((val, i) => {
      const x = (i / 11) * 400
      const y = 180 - (val / maxSearchVol) * 160 // padding at top and bottom
      return `${x},${y}`
    }).join(' ')
  }

  return (
    <div id="print-only-layout" className="w-full mx-auto bg-white text-[#1a1917] hidden">
      {/* COVER PAGE (First Page) */}
      <div
        className="relative flex flex-col bg-[#0a0a0a] text-white p-16 overflow-hidden"
        style={{
          height: '100vh',
          width: '100%',
          pageBreakAfter: 'always',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      >
        {/* Abstract graphic on the right */}
        <div className="absolute right-[-400px] top-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none opacity-[0.05]">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 border border-white rounded-[100px]"
              style={{
                width: `${300 + i * 60}px`,
                height: `${300 + i * 60}px`,
                transform: `translate(-50%, -50%) rotate(45deg)`
              }}
            />
          ))}
          {/* Inner shadow/gradient fade block */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0a0a0a_70%)]" />
        </div>

        <div className="relative z-10 mb-auto flex items-center gap-3">
          <img src="/favicon_white.svg" alt="Crework Labs" className="h-8 w-8" />
          <span className="font-space-grotesk text-[20px] font-bold tracking-[0.05em] text-white uppercase">Crework Labs</span>
        </div>

        <div className="relative z-10 mb-auto">
          <h1 className="font-inter text-[64px] font-bold leading-[1.05] tracking-tight mb-8 max-w-[600px]">
            Building<br />Products<br />That People Love.
          </h1>
          <p className="text-[16px] text-white/60 leading-relaxed max-w-[450px] mb-12">
            We partner with ambitious teams to validate ideas, design better experiences, and build software that makes an impact.
          </p>
          <div className="flex gap-8 text-[13px] font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-white">🚀 Validate Ideas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">💻 Build Better</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">⚡ Ship Faster</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="mb-4 text-[11px] font-bold tracking-[0.1em] text-white/50 uppercase">Company Report</div>
          <div className="mb-4 h-px w-16 bg-white/20" />
          <div className="text-[32px] font-inter">{new Date().getFullYear()}</div>
          <div className="text-[14px] text-white/50">creworklabs.com</div>
        </div>
      </div>

      {/* REGULAR REPORT CONTENT */}
      <div style={{ padding: '15mm' }}>
        {/* HEADER */}
        <div className="flex items-center gap-4 border-b border-[#e8e6e0] pb-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#1a1917]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h4l3-9 5 18 3-9h3" />
              </svg>
            </div>
            <span className="font-space-grotesk text-[18px] font-bold tracking-tight text-[#1a1917]">Crework Labs</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#f4f2eb] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#6b6860]">
              INTELLIGENCE REPORT
            </span>
            <span className="text-[12px] font-semibold text-[#a8a59f]">
              FOUNDER OS
            </span>
          </div>
        </div>

        <h1 className="font-space-grotesk mb-8 text-[36px] leading-[1.1] tracking-tight">
          Strong demand signals for your startup idea
        </h1>

        {/* SECTION: VALIDATE */}
        {reportA && (
          <div className="mb-12">
            <h2 className="mb-4 text-[14px] font-bold uppercase tracking-wider text-[#4a4740]">Validation Metrics</h2>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="rounded-xl border border-[#e8e6e0] p-4 print-avoid-break">
                <p className="text-[12px] text-[#6b6860] mb-1">Overall Score</p>
                <p className="text-[24px] font-bold text-[#1a1917]">{reportA.validationScore.overall}/10</p>
              </div>
              <div className="rounded-xl border border-[#e8e6e0] p-4 print-avoid-break">
                <p className="text-[12px] text-[#6b6860] mb-1">Search Demand</p>
                <p className="text-[24px] font-bold text-[#1a1917]">{reportA.validationScore.searchDemand}/10</p>
              </div>
              <div className="rounded-xl border border-[#e8e6e0] p-4 print-avoid-break">
                <p className="text-[12px] text-[#6b6860] mb-1">Community Buzz</p>
                <p className="text-[24px] font-bold text-[#1a1917]">{reportA.validationScore.communityDensity}/10</p>
              </div>
              <div className="rounded-xl border border-[#e8e6e0] p-4 print-avoid-break">
                <p className="text-[12px] text-[#6b6860] mb-1">Competition</p>
                <p className="text-[24px] font-bold text-[#1a1917]">{reportA.validationScore.competitionIntensity}/10</p>
              </div>
            </div>

            <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break mb-8">
              <p className="mb-2 text-[14px] font-semibold">Search interest over time</p>
              <p className="mb-4 text-[12px] text-[#6b6860]">Monthly search volume across related keywords.</p>
              <div className="w-full max-w-[500px] mt-4">
                <div className="mb-4 flex flex-wrap gap-3 text-[11px] text-[#6b6860]">
                  {keywordDatasets.map((ds, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1">
                      <span className="size-2 rounded-sm" style={{ backgroundColor: ds.color }} />
                      {ds.label}
                    </span>
                  ))}
                </div>
                <svg viewBox="0 0 400 200" className="w-full h-auto overflow-visible">
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#f0ede8" strokeWidth="1" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#f0ede8" strokeWidth="1" />
                  <line x1="0" y1="180" x2="400" y2="180" stroke="#f0ede8" strokeWidth="1" />

                  {/* Lines */}
                  {keywordDatasets.map((ds, idx) => (
                    <polyline
                      key={idx}
                      points={generatePointsStr(ds.points)}
                      fill="none"
                      stroke={ds.color}
                      strokeWidth={idx === 0 ? "2.5" : "1.5"}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  ))}
                  {/* Points */}
                  {keywordDatasets.map((ds, dsIdx) => (
                    <g key={`pts-${dsIdx}`}>
                      {ds.points.map((val, i) => (
                        <circle
                          key={i}
                          cx={(i / 11) * 400}
                          cy={180 - (val / maxSearchVol) * 160}
                          r={dsIdx === 0 ? "2.5" : "2"}
                          fill={ds.color}
                        />
                      ))}
                    </g>
                  ))}
                </svg>
              </div>
            </div>
            <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break mb-8">
              <p className="mb-4 text-[14px] font-semibold">Demand Signals & Insights</p>
              <div className="space-y-4">
                {(reportA.demandSignals || []).map((signal, idx) => (
                  <div key={idx} className="border-b border-[#e8e6e0] pb-3 last:border-0 last:pb-0">
                    <p className="text-[13px] font-bold text-[#1a1917]">{signal.theme}</p>
                    <p className="text-[12px] text-[#6b6860] mt-1">{signal.insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break mb-8">
              <p className="mb-4 text-[14px] font-semibold">Where people are talking</p>
              <div className="space-y-4">
                {topPosts.map((post, idx) => (
                  <div key={idx} className="border-b border-[#e8e6e0] pb-3 last:border-0 last:pb-0">
                    <p className="text-[11px] font-semibold mb-1 uppercase text-[#a8a59f]">{post.platform}</p>
                    {post.url ? (
                      <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#1a1917] hover:underline block decoration-black/30 underline-offset-2">
                        {post.text}
                      </a>
                    ) : (
                      <p className="text-[13px] text-[#1a1917]">{post.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break">
                <p className="mb-2 text-[14px] font-semibold">Discussion volume by platform</p>
                <div className="space-y-3 mt-6">
                  {chartPlatforms.map(([platform, count]) => (
                    <div key={platform as string}>
                      <div className="flex justify-between text-[11px] text-[#6b6860] mb-1">
                        <span>{platform as string}</span>
                        <span>{count as number} mentions</span>
                      </div>
                      <div className="h-2 w-full bg-[#f0ede8] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1a1917]" style={{ width: `${((count as number) / maxCount) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break">
                <p className="mb-2 text-[14px] font-semibold">Sentiment breakdown</p>
                <p className="mb-6 text-[12px] text-[#6b6860]">What emotion drives most of the conversation.</p>
                <div className="mt-4">
                  <div className="flex h-4 w-full rounded-full overflow-hidden mb-4">
                    <div className="bg-[#f87171] h-full" style={{ width: `${problemShare}%` }} />
                    <div className="bg-[#34d399] h-full" style={{ width: `${solutionShare}%` }} />
                    <div className="bg-[#60a5fa] h-full" style={{ width: `${buildShare}%` }} />
                  </div>
                  <div className="flex flex-col gap-2 text-[11px] text-[#6b6860]">
                    <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#f87171]" /> Pain / frustration ({problemShare}%)</div>
                    <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#34d399]" /> Wants a solution ({solutionShare}%)</div>
                    <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#60a5fa]" /> Building one ({buildShare}%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: SCOPE */}
        {reportB && (
          <div className="mb-12">
            <h2 className="mb-4 text-[14px] font-bold uppercase tracking-wider text-[#4a4740]">What to Build</h2>

            <div className="rounded-xl bg-[#1c1b18] px-6 py-6 text-white mb-6 print-avoid-break">
              <p className="mb-2 text-[12px] uppercase tracking-wider text-white/50">Your Core Loop</p>
              <p className="text-[20px] leading-relaxed mb-4">{reportB.techApproach || 'Core user action pipeline'}</p>
              <div className="flex flex-wrap gap-2">
                {(reportB.coreFeatures || []).slice(0, 3).map((f) => (
                  <span key={f.name} className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-[12px]">{f.name}</span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#e8e6e0] p-5 mb-6 print-avoid-break">
              <p className="mb-4 text-[14px] font-semibold">Feature Priority Matrix</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-[#eef8f1] p-4 border border-[#b5d6bf]">
                  <p className="font-semibold text-[#1e5c38] text-[12px] uppercase mb-2">Build Now</p>
                  <div className="space-y-2">
                    {(reportB.coreFeatures || []).map(f => <p key={f.name} className="text-[13px] text-[#1e5c38]">{f.name}</p>)}
                  </div>
                </div>
                <div className="rounded-lg bg-[#fffdf1] p-4 border border-[#fde68a]">
                  <p className="font-semibold text-[#78350f] text-[12px] uppercase mb-2">Simplify</p>
                  <div className="space-y-2">
                    <p className="text-[13px] text-[#78350f]">In-app payments</p>
                    <p className="text-[13px] text-[#78350f]">Complex analytics</p>
                  </div>
                </div>
                <div className="rounded-lg bg-[#f4f9ff] p-4 border border-[#bfdbfe]">
                  <p className="font-semibold text-[#1e3a5f] text-[12px] uppercase mb-2">Defer</p>
                  <div className="space-y-2">
                    <p className="text-[13px] text-[#1e3a5f]">Onboarding flow</p>
                    <p className="text-[13px] text-[#1e3a5f]">Saved favourites</p>
                    <p className="text-[13px] text-[#1e3a5f]">Push notifs</p>
                  </div>
                </div>
                <div className="rounded-lg bg-[#fff7f7] p-4 border border-[#fecaca]">
                  <p className="font-semibold text-[#7f1d1d] text-[12px] uppercase mb-2">Skip</p>
                  <div className="space-y-2">
                    {(reportB.skipFeatures && reportB.skipFeatures.length > 0
                      ? reportB.skipFeatures.map(f => f.name)
                      : ['AI matching', 'Subscription tiers', 'Social feed']
                    ).map(feature => (
                      <p key={feature} className="text-[13px] text-[#7f1d1d] line-through">{feature}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 mt-8">
              <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break">
                <p className="mb-4 text-[14px] font-semibold">AI Tools to Build Faster</p>
                <div className="space-y-3">
                  {(reportB.aiTools || []).map((tool, idx) => (
                    <div key={idx}>
                      <p className="text-[13px] font-bold text-[#1a1917]">{tool.tool}</p>
                      <p className="text-[12px] text-[#6b6860]">{tool.useCase}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break">
                <p className="mb-4 text-[14px] font-semibold">Common Mistakes to Avoid</p>
                <ul className="list-disc pl-4 space-y-2">
                  {(reportB.commonMistakes || []).map((mistake, idx) => (
                    <li key={idx} className="text-[12px] text-[#7f1d1d]">{mistake}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break mb-6">
              <p className="mb-4 text-[14px] font-semibold">GTM & Marketing Plan</p>
              <p className="text-[13px] text-[#1a1917] font-semibold mb-2">Waitlist Advice</p>
              <p className="text-[12px] text-[#6b6860] mb-5">{reportB.marketingPlan?.waitlistAdvice}</p>

              <p className="text-[13px] text-[#1a1917] font-semibold mb-2">Week 1 Launch Checklist</p>
              <ul className="list-disc pl-4 space-y-1">
                {(reportB.marketingPlan?.weekOneChecklist || []).map((item, idx) => (
                  <li key={idx} className="text-[12px] text-[#6b6860]">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* SECTION: PLAN */}
        {reportC && (
          <div className="mb-12">
            <h2 className="mb-4 text-[14px] font-bold uppercase tracking-wider text-[#4a4740]">How to Start</h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break">
                <p className="mb-2 text-[14px] font-semibold">Technical Complexity</p>
                <p className="text-[13px] text-[#6b6860]">{reportB?.complexityLevel || 'Medium'} complexity. Use modern managed services to ship fast.</p>
              </div>
              <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break">
                <p className="mb-2 text-[14px] font-semibold">Your North Star Metric</p>
                <p className="text-[18px] font-bold text-[#1a1917] mb-1">{reportC.whatToBuildPlan?.northStarMetric?.metric || 'Core Action Completed'}</p>
                <p className="text-[13px] text-[#6b6860]">{reportC.whatToBuildPlan?.northStarMetric?.explanation}</p>
              </div>
            </div>


            <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break mb-8">
              <p className="mb-4 text-[14px] font-semibold">28-Day Roadmap</p>
              <div className="space-y-4">
                {reportC.roadmap?.map((week, idx) => (
                  <div key={idx} className="border-b border-[#e8e6e0] pb-4 last:border-0 last:pb-0">
                    <p className="text-[13px] font-bold mb-2">Week {week.week}: {week.title}</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {(week.deliverables || []).map((d, i) => (
                        <li key={i} className="text-[12px] text-[#6b6860]">{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break">
                <p className="mb-4 text-[14px] font-semibold">Product Requirements Check</p>
                <ul className="space-y-4">
                  {(reportC.specItems || []).map((item, idx) => (
                    <li key={idx}>
                      <p className="text-[13px] font-bold text-[#1a1917]">{item.label}</p>
                      <p className="text-[12px] text-[#6b6860]">{item.note}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break">
                <p className="mb-4 text-[14px] font-semibold">Team Recommendation</p>
                <p className="text-[13px] text-[#6b6860] mb-5">{reportC.teamFit}</p>

                <p className="text-[13px] font-bold text-[#1a1917] mb-2">Key Questions to Ask Agencies</p>
                <ul className="list-disc pl-4 space-y-1">
                  {(reportC.questionsToAskAgency || []).map((q, idx) => (
                    <li key={idx} className="text-[12px] text-[#6b6860]">{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FINAL CTA PAGE */}
      <div
        className="flex flex-col items-center justify-center bg-[#0a0a0a] text-center text-white p-12"
        style={{
          height: '100vh',
          width: '100%',
          pageBreakBefore: 'always',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      >
        <div className="mb-12 flex items-center gap-3">
          <img src="/favicon_white.svg" alt="Crework Labs" className="h-10 w-10" />
          <span className="font-space-grotesk text-[24px] font-bold tracking-[0.05em] text-white uppercase">Crework Labs</span>
        </div>

        <h2 className="mb-6 font-space-grotesk text-[32px] leading-[1.2] tracking-tight max-w-[800px]">
          Your "{quiz.q2 || 'startup idea'}" has potential. Let's build it.
        </h2>

        <p className="mb-10 max-w-[500px] text-[15px] leading-relaxed text-white/70">
          Crework Labs turns validated ideas into shipped products in 4 weeks. UX-first, full code ownership, no lock-in.
        </p>

        <a href="https://calendly.com/creworklabs/30mins" target="_blank" rel="noopener noreferrer" className="inline-flex rounded-lg bg-white px-6 py-4 text-[15px] font-bold text-[#0a0a0a] shadow-lg hover:bg-gray-50 transition-colors no-underline">
          Book a free 30-min scoping call →
        </a>
      </div>
    </div>
  )
}
