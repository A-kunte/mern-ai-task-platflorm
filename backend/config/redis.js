const redis = require('redis');

// Create the Redis client using the environment variable URL
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.on('connect', () => console.log('🔴 Redis Client Connected'));
redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

// Connect immediately when this file is required
connectRedis();

module.exports = redisClient;