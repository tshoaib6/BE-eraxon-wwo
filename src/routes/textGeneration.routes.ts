import express from 'express';
import { generateText } from '../controllers/textGeneration.controller'; // Import the controller

const router = express.Router();

// POST route to generate text based on prompt
router.post('/generate-text', generateText);

export default router;
