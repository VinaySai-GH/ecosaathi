const EcoReport = require('../models/EcoReport.model');
const User = require('../models/User');

const REPORT_POINTS = 10;
const VERIFICATION_POINTS = 5;
const VERIFICATION_THRESHOLD = 10;

// GET /api/ecoreport
exports.getReports = async (req, res, next) => {
    try {
        const reports = await EcoReport.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name')
            .lean();
        res.status(200).json({ reports });
    } catch (err) {
        next(err);
    }
};

// POST /api/ecoreport
exports.createReport = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { type, title, description, severity, location, photoUrl } = req.body;

        if (!type || !title || !description || !severity || !location) {
            return res.status(400).json({ error: 'type, title, description, severity, and location are required' });
        }

        const report = await EcoReport.create({
            userId,
            type,
            title,
            description,
            severity,
            location,
            photoUrl: photoUrl || null,
        });

        await User.findByIdAndUpdate(userId, { $inc: { points: REPORT_POINTS } });

        res.status(201).json({ report, pointsEarned: REPORT_POINTS });
    } catch (err) {
        next(err);
    }
};

// PUT /api/ecoreport/:id/upvote
exports.upvoteReport = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const report = await EcoReport.findById(id);
        if (!report) return res.status(404).json({ error: 'Report not found' });

        const alreadyUpvotedIndex = report.upvotedBy.findIndex(uid => uid.toString() === userId.toString());
        
        if (alreadyUpvotedIndex !== -1) {
            // Toggle off
            report.upvotedBy.splice(alreadyUpvotedIndex, 1);
            report.upvotes -= 1;
        } else {
            // Toggle on
            report.upvotedBy.push(userId);
            report.upvotes += 1;
        }

        let bonusAwarded = false;
        if (report.upvotes >= VERIFICATION_THRESHOLD && report.status === 'pending') {
            report.status = 'community_verified';
            await User.findByIdAndUpdate(report.userId, { $inc: { points: VERIFICATION_POINTS } });
            bonusAwarded = true;
        }

        await report.save();
        res.status(200).json({ upvotes: report.upvotes, status: report.status, bonusAwarded });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/ecoreport/:id
exports.deleteReport = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const report = await EcoReport.findById(id);
        if (!report) return res.status(404).json({ error: 'Report not found' });

        if (report.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'You can only delete your own reports' });
        }

        await EcoReport.findByIdAndDelete(id);
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (err) {
        next(err);
    }
};

