// VERSION: 2.0.2 - ECOSAATHI STABILIZED
const express = require('express');
const app = express();

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const cors = require('cors');

// Public Health Check (Registered FIRST)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'EcoSaathi is awake! 🌿 (v2.0.2)' });
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

// Middleware
app.use(cors());

// Global Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
});

// Increase JSON body limit
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

// Production: Serve Frontend
if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, '../dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'API route not found' });
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Server Error',
    });
});

const PORT = process.env.PORT || 5000;

// Start server immediately
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (EcoSaathi v2.0.2)`);
    
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('✅ Connected to MongoDB');
            scheduler.initScheduler();
        })
        .catch((err) => {
            console.error('❌ MongoDB connection error:', err);
        });
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`port ${PORT} already in use`);
        process.exit(1);
    }
});
