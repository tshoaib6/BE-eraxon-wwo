import express from 'express';
import { createOrUpdateStep,getStep,getRecordById,getStepDataByUserID,searchAndSortRecords } from '../controllers/steps.controller';
import verifyJwt from '../middleware/verifyJwt';
import { stepFormUpload } from '../middleware/stepForm'; // Ensure this import matches the export

const router = express.Router();

router.post('/steps', verifyJwt, stepFormUpload, createOrUpdateStep);
router.get('/getStepsData', getStep);
router.get('/steps/record/:recordId', getRecordById);
router.get('/getStepDataByUserID', getStepDataByUserID);
router.get('/obituaries', searchAndSortRecords);


export default router;

