// backend/models/taskModel.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', taskSchema);
