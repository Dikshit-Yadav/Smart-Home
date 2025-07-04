const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const DeviceLog = require('../models/DeviceLog');

module.exports = (io) => {

  // attach io to every request
  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Get all devices
  router.get('/', async (req, res) => {
    try {
      const devices = await Device.find();
      res.json(devices);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  // Toggle device and emit
  router.put('/:id/toggle', async (req, res) => {
    try {
      const device = await Device.findById(req.params.id);
      if (!device) return res.status(404).json({ message: "Device not found" });

      device.status = device.status === 'ON' ? 'OFF' : 'ON';
      await device.save();

      const log = new DeviceLog({
        deviceId: device._id,
        deviceName: device.deviceName,
        action: device.status
      });
      await log.save();

      io.emit('device-updated');
      // req.io.emit('new-log', log); //

      res.json(device);
    } catch (err) {
      res.status(500).json({ message: "Failed to toggle device" });
    }
  });
  // DELETE a device by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedDevice = await Device.findByIdAndDelete(req.params.id);
    if (!deletedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Optionally: log deletion
    await DeviceLog.create({
      deviceId: deletedDevice._id,
      deviceName: deletedDevice.deviceName,
      action: 'DELETED'
    });

    io.emit('device-updated'); // let frontend know
    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete device' });
  }
});


  // Add device
  router.post('/add', async (req, res) => {
    const { deviceName, deviceType } = req.body;
    try {
      const newDevice = new Device({ deviceName, deviceType });
      await newDevice.save();
      res.status(201).json(newDevice);
    } catch (err) {
      res.status(500).json({ message: "Failed to add device" });
    }
  });

  return router;
};
