import express from 'express';
import { createPayment } from '../controllers/paymentDetails.controller';

const router = express.Router();

// Route for creating a new payment
router.post('/createPayment', createPayment);

export default router;
