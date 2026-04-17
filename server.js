const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const connectDB = require('./config/db');
const { initSocket } = require('./socket');
const menuRoutes = require('./routes/menu.routes');
const sessionRoutes = require('./routes/session.routes');
const orderRoutes = require('./routes/order.routes');
const kitchenStaffRoutes = require('./routes/kitchenstaff.routes');
const behaviorRoutes = require('./routes/behavior.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const adminRoutes = require('./routes/admin.routes');

connectDB();
app.use(cors({
  origin: ['http://localhost:5173', 'https://ed7fe875-10fc-4d3e-83a1-15c9f6b14242-00-30yes7atmxijc.sisko.replit.dev'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SnapServe backend running');
});

app.use('/menu', menuRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/kitchen-staff', kitchenStaffRoutes);
app.use('/api/behavior', behaviorRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin', adminRoutes);

const io = initSocket(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

server.listen(3000, () => {
  console.log('SnapServe backend listening on port 3000');
});
