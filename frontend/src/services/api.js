import axios from 'axios';

export const API = axios.create({
  // baseURL: 'http://localhost:5000/api'
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
   withCredentials: true,
});

// OTP generate
export const registerUser = (userData) => API.post('/user/register', userData);

// Login
export const loginUser = (userData) => API.post('/user/login', userData);

// OTP verification
export const verifyOtp = (data) => API.post('/user/verify-otp', data);

// Devices APIs
export const getDevices = () => API.get('/devices');
export const toggleDevice = (id) => API.put(`/devices/${id}/toggle`);
export const deleteDevice = (id) => API.delete(`/devices/${id}`);
export const addDevice = (data) => API.post('/devices/add', data);
export const getDeviceLogs = () => API.get('/logs');
export const getAnalytics = () => API.get('/analytics');

//Profile APIs
export const getProfile = () =>
  API.get('/user/profile', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });

export const updateProfile = (data) =>
  API.put('/user/profile', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });

export const disable2FA = () => {
  const userId = localStorage.getItem('userid');
  return API.put('/user/disable-2fa', {}, {
    headers: { userid: userId }
  });
};
