import type { Archetype, QuizAnswers, ReportA, ReportB, ReportC, RouteKey } from '@/types'
import { GROQ_MODELS, groqChatJson, type GroqTokenUsage } from '@/lib/groq'

export type LLMReportResult<T> = {
  report: T
  modelArchetype: Archetype | null
  usage?: GroqTokenUsage
}

const SHARED_PREAMBLE =
  "You are FounderOS's report generator. Always respond with valid JSON only (no markdown fences, no commentary, no keys beyond the schema given). Never use placeholders like TBD or lorem ipsum. Match archetype to the input exactly."

function reportSystemPrompt(route: RouteKey): string {
  if (route === 'A') {
    return `${SHARED_PREAMBLE}

Route A = demand validation. Shape:
{archetype:marketplace|saas_tool|consumer_app|ai_wrapper|b2b_platform|community|ecommerce|developer_tool,
demandSignals:{theme,intent,estimatedVolume:low|moderate|high}[3-5],
communities:{platform:Reddit|LinkedIn|Discord|Facebook|X|IndieHackers|Slack,name,description,url?}[4-6],
competitors:{name,whatTheyDo,gap}[2-3],
validationScore:{searchDemand,communityDensity,competitionIntensity,overall}(1-10 each),
blogLinks:{label,url,context}[2-4],
keywordNote:string (2-3 sentence executive bottom-line narrative analyzing search demand, customer intent, and market timing; do NOT list raw keywords)}
physical_or_local: competitors=local/offline alternatives; demandSignals=community interest (not SEO); don't pitch an app/platform unless quiz explicitly wants one.`
  }
  if (route === 'B') {
    return `${SHARED_PREAMBLE}

Route B = MVP scoping. Shape:
{archetype,
buildContext:{needsSoftwareMvp:bool,reason},
coreFeatures:{name,why}[2-3],
skipFeatures:{name,why}[3-4],
complexityLevel:Low|Medium|High,
complexityExplanation,
techApproach,
commonMistakes:string[2-3],
aiTools:{tool,useCase,url}[2-4],
marketingPlan:{waitlistAdvice,communities:string[5],activeThreads:{community,topic,suggestedComment}[5],weekOneChecklist:string[4-7]},
blogLinks:{label,url,context}[2-4],
realWorldPlan:{keySteps:string[3-5],resourcesNeeded:string[],launchChecklist:string[4-6]}}
If needsSoftwareMvp=false: omit coreFeatures,skipFeatures,complexityLevel,complexityExplanation,techApproach,aiTools; include realWorldPlan instead.`
  }
  return `${SHARED_PREAMBLE}

Route C = execution/roadmap. Shape:
{archetype,
specItems:{label,status:defined|needs_clarity|missing,note}[],
teamFit:string,
roadmap:{week:number,title,deliverables:string[]}[3],
questionsToAskAgency:string[5],
whatToBuildPlan:{
 buildDecisions:{group:build_first|build_v2|skip_for_now,title,body}[6],
 northStarMetric:{metric,explanation,target,trackingNote},
 unitEconomics:{title,description,monetizationModel:recurring|one_time_purchase|hybrid,points:{unitLabel,unitsToTarget:number,payingCustomersNeeded:number}[]},
 riskCallout:{title,body}},
blogLinks:{label,url,context}[2-4]}
physical_or_local & no software: omit roadmap, questionsToAskAgency.`
}

function reportUserPrompt(archetype: Archetype, deliveryMode: string, quiz: QuizAnswers): string {
  const quizJson = JSON.stringify({
    q1: quiz.q1 || '',
    q2: quiz.q2 || '',
    q3: quiz.q3 || '',
    q4: quiz.q4 || '',
  })

  return [
    `Archetype: ${archetype}`,
    `Delivery Mode: ${deliveryMode}`,
    `Quiz: ${quizJson}`,
    'Tone: founder-friendly, concrete. Every required array must be non-empty.',
  ].join('\n')
}

export async function generateReportAWithLLM(
  archetype: Archetype,
  deliveryMode: string,
  quiz: QuizAnswers
): Promise<LLMReportResult<ReportA>> {
  const { data: parsed, usage } = await groqChatJson<ReportA>({
    model: GROQ_MODELS.report,
    systemPrompt: reportSystemPrompt('A'),
    userPrompt: reportUserPrompt(archetype, deliveryMode, quiz),
    temperature: 0.1,
    maxTokens: 2200,
  })

  console.log(
    `[FounderOS] Report A - ${usage.totalTokens} tokens (Prompt: ${usage.promptTokens}, Completion: ${usage.completionTokens})`
  )

  return {
    report: { ...parsed, archetype },
    modelArchetype: parsed.archetype || archetype,
    usage,
  }
}

export async function generateReportBWithLLM(
  archetype: Archetype,
  deliveryMode: string,
  quiz: QuizAnswers
): Promise<LLMReportResult<ReportB>> {
  const { data: parsed, usage } = await groqChatJson<ReportB>({
    model: GROQ_MODELS.report,
    systemPrompt: reportSystemPrompt('B'),
    userPrompt: reportUserPrompt(archetype, deliveryMode, quiz),
    temperature: 0.1,
    maxTokens: 2400,
  })

  console.log(
    `[FounderOS] Report B - ${usage.totalTokens} tokens (Prompt: ${usage.promptTokens}, Completion: ${usage.completionTokens})`
  )

  return {
    report: { ...parsed, archetype },
    modelArchetype: parsed.archetype || archetype,
    usage,
  }
}

export async function generateReportCWithLLM(
  archetype: Archetype,
  deliveryMode: string,
  quiz: QuizAnswers
): Promise<LLMReportResult<ReportC>> {
  const { data: parsed, usage } = await groqChatJson<ReportC>({
    model: GROQ_MODELS.report,
    systemPrompt: reportSystemPrompt('C'),
    userPrompt: reportUserPrompt(archetype, deliveryMode, quiz),
    temperature: 0.1,
    maxTokens: 2600,
  })

  console.log(
    `[FounderOS] Report C - ${usage.totalTokens} tokens (Prompt: ${usage.promptTokens}, Completion: ${usage.completionTokens})`
  )

  return {
    report: { ...parsed, archetype },
    modelArchetype: parsed.archetype || archetype,
    usage,
  }
}
