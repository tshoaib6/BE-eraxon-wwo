
// import { Request, Response } from 'express';
// import Step from '../models/stepform.model'; 
// import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';

// export const createOrUpdateStep = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
//     const userId = extractUserIdFromToken(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()));

//     if (!userId) {
//       return res.status(401).json({ message: 'Authorization token is required' });
//     }

//     // Retrieve all steps data from the request body
//     const { step1, step2, step3, step4, step5 } = req.body;

//     // Find existing step data for the user
//     const existingStep = await Step.findOne({ userId });

//     if (existingStep) {
//       // Combine existing step data with the new step data (accumulate steps)
//       existingStep.step1 = step1 || existingStep.step1;
//       existingStep.step2 = step2 || existingStep.step2;
//       existingStep.step3 = step3 || existingStep.step3;
//       existingStep.step4 = step4 || existingStep.step4;
//       existingStep.step5 = step5 || existingStep.step5;

//       await existingStep.save();

//       return res.status(200).json({ message: 'Steps data updated successfully', steps: existingStep });
//     } else {
//       // Create new step data with all available steps
//       const newStep = new Step({
//         userId,
//         step1,
//         step2,
//         step3,
//         step4,
//         step5,
//       });

//       await newStep.save();

//       return res.status(201).json({ message: 'Steps data created successfully', steps: newStep });
//     }
//   } catch (error) {
//     console.error('Error in createOrUpdateStep:', error);
//     const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
//     return res.status(500).json({ message: errorMessage });
//   }
// };

// import { Request, Response } from 'express';
// import Step from '../models/stepform.model';
// import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';

// export const createOrUpdateStep = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
//     const userId = extractUserIdFromToken(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()));

//     if (!userId) {
//       return res.status(401).json({ message: 'Authorization token is required' });
//     }

//     // Retrieve all steps data from the request body
//     const { step1, step2, step3, step4, step5 } = req.body;

//     // Check for uploaded files
//     console.log('Uploaded files:', req.files); // Log the received files

//    const memberImages = req.files && typeof req.files === 'object' && 'memberImage' in req.files
//   ? (req.files['memberImage'] as Express.Multer.File[]) // Cast to the expected type
//   : []; // Default to an empty array if undefined

// const predeceasedImages = req.files && typeof req.files === 'object' && 'predeceasedImage' in req.files
//   ? (req.files['predeceasedImage'] as Express.Multer.File[])
//   : [];

// const files = req.files && typeof req.files === 'object' && 'file' in req.files
//   ? (req.files['file'] as Express.Multer.File[])
//   : [];


//     // Log the paths of the uploaded images
//     console.log('Member Images:', memberImages.map(file => file.path));
//     console.log('Predeceased Images:', predeceasedImages.map(file => file.path));
//     console.log('Files:', files.map(file => file.path));

//     // Find existing step data for the user
//     const existingStep = await Step.findOne({ userId });

//     if (existingStep) {
//       // Combine existing step data with the new step data
//       existingStep.step1 = step1 || existingStep.step1;
//       existingStep.step2 = step2 || existingStep.step2;
//       existingStep.step3 = step3 || existingStep.step3;
//       existingStep.step4 = step4 || existingStep.step4;
//       existingStep.step5 = step5 || existingStep.step5;

//       existingStep.step2.family.survivingFamilyMembers = existingStep.step2.family.survivingFamilyMembers?.map((member, index) => ({
//         ...member,
//         memberImage: memberImages[index]?.path || member.memberImage,
//       })) || [];

//       existingStep.step2.family.predeceasedFamilyMembers = existingStep.step2.family.predeceasedFamilyMembers?.map((member, index) => ({
//         ...member,
//         memberImage: predeceasedImages[index]?.path || member.memberImage,
//       })) || [];

//       existingStep.step5.mediaFiles = existingStep.step5.mediaFiles || [];
//       existingStep.step5.mediaFiles = existingStep.step5.mediaFiles.concat(
//         files.map(file => ({ file: file.path, date: new Date().toISOString() }))
//       );

//       await existingStep.save();

//       return res.status(200).json({ message: 'Steps data updated successfully', steps: existingStep });
//     } else {
//       // Create new step data with all available steps
//       const newStep = new Step({
//         userId,
//         step1,
//         step2,
//         step3,
//         step4,
//         step5,
//         memberImages: memberImages.map(file => file.path),
//         predeceasedImages: predeceasedImages.map(file => file.path),
//         files: files.map(file => file.path),
//       });

