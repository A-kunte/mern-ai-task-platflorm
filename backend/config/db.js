const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connect using the URI from our .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Stop the server if database connection fails
    }
};

module.exports = connectDB;