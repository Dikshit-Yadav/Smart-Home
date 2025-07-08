import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { getAnalytics, getDevices } from '../services/api';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import socket from '../socket';
import '../style/Analytics.css';
import Navbar from '../components/Navbar';

function Analytics() {
  const [data, setData] = useState({ totalDevices: 0, onDevices: 0, offDevices: 0 });
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('');

  const fetchAnalytics = async () => {
    const res = await getAnalytics();
    setData(res.data);
  };

  const fetchDevices = async () => {
    const res = await getDevices();
    setDevices(res.data);
  };

  useEffect(() => {
    fetchAnalytics();
    fetchDevices();

    socket.on('device-updated', () => {
      fetchAnalytics();
      fetchDevices();
    });

    return () => {
      socket.off('device-updated');
    };
  }, []);

const handleViewClick = (type) => {
  const filtered = devices.filter(device =>
    type === 'on'
      ? device.status === 'ON' || device.status === true
      : device.status === 'OFF' || device.status === false
  );
  setFilteredDevices(filtered);
  setPopupType(type);
  setShowPopup(true);
};


  const pieData = {
    labels: ['ON', 'OFF'],
    datasets: [
      {
        label: 'Device Status',
        data: [data.onDevices, data.offDevices],
        backgroundColor: ['#4CAF50', '#FF5252'],
        hoverOffset: 6,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <Sidebar />
        <div className="main-content">
          <h1>📈 Analytics</h1>

          <div className="stats">
            <div className="stat-card total">Total Devices: {data.totalDevices}</div>

            <div className="stat-card online">
              Devices ON: {data.onDevices}
              <button className="view-btn" onClick={() => handleViewClick('on')}>View Devices</button>
            </div>

            <div className="stat-card offline">
              Devices OFF: {data.offDevices}
              <button className="view-btn" onClick={() => handleViewClick('off')}>View Devices</button>
            </div>
          </div>

          <div className="chart-container">
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="device-popup">
          <div className="popup-content">
            <button className="close-btn" onClick={() => setShowPopup(false)}>✖</button>
            <h3>{popupType === 'on' ? 'Devices ON' : 'Devices OFF'}</h3>
            <ul>
  {filteredDevices.length === 0 ? (
    <li>No devices found.</li>
  ) : (
    filteredDevices.map(device => (
      <li key={device._id}>
        {device.deviceName} ({device.deviceType})
      </li>
    ))
  )}
</ul>

          </div>
        </div>
      )}
    </>
  );
}

export default Analytics;
