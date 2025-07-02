import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDevices, toggleDevice, deleteDevice, addDevice } from '../services/api';
import DeviceCard from '../components/DeviceCard';
import socket from '../socket';
import Navbar from '../components/Navbar';
import Sidebar from '../components/sidebar';

import '../style/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');

  const fetchDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.data);
    } catch (err) {
      console.error('Failed to fetch devices:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login');
      navigate('/');
    } else {
      fetchDevices();
    }

    // real-time updates from server
    socket.on('device-updated', () => {
      fetchDevices();
    });
    

    return () => {
      socket.off('device-updated');  
    };
  }, [navigate]);

  const handleToggle = async (id) => {
    await toggleDevice(id);
     await fetchDevices();
  };

  const handleDelete = async (id) => {
    await deleteDevice(id);
  };

  const handleAdd = async () => {
    if (deviceName && deviceType) {
      await addDevice({ deviceName, deviceType });
      setDeviceName('');
      setDeviceType('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <>
    <Navbar />
    <div className="layout">
        <Sidebar />
    <div className="dashboard-container">
      
      <h1>Smart Home Control Panel</h1>
      {/* <button onClick={handleLogout} className="logout-btn">Logout</button> */}

      {/* <div className="add-device-form">
        <input
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          placeholder="Device Name"
        />
        <input
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          placeholder="Device Type"
        />
        <button onClick={handleAdd}>Add Device</button>
      </div> */}

      <div className="device-grid">
        {devices.map((device) => (
          <DeviceCard
            key={device._id}
            device={device}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
    </div>
    </>
  );
}

export default Dashboard;
