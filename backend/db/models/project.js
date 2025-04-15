const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const ColumnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tasks: [TaskSchema],
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  columns: [ColumnSchema],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Project', ProjectSchema);
