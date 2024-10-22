// import express from 'express';
// import { createOrUpdateStep } from '../controllers/steps.controller';
// import verifyJwt from '../middleware/verifyJwt';

// const router = express.Router();

// router.post('/steps', verifyJwt, createOrUpdateStep);

// export default router;


import express from 'express';
import { createOrUpdateStep } from '../controllers/steps.controller';
import { upload } from '../middleware/cloudinary'; // Import the upload middleware

const router = express.Router();

// Assuming the image files for the family members are uploaded under fields 'survivingFamilyMembers', 'predeceasedFamilyMembers', and 'fileSrc' for step5
router.post(
  '/stepform',
  upload.fields([
    { name: 'survivingFamilyMembers', maxCount: 10 },
    { name: 'predeceasedFamilyMembers', maxCount: 10 },
    { name: 'fileSrc', maxCount: 1 }, // fileSrc for step5
  ]),
  createOrUpdateStep
);

export default router;
