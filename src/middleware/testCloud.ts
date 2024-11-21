// const cloudinary = require('cloudinary').v2
// const multer = require('multer')
// const { CloudinaryStorage } = require('multer-storage-cloudinary')
// require('dotenv').config()

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'posts',
//     allowedFormats: ['jpg', 'png', 'jpeg', 'mp4', 'mov']
//   }
// })

// const upload = multer({ storage: storage })

// export { cloudinary, upload }

// ABOVE CODE IS WITHOUT LOCAL STORAGE FUNCTIONALITY





// testing  start

const express = require('express');
import { Request, Response } from 'express';

const app = express();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts',
    allowedFormats: ['jpg', 'png', 'jpeg', 'mp4', 'mov'],
  },
});
// Multer configuration with file size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
}).single('file'); // Change 'file' to the name of the form field if necessary
// Route to handle file uploads with error handling
app.post('/upload', (req:Request, res:Response) => {
  upload(req, res, function (err:any) {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size exceeds limit of 10MB.' });
      }
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      // Handle other errors, such as Cloudinary or unexpected errors
      return res.status(500).json({ message: `Upload error: ${err.message}` });
    }
    // If no error, proceed with the response
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    // Return success response with file details
    res.status(200).json({
      message: 'File uploaded successfully!',
      fileUrl: req.file.path, // Cloudinary file URL
    });
  });
});
// Start the server (optional if you already have an existing server setup)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export { cloudinary, upload };




// testing close




// Below code have functionality of localstorage too

// import multer from 'multer';
// import path from 'path';
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure Multer for local storage
// const localStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Ensure the path to the uploads folder is correct
//     cb(null, path.join(__dirname, '../uploads')); // Local directory to store files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
//   },
// });

// // Create the Multer upload instance for local storage
// const uploadLocal = multer({ storage: localStorage });

// // Configure Multer for Cloudinary storage
// const cloudinaryStorage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: async (req, file) => {
//       return {
//         folder: 'posts', // Folder to organize files in Cloudinary
//         format: file.mimetype.split('/')[1], // Automatically set the format based on the file type
//         public_id: `${Date.now()}-${file.originalname}`, // Generate a unique public ID for the file
//       };
//     },
//   });
// // Create the Multer upload instance for Cloudinary
// const upload = multer({ storage: cloudinaryStorage });

// // Export both upload instances
// export { uploadLocal, upload, cloudinary };
