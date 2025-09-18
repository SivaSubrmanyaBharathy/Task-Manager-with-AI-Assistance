const mongoose = require('mongoose'); // ⬅️ Import mongoose to define schema

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // ⬅️ Task must have a title
    },
    completed: {
      type: Boolean,
      default: false, // ⬅️ By default, task is not completed
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // ⬅️ Reference to the User model
      required: true,
    },
  },
  {
    timestamps: true, // ⬅️ Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Task', taskSchema);
 