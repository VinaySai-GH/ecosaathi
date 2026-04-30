/**
 * 100 Rotating Questions for EcoSandhya
 * Organized by category. Each question has an id, text, category, and
 * optional "trigger" field — when set, the question is prioritized for
 * users whose app data matches the trigger condition.
 *
 * Triggers:
 *   high_car_km   → user logs > 5 car km in CarbonLog
 *   high_water    → user's last water log > 8 KL
 *   low_eco_score → user's eco_score < 50
 *   no_compost    → user said N to composting questions before
 *   meat_heavy    → user's food_type is non-veg
 *   high_plastic  → user logs > 5 plastic bottles
 *   high_waste    → user logs > 3 kg waste
 *   low_streak    → streak < 7
 *   high_streak   → streak >= 14
 */

const QUESTIONS = {
    food: [
        { id: 'food_01', text: 'Did you finish all the food on your plate today?', category: 'food' },
        { id: 'food_02', text: 'Did you eat a fully vegetarian meal today?', category: 'food' },
        { id: 'food_03', text: 'Did you compost kitchen scraps today?', category: 'food', trigger: 'no_compost' },
        { id: 'food_04', text: 'Did you cook at home instead of ordering in?', category: 'food' },
        { id: 'food_05', text: 'Did you avoid packaged/processed snacks today?', category: 'food' },
        { id: 'food_06', text: 'Did you carry your own lunch instead of buying?', category: 'food' },
        { id: 'food_07', text: 'Did you eat seasonal, locally-grown fruits today?', category: 'food' },
        { id: 'food_08', text: 'Did you reduce your meat consumption today?', category: 'food', trigger: 'meat_heavy' },
        { id: 'food_09', text: 'Did you share surplus food with someone?', category: 'food' },
        { id: 'food_10', text: 'Did you use up leftovers instead of throwing them?', category: 'food' },
        { id: 'food_11', text: 'Did you avoid wasting chapati/rice today?', category: 'food' },
        { id: 'food_12', text: 'Did you buy groceries from a local kirana/market?', category: 'food' },
        { id: 'food_13', text: 'Did you skip a food delivery app today?', category: 'food' },
        { id: 'food_14', text: 'Did you try a new plant-based recipe today?', category: 'food' },
        { id: 'food_15', text: 'Did you eat without single-use plates or cutlery?', category: 'food' },
        { id: 'food_16', text: 'Did you drink homemade chai instead of buying a plastic cup?', category: 'food' },
        { id: 'food_17', text: 'Did you check the expiry date before buying food today?', category: 'food' },
        { id: 'food_18', text: 'Did you eat at the hostel mess instead of ordering online?', category: 'food' },
        { id: 'food_19', text: 'Did you avoid food wrapped in plastic today?', category: 'food' },
        { id: 'food_20', text: 'Did you store food properly to prevent spoilage?', category: 'food' },
    ],
    water: [
        { id: 'water_01', text: 'Did you take a bucket bath instead of a shower today?', category: 'water' },
        { id: 'water_02', text: 'Did you turn off the tap while brushing teeth?', category: 'water' },
        { id: 'water_03', text: 'Did you fix or report a water leak today?', category: 'water', trigger: 'high_water' },
        { id: 'water_04', text: 'Did you reuse water (e.g., washing vegetables for plants)?', category: 'water' },
        { id: 'water_05', text: 'Did you wash clothes with a full load only?', category: 'water' },
        { id: 'water_06', text: 'Did you use a mug instead of running water for washing?', category: 'water' },
        { id: 'water_07', text: 'Did you avoid wasting drinking water today?', category: 'water' },
        { id: 'water_08', text: 'Did you carry a reusable water bottle instead of buying one?', category: 'water' },
        { id: 'water_09', text: 'Did you keep your shower under 5 minutes?', category: 'water', trigger: 'high_water' },
        { id: 'water_10', text: 'Did you water plants in the evening to reduce evaporation?', category: 'water' },
        { id: 'water_11', text: 'Did you use leftover dal/rice water for plants?', category: 'water' },
        { id: 'water_12', text: 'Did you collect rainwater for any purpose today?', category: 'water' },
        { id: 'water_13', text: 'Did you avoid running water while washing dishes?', category: 'water' },
        { id: 'water_14', text: 'Did you check your monthly water usage on the app?', category: 'water' },
        { id: 'water_15', text: 'Did you remind someone to save water today?', category: 'water' },
        { id: 'water_16', text: 'Did you reduce your total water usage compared to yesterday?', category: 'water', trigger: 'high_water' },
        { id: 'water_17', text: 'Did you use a wet cloth to clean instead of hosing down?', category: 'water' },
        { id: 'water_18', text: 'Did you avoid washing your vehicle today?', category: 'water' },
        { id: 'water_19', text: 'Did you notice and appreciate clean water availability today?', category: 'water' },
        { id: 'water_20', text: 'Did you drink enough water yourself today? Hydration matters!', category: 'water' },
    ],
    transport: [
        { id: 'transport_01', text: 'Did you walk or cycle instead of using a vehicle today?', category: 'transport' },
        { id: 'transport_02', text: 'Did you use public transport (bus/train/metro) today?', category: 'transport' },
        { id: 'transport_03', text: 'Did you carpool or share an auto/cab today?', category: 'transport', trigger: 'high_car_km' },
        { id: 'transport_04', text: 'Did you avoid using your personal car/bike for a short trip?', category: 'transport', trigger: 'high_car_km' },
        { id: 'transport_05', text: 'Did you plan your errands to reduce total travel distance?', category: 'transport' },
        { id: 'transport_06', text: 'Did you take the stairs instead of the lift today?', category: 'transport' },
        { id: 'transport_07', text: 'Did you avoid an unnecessary trip by doing something online?', category: 'transport' },
        { id: 'transport_08', text: 'Did you maintain proper tyre pressure for fuel efficiency?', category: 'transport', trigger: 'high_car_km' },
        { id: 'transport_09', text: 'Did you walk to the canteen instead of ordering delivery?', category: 'transport' },
        { id: 'transport_10', text: 'Did you encourage someone to cycle or walk today?', category: 'transport' },
        { id: 'transport_11', text: 'Did you avoid idling your vehicle for more than 30 seconds?', category: 'transport' },
        { id: 'transport_12', text: 'Did you consider an e-rickshaw or EV option today?', category: 'transport' },
        { id: 'transport_13', text: 'Did you walk at least 3000 steps today?', category: 'transport' },
        { id: 'transport_14', text: 'Did you avoid booking a solo cab for a short distance?', category: 'transport' },
        { id: 'transport_15', text: 'Did you enjoy the walk/ride and notice nature around you?', category: 'transport' },
        { id: 'transport_16', text: 'Did you stay on campus and avoid unnecessary travel?', category: 'transport' },
        { id: 'transport_17', text: 'Did you use the college shuttle instead of a private vehicle?', category: 'transport' },
        { id: 'transport_18', text: 'Did you track your transport carbon footprint on the app?', category: 'transport' },
        { id: 'transport_19', text: 'Did you choose a meeting spot closer to everyone to reduce travel?', category: 'transport' },
        { id: 'transport_20', text: 'Did you ride a bicycle on campus today?', category: 'transport' },
    ],
    waste: [
        { id: 'waste_01', text: 'Did you avoid single-use plastic today?', category: 'waste' },
        { id: 'waste_02', text: 'Did you segregate your waste into wet and dry?', category: 'waste' },
        { id: 'waste_03', text: 'Did you recycle paper, glass, or metal today?', category: 'waste' },
        { id: 'waste_04', text: 'Did you carry a cloth bag for shopping today?', category: 'waste' },
        { id: 'waste_05', text: 'Did you refuse a plastic straw or bag today?', category: 'waste', trigger: 'high_plastic' },
        { id: 'waste_06', text: 'Did you reuse something instead of throwing it away?', category: 'waste' },
        { id: 'waste_07', text: 'Did you dispose of e-waste properly (batteries, cables)?', category: 'waste' },
        { id: 'waste_08', text: 'Did you reduce the number of online shopping deliveries?', category: 'waste' },
        { id: 'waste_09', text: 'Did you use a reusable container for takeaway food?', category: 'waste' },
        { id: 'waste_10', text: 'Did you donate old clothes or items instead of trashing?', category: 'waste' },
        { id: 'waste_11', text: 'Did you avoid buying something with excess packaging?', category: 'waste', trigger: 'high_waste' },
        { id: 'waste_12', text: 'Did you use both sides of paper before recycling?', category: 'waste' },
        { id: 'waste_13', text: 'Did you pick up litter you noticed today?', category: 'waste' },
        { id: 'waste_14', text: 'Did you repair something instead of replacing it?', category: 'waste' },
        { id: 'waste_15', text: 'Did you use a digital note instead of paper today?', category: 'waste' },
        { id: 'waste_16', text: 'Did you return or recycle a PET bottle today?', category: 'waste', trigger: 'high_plastic' },
        { id: 'waste_17', text: 'Did you avoid creating any unnecessary waste today?', category: 'waste' },
        { id: 'waste_18', text: 'Did you use a refillable pen instead of a use-and-throw?', category: 'waste' },
        { id: 'waste_19', text: 'Did you share or exchange textbooks with someone?', category: 'waste' },
        { id: 'waste_20', text: 'Did you avoid throwing food in the general waste bin?', category: 'waste' },
    ],
    nature: [
        { id: 'nature_01', text: 'Did you spend at least 15 minutes outdoors today?', category: 'nature' },
        { id: 'nature_02', text: 'Did you water or care for a plant today?', category: 'nature' },
        { id: 'nature_03', text: 'Did you notice any birds or wildlife today?', category: 'nature' },
        { id: 'nature_04', text: 'Did you avoid disturbing a natural habitat today?', category: 'nature' },
        { id: 'nature_05', text: 'Did you sit under a tree or in a garden today?', category: 'nature' },
        { id: 'nature_06', text: 'Did you take a photo of something beautiful in nature?', category: 'nature' },
        { id: 'nature_07', text: 'Did you switch off lights/fans when not in use?', category: 'nature' },
        { id: 'nature_08', text: 'Did you unplug chargers when your phone was full?', category: 'nature' },
        { id: 'nature_09', text: 'Did you use natural light instead of turning on lights?', category: 'nature' },
        { id: 'nature_10', text: 'Did you learn something new about the environment today?', category: 'nature' },
        { id: 'nature_11', text: 'Did you teach someone an eco-tip today?', category: 'nature' },
        { id: 'nature_12', text: 'Did you express gratitude for nature today?', category: 'nature' },
        { id: 'nature_13', text: 'Did you use a fan instead of AC today?', category: 'nature', trigger: 'low_eco_score' },
        { id: 'nature_14', text: 'Did you air-dry clothes instead of using a dryer?', category: 'nature' },
        { id: 'nature_15', text: 'Did you plant a seed or sapling today?', category: 'nature' },
        { id: 'nature_16', text: 'Did you meditate or do yoga outdoors today?', category: 'nature' },
        { id: 'nature_17', text: 'Did you avoid using pesticides or harmful chemicals?', category: 'nature' },
        { id: 'nature_18', text: 'Did you notice the sunset or sunrise today?', category: 'nature' },
        { id: 'nature_19', text: 'Did you clean up an area around your hostel/home?', category: 'nature' },
        { id: 'nature_20', text: 'Did you feel connected to nature at any point today?', category: 'nature' },
    ],
};

