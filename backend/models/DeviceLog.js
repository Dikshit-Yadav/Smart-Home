const mongoose = require('mongoose');

const deviceLogSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  deviceName: { type: String, required: true },
  action: { type: String, enum: ['ON', 'OFF'], required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeviceLog', deviceLogSchema);
