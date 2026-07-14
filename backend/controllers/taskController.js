const Task = require('../models/Task');
const redis = require('redis');

// Initialize Redis client
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://redis:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis successfully');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
})();

// @desc    Create a new task & push functional parameters to Redis Queue
const createTask = async (req, res) => {
    try {
        // 1. Destructure the explicit variables required by the assignment brief
        const { title, inputText, operationType } = req.body;
        
        // 2. Comprehensive validation check
        if (!title || !inputText || !operationType) {
            return res.status(400).json({ 
                message: 'Validation failed. Title, inputText, and operationType are all required fields.' 
            });
        }

        // 3. Create the document matching the task management requirements
        const task = await Task.create({
            user: req.user._id,
            title,
            inputText,
            operationType,
            status: 'pending' // Initializing status as requested by step requirements
        });

        // 4. Push the structured object so the background engine has instantaneous payload data
        await redisClient.lPush('task_queue', JSON.stringify({ 
            taskId: task._id,
            inputText: task.inputText,
            operationType: task.operationType
        }));

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tasks for logged-in user
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this task' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTask, getTasks, getTaskById };