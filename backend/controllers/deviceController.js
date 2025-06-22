const Device = require('../models/Device');

// all devices
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch devices" });
  }
};

// Toggle device ON/OFF
exports.toggleDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: "Device not found" });

    device.status = device.status === 'ON' ? 'OFF' : 'ON';
    await device.save();
    res.json(device);
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle device" });
  }
};

//  new device
exports.addDevice = async (req, res) => {
  const { deviceName, deviceType } = req.body;
  try {
    const newDevice = new Device({ deviceName, deviceType });
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (err) {
    res.status(500).json({ message: "Failed to add device" });
  }
};
getDevices()
