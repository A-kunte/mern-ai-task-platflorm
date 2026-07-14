require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// 1. Import database and queue connections
const connectDB = require('./config/db.js');
const redisClient = require('./config/redis.js');

const app = express();

// 2. Trigger the MongoDB connection
connectDB();

// --- Middleware ---
app.use(helmet()); 
app.use(cors());
app.use(express.json()); // Essential to read the JSON body you send in Thunder Client!

// --- API Routes ---
// This must sit completely outside of any other route blocks
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// --- Temporary Test Route ---
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running smoothly!' });
});

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is up and running on http://localhost:${PORT}`);
});