//       await newStep.save();

//       return res.status(201).json({ message: 'Steps data created successfully', steps: newStep });
//     }
//   } catch (error) {
//     console.error('Error in createOrUpdateStep:', error);
//     const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
//     return res.status(500).json({ message: errorMessage });
//   }
// };






// import { Request, Response } from 'express';
// import Step from '../models/stepform.model';
// import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';

// // Define the type for uploaded files
// interface UploadedFiles {
//   memberImage?: Express.Multer.File[];
//   predeceasedImage?: Express.Multer.File[];
//   file?: Express.Multer.File[];
// }

// export const createOrUpdateStep = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
//     const userId = extractUserIdFromToken(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()));

//     if (!userId) {
//       return res.status(401).json({ message: 'Authorization token is required' });
//     }

//     // Retrieve all steps data from the request body
//     const { step1, step2, step3, step4, step5 } = req.body;

//     // Check for uploaded files
//     const uploadedFiles: UploadedFiles = req.files as UploadedFiles;
//     console.log('Uploaded files:', uploadedFiles); // Log the received files

//     const memberImages = uploadedFiles.memberImage || [];
//     const predeceasedImages = uploadedFiles.predeceasedImage || [];
//     const files = uploadedFiles.file || [];

//     // Log the paths of the uploaded images
//     console.log('Member Images:', memberImages.map(file => file.path));
//     console.log('Predeceased Images:', predeceasedImages.map(file => file.path));
//     console.log('Files:', files.map(file => file.path));

//     // Find existing step data for the user
//     const existingStep = await Step.findOne({ userId });

//     if (existingStep) {
//       // Combine existing step data with the new step data
//       existingStep.step1 = step1 || existingStep.step1;
//       existingStep.step2 = step2 || existingStep.step2;
//       existingStep.step3 = step3 || existingStep.step3;
//       existingStep.step4 = step4 || existingStep.step4;
//       existingStep.step5 = step5 || existingStep.step5;

//       // Update surviving family members' images
//      // Ensure survivingFamilyMembers array exists before pushing images
// if (existingStep.step2?.family?.survivingFamilyMembers) {
//   memberImages.forEach((image) => {
//     existingStep.step2.family.survivingFamilyMembers!.push({
//       memberImage: image.path,
//     });
//   });
// } else {
//   // Initialize the array if it doesn't exist
//   existingStep.step2.family.survivingFamilyMembers = memberImages.map((image) => ({
//     memberImage: image.path,
//   }));
// }

// // Ensure predeceasedFamilyMembers array exists before pushing images
// if (existingStep.step2?.family?.predeceasedFamilyMembers) {
//   predeceasedImages.forEach((image) => {
//     existingStep.step2.family.predeceasedFamilyMembers!.push({
//       memberImage: image.path,
//     });
//   });
// } else {
//   // Initialize the array if it doesn't exist
//   existingStep.step2.family.predeceasedFamilyMembers = predeceasedImages.map((image) => ({
//     memberImage: image.path,
//   }));
// }

// // Log to confirm the images are being pushed into the arrays
// console.log('Updated Surviving Family Members:', existingStep.step2.family.survivingFamilyMembers);
// console.log('Updated Predeceased Family Members:', existingStep.step2.family.predeceasedFamilyMembers);

// // Save the updated step

//       // Update media files
//       existingStep.step5.mediaFiles = existingStep.step5.mediaFiles || [];
//       existingStep.step5.mediaFiles.push(...files.map(file => ({ file: file.path, date: new Date().toISOString() })));

//       await existingStep.save();

//       return res.status(200).json({ message: 'Steps data updated successfully', steps: existingStep });
//     } else {
//       return res.status(404).json({ message: 'No existing steps found for the user' });
//     }
//   } catch (error) {
//     console.error('Error in createOrUpdateStep:', error);
//     const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
//     return res.status(500).json({ message: errorMessage });
//   }
// };


import { Request, Response } from 'express';
import Step from '../models/stepform.model';
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';

interface UploadedFiles {
  memberImage?: Express.Multer.File[];
  predeceasedImage?: Express.Multer.File[];
  file?: Express.Multer.File[];
}

