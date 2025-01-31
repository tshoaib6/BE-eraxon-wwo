import express from 'express';
import { createUserInformation, getUserInformation } from '../controllers/userInformation.controller';

const router = express.Router();

router.post('/user-info', createUserInformation); // Create user information
router.get('/user-info', getUserInformation); // Get user information

export default router;
