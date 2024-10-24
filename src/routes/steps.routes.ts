import express from 'express';
import { createOrUpdateStep,getStep } from '../controllers/steps.controller';
import verifyJwt from '../middleware/verifyJwt';
import { stepFormUpload } from '../middleware/stepForm'; // Ensure this import matches the export

const router = express.Router();

router.post('/steps', verifyJwt, stepFormUpload, createOrUpdateStep);
router.get('/getStepsData',verifyJwt, getStep);

export default router;
