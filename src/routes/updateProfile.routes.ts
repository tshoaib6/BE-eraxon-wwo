import express from 'express';
import { uploadProfilePic } from '../middleware/cloudinary'; // Adjust the path as needed
import { updateProfile } from '../controllers/updateProfile.controller'; // Your update profile controller

const router = express.Router();


router.put('/profile', uploadProfilePic.single('profilePic'), updateProfile);

export default router;
