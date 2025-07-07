// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../style/Sidebar.css';

// function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('username');
//     navigate('/');
//   };

//   return (
//     <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
//       <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
//         {collapsed ? '➡' : '⬅'}
//       </div>

//       <div className="menu">
//         <div className="menu-item" onClick={() => navigate('/dashboard')}>🏠 {!collapsed && 'Dashboard'}</div>
//         <div className="menu-item" onClick={() => navigate('/add-device')}>➕ {!collapsed && 'Add Device'}</div>
//         <div className="menu-item" onClick={() => navigate('/logs')}>📊 {!collapsed && 'Device Logs'}</div>
//         <div className="menu-item" onClick={() => navigate('/analytics')}>📈 {!collapsed && 'Analytics'}</div>
//         <div className="menu-item" onClick={() => navigate('/profile')}>👤 {!collapsed && 'Profile'}</div>
//         <div className="menu-item" onClick={() => navigate('/security')}>🔒 {!collapsed && 'Security'}</div>
//         <div className="menu-item" onClick={() => navigate('/settings')}>⚙️ {!collapsed && 'System Settings'}</div>
//         <div className="menu-item" onClick={() => navigate('/notifications')}>📢 {!collapsed && 'Notifications'}</div>
//         <div className="menu-item" onClick={() => navigate('/help')}>❓ {!collapsed && 'Help'}</div>
//         <div className="menu-item logout" onClick={handleLogout}>🚪 {!collapsed && 'Logout'}</div>

//       </div>
//     </div>
//   );
// }

// export default Sidebar;


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

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { icon: '➕', label: 'Add Device', path: '/add-device' },
    { icon: '📊', label: 'Device Logs', path: '/logs' },
    { icon: '📈', label: 'Analytics', path: '/analytics' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '🔒', label: 'Security', path: '/security' },
    { icon: '⚙️', label: 'System Settings', path: '/settings' },
    { icon: '📢', label: 'Notifications', path: '/notifications' },
    { icon: '❓', label: 'Help', path: '/help' },
    { icon: '🚪', label: 'Logout', path: '/', action: handleLogout },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '➡' : '⬅'}
      </div>

      <div className="menu">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="menu-item"
            onClick={() => item.action ? item.action() : navigate(item.path)}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && <span className="label">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
