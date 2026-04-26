const UserLearningProgress = require('../models/UserLearningProgress.model');
const User = require('../models/User');

// Module quiz answers — server-side source of truth
// Matches modules.js on the frontend
const QUIZ_ANSWERS = {
    'air-quality':        [2, 0, 1, 3, 2],
    'carbon-footprint':   [1, 2, 0, 3, 1],
    'waste-management':   [0, 2, 1, 3, 0],
    'water-conservation': [3, 1, 2, 0, 2],
    'biodiversity':       [1, 0, 3, 2, 1],
    'climate-change':     [2, 3, 0, 1, 2],
};

const POINTS_PER_MODULE = 30;

// GET /api/ecolearn/progress
exports.getProgress = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const progressDocs = await UserLearningProgress.find({ userId });
        res.status(200).json({ progress: progressDocs });
    } catch (err) {
        next(err);
    }
};

// POST /api/ecolearn/progress
// Body: { moduleId, lessonId }
exports.markLessonComplete = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { moduleId, lessonId } = req.body;

        if (!moduleId || !lessonId) {
            return res.status(400).json({ error: 'moduleId and lessonId are required' });
        }

        const progress = await UserLearningProgress.findOneAndUpdate(
            { userId, moduleId },
            { $addToSet: { lessonsCompleted: lessonId } },
            { upsert: true, new: true }
        );

        res.status(200).json({ progress });
    } catch (err) {
        next(err);
    }
};

// POST /api/ecolearn/quiz/submit
// Body: { moduleId, answers: [0,1,2,3,2] }
exports.submitQuiz = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { moduleId, answers } = req.body;

        const correctAnswers = QUIZ_ANSWERS[moduleId];
        if (!correctAnswers) {
            return res.status(400).json({ error: 'Invalid moduleId' });
        }
        if (!Array.isArray(answers) || answers.length !== 5) {
            return res.status(400).json({ error: 'answers must be an array of 5 values' });
        }

        const score = answers.reduce((acc, ans, i) => acc + (ans === correctAnswers[i] ? 1 : 0), 0);

        const existing = await UserLearningProgress.findOne({ userId, moduleId });
        const alreadyAwarded = existing?.pointsAwarded ?? false;

        const progress = await UserLearningProgress.findOneAndUpdate(
            { userId, moduleId },
            {
                quizScore: score,
                pointsAwarded: true,
                completedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        let pointsEarned = 0;
        if (!alreadyAwarded) {
            pointsEarned = POINTS_PER_MODULE;
            await User.findByIdAndUpdate(userId, { $inc: { points: POINTS_PER_MODULE } });
        }

        res.status(200).json({ score, total: 5, pointsEarned, progress });
    } catch (err) {
        next(err);
    }
};
