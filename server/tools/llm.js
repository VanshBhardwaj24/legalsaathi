// Shared LLM helper — uses Groq's OpenAI-compatible REST API directly via fetch.
// Model: qwen/qwen3-32b — confirmed available for this API key.

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const MODEL = 'qwen/qwen3-32b';

export async function generateText({ system, prompt, apiKey, model }) {
    const activeApiKey = apiKey || process.env.GROQ_API_KEY;
    const activeModel = model || MODEL;
    
    if (!activeApiKey) {
        throw new Error('Groq API Key is missing. Check your .env file.');
    }

    const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeApiKey}`
        },
        body: JSON.stringify({
            model: activeModel,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || `Groq API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.choices[0].message.content;
    
    // Clean up "thinking" blocks if present
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}
