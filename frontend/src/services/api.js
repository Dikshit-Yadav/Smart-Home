import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://localhost:5000/api'
  baseURL: `${import.meta.env.VITE_API_URL}/api`
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
export const getProfile = () => {
  return API.get('/user/profile', {
    headers: { userid: localStorage.getItem('userid') }
  });
};

export const updateProfile = (data) => {
  return API.put('/user/profile', data, {
    headers: { userid: localStorage.getItem('userid') }
  });
};


export const disable2FA = () => {
  const userId = localStorage.getItem('userid');
  return API.put('/user/disable-2fa', null, {
    headers: {
      userid: userId
    }
  });
};

