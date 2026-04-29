const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MODELS = [
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'
];

async function testAll() {
    const apiKey = process.env.GEMINI_API_KEY;
    for (const url of MODELS) {
        console.log(`🧪 Testing: ${url.split('/models/')[1].split(':')[0]}...`);
        try {
            const res = await fetch(`${url}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] })
            });
            const data = await res.json();
            if (res.ok) {
                console.log('✅ SUCCESS!');
                return;
            } else {
                console.log(`❌ Failed [${res.status}]: ${data.error?.message?.slice(0, 50)}...`);
            }
        } catch (e) {
            console.log('❌ Error:', e.message);
        }
    }
}

testAll();
