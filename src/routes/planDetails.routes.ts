import express from 'express';
import { createPlan, getAllPlans } from '../controllers/planDetails.controller';

const router = express.Router();

// POST Route - Create a new plan
router.post('/createPlan', createPlan);

// GET Route - Get all plans
router.get('/getPlans', getAllPlans);

export default router;
