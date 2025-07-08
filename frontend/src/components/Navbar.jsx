import React, { useEffect, useState } from 'react';
import '../style/Navbar.css';
import { getProfile } from '../services/api';

function Navbar() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        console.error('❌ Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="navbar">
      <nav className="navbar-container">
        <div className="nav-left">
          <a className="navbar-brand" href="/dashboard">🏠 Smart Home</a>
        </div>
        <div className="nav-right">
          <span onClick={() => setShowPopup(!showPopup)}>
            <i className="fa-solid fa-circle-user profile-icon"></i>
          </span>
        </div>
      </nav>

      {showPopup && (
        <div className="user-popup">
          <button className="close-btn" onClick={() => setShowPopup(false)}>✖</button>
          <h4>👤 {username}</h4>
          <p>📧 {email}</p>
        </div>
      )}
    </div>
  );
}

export default Navbar;
