const Spot = require('../models/Spot');
const User = require('../models/User');

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
    }

    return spot.populate('added_by', 'name phone');
};

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
