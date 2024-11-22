import express from 'express';
import { saveUserLocation } from '../controllers/location.controller';

const router = express.Router();

// POST route to save user's location
router.post('/save', saveUserLocation);

export default router;
