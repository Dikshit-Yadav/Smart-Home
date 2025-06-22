// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const userRoutes = require('./routes/userRoutes');
// const deviceRoutes = require('./routes/deviceRoutes');

// dotenv.config();

// const app = express();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http, {
//   cors: { origin: 'http://localhost:5173', credentials: true }
// });
// const PORT = process.env.PORT || 5000;

// // Middleware
// const corsOptions = {
//   origin: 'http://localhost:5173',
//   credentials: true
// };

// app.use(cors(corsOptions));


// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.log(err));

// // app.use((req, res, next) => {
// //   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
// //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// //   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
// //   res.header("Access-Control-Allow-Credentials", "true");
// //   next();
// // });

// // Routes
// app.use('/api/user', userRoutes);
// app.use('/api/devices', deviceRoutes(io));

// // Test Route
// app.get('/', (req, res) => {
//   res.send('Smart Home Automation Backend Running 🚀');
// });

// // Start Server
// http.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });













const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

app.use('/api/user', userRoutes);
app.use('/api/devices', deviceRoutes(io));

app.get('/', (req, res) => {
  res.send('Smart Home Automation Backend Running 🚀');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

