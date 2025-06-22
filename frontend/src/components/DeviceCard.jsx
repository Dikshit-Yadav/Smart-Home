import React from 'react';

function DeviceCard({ device, onToggle, onDelete }) {
  return (
    <div className="device-card">
      <h3>{device.deviceName}</h3>
      <p>Type: {device.deviceType}</p>
      <p>Status: <span className={device.status === 'ON' ? 'online' : 'offline'}>{device.status}</span></p>

      <button onClick={() => onToggle(device._id)}>
        {device.status === 'ON' ? 'Turn OFF' : 'Turn ON'}
      </button>

      <button className="delete-btn" onClick={() => onDelete(device._id)}>
        Delete
      </button>
    </div>
  );
}

export default DeviceCard;
