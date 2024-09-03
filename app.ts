import express, { Application } from 'express';
import * as path from 'path';
import * as fs from 'fs';
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

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
