const fs = require('fs');
const path = require('path');

// Parse .env manually to avoid dependency issues
const envPath = path.join(__dirname, '.env');
const env = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      env[key] = value.trim();
    }
  }
}

const NEWS_API_KEY = env.NEWS_API_KEY;
const MISTRAL_API_KEY = env.MISTRAL_API_KEY;

console.log('API Keys Found:');
console.log('NEWS_API_KEY:', NEWS_API_KEY ? 'Present (ending in ' + NEWS_API_KEY.slice(-4) + ')' : 'Missing');
console.log('MISTRAL_API_KEY:', MISTRAL_API_KEY ? 'Present (ending in ' + MISTRAL_API_KEY.slice(-4) + ')' : 'Missing');
console.log('\n----------------------------------------\n');

async function test() {
  const idea = 'A marketplace for freelance nail designers';
  const searchQuery = 'nail design OR freelance artist';

  if (!NEWS_API_KEY) {
    console.error('Error: NEWS_API_KEY is not set');
    return;
  }

  // 1. Fetch from NewsAPI
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=relevancy&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`;
  
  console.log('1. Fetching news articles from NewsAPI...');
  try {
    const newsRes = await fetch(newsApiUrl);
    console.log('NewsAPI Status:', newsRes.status);
    if (!newsRes.ok) {
      const errText = await newsRes.text();
      console.error('NewsAPI Error Response:', errText);
      return;
    }
    const newsData = await newsRes.json();
    const allArticles = newsData.articles || [];
    console.log(`NewsAPI Success! Found ${allArticles.length} articles.`);
    if (allArticles.length === 0) {
      console.log('No articles found for query. Done.');
      return;
    }
    
    console.log('Sample Article Title:', allArticles[0].title);
    console.log('\n----------------------------------------\n');

    if (!MISTRAL_API_KEY) {
      console.log('MISTRAL_API_KEY is not set. Skipping Mistral test.');
      return;
    }

    // 2. Fetch from Mistral API
    console.log('2. Fetching from Mistral API to filter articles...');
    const mistralPrompt = `
      You are an expert startup analyst. Below are recent news articles related to the startup idea: "${idea}".
      Select the 2 to 3 most relevant articles that validate the need for this idea.
      
      Articles:
      ${allArticles
        .map((a, i) => `[${i}] Title: ${a.title}\nSource: ${a.source?.name}\nURL: ${a.url}\nDescription: ${a.description || 'N/A'}`)
        .join('\n\n')}
      
      Return ONLY a JSON array containing the selected articles. The objects should have keys: "title", "source", and "url". No markdown fences.
    `;

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
    });

    console.log('Mistral API Status:', mistralRes.status);
    const mistralText = await mistralRes.text();
    
    if (!mistralRes.ok) {
      console.error('Mistral API Error Response:', mistralText);
      return;
    }

    console.log('Mistral Raw Response:', mistralText);
    
    try {
      const data = JSON.parse(mistralText);
      const rawContent = data.choices?.[0]?.message?.content || '[]';
      console.log('Mistral Choices content:', rawContent);
      const parsed = JSON.parse(rawContent);
      console.log('Successfully parsed Mistral response content:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.error('Failed to parse Mistral JSON:', e.message);
    }

  } catch (error) {
    console.error('Network or Execution Error:', error);
  }
}

test();
