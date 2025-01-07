import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import { RequestHandler } from 'express';

require('dotenv').config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    return {
      folder: 'digital_remembrance/uploads',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    };
  }
});

const upload = multer({
  storage: cloudinaryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB file size limit per image
  }
});

// Middleware to upload multiple images with description and date
const uploadImagesMiddleware: RequestHandler = upload.fields([
  { name: 'image', maxCount: 10 }, // Max 10 images
]);

export { uploadImagesMiddleware };
