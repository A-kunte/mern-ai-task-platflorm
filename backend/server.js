require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit'); // Required for API Security

// Database and Queue Connections
const connectDB = require('./config/db.js');
const redisClient = require('./config/redis.js');

const app = express();

// 1. Initialize MongoDB Connection
connectDB();

// --- Security Middleware ---
// Helmet: Sets secure HTTP headers (Assignment Requirement)
app.use(helmet()); 

// CORS: Enable Cross-Origin Resource Sharing
app.use(cors());

// Rate Limiter: Protects against brute force/DDoS (Assignment Requirement)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiter to all /api routes
app.use('/api/', apiLimiter);

// Parse JSON bodies
app.use(express.json()); 

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running smoothly!' });
});

// Global Error Handler (Good for Clean Architecture/Maintainability)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server!' });
});

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is up and running on http://localhost:${PORT}`);
});