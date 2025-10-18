const Task = require('../models/taskModel');
const { getAISuggestion } = require('../utils/aisuggest'); // Fixed import

// ➕ Create a new task with AI suggestion
const createTask = async (req, res) => {
  try {
    const { title, description, priority, category, completed } = req.body;

    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'medium',
      category: category || '',
      completed: completed || false,
      suggestion: "No suggestion available", // Default value
      completedAt: completed ? new Date() : undefined,
      user_id: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Task creation failed', error: err.message });
  }
};

// 📄 Get all tasks for logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Fetching tasks failed', error: err.message });
  }
};

// ✏️ Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // REMOVE the automatic AI suggestion generation
    // Only update what's explicitly sent from frontend

    const task = await Task.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      updates,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Updating task failed', error: err.message });
  }
};

// ❌ Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user_id: req.user.id
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting task failed', error: err.message });
  }
};

// AI Suggestion endpoint
const aisuggest = async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;

    // Use description primarily, fallback to title
    const taskDescription = description || title;

    if (!taskDescription) {
      return res.status(400).json({ error: 'Task description or title is required' });
    }

    const suggestion = await getAISuggestion(taskDescription);
    res.json({ suggestion });
  } catch (error) {
    console.error('AI Suggestion error:', error);
    res.status(500).json({ error: 'Failed to get AI suggestion' });
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  aisuggest,
};
