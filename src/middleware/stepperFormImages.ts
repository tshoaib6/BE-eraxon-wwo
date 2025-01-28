import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';

const uploadToCloudinary = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || '');
        }
      }
    ).end(file.buffer);
  });
};

export const uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // Parse text fields
    req.body.basicInfo = req.body.basicInfo ? JSON.parse(req.body.basicInfo) : {};
    req.body.family = req.body.family ? JSON.parse(req.body.family) : { survivingFamily: [], predeceasedFamily: [] };
    req.body.memorialServices = req.body.memorialServices ? JSON.parse(req.body.memorialServices) : [];
    req.body.personalDetails = req.body.personalDetails ? JSON.parse(req.body.personalDetails) : { education: [] };
    req.body.mediaFiles = req.body.mediaFiles ? JSON.parse(req.body.mediaFiles) : [];

    // Process surviving family images
    if (files?.['survivingFamilyImages']) {
      req.body.family.survivingFamily = await Promise.all(
        files['survivingFamilyImages'].map(async (file, index) => ({
          ...req.body.family.survivingFamily[index],
          memberImage: await uploadToCloudinary(file),
        }))
      );
    }

    // Process predeceased family images
    if (files?.['predeceasedFamilyImages']) {
      req.body.family.predeceasedFamily = await Promise.all(
        files['predeceasedFamilyImages'].map(async (file, index) => ({
          ...req.body.family.predeceasedFamily[index],
          memberImage: await uploadToCloudinary(file),
        }))
      );
    }

    // Process media files
    if (files?.['mediaFiles']) {
      const existingMediaFiles = req.body.mediaFiles;
      req.body.mediaFiles = [
        ...existingMediaFiles,
        ...(await Promise.all(
          files['mediaFiles'].map(async (file) => ({
            file: await uploadToCloudinary(file),
            date: new Date().toISOString(),
            note: file.originalname,
          }))
        )),
      ];
    }

    // Proceed to the next middleware/controller
    next();
  } catch (error) {
    console.error('Error in file upload middleware:', error);
    res.status(500).json({ message: 'Error processing files and data', error });
  }
};