const CATEGORIES = Object.keys(QUESTIONS);

// Flatten all questions into a single array for easy lookup
const ALL_QUESTIONS = Object.values(QUESTIONS).flat();

/**
 * Find a question by its id
 */
function findQuestionById(id) {
    return ALL_QUESTIONS.find(q => q.id === id) || null;
}

/**
 * Get 3 deterministic daily questions.
 * Uses day-of-year to cycle through the full 100-question pool.
 * Each day picks from 3 different categories.
 */
function getDailyQuestions(dayOffset = 0) {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) + dayOffset;

    const selected = [];
    for (let i = 0; i < 3; i++) {
        const catIndex = (dayOfYear + i) % CATEGORIES.length;
        const category = CATEGORIES[catIndex];
        const pool = QUESTIONS[category];
        // Rotate through the pool using day offset
        const qIndex = Math.floor(dayOfYear / CATEGORIES.length) % pool.length;
        // Add small offset per slot to avoid picking from same position
        const finalIndex = (qIndex + i * 7) % pool.length;
        selected.push(pool[finalIndex]);
    }
    return selected;
}

/**
 * Get behavior-aware questions for a specific user.
 * Checks their CarbonLog + WaterLog to prioritize triggered questions.
 */
async function getPersonalizedQuestions(userId) {
    const base = getDailyQuestions();

    try {
        const CarbonLog = require('../models/CarbonLog');
        const WaterLog  = require('../models/WaterLog');

        const [latestCarbon, latestWater] = await Promise.all([
            CarbonLog.findOne({ userId }).sort({ createdAt: -1 }).lean(),
            WaterLog.findOne({ userId }).sort({ createdAt: -1 }).lean(),
        ]);

        const triggers = new Set();

        if (latestCarbon) {
            if (latestCarbon.transport_car_km > 5) triggers.add('high_car_km');
            if (latestCarbon.eco_score < 50)        triggers.add('low_eco_score');
            if (latestCarbon.food_type === 'non_veg') triggers.add('meat_heavy');
            if (latestCarbon.plastic_bottles > 5)   triggers.add('high_plastic');
            if (latestCarbon.waste_kg > 3)          triggers.add('high_waste');
        }
        if (latestWater && latestWater.kl_used > 8) {
            triggers.add('high_water');
        }

        if (triggers.size === 0) return base;

        // Try to swap in triggered questions from the same categories
        const triggered = ALL_QUESTIONS.filter(q => q.trigger && triggers.has(q.trigger));
        if (triggered.length === 0) return base;

        // Replace one base question with a triggered one (if from a different category)
        const swap = triggered[Math.floor(Math.random() * triggered.length)];
        const swapIndex = base.findIndex(q => q.category === swap.category);
        if (swapIndex >= 0) {
            base[swapIndex] = swap;
        } else {
            base[0] = swap; // Replace first if no category match
        }

        return base;
    } catch {
        return base; // Fallback to base if anything fails
    }
}

module.exports = {
    QUESTIONS,
    CATEGORIES,
    ALL_QUESTIONS,
    findQuestionById,
    getDailyQuestions,
    getPersonalizedQuestions,
};
