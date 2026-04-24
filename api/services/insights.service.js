const User      = require('../models/User');
const WaterLog  = require('../models/WaterLog');
const CarbonLog = require('../models/CarbonLog');
const Answer    = require('../models/Answer');
const BotUser   = require('../models/BotUser');
const whatsappService = require('./whatsapp.service');

const GEMINI_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
];

// Question text lookup (mirrors bot.service.js)
const QUESTIONS = {
    food:      [
        { id: 'food_1',      text: 'Did you reduce food waste today?' },
        { id: 'food_2',      text: 'Did you eat vegetarian meals today?' },
        { id: 'food_3',      text: 'Did you compost food scraps today?' },
    ],
    water:     [
        { id: 'water_1',     text: 'Did you reduce water usage today?' },
        { id: 'water_2',     text: 'Did you take a short shower today?' },
        { id: 'water_3',     text: 'Did you fix any water leaks today?' },
    ],
    transport: [
        { id: 'transport_1', text: 'Did you use public transport today?' },
        { id: 'transport_2', text: 'Did you walk/cycle today?' },
        { id: 'transport_3', text: 'Did you carpool or share a ride?' },
    ],
    waste:     [
        { id: 'waste_1',     text: 'Did you reduce single-use plastics today?' },
        { id: 'waste_2',     text: 'Did you recycle items today?' },
        { id: 'waste_3',     text: 'Did you reuse items instead of buying new?' },
    ],
    nature:    [
        { id: 'nature_1',   text: 'Did you spend time in nature today?' },
        { id: 'nature_2',   text: 'Did you plant/care for a plant today?' },
        { id: 'nature_3',   text: 'Did you protect local wildlife today?' },
    ],
};

function findQuestion(id) {
    for (const cat of Object.values(QUESTIONS)) {
        const q = cat.find(x => x.id === id);
        if (q) return q.text;
    }
    return id;
}

