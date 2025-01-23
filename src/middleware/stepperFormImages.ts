import multer from 'multer';
import path from 'path'; // Import the path module
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import cloudinaryConfig from '../utils/cloudinary'; // Import the cloudinaryConfig function

// Initialize Cloudinary configuration
cloudinaryConfig(); // Call the function to initialize Cloudinary

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Destination folder for temporary storage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name with file extension
  },
});

const upload = multer({ storage });

// Helper function to upload a file to Cloudinary
const uploadToCloudinary = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error: any, result: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(result?.secure_url || ''); // Resolve with Cloudinary URL
      }
    });
  });
};

// Middleware for uploading family member images and media files
export const uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure req.files is defined before accessing it
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // Check if files are provided
    if (!files) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Upload surviving family images to Cloudinary
    if (files['survivingFamilyImages']) {
      const survivingFamilyImages = files['survivingFamilyImages'] as Express.Multer.File[];
      req.body.family.survivingFamily = await Promise.all(
        survivingFamilyImages.map(async (file, index) => ({
          ...req.body.family.survivingFamily?.[index], // Retain existing family member data
          memberImage: await uploadToCloudinary(file), // Upload image to Cloudinary
        }))
      );
    }

    // Upload predeceased family images to Cloudinary
    if (files['predeceasedFamilyImages']) {
      const predeceasedFamilyImages = files['predeceasedFamilyImages'] as Express.Multer.File[];
      req.body.family.predeceasedFamily = await Promise.all(
        predeceasedFamilyImages.map(async (file, index) => ({
          ...req.body.family.predeceasedFamily?.[index], // Retain existing family member data
          memberImage: await uploadToCloudinary(file), // Upload image to Cloudinary
        }))
      );
    }

    // Upload media files to Cloudinary
    if (files['mediaFiles']) {
      const mediaFiles = files['mediaFiles'] as Express.Multer.File[];
      req.body.mediaFiles = await Promise.all(
        mediaFiles.map(async (file) => ({
          file: await uploadToCloudinary(file), // Upload media file
          date: new Date().toISOString(), // Set the current date for the media file
          note: file.originalname, // Retain original file name
        }))
      );
    }

    next(); // Proceed to the controller after uploading
  } catch (error) {
    console.error('File upload failed:', error);
    res.status(500).json({ message: 'Error uploading files', error });
  }
};
