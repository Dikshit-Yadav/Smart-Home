const Device = require('../models/Device');
const DeviceLog = require('../models/DeviceLog');  // Import DeviceLog model

exports.toggleDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: "Device not found" });

    // Toggle status
    device.status = device.status === 'ON' ? 'OFF' : 'ON';
    await device.save();

    // Create device log
    const log = new DeviceLog({
      deviceId: device._id,
      deviceName: device.deviceName,
      action: device.status
    });
    await log.save();
    // Emit real-time event
    if (req.io) {
      req.io.emit('new-log', log);
    }
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to toggle device" });
  }
};
