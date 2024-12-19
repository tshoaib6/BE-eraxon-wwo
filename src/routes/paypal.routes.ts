import express from 'express';
import { createPayPalPayment, capturePayPalPayment, createCardPayment, captureCardPayment } from '../controllers/paypal.controller';

const router = express.Router();

router.post('/createPaypal', createPayPalPayment);
router.post('/capturePayment', capturePayPalPayment);
router.post('/createCardPayment', createCardPayment);
router.post('/captureCardPayment', captureCardPayment);

export default router;
