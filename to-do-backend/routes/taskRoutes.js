const express = require('express');
const router = express.Router();

// 🔐 Import middleware to verify token
const { protect } = require('../middleware/authMiddleware');

// 📦 Import controller functions
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  aisuggest,
} = require('../controllers/taskController');

// ➕ Create a task
router.post('/', protect, createTask);

// 📄 Get all tasks
router.get('/', protect, getTasks);

// ✏️ Update a task by ID
router.put('/:id', protect, updateTask);

// ❌ Delete a task by ID
router.delete('/:id', protect, deleteTask);

// AI suggestion by title and description
router.post('/ai-suggestion', protect, aisuggest);

module.exports = router;