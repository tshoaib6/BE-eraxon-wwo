import express from 'express';
import { createPayPalPayment, capturePayPalPayment, createPayPalCardPayment, capturePayPalCardPayment,getPaypalPaymentHistory,cancelSubscription } from '../controllers/paypal.controller';

const router = express.Router();

router.post('/createPaypal', createPayPalPayment);
router.post('/capturePayment', capturePayPalPayment);
router.post('/createCardPayment', createPayPalCardPayment);
router.post('/captureCardPayment', capturePayPalCardPayment);
router.get('/paypalPaymentHistory', getPaypalPaymentHistory);
router.put('/cancelSubscription', cancelSubscription);



export default router;
