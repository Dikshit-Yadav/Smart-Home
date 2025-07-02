import React, { useState } from 'react';
import axios from 'axios';
import '../style/Security.css';

function TwoFactorSetup({ userId }) {
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [verified, setVerified] = useState(false);

    const handleSendOTP = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/user/enable-2fa', {}, {
                headers: { userid: userId }
            });
            setOtpSent(true);
            setMessage('✅ OTP sent to your email');
        } catch (err) {
            setMessage('❌ Failed to send OTP');
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/user/verify-2fa', {
                otp
            }, {
                headers: { userid: userId }
            });
            setVerified(true);
            setMessage('✅ 2FA enabled successfully');
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.message || 'Verification failed'));
        }
    };

    return (
        <div className="twofa-container">
            <h3>🔐 Two-Factor Authentication</h3>

            {verified ? (
                <p className="message success">2FA is now enabled on your account ✅</p>
            ) : (
                <>
                    {!otpSent ? (
                        <button className="btn-send" onClick={handleSendOTP}>Send OTP</button>
                    ) : (
                        <div className="otp-box">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button onClick={handleVerifyOTP}>Verify OTP</button>
                        </div>
                    )}
                    {message && <p className="message">{message}</p>}
                </>
            )}
        </div>
    );
}

export default TwoFactorSetup;
