const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts',
    allowedFormats: ['jpg', 'png', 'jpeg', 'mp4', 'mov']
  }
})

const upload = multer({ storage: storage })

export { cloudinary, upload }

// ABOVE CODE IS WITHOUT LOCAL STORAGE FUNCTIONALITY











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
