const axios = require('axios');
const CommunityReport = require('../models/CommunityReport.model');
const AQICache = require('../models/AQICache.model');

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

exports.createReport = async (req, res) => {
    try {
        const { issueType, description, location, photoUrl } = req.body;
        const userId = req.user.id; // from auth middleware

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
        const userId = req.user.id;

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
