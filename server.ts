import app from './app';
import redis from './redis';
import mongoose from 'mongoose';
import cors from 'cors';
import { initializeSocket } from './src/socket';

import http from 'http';

const port = process.env.PORT || 3000;
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration using the utility function
initializeSocket(server);

mongoose.connect(dbUrl)
  .then(() => {
    console.log('Connected to MongoDB');

    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err: any) => {
    console.error('Failed to connect to MongoDB', err);
  });
