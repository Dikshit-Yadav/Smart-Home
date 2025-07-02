import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../style/Profile.css';
import { getProfile, updateProfile } from '../services/api';

function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        setError('Failed to fetch profile.',err);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password && password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await updateProfile({ username, email, password });
      setMessage('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="profile-page">
          <h2>👤 Profile Settings</h2>
          <form onSubmit={handleSubmit} className="profile-form">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Leave blank to keep existing"
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit">Update Profile</button>
            {message && <p className="success-msg">{message}</p>}
            {error && <p className="error-msg">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;
