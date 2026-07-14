const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check if token is sent in the Authorization header (e.g., "Bearer eyJhbGci...")
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the "Bearer <token>" string
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your JWT secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user associated with the token (excluding their hashed password)
            req.user = await User.findById(decoded.id).select('-password');

            // Pass control to the next route handler/controller
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };