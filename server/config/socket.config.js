import { Server } from 'socket.io';

let io;
// A map to keep track of connected users: { userId: socketId }
// This allows us to emit events to specific users even if they have multiple devices or reconnect
const userSockets = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this in production to match your frontend URL
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // When the frontend connects, it should emit a 'register' event with the userId
    socket.on('register', (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`👤 User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      // Remove the user from our tracking map when they disconnect
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`🔌 User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

// Utility function to get the initialized io instance
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Utility function to emit an event to a specific user
export const emitToUser = (userId, eventName, data) => {
  if (!io) return;
  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(socketId).emit(eventName, data);
  }
};
