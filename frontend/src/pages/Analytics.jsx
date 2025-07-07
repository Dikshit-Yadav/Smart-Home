import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { getAnalytics } from '../services/api';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import socket from '../socket';
import '../style/Analytics.css';
import Navbar from '../components/Navbar';

function Analytics() {
  const [data, setData] = useState({ totalDevices: 0, onDevices: 0, offDevices: 0 });

  const fetchAnalytics = async () => {
    const res = await getAnalytics();
    setData(res.data);
  };

  useEffect(() => {
    fetchAnalytics();

    socket.on('device-updated', () => {
      fetchAnalytics();
    });

    return () => {
      socket.off('device-updated');
    };
  }, []);

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
    <Navbar/>
    <div className="dashboard-page">
      <Navbar/>
      <Sidebar />
      <div className="main-content">
        <h1>📈 Analytics</h1>

        <div className="stats">
          <div className="stat-card total">Total Devices: {data.totalDevices}</div>
          <div className="stat-card online">Devices ON: {data.onDevices}</div>
          <div className="stat-card offline">Devices OFF: {data.offDevices}</div>
        </div>

        <div className="chart-container">
          <Pie data={pieData} />
        </div>
      </div>
    </div>
    </>
  );
}

export default Analytics;
