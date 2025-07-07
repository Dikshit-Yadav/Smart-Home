import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import { addDevice, getDevices, deleteDevice } from '../services/api';
import '../style/AddDevice.css';  
import Navbar from '../components/Navbar';

function AddDevice() {
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [message, setMessage] = useState('');
  const [devices, setDevices] = useState([]);

  const fetchDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.data);
    } catch (err) {
      console.error("Failed to fetch devices", err);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deviceName || !deviceType) {
      setMessage('Please fill all fields');
      return;
    }
    try {
      await addDevice({ deviceName, deviceType });
      setMessage('✅ Device added successfully!');
      setDeviceName('');
      setDeviceType('');
      fetchDevices();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add device');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDevice(id);
      fetchDevices();
    } catch (err) {
      console.error('Failed to delete device', err);
    }
  };

  return (
    <><Navbar/>
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <h1>➕ Add New Device</h1>

        <form className="add-device-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Device Name" 
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Device Type" 
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
          />
          <button type="submit">Add Device</button>
        </form>

        {message && <p className="message">{message}</p>}

        <h2>📋 Existing Devices</h2>
        <div className="device-grid">
          {devices.map(device => (
            <div className="device-card" key={device._id}>
              <h3>{device.deviceName}</h3>
              <p>Type: {device.deviceType}</p>
              <p>Status: <span className={device.status === 'ON' ? 'status-on' : 'status-off'}>{device.status}</span></p>
              <button className="delete-btn" onClick={() => handleDelete(device._id)}>🗑 Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default AddDevice;
