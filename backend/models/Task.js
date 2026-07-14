const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  inputText: { type: String, required: true },       // <-- Ensure this exists
  operationType: { type: String, required: true },   // <-- Ensure this exists
  status: { type: String, default: 'pending' },
  result: { type: String },
  logs: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);