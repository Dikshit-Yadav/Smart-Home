const express = require('express');
const router = express.Router();
const DeviceLog = require('../models/DeviceLog');

// all device logs
router.get('/', async (req, res) => {
  try {
    const logs = await DeviceLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

module.exports = router;
