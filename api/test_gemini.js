require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) { console.log('no key'); process.exit(1); }

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: "Hello" }] }]
    })
}).then(res => res.json()).then(console.log).catch(console.error);
