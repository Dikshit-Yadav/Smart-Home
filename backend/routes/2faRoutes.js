// backend/routes/2faRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Email config
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Enable 2FA - Generate and send OTP
router.post('/enable-2fa', async (req, res) => {
    const { userId, email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();

    try {
        await User.findByIdAndUpdate(userId, {
            twoFactorOTP: otp,
            twoFactorEnabled: false,
            otpExpiresAt: Date.now() + 5 * 60 * 1000 // expires in 5 mins
        });

        await transporter.sendMail({
            to: email,
            subject: 'Your 2FA OTP Code',
            html: `<h2>Your verification code is: ${otp}</h2>`
        });

        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// Verify OTP
router.post('/verify-2fa', async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (
            user.twoFactorOTP === otp &&
            user.otpExpiresAt &&
            Date.now() < user.otpExpiresAt
        ) {
            user.twoFactorEnabled = true;
            user.twoFactorOTP = null;
            user.otpExpiresAt = null;
            await user.save();
            return res.json({ message: '✅ 2FA enabled successfully' });
        } else {
            return res.status(400).json({ message: '❌ Invalid or expired OTP' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
});

module.exports = router;
