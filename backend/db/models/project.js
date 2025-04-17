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

const SettingSchema = new mongoose.Schema({
  bg: String
})

const LogsSchema = new mongoose.Schema({
  action: String,
  by: String,
  date: { type: Date, default: () => new Date() }
})

const GroupsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  columns: [ColumnSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },
  updatedAt: { type: Date, default: () => new Date() },
  settings: [SettingSchema],
  logs: [LogsSchema]
})

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  groups: [GroupsSchema],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },
  updatedAt: { type: Date, default: () => new Date() }
});

module.exports = mongoose.model('Project', ProjectSchema);