export const createOrUpdateStep = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    const userId = extractUserIdFromToken(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()));

    if (!userId) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Retrieve all steps data from the request body
    const { step1, step2, step3, step4, step5 } = req.body;

    // Check if files are available in the request
    const uploadedFiles: UploadedFiles = req.files ? (req.files as UploadedFiles) : {};

    const memberImages = uploadedFiles.memberImage || [];
    const predeceasedImages = uploadedFiles.predeceasedImage || [];
    const files = uploadedFiles.file || [];

    // Log file information if available
    if (memberImages.length) {
      console.log('Member Images:', memberImages.map(file => file.path));
    } else {
      console.log('No member images uploaded');
    }

    if (predeceasedImages.length) {
      console.log('Predeceased Images:', predeceasedImages.map(file => file.path));
    } else {
      console.log('No predeceased images uploaded');
    }

    if (files.length) {
      console.log('Files:', files.map(file => file.path));
    } else {
      console.log('No files uploaded');
    }

    // Find existing step data for the user
    const existingStep = await Step.findOne({ userId });

    if (existingStep) {
      // Update existing step with new data or retain existing data if not provided
      existingStep.step1 = step1 || existingStep.step1;
      existingStep.step2 = step2 || existingStep.step2;
      existingStep.step3 = step3 || existingStep.step3;
      existingStep.step4 = step4 || existingStep.step4;
      existingStep.step5 = step5 || existingStep.step5;

      // Handle images for surviving family members
      if (existingStep.step2?.family?.survivingFamilyMembers) {
        memberImages.forEach((image) => {
          existingStep.step2.family.survivingFamilyMembers!.push({ memberImage: image.path });
        });
      } else if (memberImages.length > 0) {
        existingStep.step2.family.survivingFamilyMembers = memberImages.map((image) => ({
          memberImage: image.path,
        }));
      }

      // Handle images for predeceased family members
      if (existingStep.step2?.family?.predeceasedFamilyMembers) {
        predeceasedImages.forEach((image) => {
          existingStep.step2.family.predeceasedFamilyMembers!.push({ memberImage: image.path });
        });
      } else if (predeceasedImages.length > 0) {
        existingStep.step2.family.predeceasedFamilyMembers = predeceasedImages.map((image) => ({
          memberImage: image.path,
        }));
      }

      // Update media files
      existingStep.step5.mediaFiles = existingStep.step5.mediaFiles || [];
      existingStep.step5.mediaFiles.push(...files.map(file => ({ file: file.path, date: new Date().toISOString() })));

      // Save the updated step
      await existingStep.save();
      return res.status(200).json({ message: 'Steps data updated successfully', steps: existingStep });
    } else {
      // If no existing steps found, create a new step
      const newStepData: any = {
        userId,
        step1,
        step2,
        step3,
        step4,
        step5,
      };

      // Handle surviving family members' images
      if (memberImages.length > 0) {
        newStepData.step2.family.survivingFamilyMembers = memberImages.map((image) => ({
          memberImage: image.path,
        }));
      }

      // Handle predeceased family members' images
      if (predeceasedImages.length > 0) {
        newStepData.step2.family.predeceasedFamilyMembers = predeceasedImages.map((image) => ({
          memberImage: image.path,
        }));
      }

      // Handle media files
      if (files.length > 0) {
        newStepData.step5.mediaFiles = files.map((file) => ({
          file: file.path,
          date: new Date().toISOString(),
        }));
      }

      // Create the new step
      const newStep = new Step(newStepData);
      await newStep.save();

      return res.status(201).json({ message: 'Steps data created successfully', steps: newStep });
    }
  } catch (error) {
    console.error('Error in createOrUpdateStep:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ message: errorMessage });
  }
};



// get request for this api 
export const getStep = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract the token from cookies or headers
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Extract the userId from the token
    const userId = extractUserIdFromToken(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()));

    if (!userId) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Fetch the step data for the user
    const userStepData = await Step.findOne({ userId });

    // If no steps are found, return a 404 response
    if (!userStepData) {
      return res.status(404).json({ message: 'No step data found for the user' });
    }

    // Return the step data
    return res.status(200).json({ message: 'Step data retrieved successfully', steps: userStepData });

  } catch (error) {
    console.error('Error in getStep:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ message: errorMessage });
  }
};