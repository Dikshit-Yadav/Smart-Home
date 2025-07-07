import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { getDeviceLogs } from '../services/api';
import socket from '../socket';
import Navbar from '../components/Navbar';
import '../style/DeviceLogs.css';

function DeviceLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await getDeviceLogs();
      setLogs(res.data);
    };
    fetchLogs();

    // real-time updates
    socket.on('new-log', (log) => {
      setLogs(prevLogs => [log, ...prevLogs]); 
    });

    return () => {
      socket.off('new-log');
    };
  }, []);

  return (
    <><Navbar/>
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <h1>📊 Device Logs (Live)</h1>
        <div className="log-table-container">
          <table className="log-table">
            <thead>
              <tr>
                <th>Device Name</th>
                <th>Action</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td>{log.deviceName}</td>
                  <td>{log.action}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}

export default DeviceLogs;
