import type {
  ClassifyRequest,
  ClassifyResponse,
  EvaluateIdeaRequest,
  EvaluateIdeaResponse,
  ReportRequest,
  ReportA,
  ReportB,
  ReportC,
  CaptureEmailRequest,
  LeadTag,
} from '@/founderos/types'

let BASE = import.meta.env.PUBLIC_LEAD_MAGNET_BACKEND_URL ?? 'http://localhost:3001'
if (BASE.endsWith('/')) {
  BASE = BASE.slice(0, -1)
}

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
  evaluateIdea(idea: string) {
    return post<EvaluateIdeaRequest, EvaluateIdeaResponse>('/api/evaluate-idea', { idea })
  },

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

  sendReport(body: { email: string; sessionId: string; reports: any }) {
    return post<{ email: string; sessionId: string; reports: any }, { success: boolean }>(
      '/api/send-report',
      body
    )
  },

  getNews(idea: string, keywords?: string[]) {
    return post<{ idea: string; keywords?: string[] }, { articles: Array<{ title: string, source: string, url: string }> }>('/api/news', { idea, keywords })
  },

  getSocialPosts(idea: string, keywords?: string[]) {
    return post<{ idea: string; keywords?: string[] }, { posts: any[] }>('/api/social', { idea, keywords })
  },
}
