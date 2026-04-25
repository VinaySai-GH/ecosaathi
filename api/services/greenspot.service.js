const Spot = require('../models/Spot');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.getSpots = async (filters = {}) => {
    const { category, lat, lng, q, limit = 100 } = filters;
    const query = {};

    if (category) {
        query.category = category;
    }

    if (q) {
        query.$or = [
            { name: { $regex: q, $options: 'i' } },
            { address: { $regex: q, $options: 'i' } },
        ];
    }

    let spots = await Spot.find(query)
        .populate('added_by', 'name phone')
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .lean();

    // If lat/lng provided, calculate distance and sort by proximity
    if (lat && lng) {
        spots = spots.map((spot) => {
            const distance = calculateDistance(lat, lng, spot.lat, spot.lng);
            return { ...spot, distance };
        });
        spots.sort((a, b) => a.distance - b.distance);
    }

    return spots;
};

exports.createSpot = async (spotData, userId) => {
    const { name, category, lat, lng, address, opening_hours, cost, tip, photoUrl, google_place_id, rating } = spotData;

    const tips = tip ? [tip] : [];

    const spot = await Spot.create({
        name,
        category,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address,
        opening_hours: opening_hours || '',
        cost: cost || '',
        tips,
        photos: photoUrl ? [photoUrl] : [],
        added_by: userId,
        google_place_id: google_place_id || '',
        rating: rating || null,
    });

    // Award 30 points for adding a verified listing
    await User.findByIdAndUpdate(userId, { $inc: { points: 30 } });
    await Notification.create({
        user: userId,
        message: `Great find! You earned 30 points for adding a new Green Spot.`,
        link: '/greenspot'
    });

    return spot.populate('added_by', 'name phone');
};

exports.verifySpot = async (spotId, userId) => {
    const spot = await Spot.findById(spotId);
    if (!spot) {
        throw new Error('Spot not found');
    }

    if (!spot.verified_by.includes(userId)) {
        spot.verified_by.push(userId);
        await spot.save();
        
        // Award 5 points for verifying
        await User.findByIdAndUpdate(userId, { $inc: { points: 5 } });
        await Notification.create({
            user: userId,
            message: `Thanks for helping the community! You earned 5 points for verifying a Green Spot.`,
            link: '/greenspot'
        });
    }

    return spot.populate('added_by', 'name phone');
};

exports.getCityEcoScore = async (city = 'Tirupati') => {
    const spots = await Spot.find({}).populate('added_by', '_id').lean();
    
    const totalSpots = spots.length;
    const verifiedSpots = spots.filter(s => s.verified_by && s.verified_by.length >= 2).length;
    const totalVerifications = spots.reduce((sum, s) => sum + (s.verified_by ? s.verified_by.length : 0), 0);
    
    // Get unique contributors
    const contributorSet = new Set();
    spots.forEach(s => {
        if (s.added_by && s.added_by._id) {
            contributorSet.add(s.added_by._id.toString());
        }
    });
    const activeContributors = contributorSet.size;
    
    // Calculate score: 0-100
    // Verified spots worth 15pts each, verifications 5pts each, contributors 2pts each
    const scoreNumerator = (verifiedSpots * 15) + (totalVerifications * 5) + (activeContributors * 2);
    const scoreDenominator = Math.max(20, totalSpots + 20); // Avoid division by 0
    const ecoScore = Math.round((scoreNumerator / scoreDenominator) * 100);
    
    return {
        city,
        ecoScore: Math.min(100, Math.max(0, ecoScore)), // Clamp 0-100
        totalSpots,
        verifiedSpots,
        totalVerifications,
        activeContributors,
        categories: groupByCategory(spots),
    };
};

function groupByCategory(spots) {
    const categories = {};
    spots.forEach(spot => {
        if (!categories[spot.category]) {
            categories[spot.category] = { count: 0, verified: 0 };
        }
        categories[spot.category].count++;
        if (spot.verified_by && spot.verified_by.length >= 2) {
            categories[spot.category].verified++;
        }
    });
    return categories;
}

// Haversine formula to calculate distance between two lat/lng points (in km)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
