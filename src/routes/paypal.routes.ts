import express from 'express';
import { createPayPalPayment, capturePayPalPayment, createCardPayment, captureCardPayment,getPaypalPaymentHistory,cancelSubscription } from '../controllers/paypal.controller';

const router = express.Router();

router.post('/createPaypal', createPayPalPayment);
router.post('/capturePayment', capturePayPalPayment);
router.post('/createCardPayment', createCardPayment);
router.post('/captureCardPayment', captureCardPayment);
router.get('/paypalPaymentHistory', getPaypalPaymentHistory);
router.put('/cancelSubscription', cancelSubscription);



export default router;
