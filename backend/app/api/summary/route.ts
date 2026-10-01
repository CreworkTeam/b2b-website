import { NextResponse } from 'next/server'

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

export async function POST(request: Request) {
  try {
    const { idea, archetype } = await request.json()

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json({ error: 'Valid idea string is required' }, { status: 400 })
    }

    const fallbackSummary = 'Your concept sits at the intersection of proven demand and underserved user needs. By focusing strictly on solving the core pain point—without overcomplicating the initial features—you have a unique opportunity to build early traction. The combination of your chosen model and a targeted go-to-market approach positions you well to capture market share from slower, traditional competitors.'

    if (!MISTRAL_API_KEY) {
      console.warn('MISTRAL_API_KEY not configured, returning mock summary')
      return NextResponse.json({ summary: fallbackSummary })
    }

    const mistralPrompt = `
      You are an expert startup analyst. An entrepreneur has the following startup idea: "${idea}". 
      The idea is classified as a ${archetype || 'startup'}.
      Write a concise, 2-3 sentence paragraph (max 60 words) explaining "what stands out about this idea" and why it is a strong opportunity. 
      Focus on the intersection of demand, underserved needs, and market gap. Keep it encouraging and professional. Do not use placeholders.
      
      Return ONLY a JSON object with a single key "summary" containing the paragraph string. No markdown fences.
    `

    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: mistralPrompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      }),
    })

    if (!mistralRes.ok) {
      console.error(`Mistral failed: ${mistralRes.status} ${await mistralRes.text()}`)
      return NextResponse.json({ summary: fallbackSummary })
    }

    const mistralData = await mistralRes.json()
    const rawContent = mistralData.choices?.[0]?.message?.content || '{}'
    
    let parsed
    try {
      parsed = JSON.parse(rawContent)
    } catch (err) {
      console.error('Failed to parse Mistral JSON:', err)
      parsed = { summary: fallbackSummary }
    }

    return NextResponse.json({ summary: parsed.summary || fallbackSummary })
  } catch (err) {
    console.error('Error in /api/summary:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