// ─── Context builder ──────────────────────────────────────────────────────────
exports.buildContext = buildContext;
async function buildContext(userId) {
    const [user, waterLogs, carbonLogs, answers, botUser] = await Promise.all([
        User.findById(userId).lean(),
        WaterLog.find({ userId }).sort({ year: -1, month: -1 }).limit(6).lean(),
        CarbonLog.find({ userId }).sort({ year: -1, month: -1 }).limit(6).lean(),
        Answer.find({ userId }).sort({ date: -1 }).limit(30).lean(),
        BotUser.findOne({ userId }).lean(),
    ]);

    if (!user) throw new Error('User not found');

    // ── Water section ─────────────────────────────────────────────────────────
    const waterSection = waterLogs.length === 0
        ? 'No water logs recorded yet.'
        : waterLogs.map(w =>
            `  ${MONTHS[w.month - 1]} ${w.year}: ${w.kl_used} KL (city: ${w.city})`
          ).join('\n');

    // Water trend
    let waterTrend = '';
    if (waterLogs.length >= 2) {
        const diff = waterLogs[0].kl_used - waterLogs[1].kl_used;
        waterTrend = diff < 0
            ? `  Trend: IMPROVING — used ${Math.abs(diff).toFixed(1)} KL less than previous month.`
            : diff > 0
                ? `  Trend: WORSENING — used ${diff.toFixed(1)} KL more than previous month.`
                : '  Trend: STABLE — same as previous month.';
    }

    // ── Carbon section ────────────────────────────────────────────────────────
    const carbonSection = carbonLogs.length === 0
        ? 'No carbon logs recorded yet.'
        : carbonLogs.map(c => {
            const lines = [
                `  ${MONTHS[c.month - 1]} ${c.year}:`,
                `    Monthly CO2: ${c.monthly_carbon?.toFixed(1)} kg | Eco Score: ${c.eco_score}/100 | Trees needed to offset: ${c.trees_needed}`,
                `    Transport — bike: ${c.transport_bike_km}km, car: ${c.transport_car_km}km, bus: ${c.transport_bus_km}km, train: ${c.transport_train_km}km`,
                `    Food — type: ${c.food_type}, chicken meals: ${c.chicken_meals}, LPG cylinders: ${c.lpg_cylinders}`,
                `    Waste — ${c.waste_kg}kg generated | composting: ${c.composting} | recycling: ${c.recycling}`,
                `    Plastic bottles: ${c.plastic_bottles} | Online orders: ${c.online_orders} | Electricity: ${c.electricity_units} units`,
            ];
            return lines.join('\n');
          }).join('\n');

    // Carbon trend
    let carbonTrend = '';
    if (carbonLogs.length >= 2) {
        const diff = carbonLogs[0].monthly_carbon - carbonLogs[1].monthly_carbon;
        carbonTrend = diff < 0
            ? `  Trend: IMPROVING — emitted ${Math.abs(diff).toFixed(1)} kg less CO2 than previous month.`
            : diff > 0
                ? `  Trend: WORSENING — emitted ${diff.toFixed(1)} kg more CO2 than previous month.`
                : '  Trend: STABLE.';
    }

    // ── RKH answers section ───────────────────────────────────────────────────
    const rkhSection = answers.length === 0
        ? 'No nightly reflection answers yet.'
        : answers.map(a => {
            const dateStr = new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            const qa = (a.question_ids || []).map((qid, i) =>
                `    Q: ${findQuestion(qid)} → ${a.answers[i] || '?'}`
            ).join('\n');
            return `  ${dateStr}:\n${qa}`;
          }).join('\n');

    // ── Streak / gamification ─────────────────────────────────────────────────
    const streak       = botUser?.streak ?? 0;
    const lastAnswered = botUser?.last_answered
        ? new Date(botUser.last_answered).toLocaleDateString('en-IN')
        : 'never';

    return {
        userName:      user.name,
        city:          user.city || 'unknown city',
        bio:           user.bio || 'Not provided',
        totalPoints:   user.points,
        streak,
        lastAnswered,
        waterSection,
        waterTrend,
        carbonSection,
        carbonTrend,
        rkhSection,
    };
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(ctx) {
    return `You are EcoSaathi's personal sustainability coach — warm, encouraging, and data-driven.
Generate a SHORT, COMPELLING eco insight for ${ctx.userName} from ${ctx.city}, India.

DATA SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${ctx.userName} | City: ${ctx.city} | Bio: ${ctx.bio} | Points: ${ctx.totalPoints} | Streak: ${ctx.streak} days

WATER USAGE (last 6 months):
${ctx.waterSection}
${ctx.waterTrend}

CARBON FOOTPRINT (last 6 months):
${ctx.carbonSection}
${ctx.carbonTrend}

NIGHTLY REFLECTIONS (last 14 days):
${ctx.rkhSection}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTRUCTIONS:
1. Write a rich, detailed paragraph consisting of EXACTLY 3 to 4 complete sentences.
2. Analyze MULTIPLE patterns from their data (e.g., water trends AND carbon footprint or reflections).
3. Include at least TWO specific numbers or facts from their data.
4. Provide a detailed, actionable tip they can do SPECIFICALLY in ${ctx.city} TODAY to improve.
5. Make it warm, personal, deeply encouraging, and insightful — like a mentor who cares.
6. End with an encouraging emoji or phrase.
7. Do NOT mention "the app" or that you're an AI.
8. Do NOT use bold, italics, or special formatting.
9. RANDOM SEED for variation: ${Math.random().toString(36).substring(7)}

EXAMPLE OUTPUT:
"Your water usage dropped beautifully from 12 KL to 9 KL last month, showing exactly how much impact your daily habits can make. It's truly inspiring to see your 5-day reflection streak alongside such real-world results. However, your transport footprint increased slightly due to those extra car trips. Since the weather in your city is getting nicer, consider taking the bus or carpooling for your campus commute tomorrow to offset those emissions. Every small choice compounds, and your dedication to vegetarian meals is already saving significant amounts of water. You have the momentum to make this your greenest month yet. Keep shining and inspiring those around you! 🌿"

NOW WRITE THE INSIGHT FOR ${ctx.userName}:`;
}

// ─── Gemini caller ────────────────────────────────────────────────────────────

async function callGemini(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set in environment');

    const body = {
        contents: [
            {
                role: 'user',
                parts: [{ 
                    text: `SYSTEM: You are EcoSaathi AI. You MUST write a detailed, flowing paragraph of exactly 3 to 4 sentences. You MUST NOT cut off. You MUST end with a period.\n\nDATA:\n${prompt}` 
                }]
            }
        ],
        generationConfig: {
            temperature: 0.1
        }
    };

    const MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
    let lastError = null;

    for (const model of MODELS_TO_TRY) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        try {
            const res = await fetch(url, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(body),
            });

            if (!res.ok) {
                const errText = await res.text().catch(() => '');
                console.error(`[Gemini] Model ${model} failed (${res.status}):`, errText.substring(0, 200));
                lastError = new Error(`Gemini API error ${res.status}`);
                continue; // Try the next model!
            }

            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) {
                lastError = new Error(`Empty response from ${model}`);
                continue;
            }
            
            console.log(`[Gemini] Successfully generated using ${model}`);
            return text.trim();
        } catch (err) {
            console.error(`[Gemini] Network error for ${model}:`, err.message);
            lastError = err;
            continue;
        }
    }

    throw lastError || new Error("All Gemini models failed");
}

