require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes      = require('./routes/auth.routes');
const neeruRoutes     = require('./routes/neeru.routes');
const carbonRoutes    = require('./routes/carbon.routes');
const greenspotRoutes = require('./routes/greenspot.routes');
const ecopulseRoutes  = require('./routes/ecopulse.routes');
const botRoutes       = require('./routes/bot.routes');
const insightsRoutes  = require('./routes/insights.routes');
const postRoutes      = require('./routes/post.routes');
const userRoutes      = require('./routes/user.routes');
const notificationRoutes = require('./routes/notification.routes');
const scheduler       = require('./services/scheduler');

const app = express();

// Middleware
app.use(cors());
// Increase JSON body limit from default 100KB to 50MB (for base64-encoded bill images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mount Routes
app.use('/api/auth',        authRoutes);
app.use('/api/neeru',       neeruRoutes);
app.use('/api/carbon',      carbonRoutes);
app.use('/api/spots',       greenspotRoutes);
app.use('/api/leaderboard', ecopulseRoutes);
app.use('/api/bot',         botRoutes);
app.use('/api/insights',    insightsRoutes);
app.use('/api/posts',       postRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handler (Simple centralized error handler)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Server Error',
    });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)//|| 'mongodb://localhost:27017/ecosaathi')
    .then(() => {
        console.log('✅ Connected to MongoDB');
        scheduler.initScheduler();
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        server.on('error', (err) => {
            if (err && err.code === 'EADDRINUSE') {
                console.error(`port ${PORT} already in use — another process may be running`);
                process.exit(1);
            }
            console.error('server error:', err);
            process.exit(1);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
