import type { Archetype, QuizAnswers, ReportA, ReportB, ReportC, RouteKey } from '@/types'
import { GROQ_MODELS, groqChatJson } from '@/lib/groq'

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
      'If Delivery Mode is physical_or_local, competitors = other local/offline alternatives (other exchange boxes, library programs, similar community projects nearby), demandSignals = local/community interest signals (not search-volume/SEO framing).',
      'For physical_or_local ideas, do not suggest turning this into an app or platform unless the user\'s quiz answers explicitly indicate they want a digital product.',
      'Do not include any extra keys.',
    ].join(' ')
  }
  if (route === 'B') {
    return [
      'You generate Route B report JSON for MVP scoping.',
      'Return exactly one object with ONLY these top-level keys:',
      'archetype, coreFeatures, skipFeatures, complexityLevel, complexityExplanation, techApproach, commonMistakes, aiTools, marketingPlan, blogLinks, buildContext',
      'Field requirements:',
      '- buildContext: { needsSoftwareMvp: boolean, reason: string }',
      '- coreFeatures: 2-3 objects {name, why}',
      '- skipFeatures: 3-4 objects {name, why}',
      '- complexityLevel: Low|Medium|High',
      '- complexityExplanation: string',
      '- techApproach: string',
      '- commonMistakes: 2-3 strings',
      '- aiTools: 2-4 objects {tool, useCase, url}',
      '- marketingPlan: {waitlistAdvice:string, communities:string[5], activeThreads:[{community,topic,suggestedComment}] (5 items), weekOneChecklist:string[4-7]}',
      '- blogLinks: array of 2-4 objects {label, url, context}',
      '- realWorldPlan: {keySteps:string[3-5], resourcesNeeded:string[], launchChecklist:string[4-6]}',
      'If buildContext.needsSoftwareMvp is false, you MUST OMIT coreFeatures, skipFeatures, complexityLevel, complexityExplanation, techApproach, and aiTools entirely, and INSTEAD INCLUDE realWorldPlan.',
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
    '- unitEconomics: {title, description, monetizationModel(recurring|one_time_purchase|hybrid), points:[{unitLabel, unitsToTarget:number, payingCustomersNeeded:number}]}',
    '- riskCallout: {title, body}',
    '- blogLinks: array of 2-4 objects {label, url, context}',
    'If Delivery Mode is physical_or_local and software is not being built, you MUST completely omit roadmap and questionsToAskAgency.',
    'Do not include any extra keys.',
  ].join(' ')
}

function reportUserPrompt(route: RouteKey, archetype: Archetype, deliveryMode: string, quiz: QuizAnswers): string {
  return [
    `Route: ${route}`,
    `Archetype: ${archetype}`,
    `Delivery Mode: ${deliveryMode}`,
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

export async function generateReportAWithLLM(archetype: Archetype, deliveryMode: string, quiz: QuizAnswers): Promise<LLMReportResult<ReportA>> {
  const payload = await groqChatJson({
    model: GROQ_MODELS.report,
    systemPrompt: reportSystemPrompt('A'),
    userPrompt: reportUserPrompt('A', archetype, deliveryMode, quiz),
    temperature: 0.1,
    maxTokens: 2200,
  })

  const parsed = payload as unknown as ReportA
  return {
    report: { ...parsed, archetype },
    modelArchetype: parsed.archetype || archetype,
  }
}

export async function generateReportBWithLLM(archetype: Archetype, deliveryMode: string, quiz: QuizAnswers): Promise<LLMReportResult<ReportB>> {
  const payload = await groqChatJson({
    model: GROQ_MODELS.report,
    systemPrompt: reportSystemPrompt('B'),
    userPrompt: reportUserPrompt('B', archetype, deliveryMode, quiz),
    temperature: 0.1,
    maxTokens: 2400,
  })

  const parsed = payload as unknown as ReportB
  return {
    report: { ...parsed, archetype },
    modelArchetype: parsed.archetype || archetype,
  }
}

export async function generateReportCWithLLM(archetype: Archetype, deliveryMode: string, quiz: QuizAnswers): Promise<LLMReportResult<ReportC>> {
  const payload = await groqChatJson({
    model: GROQ_MODELS.report,
    systemPrompt: reportSystemPrompt('C'),
    userPrompt: reportUserPrompt('C', archetype, deliveryMode, quiz),
    temperature: 0.1,
    maxTokens: 2600,
  })

  const parsed = payload as unknown as ReportC
  return {
    report: { ...parsed, archetype },
    modelArchetype: parsed.archetype || archetype,
  }
}
