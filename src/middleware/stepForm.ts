// import multer, { Multer } from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from 'cloudinary';

// // Load environment variables from .env file
// require('dotenv').config();

// // Configure Cloudinary with your credentials
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure Cloudinary storage for multer
// const stepFormStorage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: async (req, file) => {
//     return {
//       folder: 'stepform/uploads', // Folder name in Cloudinary
//       allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed formats
//       public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // Unique public ID
//     };
//   },
// });

// // Create multer instance with defined storage and limits
// const stepFormUpload: Multer = multer({
//   storage: stepFormStorage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10 MB file size limit
//   },
// });

// // Export the multer upload middleware
// export { stepFormUpload };


// stepForm.ts

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import { RequestHandler } from 'express';

// Load environment variables from .env file
require('dotenv').config();

// Configure Cloudinary with your credentials
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for multer
const stepFormStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    return {
      folder: 'stepform/uploads',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, 
    };
  },
});

// Create multer instance with defined storage and limits
const stepFormUpload = multer({
  storage: stepFormStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit
  },
});

// Define middleware for handling multiple file fields
const stepFormUploadMiddleware: RequestHandler = stepFormUpload.fields([
  { name: 'memberImage', maxCount: 5 }, 
  { name: 'predeceasedImage', maxCount: 5 }, // Handle predeceased images
  { name: 'file', maxCount: 5 },
]);

// Export the multer upload middleware
export { stepFormUploadMiddleware as stepFormUpload };
