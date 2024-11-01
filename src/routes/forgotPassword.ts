import express from 'express';
import { requestPasswordReset } from '../controllers/forgotPassword.controller';

const router = express.Router();

router.get('/requestReset', requestPasswordReset);


export default router;