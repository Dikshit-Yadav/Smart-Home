import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import '../style/Settings.css';

function SystemSettings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleReset = () => {
    setTheme('light');
    localStorage.removeItem('theme');
  };

  return (
    <>
    <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="settings-container">
          <h2>⚙️ System Settings</h2>
          <div className="setting-option">
            <label>Theme:</label>
            <div className="theme-toggle">
              <button
                className={theme === 'light' ? 'active' : ''}
                onClick={() => setTheme('light')}
              >
                🌞 Light
              </button>
              <button
                className={theme === 'dark' ? 'active' : ''}
                onClick={() => setTheme('dark')}
              >
                🌙 Dark
              </button>
            </div>
          </div>

          <div className="setting-option">
            <button className="reset-btn" onClick={handleReset}>
              🔁 Reset to Default
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SystemSettings;
