require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const neeruRoutes = require('./routes/neeru.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/neeru', neeruRoutes);

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
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecosaathi')
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
