import React from 'react';
import Sidebar from '../components/sidebar';

function Help() {
  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <h1>❓ Help</h1>
        <p>Help and support resources will be provided here.</p>
      </div>
    </div>
  );
}

export default Help;
