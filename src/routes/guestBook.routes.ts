import express from 'express';
import { createGuestBookEntry,getGuestBookEntries } from '../controllers/guestBook.controller';
import { uploadGuestBookImage } from '../middleware/cloudinary';

const router = express.Router();

router.post(
  '/guestbook',
  uploadGuestBookImage.single('image'), // Middleware for image upload
  createGuestBookEntry // Controller for creating guestbook entry
);
router.get("/guestbook", getGuestBookEntries);


export default router;
