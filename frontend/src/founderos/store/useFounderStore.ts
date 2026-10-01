import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type {
    FounderState,
    SessionData,
    QuizAnswers,
    Archetype,
    RouteKey,
    LeadTag,
    Q1Answer,
    Q3Answer,
    Q4Answer,
    ReportA,
    ReportB,
    ReportC,
    DeliveryMode,
} from '../types'

const STORAGE_KEY = 'founderOS_session'

const defaultQuiz: QuizAnswers = {
    q1: null,
    q2: '',
    q3: null,
    q4: null,
    q5: undefined,
}

const defaultSession: SessionData = {
    sessionId: '',
    createdAt: '',
    quiz: defaultQuiz,
    ideaEvaluation: null,
    archetype: null,
    email: null,
    emailCapturedAt: null,
    budget: null,
    leadTag: null,
    routesGenerated: [],
    reports: { A: null, B: null, C: null },
    deliveryMode: undefined,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readStorage(): SessionData | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        return JSON.parse(raw) as SessionData
    } catch {
        return null
    }
}

function writeStorage(data: SessionData) {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
        // localStorage unavailable — silently continue
    }
}

// Extract only the serialisable session fields from state
function toSessionData(state: FounderState): SessionData {
    return {
        sessionId: state.sessionId,
        createdAt: state.createdAt,
        quiz: state.quiz,
        ideaEvaluation: state.ideaEvaluation,
        archetype: state.archetype,
        email: state.email,
        emailCapturedAt: state.emailCapturedAt,
        budget: state.budget,
        leadTag: state.leadTag,
        routesGenerated: state.routesGenerated,
        reports: state.reports,
        deliveryMode: state.deliveryMode,
    }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useFounderStore = create<FounderState>((set, get) => ({
    // ── Initial state ──────────────────────────────────────────────────────────
    ...defaultSession,
    activeTab: 'A',

    // ── Quiz actions ───────────────────────────────────────────────────────────
    setQ1: (val: Q1Answer) =>
        set((s) => ({ quiz: { ...s.quiz, q1: val } })),

    setQ2: (val: string) =>
        set((s) => ({ quiz: { ...s.quiz, q2: val } })),

    setIdeaEvaluation: (val) =>
        set({ ideaEvaluation: val }),

    setQ3: (val: Q3Answer) =>
        set((s) => ({ quiz: { ...s.quiz, q3: val } })),

    setQ4: (val: Q4Answer) =>
        set((s) => ({ quiz: { ...s.quiz, q4: val } })),

    setQ5: (val: DeliveryMode) =>
        set((s) => ({ quiz: { ...s.quiz, q5: val } })),

    // ── Session actions ────────────────────────────────────────────────────────
    setArchetype: (val: Archetype) => set({ archetype: val }),

    setDeliveryMode: (val: DeliveryMode) => set({ deliveryMode: val }),

    setEmail: (val: string) =>
        set({ email: val, emailCapturedAt: new Date().toISOString() }),

    setBudget: (val: string) => set({ budget: val }),

    setLeadTag: (val: LeadTag) => set({ leadTag: val }),

    setReport: (route: RouteKey, data: ReportA | ReportB | ReportC) =>
        set((s) => ({ reports: { ...s.reports, [route]: data } })),

    setActiveTab: (tab: RouteKey) => set({ activeTab: tab }),

    markRouteGenerated: (route: RouteKey) =>
        set((s) => ({
            routesGenerated: s.routesGenerated.includes(route)
                ? s.routesGenerated
                : [...s.routesGenerated, route],
        })),

    // ── Persistence ────────────────────────────────────────────────────────────

    hydrateFromStorage: () => {
        const saved = readStorage()
        if (saved && saved.sessionId) {
            // BACKWARD COMPATIBILITY: default deliveryMode to 'hybrid' for old sessions
            if (saved.deliveryMode === undefined) {
                saved.deliveryMode = 'hybrid'
            }
            set({ ...saved })
        } else {
            // First visit or invalid session — create a fresh session ID
            const fresh: Partial<SessionData> = {
                ...saved,
                sessionId: uuidv4(),
                createdAt: saved?.createdAt || new Date().toISOString(),
            }
            set(fresh)
            writeStorage({ ...defaultSession, ...fresh })
        }
    },

    persistToStorage: () => {
        const state = get()
        writeStorage(toSessionData(state))
    },

    // ── Reset ──────────────────────────────────────────────────────────────────
    reset: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
        }
        set({
            ...defaultSession,
            sessionId: uuidv4(),
            createdAt: new Date().toISOString(),
            activeTab: 'A',
        })
    },
}))
