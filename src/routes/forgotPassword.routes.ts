import express from 'express';
import { requestPasswordReset,verifyOTP } from '../controllers/forgotPassword.controller';
import { setNewPassword } from '../controllers/newPassword.controller';

const router = express.Router();

router.get('/request-reset', requestPasswordReset);

router.post('/verify-otp', verifyOTP);

router.post('/new-password', setNewPassword);


export default router;