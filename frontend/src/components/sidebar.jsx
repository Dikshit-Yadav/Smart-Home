// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../style/Sidebar.css'; 

// function Sidebar() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('username');
//     navigate('/');
//   };

//   return (
//     <div className="sidebar">
//       <h3>Menu</h3>
//       <ul>
//         <li>Dashboard</li>
//         <li onClick={handleLogout}>Logout</li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;














import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Sidebar.css';  // We'll write this CSS too

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
        <div className="menu-item" onClick={() => navigate('/dashboard')}>🏠 { !collapsed && 'Dashboard' }</div>
        <div className="menu-item" onClick={() => navigate('/add-device')}>➕ { !collapsed && 'Add Device' }</div>
        <div className="menu-item">📊 { !collapsed && 'Device Logs' }</div>
        <div className="menu-item">📈 { !collapsed && 'Analytics' }</div>
        <div className="menu-item">👤 { !collapsed && 'Profile' }</div>
        <div className="menu-item">🔒 { !collapsed && 'Security' }</div>
        <div className="menu-item">⚙️ { !collapsed && 'System Settings' }</div>
        <div className="menu-item">📢 { !collapsed && 'Notifications' }</div>
        <div className="menu-item">❓ { !collapsed && 'Help' }</div>
        <div className="menu-item logout" onClick={handleLogout}>🚪 { !collapsed && 'Logout' }</div>
      </div>
    </div>
  );
}

export default Sidebar;
