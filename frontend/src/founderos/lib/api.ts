import type {
  ClassifyRequest,
  ClassifyResponse,
  ReportRequest,
  ReportA,
  ReportB,
  ReportC,
  CaptureEmailRequest,
  LeadTag,
} from '@/founderos/types'

const BASE = import.meta.env.PUBLIC_LEAD_MAGNET_BACKEND_URL ?? 'http://localhost:3001'

async function post<TBody, TResponse>(path: string, body: TBody): Promise<TResponse> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error ?? `Request failed: ${res.status}`)
  }

  return res.json() as Promise<TResponse>
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const api = {
  classify(idea: string) {
    return post<ClassifyRequest, ClassifyResponse>('/api/classify', { idea })
  },

  reportA(body: ReportRequest) {
    return post<ReportRequest, ReportA>('/api/report/a', body)
  },

  reportB(body: ReportRequest) {
    return post<ReportRequest, ReportB>('/api/report/b', body)
  },

  reportC(body: ReportRequest) {
    return post<ReportRequest, ReportC>('/api/report/c', body)
  },

  captureEmail(body: CaptureEmailRequest) {
    return post<CaptureEmailRequest, { success: boolean; leadTag: LeadTag }>(
      '/api/capture-email',
      body
    )
  },

  sendReport(body: { email: string; sessionId: string }) {
    return post<{ email: string; sessionId: string }, { success: boolean }>(
      '/api/send-report',
      body
    )
  },
}
