import { Router } from 'express';
import { signup, verifyEmail  } from '../controllers/user.controller';

const router = Router();

// router.get('/users', getUser);
router.post('/signup', signup);
router.get('/verify-email', verifyEmail);

export default router;
