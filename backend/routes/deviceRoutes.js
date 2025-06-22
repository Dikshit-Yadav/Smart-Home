const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

module.exports = function (io) {

  router.get('/', async (req, res) => {
    try {
      const devices = await Device.find();
      res.json(devices);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  router.post('/add', async (req, res) => {
    try {
      const newDevice = new Device(req.body);
      await newDevice.save();
      io.emit('device-updated');
      res.status(201).json(newDevice);
    } catch (err) {
      res.status(500).json({ message: "Failed to add device" });
    }
  });

  router.put('/:id/toggle', async (req, res) => {
    try {
      const device = await Device.findById(req.params.id);
      device.status = device.status === 'ON' ? 'OFF' : 'ON';
      await device.save();
      io.emit('device-updated');
      res.json(device);
    } catch (err) {
      res.status(500).json({ message: "Failed to toggle device" });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await Device.findByIdAndDelete(req.params.id);
      io.emit('device-updated');
      res.json({ message: 'Device deleted' });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete device" });
    }
  });

  return router;
};

