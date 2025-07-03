const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const deviceLogRoutes = require('./routes/deviceLogRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});

// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
const allowedOrigins = [
  'http://localhost:5173',
  'https://smart-home-epyizbrgn-dikshit-yadavs-projects.vercel.app',
  'https://smart-home-cifp.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

app.use('/api/user', userRoutes);
app.use('/api/devices', deviceRoutes(io));
app.use('/api/logs', deviceLogRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.send('Smart Home Automation Backend Running 🚀');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

