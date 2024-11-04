import { Router } from 'express';
import { createPayment } from '../controllers/payment.controller';

const router = Router();

router.post('/payments', createPayment);

export default router;
