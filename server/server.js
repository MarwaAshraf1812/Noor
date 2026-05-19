import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { initializeSocket } from "./config/socket.config.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server manually to attach socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

// Expose IO for services that need it
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});