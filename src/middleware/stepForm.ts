// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from 'cloudinary';
// import { RequestHandler } from 'express';

// require('dotenv').config();

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const stepFormStorage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: async (req, file) => {
//     return {
//       folder: 'stepform/uploads',
//       allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'docx'], // Added more formats if needed
//     };
//   },
// });

// const stepFormUpload = multer({
//   storage: stepFormStorage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10 MB file size limit
//   },
// });

// const stepFormUploadMiddleware: RequestHandler = (req, res, next) => {
//   stepFormUpload.fields([
//     { name: 'memberImage', maxCount: 5 },
//     // { name: 'file', maxCount: 5 }
//   ])(req, res, (err: any) => {
//     if (err) {
//       return res.status(400).json({ message: 'File upload error', error: err.message });
//     }
//     next();
//   });
// };

// export { stepFormUploadMiddleware as stepFormUpload };



import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import { RequestHandler } from 'express';

require('dotenv').config();

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration (for memberImage if still using file input)
const stepFormStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    return {
      folder: 'stepform/memberImages',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

// Multer setup for file upload (only used for memberImage now)
const stepFormUpload = multer({
  storage: stepFormStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit
  },
});

// Middleware that only handles memberImage files
const stepFormUploadMiddleware: RequestHandler = (req, res, next) => {
  stepFormUpload.fields([
    { name: 'memberImage', maxCount: 10 }, // Adjust count if needed
  ])(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        message: 'File upload error',
        error: err.message,
      });
    }
    next();
  });
};

export { stepFormUploadMiddleware as stepFormUpload };
