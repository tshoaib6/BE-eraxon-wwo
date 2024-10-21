import express from 'express';
import { createOrUpdateStep } from '../controllers/steps.controller';
import verifyJwt from '../middleware/verifyJwt';

const router = express.Router();

router.post('/steps', verifyJwt, createOrUpdateStep);

export default router;
