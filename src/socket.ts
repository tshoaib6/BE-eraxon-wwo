import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

let io: Server;

export const initializeSocket = (server: http.Server) => {
  const allowedOrigin = process.env.FRONT_END_URL || 'http://localhost:5173'; // Fallback if not defined

  io = new Server(server, {
    cors: {
      origin: allowedOrigin,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

export const getSocket = () => {
  if (!io) {
    throw new Error('Socket not initialized');
  }
  return io;
};
