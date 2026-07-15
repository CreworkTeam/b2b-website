import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ReportB } from '@/founderos/types'
import { EmailGateCard, GateOverlay } from './shared'
import { api } from '@/founderos/lib/api'
import { useFounderStore } from '@/founderos/store/useFounderStore'

type ScopeSectionProps = {
  reportB: ReportB | null
  gateUnlocked: boolean
  gateEmail: string
  setGateEmail: (value: string) => void
  gateError: string
  gateLoading: boolean
  submitEmailGate: () => void
  socialPosts?: any[]
  socialLoading?: boolean
  onContinuePlan: () => void
  onBackValidate: () => void
}

const CHIP_BASE = 'inline-flex items-center rounded-[6px] px-2.5 py-1 text-[11px] font-medium'

export function ScopeSection({
  reportB,
  gateUnlocked,
  gateEmail,
  setGateEmail,
  gateError,
  gateLoading,
  submitEmailGate,
  socialPosts = [],
  socialLoading = false,
  onContinuePlan,
}: ScopeSectionProps) {
  const [guideEmail, setGuideEmail] = useState('')
  const [guideStatus, setGuideStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { sessionId, quiz, archetype, setEmail } = useFounderStore()

  const handleSendGuide = async () => {
    if (!guideEmail || !guideEmail.includes('@')) return
    setGuideStatus('loading')
    try {
      await api.captureEmail({
        email: guideEmail,
        sessionId,
        quiz,
        archetype,
        q4: quiz.q4
      })
      setEmail(guideEmail)
      setGuideStatus('success')
      setGuideEmail('')
    } catch (e) {
      console.error('Guide email error:', e)
      setGuideStatus('error')
    }
  }

  // Map archetype to label
  const archetypeLabels: Record<string, string> = {
    marketplace: 'Marketplace',
    saas_tool: 'SaaS Tool',
    consumer_app: 'Consumer App',
    ai_wrapper: 'AI Tool',
    b2b_platform: 'B2B Platform',
    community: 'Community',
    ecommerce: 'E-Commerce',
    developer_tool: 'Developer Tool',
  }
  const archetypeLabel = reportB?.archetype ? archetypeLabels[reportB.archetype] ?? 'Startup' : 'Startup'

  // Derive complexity color
  const complexityColor = reportB?.complexityLevel === 'Low'
    ? { border: 'border-[#b5d6bf]', bg: 'bg-[#eaf3ec]', text: 'text-[#1e5c38]', dot: 'bg-[#1e5c38]' }
    : reportB?.complexityLevel === 'Medium'
      ? { border: 'border-[#fde68a]', bg: 'bg-[#fffbeb]', text: 'text-[#78350f]', dot: 'bg-[#78350f]' }
      : { border: 'border-[#fecaca]', bg: 'bg-[#fff7f7]', text: 'text-[#7f1d1d]', dot: 'bg-[#7f1d1d]' }

  interface ChannelItem {
    platform: string;
    title: string;
    body: string;
    color: string;
    badge?: string;
  }

  // 1. Serper Data (Reddit & LinkedIn)
  const serperChannels: ChannelItem[] = socialPosts.map((post) => {
    let color = '#6b6860'
    if (post.platform === 'reddit') color = '#ff4500'
    else if (post.platform === 'linkedin') color = '#0077b5'
    else if (post.platform === 'twitter') color = '#1d9bf0'

    return {
      platform: post.platform === 'reddit' ? 'Reddit' : post.platform === 'linkedin' ? 'LinkedIn' : post.platform,
      title: post.source,
      body: post.text,
      color,
    }
  })

  // 2. Groq Data (Twitter)
  const groqTwitterChannels: ChannelItem[] = (reportB?.marketingPlan?.activeThreads || [])
    .filter(thread => thread.community.toLowerCase().includes('twitter') || thread.community.toLowerCase().includes('x'))
    .map(thread => ({
      platform: 'Twitter',
      title: thread.community,
      body: thread.suggestedComment,
      color: '#1d9bf0',
    }))

  // 3. Combine them (take up to 5 total)
  let combinedChannels: ChannelItem[] = [...serperChannels, ...groqTwitterChannels].slice(0, 5)

  // Fallback if empty (e.g. API fails or no data yet)
  if (combinedChannels.length === 0 && !socialLoading) {
    combinedChannels = [
      {
        platform: 'Reddit',
        title: 'r/SaaS · r/startups · r/entrepreneur',
        body: 'Problem-aware founders ask for tools and workflows here daily. Lead with insight, not promotion.',
        color: '#ff4500',
      },
      {
        platform: 'LinkedIn',
        title: 'LinkedIn groups in your target industry',
        body: 'Decision-makers share operational pain points and tool recommendations in public posts and comments.',
        color: '#0077b5',
      },
    ]
  }

  // Add "Start here" badge to the first item
  if (combinedChannels.length > 0) {
    combinedChannels[0].badge = 'Start here'
  }

  const coreLoopHeadline = reportB?.techApproach
    ? (reportB.techApproach.length > 120 ? `${reportB.techApproach.slice(0, 120)}...` : reportB.techApproach)
    : 'User searches by location -> views nail artist portfolio -> sends a booking request.'

  const fadeProps = (index: number) => ({
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: index * 0.15 }
  })

  return (
    <div className="relative">
      {/* Email gate */}
      {!gateUnlocked && (
        <EmailGateCard
          gateEmail={gateEmail}
          setGateEmail={setGateEmail}
          gateError={gateError}
          gateLoading={gateLoading}
          submitEmailGate={submitEmailGate}
        />
      )}

      <div className={`${!gateUnlocked ? 'pointer-events-none select-none' : ''}`}>
        <motion.div {...fadeProps(0)}>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-[5px] bg-[#f0ede6] px-2.5 py-1 text-[11px] text-[#5a574f]">{archetypeLabel}</span>
            {/* TODO: Add target user label dynamically when available in ReportB */}
            {(reportB?.archetype === 'marketplace' || reportB?.archetype === 'consumer_app') && (
              <span className="rounded-[5px] bg-[#f0ede8] px-2.5 py-1 text-[11px] text-[#5a574f]">Consumer · B2C</span>
            )}
            {reportB?.complexityLevel && (
              <span className={`rounded-[5px] ${complexityColor.border} ${complexityColor.bg} px-2.5 py-1 text-[11px] ${complexityColor.text}`}>
                {reportB.complexityLevel} complexity
              </span>
            )}
          </div>

          <p className="mb-2.5 text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-[#4a4740]">Your core loop</p>
          <div className={`print-avoid-break mb-8 rounded-xl bg-[#1c1b18] px-6 py-6 text-white ${!gateUnlocked ? 'filter blur-[7px] select-none pointer-events-none' : ''}`}>
            <p className="mb-3 text-[13px] text-white/50">This is the single thing a user does in your product that delivers value.</p>
            <p className="text-[22px] leading-[1.35]" style={{ fontFamily: 'Georgia, serif' }}>
              {coreLoopHeadline}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {(reportB?.coreFeatures && reportB.coreFeatures.length >= 3
                ? reportB.coreFeatures.slice(0, 3).map(f => f.name)
                : ['Search by location', 'View portfolio', 'Send booking request']
              ).map((step, idx, arr) => (
                <div key={step} className="inline-flex items-center gap-2">
                  <span className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-[12px]">{step}</span>
                  {idx < arr.length - 1 && <span className="text-white/35">→</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 h-px bg-[#e4e0d8]" />
        </motion.div>

        <motion.div {...fadeProps(1)}>
          <div className="mb-3">
            <p className="mb-1.5 text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-[#4a4740]">Feature priority matrix</p>
            <p className="text-[13px] text-[#5a574f]">Every feature plotted by user need vs build difficulty, plus where your idea sits in the market.</p>
          </div>

          <div className={`mb-8 grid gap-3 md:grid-cols-2 ${!gateUnlocked ? 'filter blur-[7px] select-none pointer-events-none' : ''}`}>
            <div className="print-avoid-break overflow-hidden rounded-xl border border-[#d9d3c8] bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
              <div className="border-b border-[#e4e0d8] bg-[#fbfaf7] px-4 py-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-[#9e9b93]">User need x Build complexity</p>
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#9e9b93]">Easy ↔ Hard</p>
                </div>
                <div className="h-px bg-[#ece7de]" />
              </div>
              <div className="grid grid-cols-2 gap-2 p-3">
                <div className="rounded-lg border border-[#b5d6bf] bg-[linear-gradient(180deg,#eef8f1_0%,#e7f2ea_100%)] p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#1e5c38]">Build now</p>
                  <div className="space-y-1.5">
                    {(reportB?.coreFeatures && reportB.coreFeatures.length > 0
                      ? reportB.coreFeatures.map(f => f.name)
                      : ['Core user action', 'Progress/status view', 'Basic onboarding']
                    ).map(feature => (
                      <span key={feature} className={`${CHIP_BASE} bg-white/75 text-[#1e5c38]`}>{feature}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-[#fde68a] bg-[linear-gradient(180deg,#fffdf1_0%,#fdf8df_100%)] p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#78350f]">Simplify</p>
                  {/* TODO: Add dynamic simplify features when available in ReportB */}
                  <div className="space-y-1.5">
                    <span className={`${CHIP_BASE} bg-white/75 text-[#78350f]`}>In-app payments</span>
                    <span className={`${CHIP_BASE} bg-white/75 text-[#78350f]`}>Availability cal.</span>
                    <span className={`${CHIP_BASE} bg-white/75 text-[#78350f]`}>Verified reviews</span>
                  </div>
                </div>
                <div className="rounded-lg border border-[#bfdbfe] bg-[linear-gradient(180deg,#f4f9ff_0%,#eaf3ff_100%)] p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#1e3a5f]">Defer</p>
                  {/* TODO: Add dynamic defer features when available in ReportB */}
                  <div className="space-y-1.5">
                    <span className={`${CHIP_BASE} bg-white/75 text-[#1e3a5f]`}>Onboarding flow</span>
                    <span className={`${CHIP_BASE} bg-white/75 text-[#1e3a5f]`}>Saved favourites</span>
                    <span className={`${CHIP_BASE} bg-white/75 text-[#1e3a5f]`}>Push notifs</span>
                  </div>
                </div>
                <div className="rounded-lg border border-[#fecaca] bg-[linear-gradient(180deg,#fff7f7_0%,#fdecec_100%)] p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#7f1d1d]">Skip</p>
                  <div className="space-y-1.5">
                    {(reportB?.skipFeatures && reportB.skipFeatures.length > 0
                      ? reportB.skipFeatures.map(f => f.name)
                      : ['AI matching', 'Subscription tiers', 'Social feed']
                    ).map(feature => (
                      <span key={feature} className={`${CHIP_BASE} bg-white/75 text-[#7f1d1d] line-through`}>{feature}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="print-avoid-break overflow-hidden rounded-xl border border-[#e4e0d8] bg-white">
                <div className="border-b border-[#e4e0d8] px-4 py-3">
                  <p className="text-[13px] font-medium text-[#1c1b18]">Where your idea sits in the market</p>
                  <p className="text-[11px] text-[#9e9b93]">Based on market uniqueness x value delivered</p>
                </div>
                <div className="grid grid-cols-2">
                  <div className="border-b border-r border-[#e4e0d8] px-3 py-3 opacity-50">
                    <p className="text-[12px] font-semibold">Tech Novelty</p>
                    <p className="text-[11px] text-[#9e9b93]">High uniqueness · Low value</p>
                  </div>
                  <div className="border-b border-[#b5d6bf] bg-[#eaf3ec] px-3 py-3">
                    <p className="mb-1 inline-block rounded bg-[#1e5c38] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-white">Your idea</p>
                    <p className="text-[12px] font-semibold text-[#1e5c38]">Category King</p>
                    <p className="text-[11px] text-[#1e5c38]/80">High uniqueness · High value</p>
                  </div>
                  <div className="border-r border-[#e4e0d8] px-3 py-3 opacity-50">
                    <p className="text-[12px] font-semibold">Low Impact</p>
                    <p className="text-[11px] text-[#9e9b93]">Low uniqueness · Low value</p>
                  </div>
                  <div className="px-3 py-3 opacity-50">
                    <p className="text-[12px] font-semibold">Commodity Play</p>
                    <p className="text-[11px] text-[#9e9b93]">Low uniqueness · High value</p>
                  </div>
                </div>
              </div>

              <div className="print-avoid-break rounded-xl border border-[#e4e0d8] bg-white p-4">
                <p className="mb-1 text-[13px] font-medium text-[#1c1b18]">A.C.P. Framework score</p>
                <p className="mb-3 text-[11px] text-[#9e9b93]">Audience · Community · Product</p>

                {/* TODO: Add dynamic A.C.P. scores when available in ReportB */}
                {[
                  ['Audience', '8/10', '80%', '#1e5c38'],
                  ['Community', '6/10', '60%', '#d97706'],
                  ['Product', '8/10', '80%', '#1e5c38'],
                ].map(([label, score, width, color]) => (
                  <div key={label} className="mb-3 last:mb-0">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[13px] text-[#1c1b18]">{label}</span>
                      <span className="text-[13px] font-medium" style={{ color, fontFamily: 'var(--font-geist-mono)' }}>{score}</span>
                    </div>
                    <div className="h-1.25 overflow-hidden rounded bg-[#e4e0d8]">
                      <div className="h-full rounded" style={{ width, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-8 h-px bg-[#e4e0d8]" />

        <motion.div {...fadeProps(3)}>
          <div className="mb-3">
            <p className="mb-1.5 text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-[#4a4740]">Get your first 100 users</p>
            <p className="text-[13px] text-[#5a574f]">Your users are already talking about this problem in these exact places.</p>
          </div>

          <div className="mb-5">
            <p className="mb-2.5 text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-[#4a4740]">Where your users already are</p>
            <div className={`space-y-2.5 rounded-xl border border-[#e8e6e0] bg-white px-5 py-4 ${!gateUnlocked ? 'filter blur-[7px] select-none pointer-events-none' : ''}`}>
              {socialLoading ? (
                <div className="flex flex-col gap-2">
                  <p className="text-[12px] font-medium text-[#9e9b93] animate-pulse">
                    Finding real communities... {!gateUnlocked && 'fast loading available in full unlock'}
                  </p>
                  <div className="h-4 w-3/4 rounded bg-[#f0ede8] animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-[#f0ede8] animate-pulse" />
                  <div className="mt-4 h-4 w-5/6 rounded bg-[#f0ede8] animate-pulse" />
                  <div className="h-4 w-2/3 rounded bg-[#f0ede8] animate-pulse" />
                </div>
              ) : combinedChannels.map((channel, idx) => (
                <article key={`${channel.title}-${idx}`} className="print-avoid-break border-b border-[#e8e6e0] pb-3 last:border-b-0 last:pb-0">
                  <div className="mb-1 flex items-center gap-2 text-[11px]">
                    <span className="font-semibold" style={{ color: channel.color }}>{channel.platform}</span>
                    <span className="text-[#a8a59f]">·</span>
                    <span className="text-[#6b6860]">{channel.title}</span>
                  </div>
                  <p className="text-[13px] leading-6 text-[#1c1b18]">{channel.body}</p>
                  {channel.badge && <span className="mt-2 inline-flex rounded-[5px] border border-[#b5d6bf] bg-[#eaf3ec] px-2 py-0.5 text-[10px] font-semibold text-[#1e5c38]">{channel.badge}</span>}
                </article>
              ))}
            </div>
          </div>

          <div className={`hide-in-pdf mb-8 rounded-xl border border-[#e4e0d8] bg-white p-5 ${!gateUnlocked ? 'filter blur-[7px] select-none pointer-events-none' : ''}`}>
            <p className="mb-1 text-[13px] font-medium text-[#1c1b18]">How to use AI to find the exact communities where your users already are</p>
            <p className="mb-3 text-[13px] leading-6 text-[#5a574f]">
              We send one practical guide per week to founders building their first product.
            </p>
            <div className="mb-1 flex flex-wrap gap-2">
              <input
                type="email"
                value={guideEmail}
                onChange={(e) => setGuideEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-10 min-w-50 flex-1 rounded-lg border border-[#e4e0d8] bg-[#f8f6f1] px-3 text-[13px] outline-none"
              />
              <button
                onClick={handleSendGuide}
                disabled={guideStatus === 'loading' || guideStatus === 'success'}
                className="cursor-pointer h-10 rounded-lg bg-[#1c1b18] border border-transparent px-4 text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-black hover:border-[#1c1b18] disabled:opacity-50"
              >
                {guideStatus === 'loading' ? 'Sending...' : guideStatus === 'success' ? 'Sent!' : 'Send me the guide ->'}
              </button>
            </div>
            <div className="flex items-start justify-between">
              <div>
                {guideStatus === 'error' && <p className="mb-1 text-[11px] text-red-500">Failed to send. Please try again.</p>}
                <p className="text-[11px] text-[#9e9b93]">One email per week · No spam · Unsubscribe any time</p>
              </div>
              <a 
                href="https://shikshita.substack.com/p/find-exact-reddit-discussions-where" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#1a1917] hover:underline"
              >
                I want to read it first ↗
              </a>
            </div>
          </div>

          <div className="mb-8 h-px bg-[#e4e0d8]" />

          <button
            type="button"
            onClick={onContinuePlan}
            className="hide-in-pdf cursor-pointer w-full rounded-lg bg-[#1a1917] border border-transparent px-5 py-3 text-center text-[14px] font-semibold text-white transition-all hover:bg-white hover:text-black hover:border-[#1a1917]"
          >
            How to start: your 30-day launch plan →
          </button>
        </motion.div>
      </div>
    </div>
  )
}
