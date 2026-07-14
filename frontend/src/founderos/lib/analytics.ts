// Dummy analytics to prevent errors since posthog isn't fully set up here
import type { Archetype, RouteKey, Q1Answer, Q4Answer, LeadTag } from '@/founderos/types'

function track(event: string, properties?: Record<string, string | number | boolean | null>) {
  console.log('[Analytics]', event, properties)
}

export const analytics = {
  pageViewed(sessionId: string) {
    track('page_viewed', { session_id: sessionId })
  },
  quizStarted(sessionId: string) {
    track('quiz_started', { session_id: sessionId })
  },
  quizQ1Answered(sessionId: string, answer: Q1Answer) {
    track('quiz_q1_answered', { session_id: sessionId, answer })
  },
  quizQ2Submitted(sessionId: string, charCount: number, archetype: Archetype) {
    track('quiz_q2_submitted', { session_id: sessionId, char_count: charCount, archetype_detected: archetype })
  },
  quizQ3Answered(sessionId: string, userType: string) {
    track('quiz_q3_answered', { session_id: sessionId, user_type: userType })
  },
  quizQ4Answered(sessionId: string, seriousness: Q4Answer) {
    track('quiz_q4_answered', { session_id: sessionId, seriousness })
  },
  quizCompleted(sessionId: string, routeAssigned: RouteKey, timeSeconds: number) {
    track('quiz_completed', { session_id: sessionId, route_assigned: routeAssigned, time_seconds: timeSeconds })
  },
  quizAbandoned(sessionId: string, lastQuestion: number) {
    track('quiz_abandoned', { session_id: sessionId, last_question: lastQuestion })
  },
  previewShown(sessionId: string, route: RouteKey) {
    track('preview_shown', { session_id: sessionId, route })
  },
  emailGateShown(sessionId: string) {
    track('email_gate_shown', { session_id: sessionId })
  },
  emailSubmitted(sessionId: string, route: RouteKey) {
    track('email_submitted', { session_id: sessionId, route })
  },
  reportUnlocked(sessionId: string, route: RouteKey) {
    track('report_unlocked', { session_id: sessionId, route })
  },
  pdfDownloaded(sessionId: string, route: RouteKey) {
    track('pdf_downloaded', { session_id: sessionId, route })
  },
  routeBClicked(sessionId: string, fromRoute: RouteKey) {
    track('route_b_clicked', { session_id: sessionId, from_route: fromRoute })
  },
  budgetGateShown(sessionId: string) {
    track('budget_gate_shown', { session_id: sessionId })
  },
  budgetAnswered(sessionId: string, budgetRange: string, leadTag: LeadTag) {
    track('budget_answered', { session_id: sessionId, budget_range: budgetRange, lead_tag: leadTag })
  },
  routeCClicked(sessionId: string, fromRoute: RouteKey) {
    track('route_c_clicked', { session_id: sessionId, from_route: fromRoute })
  },
  allRoutesViewed(sessionId: string, timeMinutes: number) {
    track('all_routes_viewed', { session_id: sessionId, time_to_complete_minutes: timeMinutes })
  },
  ctaClicked(sessionId: string, route: RouteKey, leadTag: LeadTag | null, budgetRange: string | null) {
    track('cta_clicked', { session_id: sessionId, route, lead_tag: leadTag, budget_range: budgetRange })
  },
  callBooked(sessionId: string, leadTag: LeadTag | null, budgetRange: string | null) {
    track('call_booked', { session_id: sessionId, lead_tag: leadTag, budget_range: budgetRange })
  },
}
