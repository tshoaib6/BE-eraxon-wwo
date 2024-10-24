
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






import { Request, Response } from 'express';
import Step from '../models/stepform.model';
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';

// Define the type for uploaded files
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

    // Check for uploaded files
    const uploadedFiles: UploadedFiles = req.files as UploadedFiles;
    console.log('Uploaded files:', uploadedFiles); // Log the received files

    const memberImages = uploadedFiles.memberImage || [];
    const predeceasedImages = uploadedFiles.predeceasedImage || [];
    const files = uploadedFiles.file || [];

    // Log the paths of the uploaded images
    console.log('Member Images:', memberImages.map(file => file.path));
    console.log('Predeceased Images:', predeceasedImages.map(file => file.path));
    console.log('Files:', files.map(file => file.path));

    // Find existing step data for the user
    const existingStep = await Step.findOne({ userId });

    if (existingStep) {
      // Combine existing step data with the new step data
      existingStep.step1 = step1 || existingStep.step1;
      existingStep.step2 = step2 || existingStep.step2;
      existingStep.step3 = step3 || existingStep.step3;
      existingStep.step4 = step4 || existingStep.step4;
      existingStep.step5 = step5 || existingStep.step5;

      // Update surviving family members' images
      if (existingStep.step2?.family?.survivingFamilyMembers) {
        existingStep.step2.family.survivingFamilyMembers = existingStep.step2.family.survivingFamilyMembers.map((member, index) => ({
          ...member,
          memberImage: memberImages[index]?.path || member.memberImage,
        }));
      }

      // Update predeceased family members' images
      if (existingStep.step2?.family?.predeceasedFamilyMembers) {
        existingStep.step2.family.predeceasedFamilyMembers = existingStep.step2.family.predeceasedFamilyMembers.map((member, index) => ({
          ...member,
          memberImage: predeceasedImages[index]?.path || member.memberImage,
        }));
      }

      // Update media files
      existingStep.step5.mediaFiles = existingStep.step5.mediaFiles || [];
      existingStep.step5.mediaFiles.push(...files.map(file => ({ file: file.path, date: new Date().toISOString() })));

      await existingStep.save();

      return res.status(200).json({ message: 'Steps data updated successfully', steps: existingStep });
    } else {
      return res.status(404).json({ message: 'No existing steps found for the user' });
    }
  } catch (error) {
    console.error('Error in createOrUpdateStep:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ message: errorMessage });
  }
};
