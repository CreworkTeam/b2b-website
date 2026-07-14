import type { Archetype, QuizAnswers, ReportA, ReportB, ReportC, RouteKey } from '@/types'
import { GROQ_MODELS, groqChatJson } from '@/lib/groq'
import { parseReportA, parseReportB, parseReportC } from '@/lib/llmValidation'
import { z } from 'zod'

export type LLMReportResult<T> = {
  report: T
  modelArchetype: Archetype | null
}

function quizContext(quiz: QuizAnswers): string {
  return JSON.stringify(
    {
      q1: quiz.q1,
      q2: quiz.q2,
      q3: quiz.q3,
      q4: quiz.q4,
    },
    null,
    2
  )
}

function reportSystemPrompt(route: RouteKey): string {
  if (route === 'A') {
    return [
      'You generate Route A report JSON for startup demand validation.',
      'Return exactly one object with ONLY these top-level keys:',
      'archetype, demandSignals, communities, competitors, validationScore, blogLinks, keywordNote',
      'Field requirements:',
      '- archetype: one of marketplace|saas_tool|consumer_app|ai_wrapper|b2b_platform|community|ecommerce|developer_tool',
      '- demandSignals: array of 3-5 objects {theme, intent, estimatedVolume(low|moderate|high)}',
      '- communities: array of 4-6 objects {platform(Reddit|LinkedIn|Discord|Facebook|X|IndieHackers|Slack), name, description, url?}',
      '- competitors: array of 2-3 objects {name, whatTheyDo, gap}',
      '- validationScore: {searchDemand:number(1-10), communityDensity:number(1-10), competitionIntensity:number(1-10), overall:number(1-10)}',
      '- blogLinks: array of 2-4 objects {label, url, context}',
      '- keywordNote: string',
      'Do not include any extra keys.',
    ].join(' ')
  }
  if (route === 'B') {
    return [
      'You generate Route B report JSON for MVP scoping.',
      'Return exactly one object with ONLY these top-level keys:',
      'archetype, coreFeatures, skipFeatures, complexityLevel, complexityExplanation, techApproach, commonMistakes, aiTools, marketingPlan, blogLinks',
      'Field requirements:',
      '- coreFeatures: 2-3 objects {name, why}',
      '- skipFeatures: 3-4 objects {name, why}',
      '- complexityLevel: Low|Medium|High',
      '- complexityExplanation: string',
      '- techApproach: string',
      '- commonMistakes: 2-3 strings',
      '- aiTools: 2-4 objects {tool, useCase, url}',
      '- marketingPlan: {waitlistAdvice:string, communities:string[5], activeThreads:[{community,topic,suggestedComment}] (5 items), weekOneChecklist:string[4-7]}',
      '- blogLinks: array of 2-4 objects {label, url, context}',
      'Do not include any extra keys.',
    ].join(' ')
  }
  return [
    'You generate Route C report JSON for build-readiness planning.',
    'Return exactly one object with ONLY these top-level keys:',
    'archetype, specItems, teamFit, roadmap, questionsToAskAgency, whatToBuildPlan, blogLinks',
    'Field requirements:',
    '- specItems: array of objects {label, status(defined|needs_clarity|missing), note}',
    '- teamFit: string',
    '- roadmap: array of 3 objects {week:number,title:string,deliverables:string[]}',
    '- questionsToAskAgency: exactly 5 strings',
    '- whatToBuildPlan: object with keys buildDecisions, northStarMetric, unitEconomics, riskCallout',
    '- buildDecisions: exactly 6 objects with group build_first|build_v2|skip_for_now, plus title/body',
    '- northStarMetric: {metric, explanation, target, trackingNote}',
    '- unitEconomics: {title, description, points:[{commissionLabel, bookingsToTarget:number, artistsNeeded:number}]}',
    '- riskCallout: {title, body}',
    '- blogLinks: array of 2-4 objects {label, url, context}',
    'Do not include any extra keys.',
  ].join(' ')
}

function reportUserPrompt(route: RouteKey, archetype: Archetype, quiz: QuizAnswers): string {
  return [
    `Route: ${route}`,
    `Archetype: ${archetype}`,
    'Quiz answers JSON:',
    quizContext(quiz),
    'Constraints:',
    '- Keep output founder-friendly and concrete.',
    '- No placeholders like TBD or lorem ipsum.',
    '- Ensure all required arrays are non-empty.',
    '- Set archetype exactly to the provided archetype.',
    '- Return only valid JSON object.',
  ].join('\n')
}

export async function generateReportAWithLLM(archetype: Archetype, quiz: QuizAnswers): Promise<LLMReportResult<ReportA>> {
  const payload = await groqChatJson({
    model: GROQ_MODELS.report,
    systemPrompt: reportSystemPrompt('A'),
    userPrompt: reportUserPrompt('A', archetype, quiz),
    temperature: 0.1,
    maxTokens: 2200,
  })

  try {
    const parsed = parseReportA(payload)
    return {
      report: { ...parsed, archetype },
      modelArchetype: parsed.archetype,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid LLM payload for Report A: ${error.issues.map((i) => i.path.join('.')).join(', ')}`)
    }
    throw error
  }
}

export async function generateReportBWithLLM(archetype: Archetype, quiz: QuizAnswers): Promise<LLMReportResult<ReportB>> {
  const payload = await groqChatJson({
    model: GROQ_MODELS.report,
    systemPrompt: reportSystemPrompt('B'),
    userPrompt: reportUserPrompt('B', archetype, quiz),
    temperature: 0.1,
    maxTokens: 2400,
  })

  try {
    const parsed = parseReportB(payload)
    return {
      report: { ...parsed, archetype },
      modelArchetype: parsed.archetype,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid LLM payload for Report B: ${error.issues.map((i) => i.path.join('.')).join(', ')}`)
    }
    throw error
  }
}

export async function generateReportCWithLLM(archetype: Archetype, quiz: QuizAnswers): Promise<LLMReportResult<ReportC>> {
  const payload = await groqChatJson({
    model: GROQ_MODELS.report,
    systemPrompt: reportSystemPrompt('C'),
    userPrompt: reportUserPrompt('C', archetype, quiz),
    temperature: 0.1,
    maxTokens: 2600,
  })

  try {
    const parsed = parseReportC(payload)
    return {
      report: { ...parsed, archetype },
      modelArchetype: parsed.archetype,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid LLM payload for Report C: ${error.issues.map((i) => i.path.join('.')).join(', ')}`)
    }
    throw error
  }
}
