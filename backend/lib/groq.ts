type GroqMessage = {
  role: 'system' | 'user'
  content: string
}

export type GroqTokenUsage = {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export type GroqChatResult<T = unknown> = {
  data: T
  usage: GroqTokenUsage
}

type GroqChatResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const REQUEST_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS ?? 15000)
const RETRY_ATTEMPTS = Number(process.env.LLM_RETRY_ATTEMPTS ?? 2)
const RETRY_BACKOFF_MS = Number(process.env.LLM_RETRY_BACKOFF_MS ?? 400)
const CIRCUIT_FAILURE_THRESHOLD = Number(process.env.LLM_CIRCUIT_FAILURE_THRESHOLD ?? 3)
const CIRCUIT_RESET_MS = Number(process.env.LLM_CIRCUIT_RESET_MS ?? 60000)

const circuitState: {
  consecutiveFailures: number
  openedAt: number | null
} = {
  consecutiveFailures: 0,
  openedAt: null,
}

export const GROQ_MODELS = {
  report: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen-2.5-32b'] as const,
  classifier: ['gemma2-9b-it', 'qwen-2.5-32b', 'openai/gpt-oss-20b'] as const,
  evaluator: ['gemma2-9b-it', 'qwen-2.5-32b', 'openai/gpt-oss-20b'] as const,
}

function isCircuitOpen(): boolean {
  if (circuitState.openedAt === null) return false
  const elapsed = Date.now() - circuitState.openedAt
  if (elapsed >= CIRCUIT_RESET_MS) {
    circuitState.openedAt = null
    circuitState.consecutiveFailures = 0
    return false
  }
  return true
}

function markSuccess(): void {
  circuitState.consecutiveFailures = 0
  circuitState.openedAt = null
}

