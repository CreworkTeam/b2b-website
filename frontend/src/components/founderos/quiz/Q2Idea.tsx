'use client'
import { useState, useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import { api } from '@/founderos/lib/api'
import { useFounderStore } from '@/founderos/store/useFounderStore'
const MIN = 20
const MAX = 400

export function Q2Idea({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const { ideaEvaluation, setIdeaEvaluation } = useFounderStore()
  const [detecting, setDetecting] = useState(false)
  
  const apiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear any active timers and reset evaluation
    if (apiTimeoutRef.current) clearTimeout(apiTimeoutRef.current)

    const trimmed = value.trim()
    if (trimmed.length < 15) {
      setIdeaEvaluation(null)
      setDetecting(false)
      return
    }

    // Set detecting to true immediately to show status
    setDetecting(true)
    setIdeaEvaluation(null)

    // Trigger evaluateIdea call after exactly 2 seconds of inactivity
    apiTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await api.evaluateIdea(value)
        setIdeaEvaluation(result)
      } catch (err) {
        console.error(err)
      } finally {
        setDetecting(false)
      }
    }, 2000)

    return () => {
      if (apiTimeoutRef.current) clearTimeout(apiTimeoutRef.current)
    }
  }, [value, setIdeaEvaluation])

  return (
    <section className="rounded-xl bg-[#f9f9f9] border border-[#eaeaea] px-5 py-6 sm:px-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-black text-[11px] font-bold text-white">05</span>
          <h3 className="font-space-grotesk text-[24px] font-semibold leading-7 tracking-[-0.02em] text-[#191c1d] sm:text-[26px]">
            Describe your core idea
          </h3>
        </div>
        <div className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-[#AAF4B5] px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Sparkles className="h-3.5 w-3.5 text-[#2B713F]" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#2B713F]">AI Analysis Active</span>
        </div>
      </div>

      <div className="mt-5">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={MAX}
          rows={4}
          placeholder="Ex: A collaborative platform for local pet sitters and pet owners with integrated health tracking..."
          className="font-space-grotesk w-full resize-none rounded-md border border-[#eaeaea] bg-white px-4 py-4 text-[14px] leading-6 text-[#0a0a0a] outline-none transition-colors duration-150 placeholder:text-[#a1a1aa] focus:border-[#171717]"
          style={{ minHeight: '120px' }}
        />

        <div className="mt-2 space-y-3">
          {/* Status badge / simple messages */}
          {(detecting || (!detecting && !ideaEvaluation && value.length > 0 && value.trim().length < MIN) || value.length > MAX - 100) && (
            <div className="flex min-h-[32px] items-center justify-between">
              <div>
                {detecting && (
                  <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#eaeaea] px-2 py-1 text-[10px] text-[#6f6b63]"
                        style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#6f6b63] pulse-dot" />
                    Generating AI analysis...
                  </span>
                )}
                {!detecting && !ideaEvaluation && value.length > 0 && value.trim().length < MIN && (
                  <span className="text-[10px] text-[#a3a3a3]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {MIN - value.trim().length} more chars needed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {value.length > MAX - 100 && (
                  <span className="text-[10px] text-[#a3a3a3]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {MAX - value.length} left
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Detailed results block */}
          {!detecting && ideaEvaluation && (
            <div className="font-space-grotesk animate-in fade-in duration-300 space-y-3.5 border-t border-[#eaeaea]/60 pt-3.5">
              {/* Safety alert */}
              {(ideaEvaluation.safety?.harmful || ideaEvaluation.safety?.adult) ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-[14px] text-red-700">
                  <p className="font-semibold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                    Idea Flagged:
                  </p>
                  <p className="mt-1 text-red-600 font-mono text-[13px]">{ideaEvaluation.safety.reason || "Sorry, can't help with this."}</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Primary Category Indicator */}
                  {ideaEvaluation.primary_category && ideaEvaluation.primary_category !== 'Unclear' && (
                    <div className="flex flex-wrap items-center gap-2 text-[13px]">
                      <span className="font-bold text-[#6f6b63] uppercase tracking-wider text-[12px]">Primary Domain:</span>
                      <span className="rounded bg-black text-white px-2.5 py-0.5 text-[13px] font-semibold">
                        {ideaEvaluation.primary_category}
                      </span>
                      {ideaEvaluation.categories?.[0]?.subcategory && (
                        <span className="text-[#6b6860]">
                          ({ideaEvaluation.categories[0].subcategory})
                        </span>
                      )}
                      {ideaEvaluation.categories?.[0]?.confidence !== undefined && (
                        <div className="flex items-center gap-1.5 ml-auto">
                          <span className="text-[12px] text-[#6b6860] font-mono">
                            Confidence: {Math.round(ideaEvaluation.categories[0].confidence * 100)}%
                          </span>
                          <div className="w-16 h-1 bg-[#eaeaea] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-black transition-all duration-500" 
                              style={{ width: `${Math.round(ideaEvaluation.categories[0].confidence * 100)}%` }} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* All Matches */}
                  {ideaEvaluation.categories && ideaEvaluation.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[12px] font-bold text-[#6f6b63] uppercase tracking-wider mr-1">All Matches:</span>
                      {ideaEvaluation.categories.map((c, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 rounded-full border border-[#eaeaea] bg-white px-3 py-1 text-[13px] font-medium text-[#1a1917]">
                          {c.name}
                          <span className="text-[11px] text-[#9e9b93] font-mono">{Math.round(c.confidence * 100)}%</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tags Badges */}
                  {ideaEvaluation.tags && ideaEvaluation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center border-t border-[#eaeaea]/40 pt-3">
                      <span className="text-[12px] font-bold text-[#6f6b63] uppercase tracking-wider mr-1">Tags:</span>
                      {ideaEvaluation.tags.map((tag) => (
                        <span key={tag} className="rounded bg-[#f3f4f6] text-[#374151] px-2 py-0.5 text-[12px] font-semibold font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Unclear Fallback */}
                  {ideaEvaluation.primary_category === 'Unclear' && (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50/50 p-4 text-[14px] text-yellow-800 leading-relaxed">
                      <p className="font-semibold">⚠️ Unclear Idea Description</p>
                      <p className="mt-0.5 text-yellow-700">Please describe what you are building in plain language (at least 15-20 characters) so we can classify it.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
