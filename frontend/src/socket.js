import { io } from 'socket.io-client';
// const socket = io('http://localhost:5000',

  const socket = io(import.meta.env.VITE_API_URL, {
  transports: ['websocket'],
  withCredentials: true
});

export default socket;

