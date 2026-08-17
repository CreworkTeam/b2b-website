import { NextRequest, NextResponse } from 'next/server'
import { mistralChatJson, groqChatJson, GROQ_MODELS } from '@/lib/groq'

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

    if (!process.env.MISTRAL_API_KEY && !process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'LLM API keys not configured' }, { status: 500 })
    }

    try {
      const runner = process.env.MISTRAL_API_KEY
        ? (p: any) => mistralChatJson(p)
        : (p: any) => groqChatJson({ ...p, model: GROQ_MODELS.evaluator })

      const { data: payload, usage } = await runner({
        systemPrompt: `You are an Idea Classification Engine. Given a short product, project, or business idea, classify it using the taxonomy below. Do NOT evaluate quality, market fit, feasibility, or give advice. Output ONLY valid JSON matching the schema.

TAXONOMY — choose 1–3 materially relevant categories, ranked by relevance:
- SaaS: CRM, HRMS, Workflow, ERP, B2B tools
- AI/ML: RAG, Agents, Computer Vision, LLM apps
- FinTech: Payments, Banking, Investing, Insurance
- Healthcare: Diagnostics, Patient Management, Telemedicine
- EdTech: Learning, Courses, Tutoring, Skill assessment
- E-commerce: Marketplace, Shopping, Online Retail
- Logistics: Transport, Supply Chain, Fleet/Delivery
- Social Media: Chat, Community, Networking
- Gaming: RPG, Multiplayer, Casual, Sim
- Productivity: Notes, Calendar, Tasks, Collaboration
- Cybersecurity: Authentication, Threat Detection, Compliance
- Robotics: Automation, Drones, Industrial Automation
- Research: Scientific, Academic, Lab software
- Creative: Music, Art, Writing, Design tools
- Hardware: IoT, Embedded, Wearables
- Local Commerce & Retail: Physical shops, community exchange, resale, swaps
- Food & Beverage: Restaurants, cafes, food trucks, catering
- Professional & Local Services: Repair, consulting, trades, personal services
- Real Estate & Hospitality: Property, rentals, hotels, travel/experiences
- Community & Non-profit: Civic initiatives, mutual aid, volunteering
- Events: Planning, ticketing, physical gatherings
- Manufacturing & Physical Goods: Physical product production
- Other: Only when no taxonomy category fits well

For each category return:
- name
- specific subcategory
- confidence from 0–1

The first category is primary_category. Do not add weak or incidental categories.

TAGS:
Return 3–6 concise attributes not captured by the taxonomy, such as B2B, B2C, Mobile, API-first, No-code, Open-source, Enterprise, Automation, Marketplace.

DELIVERY MODE:
- digital_product: the idea itself is software, an app, website, or digital platform
- physical_or_local: the core idea is offline/physical with no inherent software component
- hybrid: the idea explicitly combines a real-world activity with a digital component
Do not infer a digital product merely because the idea could be digitized.

SAFETY — evaluate independently of taxonomy:
- harmful=true only if the CORE function involves violence, fraud, or another illegal activity
- adult=true if sexual content is the primary subject
- political=true if fundamentally a campaign, advocacy, or public-policy tool
- risk_level: "none", "low", "medium", or "high"
- reason: one plain sentence if any flag is true; otherwise null
Safety flags never replace taxonomy categories.

AMBIGUOUS INPUT:
ONLY mark primary_category="Unclear" (and categories=[]) if the input is literal keyboard smashing, random character spam (e.g. "asdfghjk", "1234567"), or completely meaningless words.
For any creative, visionary, conversational, or early-stage idea (such as "Jarvis AI bot", "space robotics", "drone helper", "smart platform"), ALWAYS classify it into the closest taxonomy categories (e.g., AI/ML, Robotics, Hardware, Productivity, SaaS) with appropriate subcategories.

RULES:
1. Multi-label by default, but include only materially relevant categories; maximum 3.
2. Rank categories by relevance.
3. The first item in categories must match primary_category.
4. Subcategories should be specific and closely describe the idea.
5. Output ONLY the JSON object. No explanation, markdown, or extra text.

OUTPUT SCHEMA:
{
  "categories": [
    {"name": "string", "subcategory": "string", "confidence": 0.0}
  ],
  "primary_category": "string",
  "tags": ["string"],
  "delivery_mode": "digital_product",
  "safety": {
    "harmful": false,
    "adult": false,
    "political": false,
    "risk_level": "none",
    "reason": null
  }
}`,
        userPrompt: `Evaluate this idea:\n\n${idea}`,
        temperature: 0.1,
        maxTokens: 800,
      })

      if (payload && typeof payload === 'object') {
        const p = payload as any
        if (Array.isArray(p.categories) && p.categories.length > 0 && (!p.primary_category || p.primary_category === 'Unclear')) {
          p.primary_category = p.categories[0].name
        }
      }

      console.log(`[FounderOS] Idea Evaluation - ${usage.totalTokens} tokens (Prompt: ${usage.promptTokens}, Completion: ${usage.completionTokens})`)
      return NextResponse.json(payload)
    } catch (error) {
      console.error('[evaluate-idea] error:', error)
      return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
