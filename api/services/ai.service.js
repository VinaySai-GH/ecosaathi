const insightsService = require('./insights.service');

const GEMINI_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * AI Service for conversational bot responses
 */

exports.getConversationalResponse = async (userId, userMessage) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY not set');

        // Build context from user's logs
        const ctx = await insightsService.buildContext(userId);

        const systemPrompt = `You are EcoSaathi AI, a friendly sustainability coach for college students in India.
The user's name is ${ctx.userName} from ${ctx.city}.
They have ${ctx.totalPoints} points and a ${ctx.streak}-day streak.
Their recent water usage: ${ctx.waterTrend || 'No data yet'}.
Their recent carbon footprint: ${ctx.carbonTrend || 'No data yet'}.

If they say "hello" or "hi", greet them warmly and mention their streak.
If they ask for tips, give 1 specific tip for ${ctx.city}.
If they ask about their progress, summarize their points and streak.
If they are just chatting, keep it eco-focused.
Keep your response short (max 3 sentences).
Always be encouraging.
Never mention you are an AI.`;

        const body = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: `${systemPrompt}\n\nUser says: "${userMessage}"` }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 150
            }
        };

        const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            throw new Error(`Gemini Error: ${res.status}`);
        }

        const data = await res.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "I'm here to help you live more sustainably! 🌿";

    } catch (error) {
        console.error('[AI Service] Error:', error.message);
        return "Hey there! I'm your EcoSaathi assistant. How can I help you on your green journey today? 🌿";
    }
};
