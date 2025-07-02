const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// analytics route
router.get('/', async (req, res) => {
  try {
    const total = await Device.countDocuments();
    const onCount = await Device.countDocuments({ status: 'ON' });
    const offCount = await Device.countDocuments({ status: 'OFF' });

    res.json({
      totalDevices: total,
      onDevices: onCount,
      offDevices: offCount
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

module.exports = router;
