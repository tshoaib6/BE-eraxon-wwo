import express, { Application, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
const dotenv = require('dotenv');

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Custom CORS middleware with dynamic origin
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigin = process.env.FRONT_END_URL || 'http://localhost:5173'; // Fallback if not defined

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '1800');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Function to dynamically load routes
const loadRoutes = (app: Application) => {
  const routesPath = path.join(__dirname, 'src/routes');
  fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith('.routes.ts')) {
      const route = require(path.join(routesPath, file));
      app.use('/api', route.default); // Set prefix for routes
    }
  });
};

// Load routes
loadRoutes(app);

export default app;
