const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  skills: { type: [String], required: true },
  performanceScore: { type: Number, required: true, min: 0, max: 100 },
  experience: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
