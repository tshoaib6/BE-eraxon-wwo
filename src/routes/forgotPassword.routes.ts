import express from 'express';
import { requestPasswordReset,verifyOTP,resendOTP } from '../controllers/forgotPassword.controller';
import { setNewPassword } from '../controllers/newPassword.controller';

const router = express.Router();

router.get('/request-reset', requestPasswordReset);

router.post('/verify-otp', verifyOTP);

router.post('/new-password', setNewPassword);

router.get('/resend-otp', resendOTP); // New route for resending OTP

export default router;