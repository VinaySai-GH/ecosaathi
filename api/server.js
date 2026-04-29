const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Public Health Check (for keeping the app awake on Render)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'EcoSaathi is awake! 🌿' });
});

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
const ecoLearnRoutes  = require('./routes/ecolearn.routes');
const ecoReportRoutes = require('./routes/ecoreport.routes');
const pollutionRoutes = require('./routes/pollutionsense.routes');
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
app.use('/api/ecolearn',  ecoLearnRoutes);
app.use('/api/ecoreport', ecoReportRoutes);
app.use('/api/pollution',   pollutionRoutes);

// --- Production: Serve Frontend ---
if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, '../dist');
    
    // 1. Serve static files with high priority
    app.use(express.static(distPath));

    // 2. Handle API routes (already handled above, but good to be safe)
    // 3. Fallback: Serve index.html for any other route (SPA support)
    app.get('*', (req, res) => {
        // Skip API routes so they don't accidentally return index.html
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'API route not found' });
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

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
