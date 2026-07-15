'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFounderStore } from '@/founderos/store/useFounderStore'
import { api } from '@/founderos/lib/api'
import { analytics } from '@/founderos/lib/analytics'
import { PlanSection } from './page/PlanSection'
import { ValidateSection } from './page/ValidateSection'
import { LandingHeader } from '../landing/sections/LandingHeader'
import { ReportHeader, ReportLoading, ReportMobileNav, ReportSidebar } from './page/shared'
import { PrintLayout } from './PrintLayout'
import { toFeedPost } from './page/types'
import type { FeedPost, ReportSection } from './page/types'
import { ScopeSection } from './page/ScopeSection'

export function ReportPage() {
  const [section, setSection] = useState<ReportSection>('validate')
  const [platform, setPlatform] = useState<'all' | FeedPost['platform']>('all')
  const [gateEmail, setGateEmail] = useState('')
  const [gateLoading, setGateLoading] = useState(false)
  const [gateError, setGateError] = useState('')
  const [loadingReports, setLoadingReports] = useState(false)
  const [loadingRouteA, setLoadingRouteA] = useState(false)
  const [loadingRouteB, setLoadingRouteB] = useState(false)
  const [loadingRouteC, setLoadingRouteC] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [downloadEmail, setDownloadEmail] = useState('')
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [newsArticles, setNewsArticles] = useState<{ title: string, source: string, url: string }[]>([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [socialPosts, setSocialPosts] = useState<any[]>([])
  const [socialLoading, setSocialLoading] = useState(false)
  const {
    sessionId,
    quiz,
    archetype,
    reports,
    email,
    setReport,
    setEmail,
    setLeadTag,
    persistToStorage,
    hydrateFromStorage,
  } = useFounderStore()

  useEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#what-to-build') setSection('scope')
      else if (hash === '#how-to-start') setSection('plan')
      else if (hash === '#is-there-demand') setSection('validate')
    }

    if (!window.location.hash || !['#is-there-demand', '#what-to-build', '#how-to-start'].includes(window.location.hash)) {
      window.history.replaceState(null, '', '#is-there-demand')
      setSection('validate')
    } else {
      handleHashChange()
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleSectionChange = (newSection: ReportSection) => {
    const hash = newSection === 'validate' ? '#is-there-demand' 
      : newSection === 'scope' ? '#what-to-build' 
      : '#how-to-start'
    window.location.hash = hash
  }

  const keywordCanvasRef = useRef<HTMLCanvasElement>(null)
  const platformCanvasRef = useRef<HTMLCanvasElement>(null)
  const sentimentCanvasRef = useRef<HTMLCanvasElement>(null)
  const routeAKeyRef = useRef<string | null>(null)
  const routeBKeyRef = useRef<string | null>(null)
  const routeCKeyRef = useRef<string | null>(null)
  const newsKeyRef = useRef<string | null>(null)
  const socialKeyRef = useRef<string | null>(null)

  const activeArchetype = archetype
  const reportA = reports.A
  const reportB = reports.B
  const reportC = reports.C
  const gateUnlocked = Boolean(email)
  const requestKey = useMemo(
    () => JSON.stringify({ archetype: activeArchetype, q1: quiz.q1, q2: quiz.q2, q3: quiz.q3, q4: quiz.q4 }),
    [activeArchetype, quiz.q1, quiz.q2, quiz.q3, quiz.q4]
  )

  const filteredPosts = useMemo(() => {
    if (!socialPosts) return []
    if (platform === 'all') return socialPosts
    return socialPosts.filter((p) => p.platform === platform)
  }, [socialPosts, platform])

  useEffect(() => {
    let cancelled = false

    async function loadReportA() {
      if (!activeArchetype) {
        setLoadingReports(true)
        return
      }

      if (routeAKeyRef.current === requestKey && reportA) return
      setLoadingReports(true)

      try {
        const body = { quiz, archetype: activeArchetype }
        setLoadingRouteA(true)
        const a = await api.reportA(body)
        if (cancelled) return
        setReport('A', a)
        routeAKeyRef.current = requestKey
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) {
          setLoadingReports(false)
          setLoadingRouteA(false)
        }
      }
    }

    loadReportA()

    return () => {
      cancelled = true
    }
  }, [reportA, quiz, activeArchetype, requestKey, setReport])

  useEffect(() => {
    let cancelled = false
    async function loadNews() {
      if (!activeArchetype) return
      if (!reportA) return // Wait for reportA to get the keywords
      if (newsKeyRef.current === requestKey && newsArticles.length > 0) return
      
      setNewsLoading(true)
      try {
        const keywords = reportA.demandSignals?.map(s => s.theme) || []
        const { articles } = await api.getNews(quiz.q2 || 'startup idea', keywords)
        if (!cancelled) {
          setNewsArticles(articles)
          newsKeyRef.current = requestKey
        }
      } catch (err) {
        console.error('Failed to load news:', err)
      } finally {
        if (!cancelled) setNewsLoading(false)
      }
    }
    loadNews()

    async function loadSocial() {
      if (!activeArchetype) return
      if (!reportA) return
      if (socialKeyRef.current === requestKey && socialPosts.length > 0) return
      
      setSocialLoading(true)
      try {
        const keywords = reportA.demandSignals?.map(s => s.theme) || []
        const { posts } = await api.getSocialPosts(quiz.q2 || 'startup idea', keywords)
        if (!cancelled) {
          setSocialPosts(posts)
          socialKeyRef.current = requestKey
        }
      } catch (err) {
        console.error('Failed to load social posts:', err)
      } finally {
        if (!cancelled) setSocialLoading(false)
      }
    }
    loadSocial()
    
    return () => { cancelled = true }
  }, [activeArchetype, requestKey, quiz.q2, newsArticles.length, socialPosts.length, reportA])

  useEffect(() => {
    let cancelled = false

    async function loadReportB() {
      if (!activeArchetype || !gateUnlocked) return
      if (section === 'validate') return
      if (routeBKeyRef.current === requestKey && reportB) return

      try {
        setLoadingRouteB(true)
        const body = { quiz, archetype: activeArchetype }
        const b = await api.reportB(body)
        if (cancelled) return
        setReport('B', b)
        routeBKeyRef.current = requestKey
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoadingRouteB(false)
      }
    }

    loadReportB()

    return () => {
      cancelled = true
    }
  }, [activeArchetype, gateUnlocked, section, reportB, quiz, requestKey, setReport])

  useEffect(() => {
    let cancelled = false

    async function loadReportC() {
      if (!activeArchetype || !gateUnlocked) return
      if (section !== 'plan') return
      if (routeCKeyRef.current === requestKey && reportC) return

      try {
        setLoadingRouteC(true)
        const body = { quiz, archetype: activeArchetype }
        const c = await api.reportC(body)
        if (cancelled) return
        setReport('C', c)
        routeCKeyRef.current = requestKey
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoadingRouteC(false)
      }
    }

    loadReportC()

    return () => {
      cancelled = true
    }
  }, [activeArchetype, gateUnlocked, section, reportC, quiz, requestKey, setReport])

  const handleEmailReport = async () => {
    const normalized = downloadEmail.trim().toLowerCase()
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)

    if (!validEmail) {
      setEmailError('Please enter a valid email address.')
      return
    }

    setEmailError('')
    setEmailLoading(true)
    try {
      let currentReportB = reports.B
      let currentReportC = reports.C

      if (!currentReportB && activeArchetype) {
        currentReportB = await api.reportB({ quiz, archetype: activeArchetype })
        setReport('B', currentReportB)
        routeBKeyRef.current = requestKey
      }
      if (!currentReportC && activeArchetype) {
        currentReportC = await api.reportC({ quiz, archetype: activeArchetype })
        setReport('C', currentReportC)
        routeCKeyRef.current = requestKey
      }

      await api.sendReport({
        email: normalized,
        sessionId,
        reports: {
          A: reportA,
          B: currentReportB,
          C: currentReportC,
        },
      })
      setEmailSuccess(true)
    } catch (err) {
      console.error(err)
      setEmailError('Failed to send report. Please try again.')
    } finally {
      setEmailLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    setDownloadError('')
    setDownloadLoading(true)
    try {
      let currentReportB = reports.B
      let currentReportC = reports.C

      if (!currentReportB && activeArchetype) {
        currentReportB = await api.reportB({ quiz, archetype: activeArchetype })
        setReport('B', currentReportB)
        routeBKeyRef.current = requestKey
      }
      if (!currentReportC && activeArchetype) {
        currentReportC = await api.reportC({ quiz, archetype: activeArchetype })
        setReport('C', currentReportC)
        routeCKeyRef.current = requestKey
      }

      // Trigger native print directly without timeouts or canvases
      window.print()
      setDownloadSuccess(true)

    } catch (err) {
      console.error(err)
      setDownloadError('Failed to generate PDF. Please try again.')
    } finally {
      setDownloadLoading(false)
    }
  }

  const submitEmailGate = async () => {
    const normalized = gateEmail.trim().toLowerCase()
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)

    if (!validEmail) {
      setGateError('Please add a valid email to unlock the full report.')
      return
    }

    setGateError('')
    setGateLoading(true)
    try {
      const { leadTag } = await api.captureEmail({
        email: normalized,
        sessionId,
        quiz,
        archetype,
        q4: quiz.q4,
      })
      setEmail(normalized)
      setLeadTag(leadTag)
      persistToStorage()
      analytics.emailSubmitted(sessionId, 'A')
      analytics.reportUnlocked(sessionId, 'A')
    } catch (err) {
      console.error(err)
      setGateError('Something went wrong. Please try again.')
    } finally {
      setGateLoading(false)
    }
  }

  useEffect(() => {
    if (!reportA || section !== 'validate') return

    let destroyed = false
    const charts: Array<{ destroy: () => void }> = []

    const buildCharts = async () => {
      const chartModule = await import('chart.js/auto')
      const Chart = chartModule.default

      if (destroyed) return

      const axisLabelColor = '#a8a59f'
      const gridColor = '#e8e6e0'

      const keywordDatasets = (reportA.demandSignals.slice(0, 3).map((signal, idx) => {
        const volumeBase = signal.estimatedVolume === 'high' ? 60 : signal.estimatedVolume === 'moderate' ? 35 : 18
        const points = [0.74, 0.79, 0.83, 0.88, 0.94, 0.92, 0.98, 0.95, 0.91, 1.04, 1.12, 1.2].map((factor) =>
          Math.round(volumeBase * factor + idx * 2)
        )
        const styles = [
          { borderColor: '#1a1917', borderWidth: 2, pointRadius: 2.5, pointBackgroundColor: '#1a1917' },
          { borderColor: '#9ca3af', borderWidth: 1.5, pointRadius: 2, pointBackgroundColor: '#9ca3af' },
          { borderColor: '#d1cec7', borderWidth: 1.5, pointRadius: 2, pointBackgroundColor: '#d1cec7' },
        ]

        return {
          label: signal.theme,
          data: points,
          ...styles[idx] ?? styles[2],
          tension: 0.35,
        }
      }))

      const platformCounts = reportA.communities.reduce<Record<string, number>>((acc, community) => {
        acc[community.platform] = (acc[community.platform] ?? 0) + 1
        return acc
      }, {})

      const topPlatforms = Object.entries(platformCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      const chartPlatforms = topPlatforms.length > 0
        ? topPlatforms
        : [['Reddit', 1], ['LinkedIn', 1], ['X', 1], ['IndieHackers', 1], ['Discord', 1]]

      const score = reportA.validationScore
      const problemShare = Math.max(25, Math.min(65, Math.round(35 + (10 - score.overall) * 2.5)))
      const solutionShare = Math.max(20, Math.min(60, Math.round(30 + score.searchDemand * 2.2)))
      const buildShare = Math.max(8, 100 - problemShare - solutionShare)

      if (keywordCanvasRef.current) {
        charts.push(
          new Chart(keywordCanvasRef.current, {
            type: 'line',
            data: {
              // TODO: replace with dynamic keyword data when real API is integrated
              labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
              datasets: keywordDatasets,
            },
            options: {
              animation: false,
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { mode: 'index', intersect: false },
              },
              scales: {
                x: {
                  ticks: { color: axisLabelColor, font: { size: 11 } },
                  grid: { color: gridColor, lineWidth: 0.5 },
                  border: { display: false },
                },
                y: {
                  ticks: { color: axisLabelColor, font: { size: 11 } },
                  grid: { color: gridColor, lineWidth: 0.5 },
                  border: { display: false },
                  title: {
                    display: true,
                    text: 'Search interest (0-100)',
                    color: axisLabelColor,
                    font: { size: 11 },
                  },
                },
              },
            },
          })
        )
      }

      if (platformCanvasRef.current) {
        charts.push(
          new Chart(platformCanvasRef.current, {
            type: 'bar',
            data: {
              labels: chartPlatforms.map(([name]) => name),
              datasets: [
                {
                  label: 'Posts',
                  data: chartPlatforms.map(([, count]) => count),
                  backgroundColor: ['#1a1917', '#444441', '#6b6860', '#a8a59f', '#d1cec7'],
                  borderRadius: 5,
                  borderSkipped: false,
                },
              ],
            },
            options: {
              animation: false,
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => ` ${context.raw} posts` } },
              },
              scales: {
                x: {
                  ticks: { color: axisLabelColor, font: { size: 11 } },
                  grid: { color: gridColor, lineWidth: 0.5 },
                  border: { display: false },
                },
                y: {
                  ticks: { color: axisLabelColor, font: { size: 11 } },
                  grid: { display: false },
                  border: { display: false },
                },
              },
            },
          })
        )
      }

      if (sentimentCanvasRef.current) {
        charts.push(
          new Chart(sentimentCanvasRef.current, {
            type: 'doughnut',
            data: {
              labels: ['Pain / frustration', 'Wants a solution', 'Building one'],
              datasets: [
                {
                  data: [problemShare, solutionShare, buildShare],
                  backgroundColor: ['#f87171', '#34d399', '#60a5fa'],
                  borderWidth: 0,
                  hoverOffset: 4,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '68%',
              plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => ` ${context.raw}% of posts` } },
              },
            },
          })
        )
      }
    }

    buildCharts()

    return () => {
      destroyed = true
      charts.forEach((chart) => chart.destroy())
    }
  }, [reportA, section])

  const validationMetrics = reportA?.validationScore ?? {
    searchDemand: 10,
    communityDensity: 9,
    competitionIntensity: 8,
    overall: 9,
  }

  return (
    <main className="min-h-screen bg-white text-[#1a1917] animate-in fade-in duration-700">
      <LandingHeader fontClass="font-space-grotesk" />
      <div className="min-h-screen w-full">
        <ReportSidebar
          section={section}
          setSection={handleSectionChange}
          ideaText={quiz.q2 || 'Marketplace to discover nail artists nearby'}
        />

        <section id="report-content" className={`px-4 py-6 sm:px-5 md:px-6 md:py-8 lg:px-8 lg:ml-[220px]`}>
          <style>{`
            @media print {
              /* Force background colors and images to print */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Hide all standard web UI elements */
              .hide-in-pdf { display: none !important; }
              #pdf-content-wrapper { display: none !important; }
              header, aside, nav, footer { display: none !important; }
              
              /* Make PrintLayout visible and take over the page */
              #print-only-layout { 
                display: block !important;
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
                background: white;
              }
              
              @page { margin: 0; }
              
              /* Guaranteed page breaks */
              .print-avoid-break, .avoid-break {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
          `}</style>
          
          <PrintLayout 
            quiz={quiz} 
            reportA={reportA} 
            reportB={reportB} 
            reportC={reportC} 
            filteredPosts={filteredPosts}
          />

          <div id="pdf-content-wrapper" className="mx-auto max-w-[47.5rem]">
            <div className="hide-in-pdf">
              <ReportMobileNav section={section} setSection={handleSectionChange} />
            </div>
            <ReportHeader section={section} />

            {loadingReports && !reportA && <div className="hide-in-pdf"><ReportLoading /></div>}

            {loadingRouteA && (
              <div className="hide-in-pdf mb-4 inline-flex items-center gap-2 rounded-lg border border-[#e4e0d8] bg-white px-3 py-2 text-[12px] text-[#6b6860]">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#1a1917]" />
                Generating Report A...
              </div>
            )}

            {!activeArchetype && (
              <div className="hide-in-pdf mb-4 inline-flex items-center gap-2 rounded-lg border border-[#e4e0d8] bg-white px-3 py-2 text-[12px] text-[#6b6860]">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#1a1917]" />
                Waiting for archetype classification...
              </div>
            )}

            <div className={section === 'validate' ? 'block' : 'hidden'}>
              {reportA && (
                <ValidateSection
                  reportA={reportA}
                  validationMetrics={validationMetrics}
                  filteredPosts={filteredPosts}
                  platform={platform}
                  setPlatform={setPlatform}
                  gateUnlocked={gateUnlocked}
                  gateEmail={gateEmail}
                  setGateEmail={(value) => {
                    setGateEmail(value)
                    if (gateError) setGateError('')
                  }}
                  gateError={gateError}
                  gateLoading={gateLoading}
                  submitEmailGate={submitEmailGate}
                  onContinueScope={() => handleSectionChange('scope')}
                  keywordCanvasRef={(node) => { keywordCanvasRef.current = node }}
                  platformCanvasRef={(node) => { platformCanvasRef.current = node }}
                  sentimentCanvasRef={(node) => { sentimentCanvasRef.current = node }}
                  capturedEmail={email}
                  downloadEmail={downloadEmail}
                  setDownloadEmail={(value) => { setDownloadEmail(value); if (emailError) setEmailError('') }}
                  downloadLoading={emailLoading}
                  downloadSuccess={emailSuccess}
                  downloadError={emailError}
                  onDownloadReport={handleEmailReport}
                  newsArticles={newsArticles}
                  newsLoading={newsLoading}
                  socialLoading={socialLoading}
                  disableDownload={loadingRouteA || loadingRouteB || loadingRouteC || newsLoading || socialLoading}
                />
              )}
            </div>

            <div className={section === 'scope' ? 'block' : 'hidden'}>
              <>
                {loadingRouteB && !reportB && (
                  <div className="hide-in-pdf mb-4 inline-flex items-center gap-2 rounded-lg border border-[#e4e0d8] bg-white px-3 py-2 text-[12px] text-[#6b6860]">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#1a1917]" />
                    Generating Report B...
                  </div>
                )}

                {reportB && (
                  <ScopeSection
                    reportB={reportB}
                    gateUnlocked={gateUnlocked}
                    gateEmail={gateEmail}
                    setGateEmail={(value) => {
                      setGateEmail(value)
                      if (gateError) setGateError('')
                    }}
                    gateError={gateError}
                    gateLoading={gateLoading}
                    submitEmailGate={submitEmailGate}
                    socialPosts={socialPosts}
                    socialLoading={socialLoading}
                    onContinuePlan={() => handleSectionChange('plan')}
                    onBackValidate={() => handleSectionChange('validate')}
                  />
                )}
              </>
            </div>

            <div className={section === 'plan' ? 'block' : 'hidden'}>
              <>
                {loadingRouteC && !reportC && (
                  <div className="hide-in-pdf mb-4 inline-flex items-center gap-2 rounded-lg border border-[#e4e0d8] bg-white px-3 py-2 text-[12px] text-[#6b6860]">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#1a1917]" />
                    Generating Report C...
                  </div>
                )}

                {reportB && reportC && (
                  <PlanSection
                    reportB={reportB}
                    reportC={reportC}
                    gateUnlocked={gateUnlocked}
                    gateEmail={gateEmail}
                    setGateEmail={(value) => {
                      setGateEmail(value)
                      if (gateError) setGateError('')
                    }}
                    gateError={gateError}
                    gateLoading={gateLoading}
                    submitEmailGate={submitEmailGate}
                    capturedEmail={email}
                    downloadEmail={downloadEmail}
                    setDownloadEmail={(value) => { setDownloadEmail(value); if (downloadError) setDownloadError('') }}
                    downloadLoading={downloadLoading}
                    downloadSuccess={false}
                    downloadError={downloadError}
                    onDownloadReport={handleDownloadReport}
                    disableDownload={loadingRouteA || loadingRouteB || loadingRouteC || newsLoading || socialLoading}
                  />
                )}
              </>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
