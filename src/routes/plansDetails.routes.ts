import { Router } from 'express';
import { createPlan, getAllPlans } from '../controllers/plansDetails.controller';

const router = Router();

// Route to create a new plan
router.post('/plans', createPlan);

// Route to get all plans
router.get('/getplans', getAllPlans);

export default router;
