// Founder OS analytics wired to Mixpanel
import mixpanel from 'mixpanel-browser'
import type { Archetype, RouteKey, Q1Answer, Q4Answer, LeadTag } from '@/founderos/types'

function track(event: string, properties?: Record<string, string | number | boolean | null>) {
  console.log('[Analytics]', event, properties)
  if (typeof window !== 'undefined') {
    try {
      mixpanel.track(event, properties)
    } catch (e) {
      console.error('[Mixpanel Track Error]', e)
    }
  }
}

export const analytics = {
  pageViewed(sessionId: string) {
    track('page_viewed', { session_id: sessionId, page_name: 'founder-os-quiz' })
  },
  quizStarted(sessionId: string) {
    track('quiz_started', { session_id: sessionId })
  },
  quizQ1Answered(sessionId: string, answer: Q1Answer) {
    track('quiz_step_completed', {
      session_id: sessionId,
      step_number: 1,
      step_name: 'journey-stage',
      answer: answer,
    })
  },
  quizQ2Submitted(sessionId: string, charCount: number, archetype: Archetype) {
    track('quiz_step_completed', {
      session_id: sessionId,
      step_number: 2,
      step_name: 'idea-description',
      answer: 'idea-submitted',
      archetype_detected: archetype,
    })
  },
  quizQ3Answered(sessionId: string, userType: string) {
    track('quiz_step_completed', {
      session_id: sessionId,
      step_number: 3,
      step_name: 'target-audience',
      answer: userType,
    })
  },
  quizQ4Answered(sessionId: string, seriousness: Q4Answer) {
    track('quiz_step_completed', {
      session_id: sessionId,
      step_number: 4,
      step_name: 'validation-status',
      answer: seriousness,
    })
  },
  quizCompleted(sessionId: string, routeAssigned: RouteKey, timeSeconds: number) {
    track('quiz_submitted', {
      session_id: sessionId,
      journey_stage: routeAssigned,
      target_audience: routeAssigned,
      validation_status: 'completed',
      time_seconds: timeSeconds,
    })
  },
  quizAbandoned(sessionId: string, lastQuestion: number) {
    track('quiz_abandoned', {
      session_id: sessionId,
      abandoned_at_step: lastQuestion,
    })
  },
  previewShown(sessionId: string, route: RouteKey) {
    track('preview_shown', { session_id: sessionId, route })
  },
  emailGateShown(sessionId: string) {
    track('email_gate_shown', { session_id: sessionId })
  },
  emailSubmitted(sessionId: string, route: RouteKey) {
    track('email_captured', {
      session_id: sessionId,
      capture_point: 'report_gate',
      route: route,
    })
  },
  reportUnlocked(sessionId: string, route: RouteKey) {
    track('report_unlocked', { session_id: sessionId, route })
  },
  reportViewed(tabName: string) {
    track('report_viewed', { tab_name: tabName })
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
    track('report_cta_clicked', {
      session_id: sessionId,
      cta_label: 'Book a call',
      route,
      lead_tag: leadTag,
      budget_range: budgetRange,
    })
  },
  callBooked(sessionId: string, leadTag: LeadTag | null, budgetRange: string | null) {
    track('discovery_call_booked', {
      session_id: sessionId,
      page_name: 'founder-os-report',
      cta_section: 'report_cta',
      lead_tag: leadTag,
      budget_range: budgetRange,
    })
  },
}

