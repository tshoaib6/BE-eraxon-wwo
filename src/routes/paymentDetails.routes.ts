import express from 'express';
import { createPayment,getPaymentDetails,cancelSubscription,getPaymentHistory  } from '../controllers/paymentDetails.controller';

const router = express.Router();

// Route for creating a new payment
router.post('/createPayment', createPayment);
router.get("/getPayment",  getPaymentDetails); // Requires authentication
router.patch("/cancelSubscription", cancelSubscription);
router.get('/paymentHistory', getPaymentHistory); // Applying the verifyToken middleware to check authorization

export default router;
