import { NextRequest, NextResponse } from 'next/server'
import { GROQ_MODELS, groqChatJson } from '@/lib/groq'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const idea = body.idea?.trim() ?? ''

    if (!idea || idea.length < 15) {
      return NextResponse.json({ error: 'Idea must be at least 15 characters' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 })
    }

    try {
      const payload = await groqChatJson({
        model: GROQ_MODELS.evaluator,
        systemPrompt: `You are an AI assistant evaluating startup ideas. 
Your goal is to describe the core idea in exactly 2 words. Also classify the idea into one of these archetypes if possible: marketplace, saas_tool, consumer_app, ai_wrapper, b2b_platform, community, ecommerce, developer_tool.
CRITICAL RULE: If the idea is illegal, dangerous, harmful, or involves restricted goods (e.g., drug supply, weapons, illegal activities), you MUST flag it as illegal and provide the negative comment "negative".

Return a JSON object with this exact schema:
{
  "isIllegal": boolean,
  "problemStatement": string | null,
  "archetype": string | null,
  "comment": string | null
}

If isIllegal is true, problemStatement and archetype can be null, and comment MUST be "negative".
If isIllegal is false, provide the 2-word problemStatement (e.g. "Pet sitting", "Invoicing tool") and the archetype, and comment can be null.`,
        userPrompt: `Evaluate this idea:\n\n${idea}`,
        temperature: 0.1,
        maxTokens: 250,
      })

      return NextResponse.json(payload)
    } catch (error) {
      console.error('[evaluate-idea] error:', error)
      return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
