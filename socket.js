const { Server } = require('socket.io');

let io = null;

function initSocket(server, options = {}) {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    ...options
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

function emitSocketEvent(eventName, resource, details = {}) {
  if (!io) return;
  io.emit(eventName, {
    resource,
    ...details
  });
}

module.exports = {
  initSocket,
  emitSocketEvent
};
