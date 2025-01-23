import express from 'express';
import { createOrUpdateObituaryForm } from '../controllers/steps.controller';
import verifyJwt from '../middleware/verifyJwt';
import { uploadFiles } from '../middleware/stepperFormImages';
import multer from 'multer';
import path from 'path'; // Import the path module

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Temporary folder for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});

const upload = multer({ storage });

const router = express.Router();

// Using upload.fields to handle multiple file inputs with unique field names
router.post('/createObituary', upload.fields([
  { name: 'survivingFamilyImages', maxCount: 10 }, // Field for surviving family images
  { name: 'predeceasedFamilyImages', maxCount: 10 }, // Field for predeceased family images
  { name: 'mediaFiles', maxCount: 5 } // Field for media files
]), uploadFiles, createOrUpdateObituaryForm);

export default router;
