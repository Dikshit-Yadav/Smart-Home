import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import '../style/TwoFactor.css';

function EnableQR2FA() {
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchQRCode = async () => {
            const userId = localStorage.getItem('userid');
            const res = await axios.post('http://localhost:5000/api/user/generate-2fa', null, {
                headers: { userid: userId }
            });
            setQrCode(res.data.qrCode);
            setSecret(res.data.secret);
        };
        fetchQRCode();
    }, []);

    const verifyToken = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/user/verify-2fa', {
                token,
                secret
            });
            setMessage('✅ ' + res.data.message);
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.message || 'Error verifying token'));
        }
    };

    return (
        <>
        
            <Navbar />
            <div className="layout">
                <Sidebar />
                <div className="twofa-container">
                    <h2>🔐 Enable 2FA (QR Code)</h2>
                    {qrCode && <img src={qrCode} alt="2FA QR Code" width="200" />}
                    <p>Scan this with Google Authenticator or Authy.</p>

                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                    <button onClick={verifyToken}>Verify Token</button>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </>
    );
}

export default EnableQR2FA;