// ─── Groq caller ──────────────────────────────────────────────────────────────

async function callGroq(prompt) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY not set in environment');

    const body = {
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'system',
                content: 'You are EcoSaathi AI. You MUST write a detailed, flowing paragraph of exactly 3 to 4 sentences. You MUST NOT cut off. You MUST end with a period.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.1
    };

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:  'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body:    JSON.stringify(body),
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Groq API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty response from Groq');
    
    console.log('[Groq] Successfully generated insight');
    return text.trim();
}

// ─── Cooldown logic ───────────────────────────────────────────────────────────

function pickNextInsightDate() {
    // Random between 3 and 4 days from now
    const daysFromNow = Math.random() < 0.5 ? 3 : 4;
    const next = new Date();
    next.setDate(next.getDate() + daysFromNow);
    return next;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns { insight, isNew, generatedAt }
 * Regenerates if past next_insight_after, otherwise returns cache.
 */
exports.getOrGenerateInsight = async (userId, force = false) => {
    const user = await User.findById(userId).select(
        'name city bio points cached_insight last_insight_at next_insight_after'
    );
    if (!user) throw new Error('User not found');

    const now = new Date();
    if (!force && user.next_insight_after && now < new Date(user.next_insight_after)) {
        console.log(`[Insights] Returning cached insight for ${user.name}`);
        return { insight: user.cached_insight, isNew: false, generatedAt: user.last_insight_at };
    }

    // Generate a fresh insight
    const ctx    = await buildContext(userId);
    const prompt = buildPrompt(ctx);
    
    console.log(`[Insights] Generating fresh insight for ${ctx.userName}...`);
    let insight;
    try {
        insight = await callGemini(prompt);
    } catch (err) {
        console.error('[Insights] Gemini call failed:', err.message);
        
        // --- GROQ FALLBACK ---
        try {
            console.log(`[Insights] Attempting Groq fallback for ${ctx.userName}...`);
            insight = await callGroq(prompt);
        } catch (groqErr) {
            console.error('[Insights] Groq fallback failed:', groqErr.message);

            // Beautiful hardcoded fallback insights if API limits are hit during demo
            const fallbacks = [
                `You are doing great, ${ctx.userName}! With ${ctx.totalPoints} points and a ${ctx.streak}-day streak, your commitment to the environment is truly inspiring. Keep up the amazing work!`,
                `Consistent reflection is the key to a greener life. It's wonderful to see your ${ctx.streak}-day streak, ${ctx.userName}. Let's try to reduce our water usage by just 1 KL this month!`,
                `${ctx.userName}, your dedication is making a real difference in ${ctx.city}. Every drop of water and every vegetarian meal counts. Keep shining and inspiring your hostel mates!`
            ];
            insight = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }
    }

    // Cache it on the user document
    const next = pickNextInsightDate();
    await User.findByIdAndUpdate(userId, {
        cached_insight:     insight,
        last_insight_at:    now,
        next_insight_after: next,
    });

    return { insight, isNew: true, generatedAt: now };
};

/**
 * Specifically pushes a new insight to WhatsApp
 */
exports.pushToWhatsApp = async (userId, insight, userName) => {
    try {
        const botUser = await BotUser.findOne({ userId });
        if (botUser && botUser.phone) {
            const message = `🌿 *Personal Eco-Insight for ${userName}*\n\n` +
                `${insight}\n\n` +
                `_Generated by EcoSaathi AI based on your recent habits._`;
            
            await whatsappService.sendTextMessage(botUser.phone, message);
            console.log(`[Insights] WhatsApp push sent to ${botUser.phone}`);
            return true;
        }
    } catch (wsErr) {
        console.error('[Insights] WhatsApp push failed:', wsErr.message);
    }
    return false;
};
