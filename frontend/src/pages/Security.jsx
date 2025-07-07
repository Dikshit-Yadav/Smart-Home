import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import PasswordInput from '../components/PasswordInput';
import { disable2FA } from '../services/api';
import '../style/Security.css';
// import axios from 'axios';
import { API } from '../services/api';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleDisable2FA = async () => {
    try {
      const res = await disable2FA();
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to disable 2FA');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    // const userId = localStorage.getItem('userid');
    if (newPassword !== confirmPassword) {
      return setMessage('❌ New passwords do not match');
    }

    try {
      const res = await API.put('/user/change-password', {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage('✅ ' + res.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setMessage('❌ ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <>
     <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="security-page">
          <h2>🔒 Change Password</h2>
          <button className="disable-btn" onClick={handleDisable2FA}>
            🔓 Disable 2FA
          </button>

          <form className="password-form" onSubmit={handleChangePassword}>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            {/* <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            /> */}
            <PasswordInput placeholder="New Password" onPasswordChange={setNewPassword} />
            <PasswordInput placeholder="Confirm New Password" onPasswordChange={setConfirmPassword} />
            {/* <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            /> */}
            <button type="submit">Update Password</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
