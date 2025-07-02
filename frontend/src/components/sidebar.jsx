import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Sidebar.css';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '➡' : '⬅'}
      </div>

      <div className="menu">
        <div className="menu-item" onClick={() => navigate('/dashboard')}>🏠 {!collapsed && 'Dashboard'}</div>
        <div className="menu-item" onClick={() => navigate('/add-device')}>➕ {!collapsed && 'Add Device'}</div>
        <div className="menu-item" onClick={() => navigate('/logs')}>📊 {!collapsed && 'Device Logs'}</div>
        <div className="menu-item" onClick={() => navigate('/analytics')}>📈 {!collapsed && 'Analytics'}</div>
        <div className="menu-item" onClick={() => navigate('/profile')}>👤 {!collapsed && 'Profile'}</div>
        <div className="menu-item" onClick={() => navigate('/security')}>🔒 {!collapsed && 'Security'}</div>
        <div className="menu-item" onClick={() => navigate('/settings')}>⚙️ {!collapsed && 'System Settings'}</div>
        <div className="menu-item" onClick={() => navigate('/notifications')}>📢 {!collapsed && 'Notifications'}</div>
        <div className="menu-item" onClick={() => navigate('/help')}>❓ {!collapsed && 'Help'}</div>
        <div className="menu-item logout" onClick={handleLogout}>🚪 {!collapsed && 'Logout'}</div>

      </div>
    </div>
  );
}

export default Sidebar;
