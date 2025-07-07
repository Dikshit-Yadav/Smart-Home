import React from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
function Help() {
  return (
    <>
    <Navbar/>
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <h1>❓ Help</h1>
        <p>Help and support resources will be provided here.</p>
      </div>
    </div>
    </>
  );
}

export default Help;
