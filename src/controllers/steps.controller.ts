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

//     const stepData = {
//       userId,
//       ...req.body, // This should include all steps data from the request body
//     };

//     // Check if the step document already exists
//     const existingStep = await Step.findOne({ userId });
    
//     if (existingStep) {
//       // Update existing step data
//       Object.assign(existingStep, stepData);
//       await existingStep.save();
//       return res.status(200).json({ message: 'Step data updated successfully', step: existingStep });
//     } else {
//       // Create new step data
//       const newStep = new Step(stepData);
//       await newStep.save();
//       return res.status(201).json({ message: 'Step data created successfully', step: newStep });
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

export const createOrUpdateStep = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    const userId = extractUserIdFromToken(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()));

    if (!userId) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Retrieve all steps data from the request body
    const { step1, step2, step3, step4, step5 } = req.body;

    // Find existing step data for the user
    const existingStep = await Step.findOne({ userId });

    if (existingStep) {
      // Combine existing step data with the new step data (accumulate steps)
      existingStep.step1 = step1 || existingStep.step1;
      existingStep.step2 = step2 || existingStep.step2;
      existingStep.step3 = step3 || existingStep.step3;
      existingStep.step4 = step4 || existingStep.step4;
      existingStep.step5 = step5 || existingStep.step5;

      await existingStep.save();

      return res.status(200).json({ message: 'Steps data updated successfully', steps: existingStep });
    } else {
      // Create new step data with all available steps
      const newStep = new Step({
        userId,
        step1,
        step2,
        step3,
        step4,
        step5,
      });

      await newStep.save();

      return res.status(201).json({ message: 'Steps data created successfully', steps: newStep });
    }
  } catch (error) {
    console.error('Error in createOrUpdateStep:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ message: errorMessage });
  }
};
