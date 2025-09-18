const Task = require('../models/taskModel'); // 🧱 Import Task model

// ➕ Create a new task
const createTask = async (req, res) => {
  
  try {
    const { title } = req.body; // 📦 Get task title from request body

    // ✅ Create task with user ID from auth middleware
    const task = await Task.create({
      title,
      user: req.user.id, // 🔐 req.user is set by token middleware
    });
    console.log("taskkkkkkkkkk: ", task);


    res.status(201).json(task); // 🎉 Return the created task
  } catch (err) {
    res.status(500).json({ message: 'Task creation failed', error: err.message });
  }
  console.log("createeeeeeee: ", createTask);
};

// 📄 Get all tasks for logged-in user
const getTasks = async (req, res) => {
  try {
    // 🔍 Find tasks where task.user === logged in user
    const tasks = await Task.find({ user: req.user.id }).populate('user', 'name'); // 🧑‍🤝‍🧑 Populate user details
    res.status(200).json(tasks); // ✅ Return all tasks
  } catch (err) {
    res.status(500).json({ message: 'Fetching tasks failed', error: err.message });
  }
};

// ✏️ Update a task (title or completed status)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params; // 🆔 Task ID from URL
    const updates = req.body;  // 📦 What to update (title/completed)

    // 🔁 Find task and update if belongs to user
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id }, // 🔐 Only user’s own task
      updates,
      { new: true } // ⬅️ Return the updated task
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task); // 🎉 Return updated task
  } catch (err) {
    res.status(500).json({ message: 'Updating task failed', error: err.message });
  }
};

// ❌ Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params; // 🆔 Task ID from URL

    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id }); // 🔐 Only delete user’s task

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting task failed', error: err.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
