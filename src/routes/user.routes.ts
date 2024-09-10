import { Router } from 'express';
import { signup, verifyEmail,login, logout } from '../controllers/user.controller';

const router = Router();

router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/login',login);
router.post('/logout', logout); 


export default router;
