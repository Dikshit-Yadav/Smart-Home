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
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://smart-home-cifp.onrender.com'
    ];

    const isVercelPreview = origin?.includes('vercel.app');

    if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// app.options('*', cors()); 

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// app.use('/api/user', userRoutes);
// app.use('/api/devices', deviceRoutes(io));
// app.use('/api/logs', deviceLogRoutes);
// app.use('/api/analytics', analyticsRoutes);
try {
  app.use('/api/user', userRoutes);
  console.log('✅ userRoutes loaded');
} catch (err) {
  console.error('❌ Error in userRoutes:', err);
}

try {
  app.use('/api/devices', deviceRoutes(io));
  console.log('✅ deviceRoutes loaded');
} catch (err) {
  console.error('❌ Error in deviceRoutes:', err);
}

try {
  app.use('/api/logs', deviceLogRoutes);
  console.log('✅ deviceLogRoutes loaded');
} catch (err) {
  console.error('❌ Error in deviceLogRoutes:', err);
}

try {
  app.use('/api/analytics', analyticsRoutes);
  console.log('✅ analyticsRoutes loaded');
} catch (err) {
  console.error('❌ Error in analyticsRoutes:', err);
}


app.get('/', (req, res) => {
  res.send('Smart Home Automation Backend Running 🚀');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

