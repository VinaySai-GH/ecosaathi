const insightsService = require('../services/insights.service');

/**
 * GET /api/insights/eco
 * Returns LLM-generated insight for the logged-in user.
 * Regenerates every 3–4 days; otherwise returns cached version.
 */
exports.getEcoInsight = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const result = await insightsService.getOrGenerateInsight(userId, true);
        res.status(200).json(result);
    } catch (error) {
        console.error('[Insights] Error generating insight:', error.message);
        // Return a soft failure — insight is optional, shouldn't crash the page
        res.status(200).json({
            insight: null,
            isNew: false,
            error: error.message,
        });
    }
};
