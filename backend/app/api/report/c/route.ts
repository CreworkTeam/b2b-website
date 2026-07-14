import { NextRequest, NextResponse } from 'next/server'
import { getReportC } from '@/lib/reportGenerator'
import { generateReportCWithLLM } from '@/lib/llmReports'
import { buildReportCacheKey, getCachedReport, setCachedReport } from '@/lib/llmCache'
import type { ReportRequest } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: ReportRequest = await req.json()

    if (!body.archetype) {
      return NextResponse.json(
        { error: 'archetype is required' },
        { status: 400 }
      )
    }

    if (!body.quiz) {
      return NextResponse.json(
        { error: 'quiz is required' },
        { status: 400 }
      )
    }

    const sessionId = (body as ReportRequest & { sessionId?: string }).sessionId
    const cacheKey = buildReportCacheKey({
      route: 'C',
      archetype: body.archetype,
      quiz: body.quiz,
      sessionId,
    })

    const cached = getCachedReport<ReturnType<typeof getReportC>>(cacheKey)
    if (cached) {
      console.info('[report/C] source=cache', { archetype: body.archetype, sessionId: sessionId ?? null })
      return NextResponse.json({
        ...cached,
        source: 'cache',
        requestedArchetype: body.archetype,
        modelArchetype: null,
        finalArchetype: body.archetype,
      })
    }

    try {
      const { report, modelArchetype } = await generateReportCWithLLM(body.archetype, body.quiz)

      if (modelArchetype && modelArchetype !== body.archetype) {
        console.warn('[report/C] archetype_mismatch', {
          requestedArchetype: body.archetype,
          modelArchetype,
          sessionId: sessionId ?? null,
        })
      }

      setCachedReport(cacheKey, report)
      console.info('[report/C] source=llm', { archetype: body.archetype, sessionId: sessionId ?? null })
      return NextResponse.json({
        ...report,
        source: 'llm',
        requestedArchetype: body.archetype,
        modelArchetype,
        finalArchetype: report.archetype,
      })
    } catch (error) {
      console.error('[report/C] LLM generation failed, using mock fallback:', error)
      const fallback = getReportC(body.archetype)
      console.info('[report/C] source=mock_fallback', { archetype: body.archetype, sessionId: sessionId ?? null })
      return NextResponse.json({
        ...fallback,
        source: 'mock_fallback',
        requestedArchetype: body.archetype,
        modelArchetype: null,
        finalArchetype: fallback.archetype,
      })
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate Route C report' },
      { status: 500 }
    )
  }
}