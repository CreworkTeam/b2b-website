'use client'
import { useState, useEffect, useRef } from 'react'
import { useFounderStore } from '@/founderos/store/useFounderStore'
import { api } from '@/founderos/lib/api'
import { analytics } from '@/founderos/lib/analytics'
import { Q1Stage } from './Q1Stage'
import { Q2Idea } from './Q2Idea'
import { Q3UserType } from './Q3UserType'
import { Q4Seriousness } from './Q4Seriousness'
import { Q5DeliveryMode } from './Q5DeliveryMode'
import type { RouteKey } from '@/founderos/types'

const ROUTE_MAP: Record<string, RouteKey> = { idea: 'A', validation: 'B', build: 'C' }

const LOADING_MESSAGES = [
  'Analysing idea...',
  'Detecting archetype...',
  'Scanning demand signals...',
  'Mapping communities...',
  'Building your report...',
]

function useTypewriter(messages: string[], active: boolean) {
  const [displayText, setDisplayText] = useState('')
  const [msgIdx, setMsgIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!active) { setDisplayText(''); setMsgIdx(0); setCharIdx(0); setFading(false); return }
    if (fading) {
      const t = setTimeout(() => { setFading(false); setMsgIdx(i => (i + 1) % messages.length); setCharIdx(0) }, 300)
      return () => clearTimeout(t)
    }
    if (charIdx < messages[msgIdx].length) {
      const t = setTimeout(() => { setDisplayText(messages[msgIdx].slice(0, charIdx + 1)); setCharIdx(c => c + 1) }, 40)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setFading(true), 800)
    return () => clearTimeout(t)
  }, [active, charIdx, msgIdx, fading, messages])

  return { displayText, fading }
}

export function QuizShell() {
  const startTimeRef = useRef<number>(Date.now())
  const { sessionId, quiz, ideaEvaluation, setQ1, setQ2, setQ3, setQ4, setQ5, setArchetype, setDeliveryMode, setActiveTab, persistToStorage, hydrateFromStorage } = useFounderStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [started, setStarted] = useState(false)
  const [q3OtherText, setQ3OtherText] = useState('')

  useEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])

  const { displayText, fading } = useTypewriter(LOADING_MESSAGES, loading)

  useEffect(() => {
    if (started) return
    const handler = () => { analytics.quizStarted(sessionId); setStarted(true) }
    window.addEventListener('click', handler, { once: true })
    return () => window.removeEventListener('click', handler)
  }, [sessionId, started])

  useEffect(() => { analytics.pageViewed(sessionId) }, [sessionId])

  const isComplete = quiz.q1 !== null && quiz.q2.trim().length >= 20 && quiz.q3 !== null && quiz.q4 !== null && quiz.q5 !== undefined && (!ideaEvaluation || (!ideaEvaluation.safety?.harmful && !ideaEvaluation.safety?.adult))

  async function handleSubmit() {
    if (!isComplete) return
    setLoading(true)
    setError(null)
    try {
      const { archetype, deliveryMode } = await api.classify(quiz.q2, quiz.q5)
      setArchetype(archetype)
      if (deliveryMode) setDeliveryMode(deliveryMode)
      const assignedRoute = ROUTE_MAP[quiz.q1!] ?? 'A'
      setActiveTab(assignedRoute)
      persistToStorage()
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
      analytics.quizQ2Submitted(sessionId, quiz.q2.length, archetype)
      analytics.quizCompleted(sessionId, assignedRoute, elapsed)
      window.location.href = '/lead-magnet/report'
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 space-y-12">
      <Q1Stage value={quiz.q1} onChange={(val) => { setQ1(val); analytics.quizQ1Answered(sessionId, val) }} />
      <Q5DeliveryMode value={quiz.q5} onChange={setQ5} />
      <Q3UserType
        value={quiz.q3}
        onChange={(val) => { setQ3(val); analytics.quizQ3Answered(sessionId, val) }}
        otherText={q3OtherText}
        onOtherTextChange={setQ3OtherText}
      />
      <Q4Seriousness value={quiz.q4} onChange={(val) => { setQ4(val); analytics.quizQ4Answered(sessionId, val) }} />
      <Q2Idea value={quiz.q2} onChange={setQ2} />

      <div className="space-y-4 border-t border-[#eaeaea] pt-8">
        {error && (
          <p className="text-[12px] text-[#525252]" style={{ fontFamily: 'var(--font-geist-mono)' }}>{error}</p>
        )}
        <button
          onClick={handleSubmit}
          disabled={!isComplete || loading}
          className="h-[52px] w-full max-w-[400px] rounded-md bg-black px-8 text-center text-[13px] font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_16px_22px_-10px_rgba(0,0,0,0.18)] transition-opacity disabled:opacity-40 hover:opacity-90"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          {loading ? (
            <span
              style={{ fontFamily: 'var(--font-geist-mono)', opacity: fading ? 0 : 1, transition: 'opacity 200ms ease', fontSize: '13px' }}
            >
              {displayText}
            </span>
          ) : (
            'Generate my report →'
          )}
        </button>
        <p
          className="text-[10px] tracking-widest text-[#5f6364]"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          No credit card · No spam · 5 minutes
        </p>
      </div>
    </div>
  )
}
