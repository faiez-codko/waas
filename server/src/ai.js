const OpenAI = require('openai')

const apiKey = process.env.OPENAI_API_KEY
const baseURL = process.env.OPENAI_BASE_URL

if (!apiKey) {
  console.warn('OPENAI_API_KEY not set — AI features will fail until provided')
}

// Initialize OpenAI client
// Note: OpenAI SDK automatically picks up OPENAI_API_KEY from env, but we can pass it explicitly too.
// We also pass baseURL if it's defined.
const client = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL || undefined
})

async function chatCompletion({ model='gpt-3.5-turbo', systemPrompt='', messages=[] }){
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured')

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...messages
      ],
      max_tokens: 1024,
      temperature: 0.7
    })

    if (completion.choices && completion.choices.length) {
      return completion.choices.map(c => c.message && c.message.content).filter(Boolean).join('\n')
    }
    return null
  } catch (e) {
    console.error('OpenAI Completion Error:', e.response ? e.response.data : e.message)
    throw e
  }
}

module.exports = { chatCompletion }
