const mongoose = require('mongoose'); // ⬅️ Import mongoose to define schema

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Task title is required'] 
  },
  description: { 
    type: String, 
    default: '' 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  category: { 
    type: String, 
    default: '' 
  },
  suggestion: {  // ✅ Add this field for AI suggestions
    type: String,
    default: 'No suggestion available'
  },
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  completedAt: { 
    type: Date 
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Task', taskSchema);
 