function markFailure(): void {
  circuitState.consecutiveFailures += 1
  if (circuitState.consecutiveFailures >= CIRCUIT_FAILURE_THRESHOLD) {
    circuitState.openedAt = Date.now()
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function safePreview(text: string, max = 600): string {
  return text.length <= max ? text : `${text.slice(0, max)}...`
}

function logGroqResponse(event: {
  model: string
  attempt: number
  success: boolean
  status?: number
  latencyMs: number
  rawText?: string
  error?: string
  usage?: GroqTokenUsage
}): void {
  const payload = {
    provider: 'groq',
    model: event.model,
    attempt: event.attempt,
    success: event.success,
    status: event.status,
    latencyMs: event.latencyMs,
    rawPreview: event.rawText ? safePreview(event.rawText) : undefined,
    error: event.error,
    usage: event.usage,
    circuitOpen: isCircuitOpen(),
    consecutiveFailures: circuitState.consecutiveFailures,
  }

  if (event.success) {
    console.info('[llm/groq] response', payload)
  } else {
    console.warn('[llm/groq] response_error', payload)
  }
}

function cleanJsonText(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return trimmed

  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  if (fenceMatch?.[1]) return fenceMatch[1].trim()

  return trimmed
}

function extractLikelyJsonObject(text: string): string {
  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first >= 0 && last > first) {
    return text.slice(first, last + 1)
  }
  return text
}

export function parseJsonObject(text: string): unknown {
  const cleaned = cleanJsonText(text)

  try {
    return JSON.parse(cleaned)
  } catch {
    const extracted = extractLikelyJsonObject(cleaned)
    return JSON.parse(extracted)
  }
}

export async function mistralChatJson<T = unknown>(params: {
  systemPrompt: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
}): Promise<GroqChatResult<T>> {
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) throw new Error('MISTRAL_API_KEY is not configured')

  const started = Date.now()
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [
        {
          role: 'system',
          content: `${params.systemPrompt}\n\nReturn only valid JSON. No markdown. No explanation.`,
        },
        {
          role: 'user',
          content: params.userPrompt,
        },
      ],
      temperature: params.temperature ?? 0.2,
      max_tokens: params.maxTokens ?? 1800,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Mistral fallback request failed: ${res.status} ${text}`)
  }

  const json = (await res.json()) as GroqChatResponse
  const raw = json.choices?.[0]?.message?.content?.trim()
  if (!raw) throw new Error('Mistral returned empty content')

  const parsed = parseJsonObject(raw) as T
  const usage: GroqTokenUsage = {
    promptTokens: json.usage?.prompt_tokens ?? 0,
    completionTokens: json.usage?.completion_tokens ?? 0,
    totalTokens: json.usage?.total_tokens ?? 0,
  }

  console.info('[llm/mistral] response success', {
    provider: 'mistral',
    model: 'mistral-small-latest',
    latencyMs: Date.now() - started,
    usage,
  })

  return { data: parsed, usage }
}

export async function groqChatJson<T = unknown>(params: {
  model: string | readonly string[]
  systemPrompt: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
  fallbackModel?: string
}): Promise<GroqChatResult<T>> {
  if (isCircuitOpen()) {
    if (process.env.MISTRAL_API_KEY) {
      console.warn('[llm] Groq circuit open, routing directly to Mistral...')
      return mistralChatJson<T>(params)
    }
    throw new Error('LLM circuit breaker is open')
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    if (process.env.MISTRAL_API_KEY) {
      return mistralChatJson<T>(params)
    }
    throw new Error('GROQ_API_KEY is not configured')
  }

  const primaryModels = Array.isArray(params.model)
    ? (params.model as string[])
    : [params.model as string]

  // Map any decommissioned models to current stable models
  const sanitizedModels = primaryModels.map((m) =>
    m === 'llama-3.1-8b-instant' || m === 'llama-3.3-70b-versatile'
      ? 'openai/gpt-oss-20b'
      : m
  )

  const modelsToTry = [...sanitizedModels]
  if (params.fallbackModel && !modelsToTry.includes(params.fallbackModel)) {
    modelsToTry.push(params.fallbackModel)
  }

  // Automatic fallback guarantee: if oss-120b is tried and oss-20b is not listed, add oss-20b
  if (modelsToTry.includes('openai/gpt-oss-120b') && !modelsToTry.includes('openai/gpt-oss-20b')) {
    modelsToTry.push('openai/gpt-oss-20b')
  }

  // Ensure gpt-oss-20b is always present as a dependable low-latency Groq fallback
  if (!modelsToTry.includes('openai/gpt-oss-20b')) {
    modelsToTry.push('openai/gpt-oss-20b')
  }

  const messages: GroqMessage[] = [
    {
      role: 'system',
      content:
        `${params.systemPrompt}\n\nReturn only valid JSON. No markdown. No explanation. No code blocks.`,
    },
    {
      role: 'user',
      content: params.userPrompt,
    },
  ]

  let lastError: unknown

  for (let mIdx = 0; mIdx < modelsToTry.length; mIdx += 1) {
    const currentModel = modelsToTry[mIdx]

    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt += 1) {
      const started = Date.now()
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

      try {
        const res = await fetch(GROQ_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: currentModel,
            messages,
            temperature: params.temperature ?? 0.2,
            max_tokens: params.maxTokens ?? 1800,
          }),
          signal: controller.signal,
        })

        if (!res.ok) {
          const text = await res.text()
          logGroqResponse({
            model: currentModel,
            attempt,
            success: false,
            status: res.status,
            latencyMs: Date.now() - started,
            rawText: text,
            error: `HTTP_${res.status}`,
          })
          throw new Error(`Groq request failed: ${res.status} ${text}`)
        }

        const json = (await res.json()) as GroqChatResponse
        const raw = json.choices?.[0]?.message?.content?.trim()
        if (!raw) {
          logGroqResponse({
            model: currentModel,
            attempt,
            success: false,
            status: res.status,
            latencyMs: Date.now() - started,
            error: 'EMPTY_CONTENT',
          })
          throw new Error('Groq returned empty content')
        }

        const parsed = parseJsonObject(raw) as T
        const usage: GroqTokenUsage = {
          promptTokens: json.usage?.prompt_tokens ?? 0,
          completionTokens: json.usage?.completion_tokens ?? 0,
          totalTokens: json.usage?.total_tokens ?? 0,
        }

        markSuccess()
        logGroqResponse({
          model: currentModel,
          attempt,
          success: true,
          status: res.status,
          latencyMs: Date.now() - started,
          rawText: raw,
          usage,
        })

        clearTimeout(timeout)
        return { data: parsed, usage }
      } catch (error) {
        clearTimeout(timeout)
        lastError = error

        logGroqResponse({
          model: currentModel,
          attempt,
          success: false,
          latencyMs: Date.now() - started,
          error: error instanceof Error ? error.message : 'Unknown error',
        })

        // If rate limited (429) or model not found (404), skip retries and try next model immediately
        const isSkippable =
          error instanceof Error &&
          (error.message.includes('429') || error.message.includes('404') || error.message.includes('model_not_found'))
        if (isSkippable && mIdx < modelsToTry.length - 1) {
          console.warn(`[llm/groq] ${error instanceof Error ? error.message : 'Error'} on ${currentModel}. Falling back to ${modelsToTry[mIdx + 1]} immediately.`)
          break
        }

        if (attempt < RETRY_ATTEMPTS) {
          await sleep(RETRY_BACKOFF_MS * attempt)
        }
      }
    }

    if (mIdx < modelsToTry.length - 1) {
      console.warn(`[llm/groq] Model ${currentModel} failed. Falling back to ${modelsToTry[mIdx + 1]}...`)
    }
  }

  // If all Groq models failed, try Mistral AI fallback if configured
  if (process.env.MISTRAL_API_KEY) {
    try {
      console.warn('[llm] All Groq models failed, switching to Mistral fallback...')
      const mistralResult = await mistralChatJson<T>(params)
      return mistralResult
    } catch (mistralErr) {
      console.error('[llm] Mistral fallback failed as well:', mistralErr)
    }
  }

  markFailure()
  throw lastError instanceof Error ? lastError : new Error('Groq request failed')
}
