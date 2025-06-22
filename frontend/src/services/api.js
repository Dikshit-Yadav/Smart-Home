import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
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
