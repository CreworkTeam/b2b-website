import { NextResponse } from 'next/server'

const NEWS_API_KEY = process.env.NEWS_API_KEY
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

type NewsArticle = {
  title: string
  url: string
  source: { name: string }
  description?: string
}

export async function POST(request: Request) {
  try {
    const { idea, keywords } = await request.json()

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json({ error: 'Valid idea string is required' }, { status: 400 })
    }

    const searchQuery = keywords && keywords.length > 0 
      ? keywords.join(' OR ') 
      : idea

    if (!NEWS_API_KEY) {
      console.warn('NEWS_API_KEY not configured, returning mock news data')
      return NextResponse.json({ articles: [] })
    }

    // 1. Fetch from NewsAPI
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      searchQuery
    )}&sortBy=relevancy&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`
    
    const newsRes = await fetch(newsApiUrl)
    if (!newsRes.ok) {
      console.error(`NewsAPI failed: ${newsRes.status} ${await newsRes.text()}`)
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: 502 })
    }
    const newsData = await newsRes.json()
    const allArticles: NewsArticle[] = newsData.articles || []

    if (allArticles.length === 0) {
      return NextResponse.json({ articles: [] })
    }

    if (!MISTRAL_API_KEY) {
      console.warn('MISTRAL_API_KEY not configured, returning top 3 from NewsAPI directly')
      return NextResponse.json({ articles: allArticles.slice(0, 3) })
    }

    // 2. Use Mistral to filter/extract the top 3
    const mistralPrompt = `
      You are an expert startup analyst. Below are recent news articles related to the startup idea: "${idea}".
      Select the 2 to 3 most relevant articles that validate the need for this idea.
      
      Articles:
      ${allArticles
        .map((a, i) => `[${i}] Title: ${a.title}\nSource: ${a.source?.name}\nURL: ${a.url}\nDescription: ${a.description || 'N/A'}`)
        .join('\n\n')}
      
      Return ONLY a JSON array containing the selected articles. The objects should have keys: "title", "source", and "url". No markdown fences.
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
        temperature: 0.1,
        response_format: { type: 'json_object' }
      }),
    })

    if (!mistralRes.ok) {
      console.error(`Mistral failed: ${mistralRes.status} ${await mistralRes.text()}`)
      // Fallback to top 3 if Mistral fails
      return NextResponse.json({ articles: allArticles.slice(0, 3) })
    }

    const mistralData = await mistralRes.json()
    const rawContent = mistralData.choices?.[0]?.message?.content || '[]'
    
    let extractedArticles = []
    try {
      extractedArticles = JSON.parse(rawContent)
      if (!Array.isArray(extractedArticles)) {
         extractedArticles = Object.values(extractedArticles).find(Array.isArray) || allArticles.slice(0, 3)
      }
    } catch (err) {
      console.error('Failed to parse Mistral JSON:', err)
      extractedArticles = allArticles.slice(0, 3)
    }

    const formattedArticles = extractedArticles.slice(0, 3).map((a: any) => ({
      title: a.title || 'Unknown Title',
      source: a.source?.name || a.source || 'Unknown Source',
      url: a.url || '#',
    }))

    return NextResponse.json({ articles: formattedArticles })
  } catch (err) {
    console.error('Error in /api/news:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
