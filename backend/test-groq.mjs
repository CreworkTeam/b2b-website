import 'dotenv/config'

const apiKey = process.env.GROQ_API_KEY

if (!apiKey) {
  console.error('❌ GROQ_API_KEY is missing in backend/.env')
  process.exit(1)
}

async function testGroq() {
  console.log('🚀 Sending test prompt to Groq API...')
  const startTime = Date.now()

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello to FounderOS team in 5 words.' }
        ],
        temperature: 0.1,
        max_tokens: 60,
      }),
    })

    const latencyMs = Date.now() - startTime
    const data = await res.json()

    if (!res.ok) {
      console.error(`❌ Groq API Error [Status ${res.status}]:`, data)
      return
    }

    console.log(`\n✅ Groq API Response [HTTP 200 OK in ${latencyMs}ms]:`)
    console.log('--------------------------------------------------')
    console.log('🤖 Output:', data.choices?.[0]?.message?.content)
    console.log('--------------------------------------------------')
    console.log('📊 Usage:', data.usage)
  } catch (err) {
    console.error('❌ Fetch Error:', err)
  }
}

testGroq()
