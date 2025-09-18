const mongoose = require('mongoose'); // ⬅️ Importing mongoose to define schema

// 🧱 Define the structure of user documents
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // ⬅️ Name must be provided
    },
    email: {
      type: String,
      required: true,
      unique: true, // ⬅️ No two users can use the same email
    },
    password: {
      type: String,
      required: true, // ⬅️ Password must be stored (will be hashed later)
    },
  },
  {
    timestamps: true, // ⬅️ Adds createdAt and updatedAt automatically
  }
);

// 📦 Export a model called "User" based on the schema
module.exports = mongoose.model('User', userSchema);
