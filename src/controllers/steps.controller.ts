  // import { Request, Response } from 'express';
  // import CombinedForm from '../models/stepform.model';
  // import { v2 as cloudinary } from 'cloudinary';
  // import cloudinaryConfig from '../utils/cloudinary';
  // import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';

  // interface mediaFiles {
  //   file: string;
  //   date: string;
  //   note?: string;
  // }

  // // Initialize Cloudinary
  // cloudinaryConfig();

  // export const createOrUpdateObituaryForm = async (req: Request, res: Response): Promise<any> => {
  //   try {
  //     const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

  //     if (!token) {
  //       return res.status(401).json({ message: 'Authorization token is required' });
  //     }

  //     const userId = extractUserIdFromToken(
  //       JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  //     );

  //     console.log("Decoded userId from form:", userId);

  //     // Extract request body
  //     const { basicInfo, family, mediaFiles, memorialServices, personalDetails } = req.body;

  //     // Find an existing form for this user
  //     let combinedForm = await CombinedForm.findOne({ userId });

  //     if (combinedForm) {
  //       if (combinedForm.status === 'drafted') {
  //         // Update the existing draft
  //         if (basicInfo) combinedForm.basicInfo = basicInfo;
  //         if (family) {
  //           const { survivingFamilyImages, predeceasedFamilyImages, ...familyData } = family;

  //           if (survivingFamilyImages) {
  //             familyData.survivingFamily = familyData.survivingFamily.map((member: any, index: number) => ({
  //               ...member,
  //               memberImage: survivingFamilyImages[index] || null,
  //             }));
  //           }

  //           if (predeceasedFamilyImages) {
  //             familyData.predeceasedFamily = familyData.predeceasedFamily.map((member: any, index: number) => ({
  //               ...member,
  //               memberImage: predeceasedFamilyImages[index] || null,
  //             }));
  //           }

  //           combinedForm.family = familyData;
  //         }
  //         if (memorialServices) combinedForm.memorialServices = memorialServices;
  //         if (personalDetails) combinedForm.personalDetails = personalDetails;

  //         if (req.files && Array.isArray(req.files)) {
  //           const files = req.files as Express.Multer.File[];
  //           const uploadedFiles: Promise<mediaFiles>[] = files.map((file) => {
  //             return new Promise((resolve, reject) => {
  //               cloudinary.uploader.upload(file.path, (error: any, result: any) => {
  //                 if (error) {
  //                   reject(error);
  //                 } else {
  //                   resolve({
  //                     file: result?.secure_url || '',
  //                     date: new Date().toISOString(),
  //                     note: file.originalname,
  //                   });
  //                 }
  //               });
  //             });
  //           });

  //           combinedForm.mediaFiles = await Promise.all(uploadedFiles);
  //         }

  //         // Save the updated draft
  //         await combinedForm.save();
  //         return res.status(200).json(combinedForm);
  //       } else if (combinedForm.status === 'submitted') {
  //         // Create a new obituary
  //         combinedForm = new CombinedForm({ userId, status: 'drafted', basicInfo, family, mediaFiles, memorialServices, personalDetails });

  //         if (req.files && Array.isArray(req.files)) {
  //           const files = req.files as Express.Multer.File[];
  //           const uploadedFiles: Promise<mediaFiles>[] = files.map((file) => {
  //             return new Promise((resolve, reject) => {
  //               cloudinary.uploader.upload(file.path, (error: any, result: any) => {
  //                 if (error) {
  //                   reject(error);
  //                 } else {
  //                   resolve({
  //                     file: result?.secure_url || '',
  //                     date: new Date().toISOString(),
  //                     note: file.originalname,
  //                   });
  //                 }
  //               });
  //             });
  //           });

  //           combinedForm.mediaFiles = await Promise.all(uploadedFiles);
  //         }

  //         // Save the new form
  //         await combinedForm.save();
  //         return res.status(201).json(combinedForm);
  //       }
  //     } else {
  //       // If no form exists, create a new one
  //       combinedForm = new CombinedForm({ userId, status: 'drafted', basicInfo, family, mediaFiles, memorialServices, personalDetails });

  //       if (req.files && Array.isArray(req.files)) {
  //         const files = req.files as Express.Multer.File[];
  //         const uploadedFiles: Promise<mediaFiles>[] = files.map((file) => {
  //           return new Promise((resolve, reject) => {
  //             cloudinary.uploader.upload(file.path, (error: any, result: any) => {
  //               if (error) {
  //                 reject(error);
  //               } else {
  //                 resolve({
  //                   file: result?.secure_url || '',
  //                   date: new Date().toISOString(),
  //                   note: file.originalname,
  //                 });
  //               }
  //             });
  //           });
  //         });

  //         combinedForm.mediaFiles = await Promise.all(uploadedFiles);
  //       }

  //       // Save the new form
  //       await combinedForm.save();
  //       return res.status(201).json(combinedForm);
  //     }
  //   } catch (error: any) {
  //     console.error(error);

  //     const errorMessage = error?.message || 'An unexpected error occurred';
  //     res.status(500).json({ success: false, message: errorMessage });
  //   }
  // };



  import { Request, Response } from 'express';
  import CombinedForm from '../models/stepform.model';
  import { v2 as cloudinary } from 'cloudinary';
  import cloudinaryConfig from '../utils/cloudinary';
  import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';
  import { uploadFiles } from '../middleware/stepperFormImages'; // Import the middleware
  
  // Initialize Cloudinary
  cloudinaryConfig();
  
  // Create or update obituary form
  export const createOrUpdateObituaryForm = [
    uploadFiles, // First, upload files using the middleware
    async (req: Request, res: Response): Promise<any> => {
      try {
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
  
        if (!token) {
          return res.status(401).json({ message: 'Authorization token is required' });
        }
  
        const userId = extractUserIdFromToken(
          JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        );
  
        console.log('Decoded userId from form:', userId);
  
        // Extract request body
        const { basicInfo, family, memorialServices, personalDetails, mediaFiles } = req.body;
  
        // Check for missing fields and respond with an error if any are missing
        if (!basicInfo || !family || !memorialServices || !personalDetails) {
          return res.status(400).json({ message: 'Required fields are missing' });
        }
  
        // Find an existing form for this user
        let combinedForm = await CombinedForm.findOne({ userId });
  
        if (combinedForm) {
          if (combinedForm.status === 'drafted') {
            // Update the existing draft
            if (basicInfo) combinedForm.basicInfo = basicInfo;
            if (family) combinedForm.family = family;
            if (memorialServices) combinedForm.memorialServices = memorialServices;
            if (personalDetails) combinedForm.personalDetails = personalDetails;
            if (mediaFiles) combinedForm.mediaFiles = mediaFiles;
  
            // Save the updated draft
            await combinedForm.save();
            return res.status(200).json(combinedForm);
          } else if (combinedForm.status === 'submitted') {
            // Create a new obituary if the form is submitted
            combinedForm = new CombinedForm({
              userId,
              status: 'drafted',
              basicInfo,
              family,
              memorialServices,
              personalDetails,
              mediaFiles,
            });
  
            // Save the new form
            await combinedForm.save();
            return res.status(201).json(combinedForm);
          }
        } else {
          // If no form exists, create a new one
          combinedForm = new CombinedForm({
            userId,
            status: 'drafted',
            basicInfo,
            family,
            memorialServices,
            personalDetails,
            mediaFiles,
          });
  
          // Save the new form
          await combinedForm.save();
          return res.status(201).json(combinedForm);
        }
      } catch (error: any) {
        console.error(error);
  
        const errorMessage = error?.message || 'An unexpected error occurred';
        res.status(500).json({ success: false, message: errorMessage });
      }
    },
  ];
  