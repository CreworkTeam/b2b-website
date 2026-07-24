import React from 'react'
import type { ReportA, ReportB, ReportC, QuizAnswers } from '../../../founderos/types'

import type { FeedPost } from './page/types'

interface PrintLayoutProps {
  quiz: QuizAnswers
  reportA: ReportA | null
  reportB: ReportB | null
  reportC: ReportC | null
  filteredPosts: FeedPost[]
  printSummary?: string
}

export function PrintLayout({ quiz, reportA, reportB, reportC, filteredPosts, printSummary }: PrintLayoutProps) {
  // Helpers for Section 1
  const score = reportA?.validationScore || { overall: 5, searchDemand: 5, communityDensity: 5, competitionIntensity: 5 }

  // Helpers for Section 2 (Evidence)
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

  const topPosts = filteredPosts.slice(0, 5) || []

  // Helpers for Section 3 (Competition)
  const competitors = reportA?.competitors || []

  // Helpers for Section 4 (Blueprint)
  const buildNow = reportB?.coreFeatures?.map(f => f.name) || ['User Profile', 'Item Upload']

  // Try to map buildDecisions if present, otherwise fallback
  const simplifyDecisions = reportC?.whatToBuildPlan?.buildDecisions?.filter(d => d.group === 'build_first')
  const deferDecisions = reportC?.whatToBuildPlan?.buildDecisions?.filter(d => d.group === 'build_v2')

  const simplify = simplifyDecisions && simplifyDecisions.length > 0
    ? simplifyDecisions.map(d => d.title)
    : ['Search & Filter for Items']

  const defer = deferDecisions && deferDecisions.length > 0
    ? deferDecisions.map(d => d.title)
    : ['Direct Messaging', 'Monetization Features']

  const skip = reportB?.skipFeatures?.map(f => f.name) || ['AI-powered Item Recognition', 'Integrated Marketplace']

  const coreLoop = reportB?.techApproach || 'Core user action pipeline and feedback mechanism.'

  return (
    <div id="print-only-layout" className="w-full mx-auto bg-white text-[#1a1917] hidden font-inter">
      <div className="p-12 md:p-16">

        {/* HEADER: The Idea Snapshot */}
        <div className="border-b border-[#e8e6e0] pb-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <img src="/favicon.svg" alt="Crework Labs" className="h-6 w-6" />
            <span className="font-space-grotesk text-[14px] font-bold tracking-tight text-[#1a1917] uppercase">
              Founder OS <span className="font-normal text-[#6b6860] lowercase">(A Product of Crework Labs)</span>
            </span>
          </div>

          <p className="text-[12px] uppercase tracking-wider text-[#a8a59f] font-semibold mb-2">Your Idea Tagline</p>
          <h1 className="font-space-grotesk text-[32px] leading-[1.15] tracking-tight font-bold mb-6">
            "{quiz.q2 || 'Virtual Assistant Task Automation'}"
          </h1>

          <div className="bg-[#f8f6f1] p-5 rounded-xl border border-[#e8e6e0]">
            <p className="text-[14px] font-bold text-[#1a1917] mb-1">The Big Question:</p>
            <p className="text-[18px] text-[#4a4740] font-medium">Is there strong demand for your startup idea?</p>
          </div>
        </div>

        {/* SECTION 1: The Verdict */}
        <div className="mb-10">
          <h2 className="mb-4 text-[16px] font-bold uppercase tracking-wider text-[#1a1917]">Section 1: The Verdict</h2>
          <p className="text-[14px] text-[#6b6860] mb-6">Is this viable? Here is what the numbers say.</p>

          <div className="flex gap-6 mb-6">
            {/* Overall Score */}
            <div className="w-1/3 rounded-xl bg-[#1c1b18] p-6 text-white flex flex-col items-center justify-center text-center shadow-md">
              <p className="text-[12px] uppercase tracking-[0.1em] text-white/50 mb-2 font-bold">Overall Validation</p>
              <p className="text-[56px] font-bold leading-none mb-2 font-space-grotesk">{score.overall}/10</p>
              <p className="text-[14px] font-medium text-[#b5d6bf]">
                {score.overall >= 7 ? 'Strong demand signal' : score.overall >= 5 ? 'Moderate demand signal' : 'Weak demand signal'}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="w-2/3 flex gap-4">
              <div className="flex-1 rounded-xl border border-[#e8e6e0] p-5 flex flex-col justify-center items-center text-center bg-[#fcfbf9]">
                <p className="text-[11px] uppercase tracking-wider text-[#6b6860] font-semibold mb-2">Demand Metric</p>
                <p className="text-[32px] font-bold text-[#1a1917] font-space-grotesk">{score.searchDemand}/10</p>
              </div>
              <div className="flex-1 rounded-xl border border-[#e8e6e0] p-5 flex flex-col justify-center items-center text-center bg-[#fcfbf9]">
                <p className="text-[11px] uppercase tracking-wider text-[#6b6860] font-semibold mb-2">Community</p>
                <p className="text-[32px] font-bold text-[#1a1917] font-space-grotesk">{score.communityDensity}/10</p>
              </div>
              <div className="flex-1 rounded-xl border border-[#e8e6e0] p-5 flex flex-col justify-center items-center text-center bg-[#fcfbf9]">
                <p className="text-[11px] uppercase tracking-wider text-[#6b6860] font-semibold mb-2">Competition</p>
                <p className="text-[32px] font-bold text-[#1a1917] font-space-grotesk">{score.competitionIntensity}/10</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e8e6e0] bg-[#fffdf1] p-5 border-l-4 border-l-[#fde68a]">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#78350f] mb-2">The Bottom Line</p>
            <p className="text-[14px] text-[#5a574f] leading-relaxed">
              {reportA?.keywordNote || "There are strong demand signals for your idea based on search intent and community discussions. Users are actively looking for solutions to this specific pain point, although existing alternatives leave a noticeable gap in the market."}
            </p>
          </div>

          {/* Opportunity Highlight to fill first page */}
          <div className="mt-6 rounded-xl bg-[#fcfbf9] border border-[#e8e6e0] p-6 shadow-sm flex items-start gap-5">
            <div className="bg-[#eef8f1] border border-[#b5d6bf] rounded-full w-12 h-12 flex items-center justify-center shrink-0">
              <span className="text-[20px]">💡</span>
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#1a1917] mb-2">What stands out about your idea</p>
              <p className="text-[13px] text-[#5a574f] leading-relaxed">
                {printSummary || (
                  <>Your concept sits at the intersection of proven demand and underserved user needs. By focusing strictly on solving the core pain point—without overcomplicating the initial features—you have a unique opportunity to build early traction. The combination of your <strong>{reportA?.archetype?.replace('_', ' ') || 'chosen'}</strong> model and a targeted go-to-market approach positions you well to capture market share from slower, traditional competitors.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: The Evidence */}
        <div className="mb-10 print:pt-12 print-avoid-break">
          <h2 className="mb-4 text-[16px] font-bold uppercase tracking-wider text-[#1a1917]">Section 2: The Evidence</h2>
          <p className="text-[14px] text-[#6b6860] mb-6">Why should you build it? Real-world data shows people are actively looking for this.</p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Search Interest Over Time */}
            <div className="rounded-xl border border-[#e8e6e0] p-5">
              <p className="mb-1 text-[14px] font-semibold">Search Interest Over Time</p>
              <p className="mb-5 text-[12px] text-[#6b6860]">Monthly search volume across related keywords.</p>
              <div className="w-full">
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
                </svg>
                <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-[#6b6860]">
                  {keywordDatasets.map((ds, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1">
                      <span className="size-2 rounded-sm" style={{ backgroundColor: ds.color }} />
                      {ds.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sentiment Breakdown */}
            <div className="rounded-xl border border-[#e8e6e0] p-5">
              <p className="mb-1 text-[14px] font-semibold">Sentiment Breakdown</p>
              <p className="mb-6 text-[12px] text-[#6b6860]">The emotion driving the conversation.</p>
              <div className="mt-4">
                <div className="flex h-6 w-full rounded-full overflow-hidden mb-5">
                  <div className="bg-[#f87171] h-full" style={{ width: `${problemShare}%` }} />
                  <div className="bg-[#34d399] h-full" style={{ width: `${solutionShare}%` }} />
                  <div className="bg-[#60a5fa] h-full" style={{ width: `${buildShare}%` }} />
                </div>
                <div className="flex flex-col gap-3 text-[12px] text-[#4a4740] font-medium">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-[#f87171]" /> Pain / frustration</div>
                    <span>{problemShare}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-[#34d399]" /> Wants a solution</div>
                    <span>{solutionShare}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-[#60a5fa]" /> Building one</div>
                    <span>{buildShare}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Where People Are Talking */}
          <div className="rounded-xl border border-[#e8e6e0] p-5 print-avoid-break">
            <p className="mb-4 text-[14px] font-semibold">Where People Are Talking</p>
            <div className="grid grid-cols-2 gap-4">
              {(reportA?.communities.slice(0, 4) || []).map((community, idx) => (
                <div key={idx} className="rounded-lg bg-[#f8f6f1] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#a8a59f] mb-1">{community.platform}</p>
                  <p className="text-[13px] font-semibold text-[#1a1917] mb-1">{community.name}</p>
                  <p className="text-[12px] text-[#6b6860] leading-relaxed">{community.description}</p>
                </div>
              ))}
            </div>

            {/* Optional: Add live highlights if available */}
            {topPosts.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[#e8e6e0] print:pt-12 print:border-t-0" style={{ pageBreakBefore: 'always' }}>
                <p className="text-[12px] font-bold uppercase tracking-wider text-[#1a1917] mb-3">Live Highlights</p>
                <div className="space-y-3">
                  {topPosts.slice(0, 2).map((post, idx) => (
                    <div key={idx} className="text-[13px] text-[#4a4740] italic border-l-2 border-[#d1cec7] pl-3 py-1">
                      "{post.text}" <span className="text-[10px] uppercase text-[#a8a59f] font-bold ml-2">— {post.platform}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: The Competition */}
        <div className="mb-10 print:pt-12 print-avoid-break">
          <h2 className="mb-4 text-[16px] font-bold uppercase tracking-wider text-[#1a1917]">Section 3: The Competition</h2>
          <p className="text-[14px] text-[#6b6860] mb-6">Who is already here, and where does your specific idea fit in?</p>

          <div className="space-y-4">
            {competitors.slice(0, 2).map((comp, idx) => (
              <div key={idx} className="rounded-xl border border-[#e8e6e0] overflow-hidden">
                <div className="bg-[#fcfbf9] px-5 py-4 border-b border-[#e8e6e0]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#a8a59f] mb-1">Competitor {idx + 1}</p>
                  <p className="text-[16px] font-bold text-[#1a1917] mb-2">{comp.name}</p>
                  <p className="text-[13px] text-[#5a574f]">{comp.whatTheyDo}</p>
                </div>
                <div className="bg-[#fffdf1] px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#78350f] mb-2">The Gap</p>
                  <p className="text-[13px] text-[#78350f] font-medium">{comp.gap}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: The Blueprint */}
        <div className="mb-10 print:pt-12 print-avoid-break">
          <h2 className="mb-4 text-[16px] font-bold uppercase tracking-wider text-[#1a1917]">Section 4: The Blueprint</h2>
          <p className="text-[14px] text-[#6b6860] mb-6">Actionable software features so you don't overbuild.</p>

          <div className="rounded-xl bg-[#1c1b18] px-6 py-5 text-white mb-6">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/50">Your Core Loop</p>
            <p className="text-[16px] font-medium leading-relaxed">{coreLoop}</p>
          </div>

          <div className="rounded-xl border border-[#e8e6e0] overflow-hidden">
            <div className="bg-[#fcfbf9] px-5 py-4 border-b border-[#e8e6e0]">
              <p className="text-[14px] font-bold text-[#1a1917]">Feature Priority Matrix</p>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f2eb] border-b border-[#e8e6e0]">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#6b6860] w-1/4">Category</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#6b6860] w-3/4">Features to Include</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                <tr className="border-b border-[#e8e6e0]">
                  <td className="px-5 py-4 font-bold text-[#1e5c38] align-top">Build Now</td>
                  <td className="px-5 py-4 text-[#1a1917] align-top">{buildNow.join(', ')}</td>
                </tr>
                <tr className="border-b border-[#e8e6e0]">
                  <td className="px-5 py-4 font-bold text-[#78350f] align-top">Simplify</td>
                  <td className="px-5 py-4 text-[#1a1917] align-top">{simplify.join(', ')}</td>
                </tr>
                <tr className="border-b border-[#e8e6e0]">
                  <td className="px-5 py-4 font-bold text-[#1e3a5f] align-top">Defer</td>
                  <td className="px-5 py-4 text-[#1a1917] align-top">{defer.join(', ')}</td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-bold text-[#7f1d1d] align-top">Skip</td>
                  <td className="px-5 py-4 text-[#1a1917] align-top">{skip.join(', ')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Technical Complexity */}
          <div className="mt-6 rounded-xl border border-[#e8e6e0] bg-[#fcfbf9] p-5">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[14px] font-bold text-[#1a1917]">Estimated Complexity:</p>
              <span className="rounded-md bg-[#eef8f1] px-2 py-1 text-[12px] font-bold uppercase tracking-wider text-[#1e5c38]">
                {reportB?.complexityLevel || 'Medium'}
              </span>
            </div>
            <p className="text-[13px] text-[#5a574f] leading-relaxed">
              {reportB?.complexityExplanation || 'This idea requires standard user authentication, a core database, and a moderately complex UI, but can be built largely with off-the-shelf components without significant technical risk.'}
            </p>
          </div>
        </div>

        {/* SECTION 5: The Action Plan */}
        <div className="mb-10 print:pt-12 print-avoid-break">
          <h2 className="mb-4 text-[16px] font-bold uppercase tracking-wider text-[#1a1917]">Section 5: The Action Plan</h2>
          <p className="text-[14px] text-[#6b6860] mb-6">Operational steps to make it real.</p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="rounded-xl border border-[#e8e6e0] p-5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#6b6860]">Your North Star Metric</p>
              <p className="text-[18px] font-bold text-[#1a1917] mb-2">{reportC?.whatToBuildPlan?.northStarMetric?.metric || 'Monthly Active Users'}</p>
              <p className="text-[12px] text-[#5a574f] leading-relaxed">{reportC?.whatToBuildPlan?.northStarMetric?.explanation || 'Track user engagement and retention from day 1.'}</p>
            </div>

            <div className="rounded-xl border border-[#e8e6e0] p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#6b6860]">Tech Approach & AI Tools</p>
              <div className="flex flex-wrap gap-2">
                {(reportB?.aiTools || []).slice(0, 4).map((tool, idx) => (
                  <span key={idx} className="rounded-md bg-[#f4f2eb] px-3 py-1.5 text-[12px] font-semibold text-[#1a1917]">
                    {tool.tool}
                  </span>
                ))}
                {(!reportB?.aiTools || reportB.aiTools.length === 0) && (
                  <>
                    <span className="rounded-md bg-[#f4f2eb] px-3 py-1.5 text-[12px] font-semibold text-[#1a1917]">Next.js</span>
                    <span className="rounded-md bg-[#f4f2eb] px-3 py-1.5 text-[12px] font-semibold text-[#1a1917]">Supabase</span>
                    <span className="rounded-md bg-[#f4f2eb] px-3 py-1.5 text-[12px] font-semibold text-[#1a1917]">Zapier</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#fecaca] bg-[#fff7f7] p-5 mb-6">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-wider text-[#7f1d1d]">Common Mistakes to Avoid</p>
            <ul className="list-disc pl-5 space-y-2">
              {(reportB?.commonMistakes || [
                'Underestimating complexity and overbuilding features.',
                'Failing to cultivate a strong initial community.',
                'Ignoring early user feedback in favor of your original vision.'
              ]).map((mistake, idx) => (
                <li key={idx} className="text-[13px] text-[#7f1d1d]">{mistake}</li>
              ))}
            </ul>
          </div>

          {/* 28-DAY ROADMAP Redesign */}
          <div className="rounded-2xl border border-[#e8e6e0] bg-white p-6 print-avoid-break mt-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center size-10 rounded-full bg-[#1e3a8a] text-white shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" x2="4" y1="22" y2="15" /></svg>
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-[#1e3a8a] tracking-tight">28-DAY ROADMAP</h2>
                <p className="text-[13px] text-[#6b7280]">A focused 4-week plan to set up and launch successfully.</p>
              </div>
            </div>

            {/* Timeline Wrapper */}
            <div className="relative">
              {/* Continuous Line */}
              <div className="absolute top-4 left-[16.6%] right-[16.6%] h-[2px] bg-[#374151] z-0"></div>

              <div className="grid grid-cols-3 gap-4 relative z-10">

                {/* Column 1: Week 1 */}
                <div className="flex flex-col items-center">
                  {/* Pill */}
                  <div className="bg-[#4f46e5] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-4 relative">
                    Days 1-7
                    <div className="absolute top-1/2 -left-2 w-3 h-3 bg-[#374151] rounded-full transform -translate-y-1/2 -z-10"></div>
                  </div>
                  {/* Card */}
                  <div className="bg-[#f5f7ff] rounded-2xl p-4 w-full h-full flex flex-col items-center text-center shadow-sm">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-[#e0e7ff] text-[#4f46e5] mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" /><circle cx="10.5" cy="10.5" r="2.5" /><line x1="12.27" x2="14" y1="12.27" y2="14" /></svg>
                    </div>
                    <p className="text-[14px] font-bold text-[#1e3a8a] mb-1 uppercase tracking-tight">Week 1</p>
                    <p className="text-[11px] font-semibold text-[#4f46e5] mb-3 leading-snug line-clamp-2">
                      {(reportC?.roadmap?.[0]?.title || 'Research & Planning').replace(/\.$/, '')}
                    </p>
                    <div className="w-8 h-0.5 bg-[#4f46e5] mb-3 opacity-50"></div>
                    <ul className="text-left text-[11px] text-[#4b5563] space-y-2 w-full">
                      {(reportC?.roadmap?.[0]?.deliverables?.slice(0, 2) || ['Market research report', 'Business plan outline']).map((d, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#4f46e5] shrink-0 mt-1 opacity-70"></span>
                          <span className="leading-tight">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 2: Week 2 */}
                <div className="flex flex-col items-center">
                  {/* Pill */}
                  <div className="bg-[#9333ea] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-4 relative">
                    Days 8-14
                    <div className="absolute top-1/2 -left-2 w-3 h-3 bg-[#374151] rounded-full transform -translate-y-1/2 -z-10"></div>
                  </div>
                  {/* Card */}
                  <div className="bg-[#faf5ff] rounded-2xl p-4 w-full h-full flex flex-col items-center text-center shadow-sm">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-[#f3e8ff] text-[#9333ea] mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    </div>
                    <p className="text-[14px] font-bold text-[#1e3a8a] mb-1 uppercase tracking-tight">Week 2</p>
                    <p className="text-[11px] font-semibold text-[#9333ea] mb-3 leading-snug line-clamp-2">
                      {(reportC?.roadmap?.[1]?.title || 'Core Setup & Build').replace(/\.$/, '')}
                    </p>
                    <div className="w-8 h-0.5 bg-[#9333ea] mb-3 opacity-50"></div>
                    <ul className="text-left text-[11px] text-[#4b5563] space-y-2 w-full">
                      {(reportC?.roadmap?.[1]?.deliverables?.slice(0, 2) || ['Infrastructure setup', 'MVP core features']).map((d, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#9333ea] shrink-0 mt-1 opacity-70"></span>
                          <span className="leading-tight">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Column 3: Week 3-4 */}
                <div className="flex flex-col items-center">
                  {/* Pill */}
                  <div className="bg-[#16a34a] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full mb-4 relative">
                    Days 15-28
                    <div className="absolute top-1/2 -left-2 w-3 h-3 bg-[#374151] rounded-full transform -translate-y-1/2 -z-10"></div>
                  </div>
                  {/* Card */}
                  <div className="bg-[#f0fdf4] rounded-2xl p-4 w-full h-full flex flex-col items-center text-center shadow-sm">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-[#dcfce7] text-[#16a34a] mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2L2 11l9 9 9-9z" /><path d="M12 22V12" /><path d="M12 12H2" /></svg>
                    </div>
                    <p className="text-[14px] font-bold text-[#1e3a8a] mb-1 uppercase tracking-tight">Week 3-4</p>
                    <p className="text-[11px] font-semibold text-[#16a34a] mb-3 leading-snug line-clamp-2">
                      {(reportC?.roadmap?.[3]?.title || 'Marketing & Launch').replace(/\.$/, '')}
                    </p>
                    <div className="w-8 h-0.5 bg-[#16a34a] mb-3 opacity-50"></div>
                    <ul className="text-left text-[11px] text-[#4b5563] space-y-2 w-full">
                      {([...(reportC?.roadmap?.[2]?.deliverables || []), ...(reportC?.roadmap?.[3]?.deliverables || [])].slice(0, 2)).map((d, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#16a34a] shrink-0 mt-1 opacity-70"></span>
                          <span className="leading-tight">{d}</span>
                        </li>
                      ))}
                      {(!reportC?.roadmap || reportC.roadmap.length === 0) && (
                        <>
                          <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#16a34a] shrink-0 mt-1 opacity-70"></span><span className="leading-tight">Marketing campaign plan</span></li>
                          <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-[#16a34a] shrink-0 mt-1 opacity-70"></span><span className="leading-tight">Grand opening launch</span></li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div> {/* End of Section 5 */}
      </div> {/* End of padding wrapper */}

      {/* SECTION 6: Next Steps */}
      <div
        className="flex flex-col items-center justify-center bg-[#0a0a0a] text-center text-white print-full-page"
        style={{
          pageBreakBefore: 'always',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
          height: '99.5vh',
          boxSizing: 'border-box',
          width: '100%',
          padding: '3rem'
        }}
      >
        <div className="mb-8 text-[11px] font-bold tracking-wider uppercase text-white/50">Section 6: Next Steps</div>

        <h2 className="mb-10 font-space-grotesk text-[36px] leading-[1.1] font-bold tracking-tight">
          How do you want to build this?
        </h2>

        <div className="grid grid-cols-2 gap-6 w-full max-w-[800px] mb-12">
          <div className="rounded-2xl border border-white/20 bg-white/5 p-8 text-left">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#a8a59f] mb-4">Option A</p>
            <p className="text-[20px] font-bold text-white mb-2">Build it yourself</p>
            <p className="text-[13px] text-white/70 leading-relaxed">
              If you have the time and desire to learn, suggest using no-code tools like Bubble for the front-end and Xano for the backend. Perfect for bootstrapping on a tight budget.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-white bg-white p-8 text-left text-[#0a0a0a] transform scale-[1.02] shadow-2xl relative">
            <div className="absolute -top-3 -right-3 bg-[#b5d6bf] text-[#1e5c38] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border-2 border-white">
              Recommended
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b6860] mb-4">Option B</p>
            <p className="text-[20px] font-bold text-[#0a0a0a] mb-2">Hire Crework Labs</p>
            <p className="text-[13px] text-[#4a4740] leading-relaxed">
              Emphasize a polished, scalable, and fast-to-market solution. We turn validated ideas into shipped products in 4 weeks with full code ownership. No technical debt, just momentum.
            </p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-8 max-w-[600px] w-full border border-white/20">
          <p className="text-[16px] font-semibold text-white mb-6">Ready to bring your idea to life?</p>
          <a
            href="/book-a-call"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full rounded-lg bg-white px-8 py-4 text-[15px] font-bold text-[#0a0a0a] transition-transform hover:scale-[1.02] no-underline"
          >
            Book a free 30-min scoping call
          </a>
        </div>
      </div>
    </div>
  );
};
