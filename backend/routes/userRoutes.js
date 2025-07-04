const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

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
    //2FA check
    if (user.twoFactorEnabled) {
      return res.status(200).json({
        message: '2FA_REQUIRED',
        twoFactorRequired: true,
        userId: user._id
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// UPDATE user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username || user.username;
    user.email = email || user.email;
    if (password) user.password = password;

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// GET user profile
// router.get('/profile', async (req, res) => {
//   try {
//     const userId = req.headers['userid'];
//     console.log("UserID:", userId)
//     const user = await User.findById(userId).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch profile' });
//   }
// });


// UPDATE user profile
// router.put('/profile', async (req, res) => {
//   try {
//     const userId = req.headers['userid'];
//     const { username, email } = req.body;
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.username = username || user.username;
//     user.email = email || user.email;
//     await user.save();

//     res.json({ message: 'Profile updated successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update profile' });
//   }
// });

// router.put('/profile', authMiddleware, async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.username = username || user.username;
//     user.email = email || user.email;

//     if (password) {
//       const hashed = await bcrypt.hash(password, 10);
//       user.password = hashed;
//     }

//     await user.save();
//     res.json({ message: "Profile updated" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Update failed" });
//   }
// });

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id); // user ID from token
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Old password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to change password' });
  }
});


// Generate QR Code + Secret
router.post('/generate-2fa', async (req, res) => {
  try {
    const userId = req.headers['userid'];
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `SmartHome App (${user.email})`
    });

    // Save secret to user
    user.twoFactorSecret = secret.base32;
    user.twoFactorEnabled = true;
    await user.save();

    // Generate QR code from otpauth URL
    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url);

    // Send QR code + base32 secret back
    res.json({
      message: '2FA QR Code generated',
      secret: secret.base32,
      qrCode: qrCodeDataURL
    });
  } catch (err) {
    console.error('Error generating 2FA QR:', err);
    res.status(500).json({ message: 'Failed to generate 2FA QR code' });
  }
  
});


// POST /verify-2fa
router.post('/verify-2fa', async (req, res) => {
  const { token, secret } = req.body;

  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1
  });

  if (verified) {
    res.json({ message: '2FA Verified ✅' });
  } else {
    res.status(401).json({ message: 'Invalid Token ❌' });
  }
});

// PUT /disable-2fa
router.put('/disable-2fa', async (req, res) => {
  try {
    const userId = req.headers['userid'];
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();
console.log('DISABLE 2FA route hit');

    res.json({ message: '2FA disabled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to disable 2FA' });
  }
});



module.exports = router;
