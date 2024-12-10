import express from 'express';
import { uploadProfilePic } from '../middleware/cloudinary'; // Adjust the path as needed
import { updateProfile , getProfile} from '../controllers/updateProfile.controller'; // Your update profile controller

const router = express.Router();


router.put('/profile', uploadProfilePic.single('profilePic'), updateProfile);
router.get('/getProfile', getProfile); // New GET route for fetching user profile

export default router;
