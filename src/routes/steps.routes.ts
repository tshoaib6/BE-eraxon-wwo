import express from 'express';
import { createOrUpdateObituaryForm } from '../controllers/steps.controller';
import { uploadFiles } from '../middleware/stepperFormImages'; // Upload middleware that handles Cloudinary upload
import multer from 'multer';

// Initialize Multer with memory storage (for multer's internal use, but it won't save files locally)

// Create Router
const router = express.Router();

// Handle file uploads using Multer, but upload files directly to Cloudinary with the middleware
  // router.post('/createObituary', upload.fields([
  //   { name: 'survivingFamilyImages', maxCount: 10 }, // Field for surviving family images
  //   { name: 'predeceasedFamilyImages', maxCount: 10 }, // Field for predeceased family images
  //   { name: 'mediaFiles', maxCount: 5 } // Field for media files
  // ]), uploadFiles, createOrUpdateObituaryForm);


  // router.post('/createObituary', createOrUpdateObituaryForm);


  const upload = multer({ storage: multer.memoryStorage() });  // or configure your storage method here

  router.post(
    '/createObituary',
    upload.fields([
      { name: 'survivingFamilyImages', maxCount: 5 }, // Match field name for surviving family images
      { name: 'predeceasedFamilyImages', maxCount: 5 }, // Match field name for predeceased family images
      { name: 'mediaFiles', maxCount: 10 }, // Match field name for media files
    ]),
    uploadFiles, // Middleware to handle file uploads and Cloudinary processing
    createOrUpdateObituaryForm // Controller to handle the rest of the form logic
  );
  
export default router;
