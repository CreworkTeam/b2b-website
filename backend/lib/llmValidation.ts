import type { Archetype, ReportA, ReportB, ReportC } from '@/types'
import { z } from 'zod'

const archetypeSchema = z.enum([
  'marketplace',
  'saas_tool',
  'consumer_app',
  'ai_wrapper',
  'b2b_platform',
  'community',
  'ecommerce',
  'developer_tool',
])

const blogLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  context: z.string(),
})

const reportASchema = z.object({
  archetype: archetypeSchema,
  demandSignals: z.array(
    z.object({
      theme: z.string(),
      intent: z.string(),
      estimatedVolume: z.enum(['low', 'moderate', 'high']),
    })
  ).min(1),
  communities: z.array(
    z.object({
      platform: z.enum(['Reddit', 'LinkedIn', 'Discord', 'Facebook', 'X', 'IndieHackers', 'Slack']),
      name: z.string(),
      description: z.string(),
      url: z.string().optional(),
    })
  ).min(1),
  competitors: z.array(
    z.object({
      name: z.string(),
      whatTheyDo: z.string(),
      gap: z.string(),
    })
  ).min(1),
  validationScore: z.object({
    searchDemand: z.number(),
    communityDensity: z.number(),
    competitionIntensity: z.number(),
    overall: z.number(),
  }),
  blogLinks: z.array(blogLinkSchema),
  keywordNote: z.string(),
})

const reportBSchema = z.object({
  archetype: archetypeSchema,
  coreFeatures: z.array(
    z.object({
      name: z.string(),
      why: z.string(),
    })
  ).min(1),
  skipFeatures: z.array(
    z.object({
      name: z.string(),
      why: z.string(),
    })
  ).min(1),
  complexityLevel: z.enum(['Low', 'Medium', 'High']),
  complexityExplanation: z.string(),
  techApproach: z.string(),
  commonMistakes: z.array(z.string()).min(1),
  aiTools: z.array(
    z.object({
      tool: z.string(),
      useCase: z.string(),
      url: z.string(),
    })
  ).min(1),
  marketingPlan: z.object({
    waitlistAdvice: z.string(),
    communities: z.array(z.string()),
    activeThreads: z.array(
      z.object({
        community: z.string(),
        topic: z.string(),
        suggestedComment: z.string(),
      })
    ),
    weekOneChecklist: z.array(z.string()),
  }),
  blogLinks: z.array(blogLinkSchema),
})

const reportCSchema = z.object({
  archetype: archetypeSchema,
  specItems: z.array(
    z.object({
      label: z.string(),
      status: z.enum(['defined', 'needs_clarity', 'missing']),
      note: z.string(),
    })
  ).min(1),
  teamFit: z.string(),
  roadmap: z.array(
    z.object({
      week: z.number(),
      title: z.string(),
      deliverables: z.array(z.string()),
    })
  ).min(1),
  questionsToAskAgency: z.array(z.string()).min(1),
  whatToBuildPlan: z.object({
    buildDecisions: z.array(
      z.object({
        group: z.enum(['build_first', 'build_v2', 'skip_for_now']),
        title: z.string(),
        body: z.string(),
      })
    ),
    northStarMetric: z.object({
      metric: z.string(),
      explanation: z.string(),
      target: z.string(),
      trackingNote: z.string(),
    }),
    unitEconomics: z.object({
      title: z.string(),
      description: z.string(),
      points: z.array(
        z.object({
          commissionLabel: z.string(),
          bookingsToTarget: z.number(),
          artistsNeeded: z.number(),
        })
      ),
    }),
    riskCallout: z.object({
      title: z.string(),
      body: z.string(),
    }),
  }).optional(),
  blogLinks: z.array(blogLinkSchema),
})

const classifierPayloadSchema = z.object({
  archetype: archetypeSchema,
})

export function isArchetype(value: unknown): value is Archetype {
  return archetypeSchema.safeParse(value).success
}

export function isValidReportA(value: unknown): value is ReportA {
  return reportASchema.safeParse(value).success
}

export function isValidReportB(value: unknown): value is ReportB {
  return reportBSchema.safeParse(value).success
}

export function isValidReportC(value: unknown): value is ReportC {
  return reportCSchema.safeParse(value).success
}

export function isValidClassifierPayload(value: unknown): value is { archetype: Archetype } {
  return classifierPayloadSchema.safeParse(value).success
}

export function parseReportA(value: unknown): ReportA {
  return reportASchema.parse(value)
}

export function parseReportB(value: unknown): ReportB {
  return reportBSchema.parse(value)
}

export function parseReportC(value: unknown): ReportC {
  return reportCSchema.parse(value)
}
