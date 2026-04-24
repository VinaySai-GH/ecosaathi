/**
 * 50 Motivational Eco Quotes — shown on the webapp after answering.
 * Mix of Indian wisdom, environmental thinking, and friendly encouragement.
 */

const QUOTES = [
    { text: 'The Earth does not belong to us. We belong to the Earth.', author: 'Chief Seattle' },
    { text: 'Be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
    { text: 'Small acts, when multiplied by millions of people, can transform the world.', author: 'Howard Zinn' },
    { text: 'Nature does not hurry, yet everything is accomplished.', author: 'Lao Tzu' },
    { text: 'We do not inherit the Earth from our ancestors, we borrow it from our children.', author: 'Native Proverb' },
    { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
    { text: 'One person can make a difference, and everyone should try.', author: 'John F. Kennedy' },
    { text: 'What we are doing to the forests of the world is but a mirror of what we are doing to ourselves.', author: 'Gandhi' },
    { text: 'Every drop in the ocean counts.', author: 'Yoko Ono' },
    { text: 'Progress is impossible without change, and those who cannot change their minds cannot change anything.', author: 'George Bernard Shaw' },
    { text: 'You cannot get through a single day without having an impact on the world around you.', author: 'Jane Goodall' },
    { text: 'The greatest threat to our planet is the belief that someone else will save it.', author: 'Robert Swan' },
    { text: 'Sustainability is not a destination. It is a way of travelling.', author: 'Anonymous' },
    { text: 'In every walk with nature, one receives far more than they seek.', author: 'John Muir' },
    { text: 'There is no such thing as away. When we throw anything, it must go somewhere.', author: 'Annie Leonard' },
    { text: 'Keep close to Nature\'s heart and break clear away, once in a while.', author: 'John Muir' },
    { text: 'Act as if what you do makes a difference. It does.', author: 'William James' },
    { text: 'The environment is where we all meet; where all have a mutual interest.', author: 'Lady Bird Johnson' },
    { text: 'If you think you are too small to make a difference, try sleeping with a mosquito.', author: 'Dalai Lama' },
    { text: 'Water is the driving force of all nature.', author: 'Leonardo da Vinci' },
    { text: 'A nation that destroys its soils destroys itself.', author: 'Franklin D. Roosevelt' },
    { text: 'Look deep into nature, and then you will understand everything better.', author: 'Albert Einstein' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
    { text: 'Paani bachao, kal banao. Save water, build tomorrow.', author: 'Indian Wisdom' },
    { text: 'Jo dharti ki seva karta hai, dharti uski seva karti hai.', author: 'Indian Wisdom' },
    { text: 'Ek ped lagao, ek zindagi bachao.', author: 'Indian Wisdom' },
    { text: 'It is our collective and individual responsibility to protect and nurture the global family.', author: 'Dalai Lama' },
    { text: 'Reduce, Reuse, Recycle. Three simple words. Infinite impact.', author: 'Anonymous' },
    { text: 'Your daily habits are writing the future of this planet.', author: 'EcoSaathi' },
    { text: 'Today\'s small step is tomorrow\'s giant leap for the planet.', author: 'EcoSaathi' },
    { text: 'The only way forward, if we are going to improve the quality of the environment, is to get everybody involved.', author: 'Richard Rogers' },
    { text: 'Waste is a design flaw.', author: 'Kate Krebs' },
    { text: 'Climate change is a fact, not a theory. Act now.', author: 'Ban Ki-moon' },
    { text: 'When the last tree is cut, the last fish is caught, and the last river is polluted, you will realize you cannot eat money.', author: 'Alanis Obomsawin' },
    { text: 'The Earth has music for those who listen.', author: 'William Shakespeare' },
    { text: 'Your eco-score is not just a number. It is your footprint on this planet.', author: 'EcoSaathi' },
    { text: 'Every meal is a chance to feed the world better.', author: 'Anonymous' },
    { text: 'The sun, the moon, and the stars would have disappeared long ago had they been within reach of predatory human hands.', author: 'Havelock Ellis' },
    { text: 'Live simply so that others may simply live.', author: 'Mahatma Gandhi' },
    { text: 'A streak is not just numbers. It is proof that you care, every single day.', author: 'EcoSaathi' },
    { text: 'Joy in looking and comprehending is nature\'s most beautiful gift.', author: 'Albert Einstein' },
    { text: 'Unless someone like you cares a whole awful lot, nothing is going to get better. It is not.', author: 'Dr. Seuss' },
    { text: 'Your habits today are the planet your children will inherit.', author: 'Anonymous' },
    { text: 'Prakriti ka rakhwala bano, sab ka bhala hoga.', author: 'Indian Wisdom' },
    { text: 'Har boond mein samundar hai, har kadam mein safar.', author: 'Indian Wisdom' },
    { text: 'The Earth laughs in flowers.', author: 'Ralph Waldo Emerson' },
    { text: 'Consistency beats intensity. Your daily reflections prove that.', author: 'EcoSaathi' },
    { text: 'An eco-warrior is not born. They are made, one habit at a time.', author: 'EcoSaathi' },
    { text: 'Think globally, act locally. Your campus is where it starts.', author: 'Anonymous' },
    { text: 'You are already changing the world by showing up every night. Keep going.', author: 'EcoSaathi' },
];

/**
 * Get a deterministic quote for today (same for everyone)
 */
function getDailyQuote() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return QUOTES[dayOfYear % QUOTES.length];
}

module.exports = { QUOTES, getDailyQuote };
