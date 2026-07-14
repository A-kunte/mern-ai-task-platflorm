const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Route for dealing with all tasks (GET all, POST new)
router.route('/')
    .post(protect, createTask)
    .get(protect, getTasks);

// Route for dealing with a single specific task by its ID
router.route('/:id')
    .get(protect, getTaskById);

module.exports = router;