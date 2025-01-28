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
  import cloudinaryConfig from '../utils/cloudinary';
  import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';
  
  // Initialize Cloudinary
  cloudinaryConfig();
  
  // Define types for the incoming fields to handle dynamic key access properly
  interface BasicInfo {
    firstNameOfDeceased?: string;
    lastNameOfDeceased?: string;
    dateOfBirth?: string | null;
    dateOfDeath?: string | null;
    gender?: string;
    placeOfBirth?: string;
    placeOfDeath?: string;
  }
  
  interface Family {
    survivingFamily?: {
      memberImage?: string;
      memberName?: string;
      lastName?: string;
      relation?: string;
      note?: string;
    }[];
    predeceasedFamily?: {
      memberName?: string;
      relation?: string;
      note?: string;
      memberImage?: string;
    }[];
  }
  
  interface MemorialServices {
    eventName: string;
    specialInstructions?: string;
    date?: string;
    time?: string;
    locationName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    contactPhoneNumber?: string;
    timeZone?: string;
    eventViewingLink?: string;
  }
  
  interface PersonalDetails {
    lifeStory?: string;
    education?: {
      schoolName?: string;
      from?: string;
      to?: string;
      schoolLocation?: string;
      degree?: string;
    }[];
    careerHighlights?: string;
    hobbies?: string;
    interests?: string;
  }
  
  interface MediaFileMetadata {
    file: string;
    date: string;
    note?: string;
  }
  
  interface CombinedFormData {
    basicInfo: BasicInfo;
    family: Family;
    memorialServices: MemorialServices[];
    personalDetails: PersonalDetails;
    mediaFiles: MediaFileMetadata[];
  }
  
  export const createOrUpdateObituaryForm = [
    async (req: Request, res: Response): Promise<any> => {
      try {
        // Extract token for authentication
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'Authorization token is required' });
        }
  
        // Decode and extract userId from token
        const userId = extractUserIdFromToken(
          JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        );
  
        console.log('Decoded userId:', userId);
  
        // Destructure fields from the request body
        const { basicInfo, family, memorialServices, personalDetails } = req.body;
        let mediaFiles = req.body.mediaFiles; // Get media files from FormData (if any)
  
        // Log the received data for debugging
        console.log('Received data:', { basicInfo, family, memorialServices, personalDetails, mediaFiles });
  
        // Find existing form for the user
        let combinedForm = await CombinedForm.findOne({ userId });
  
        if (combinedForm) {
          console.log('Existing form:', combinedForm);
  
          // Update the existing form based on the provided fields
          if (basicInfo) {
            combinedForm.basicInfo = { ...combinedForm.basicInfo, ...basicInfo };
          }
  
          if (family) {
            if (family.survivingFamily) {
              combinedForm.family.survivingFamily = [
                ...(combinedForm.family.survivingFamily || []),
                ...family.survivingFamily,
              ];
            }
            if (family.predeceasedFamily) {
              combinedForm.family.predeceasedFamily = [
                ...(combinedForm.family.predeceasedFamily || []),
                ...family.predeceasedFamily,
              ];
            }
          }
  
          if (memorialServices) {
            combinedForm.memorialServices = [
              ...(combinedForm.memorialServices || []),
              ...memorialServices,
            ];
          }
  
          if (personalDetails) {
            combinedForm.personalDetails = {
              ...combinedForm.personalDetails,
              ...personalDetails,
              education: [
                ...(combinedForm.personalDetails.education || []),
                ...(personalDetails.education || []),
              ],
            };
          }
  
          if (mediaFiles) {
            combinedForm.mediaFiles = [
              ...(combinedForm.mediaFiles || []),
              ...mediaFiles,
            ];
          }
  
          // Save the updated form
          await combinedForm.save();
          console.log('Updated form saved successfully:', combinedForm);
          return res.status(200).json(combinedForm);
        } else {
          // Create a new form if none exists
          combinedForm = new CombinedForm({
            userId,
            status: 'drafted',
            basicInfo: basicInfo || {},
            family: family || { survivingFamily: [], predeceasedFamily: [] },
            memorialServices: memorialServices || [],
            personalDetails: personalDetails || { education: [] },
            mediaFiles: mediaFiles || [],
          });
  
          // Save the new form
          await combinedForm.save();
          console.log('New form created successfully:', combinedForm);
          return res.status(201).json(combinedForm);
        }
      } catch (error: any) {
        console.error('Error occurred:', error);
  
        // Handle errors gracefully
        const errorMessage = error?.message || 'An unexpected error occurred';
        res.status(500).json({ success: false, message: errorMessage });
      }
    },
  ];
  