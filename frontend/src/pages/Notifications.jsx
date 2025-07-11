import React from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
function Notifications() {
  return (
    <>
    <Navbar/>
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <h1>📢 Notifications</h1>
        <p>Here you will see your notifications.</p>
      </div>
    </div>
    </>
  );
}

export default Notifications;
