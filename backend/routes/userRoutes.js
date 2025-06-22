const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register Route (Send OTP)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already registered.' });
    }

    const otp = generateOtp();

    if (!user) {
      user = new User({ username, email, password, otp });
    } else {
      user.username = username;
      user.password = password;
      user.otp = otp;
    }

    await user.save();

    await transporter.sendMail({
      from: `"OTP System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`
    });

    res.json({ message: 'OTP sent to email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//  OTP Verify
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.json({ message: 'User verified successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
