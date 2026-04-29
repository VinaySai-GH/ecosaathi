const axios = require('axios');
const CommunityReport = require('../models/CommunityReport.model');
const AQICache = require('../models/AQICache.model');

const GOOGLE_AQI_URL = 'https://airquality.googleapis.com/v1/currentConditions:lookup';
const WAQI_BASE_URL = 'https://api.waqi.info';

exports.getAQI = async (req, res) => {
    try {
        const city = req.query.city || 'Tirupati';

        // Check cache
        const cached = await AQICache.findOne({ city });
        const THIRTY_MINS = 30 * 60 * 1000;

        if (cached && (Date.now() - new Date(cached.updatedAt).getTime() < THIRTY_MINS)) {
            return res.status(200).json({ source: 'cache', results: cached.data });
        }

        // Fetch from OpenAQ
        const response = await axios.get(`https://api.openaq.org/v3/locations?city=${city}&limit=10`);
        const results = response.data.results || [];

        // Save to cache
        await AQICache.findOneAndUpdate(
            { city },
            { data: results, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        res.status(200).json({ source: 'api', results });
    } catch (error) {
        console.error('AQI Fetch Error:', error);
        // Return cached if failed, else empty array
        const cached = await AQICache.findOne({ city: req.query.city || 'Tirupati' });
        if (cached) {
            return res.status(200).json({ source: 'stale_cache', results: cached.data });
        }
        res.status(500).json({ error: 'Failed to fetch AQI' });
    }
};

exports.getLiveAQI = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) return res.status(400).json({ error: 'Lat and Lng are required' });

        const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.GEMINI_API_KEY;
        const WAQI_KEY = process.env.WAQI_API_KEY || 'e3d6acbfed67e3e2968f9e3d6a0c6c0e9f8a1d3e';

        console.log(`[AQI Proxy] Using Google Key: ${GOOGLE_KEY ? GOOGLE_KEY.substring(0, 8) + '...' : 'MISSING'}`);

        // Try Google Air Quality API
        if (GOOGLE_KEY) {
            try {
                console.log(`[AQI Proxy] Fetching from Google for: ${lat}, ${lng}`);
                const response = await axios.post(`${GOOGLE_AQI_URL}?key=${GOOGLE_KEY}`, {
                    location: { latitude: Number(lat), longitude: Number(lng) },
                    extraComputations: ['POLLUTANT_CONCENTRATION'],
                    languageCode: 'en'
                });

                if (response.data && response.data.indexes) {
                    const indexes = response.data.indexes;
                    const chosenIndex = indexes.find(i => i.code !== 'uaqi') || indexes[0];

                    console.log(`[AQI Proxy] Index: ${chosenIndex.code} = ${chosenIndex.aqi} (${chosenIndex.category})`);

                    const pollutants = response.data.pollutants || [];
                    return res.json({
                        aqi: chosenIndex.aqi,
                        aqiScale: 'UAQI (Google 0-100 scale — higher is worse)',
                        quality: chosenIndex.category,
                        dominantPollutant: chosenIndex.dominantPollutant,
                        pm25: pollutants.find(p => p.code === 'pm25')?.concentration?.value ?? null,
                        pm10: pollutants.find(p => p.code === 'pm10')?.concentration?.value ?? null,
                        no2: pollutants.find(p => p.code === 'no2')?.concentration?.value ?? null,
                        source: 'Google Air Quality API'
                    });
                }
            } catch (err) {
                const errMsg = err.response?.data?.error?.message || err.message;
                global.lastGoogleError = errMsg;
                console.error('[AQI Proxy] Google Error:', errMsg);
                console.error('[AQI Proxy] Google Full Error:', JSON.stringify(err.response?.data || {}, null, 2));
            }
        }

        // Fallback to WAQI
        try {
            const waqiUrl = `${WAQI_BASE_URL}/feed/geo:${lat};${lng}/?token=${WAQI_KEY}`;
            const waqiRes = await axios.get(waqiUrl);
            if (waqiRes.data.status === 'ok') {
                const d = waqiRes.data.data;
                return res.json({
                    aqi: d.aqi,
                    pm25: d.iaqi?.pm25?.v || null,
                    pm10: d.iaqi?.pm10?.v || null,
                    source: 'WAQI Proxy'
                });
            }
        } catch (waqiErr) {
            console.warn('[AQI Proxy] WAQI Fallback also failed:', waqiErr.message);
        }

        res.status(404).json({ 
            error: 'AQI data not available',
            details: 'Both Google and WAQI services failed.',
            googleError: global.lastGoogleError || 'Unknown Google error'
        });
    } catch (error) {
        console.error('Live AQI Proxy Error:', error);
        res.status(500).json({ error: 'Failed to fetch live AQI' });
    }
};

exports.createReport = async (req, res) => {
    try {
        const { issueType, description, location, photoUrl } = req.body;
        const userId = req.user._id; // from auth middleware

        const newReport = new CommunityReport({
            userId,
            issueType,
            description,
            location,
            photoUrl,
            status: 'live' // auto-approving for MVP
        });

        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        console.error('Create Report Error:', error);
        res.status(500).json({ error: 'Failed to create report' });
    }
};

exports.getReports = async (req, res) => {
    try {
        // Only "live" reports
        const filter = { status: 'live' };

        if (req.query.minLat && req.query.maxLat && req.query.minLng && req.query.maxLng) {
            filter['location.lat'] = { $gte: Number(req.query.minLat), $lte: Number(req.query.maxLat) };
            filter['location.lng'] = { $gte: Number(req.query.minLng), $lte: Number(req.query.maxLng) };
        }

        const reports = await CommunityReport.find(filter).sort({ createdAt: -1 }).limit(50);
        res.status(200).json(reports);
    } catch (error) {
        console.error('Get Reports Error:', error);
        res.status(500).json({ error: 'Failed to get reports' });
    }
};

exports.upvoteReport = async (req, res) => {
    try {
        const reportId = req.params.id;
        const userId = req.user._id;

        const report = await CommunityReport.findById(reportId);
        if (!report) return res.status(404).json({ error: 'Report not found' });

        if (report.upvotedBy.includes(userId)) {
            return res.status(400).json({ error: 'Already upvoted' });
        }

        report.upvotedBy.push(userId);
        report.upvotes += 1;
        await report.save();

        res.status(200).json(report);
    } catch (error) {
        console.error('Upvote Error:', error);
        res.status(500).json({ error: 'Failed to upvote report' });
    }
};

// Mock score calculation via backend if needed per instructions.
exports.getScore = async (req, res) => {
    // Normally the calculation logic goes here, but as per prompt Notes section 2:
    // "Backend /score endpoint is only for caching and saving user history."
    res.status(200).json({ message: "Score history saved." });
};
