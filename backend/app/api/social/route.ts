import { NextResponse } from 'next/server'

const SERPER_API_KEY = process.env.SERPER_API_KEY
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

export async function POST(request: Request) {
  try {
    const { idea, keywords } = await request.json()

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json({ error: 'Valid idea string is required' }, { status: 400 })
    }

    const searchQuery = keywords && keywords.length > 0 
      ? keywords.join(' OR ') 
      : idea

    if (!SERPER_API_KEY) {
      console.warn('SERPER_API_KEY not configured, returning empty social data')
      return NextResponse.json({ posts: [] })
    }

    // 1. Fetch from Serper (Google Search for Reddit/LinkedIn)
    const serperQuery = `site:reddit.com OR site:linkedin.com ${searchQuery}`
    const serperRes = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: serperQuery,
        num: 10
      })
    })

    if (!serperRes.ok) {
      console.error(`Serper API failed: ${serperRes.status} ${await serperRes.text()}`)
      return NextResponse.json({ error: 'Failed to fetch social posts' }, { status: 502 })
    }

    const serperData = await serperRes.json()
    const snippets = serperData.organic || []

    if (snippets.length === 0) {
      return NextResponse.json({ posts: [] })
    }

    if (!MISTRAL_API_KEY) {
      console.warn('MISTRAL_API_KEY not configured, cannot format social data')
      return NextResponse.json({ posts: [] })
    }

    // 2. Use Mistral to filter and format the snippets into FeedPost schema
    const mistralPrompt = `
      You are an expert startup analyst. Below are recent Google search snippets from Reddit and LinkedIn related to a startup idea.
      Extract the 4 to 6 most relevant conversational posts expressing a pain point or need, and format them into a JSON array of \`FeedPost\` objects.
      
      Schema:
      {
        "platform": "reddit" | "linkedin",
        "source": "string (e.g. name of subreddit or LinkedIn author)",
        "user": "string (e.g. username, or same as source if unknown)",
        "time": "string (e.g. '2h ago' or '1d ago')",
        "text": "string (the actual conversation snippet)",
        "stats": "string (e.g. '24 upvotes' or '12 comments' or 'Trending')",
        "mood": "pain" | "wants-solution" | "building",
        "url": "string (URL to the post)"
      }

      Search Snippets:
      ${snippets
        .map((s: any, i: number) => `[${i}] Title: ${s.title}\nURL: ${s.link}\nSnippet: ${s.snippet}`)
        .join('\n\n')}
      
      Return ONLY a JSON array. No markdown fences.
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
      return NextResponse.json({ posts: [] })
    }

    const mistralData = await mistralRes.json()
    const rawContent = mistralData.choices?.[0]?.message?.content || '[]'
    
    let formattedPosts = []
    try {
      formattedPosts = JSON.parse(rawContent)
      if (!Array.isArray(formattedPosts)) {
         formattedPosts = Object.values(formattedPosts).find(Array.isArray) || []
      }
    } catch (err) {
      console.error('Failed to parse Mistral JSON:', err)
      formattedPosts = []
    }

    return NextResponse.json({ posts: formattedPosts })
  } catch (err) {
    console.error('Error in /api/social:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
