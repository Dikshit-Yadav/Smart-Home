const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  deviceType: { type: String, required: true },
  status: { type: String, enum: ['ON', 'OFF'], default: 'OFF' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema);
