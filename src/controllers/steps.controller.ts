import { Request, Response } from 'express'
import Step from '../models/stepform.model'
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken'
import CombinedForm from '../models/stepform.model'

interface UploadedFiles {
  memberImage?: Express.Multer.File[] // Handle member image files
  file?: Express.Multer.File[] // Handle media files
}

interface FamilyMember {
  memberName?: string
  relation: string
  note?: string
  memberImage?: string
}

interface ParsedData {
  basicInfo: object
  family: {
    survivingFamily: FamilyMember[]
    predeceasedFamily?: FamilyMember[]
  }
  memorialServices?: object
  personalDetails?: object
  mediaFiles?: { file?: string; date?: string; note?: string }[]
  status?: string
}

interface RequestWithBody extends Request {
  body: {
    data?: string
  }
}

export const createOrUpdateStep = async (
  req: RequestWithBody,
  res: Response
): Promise<Response> => {
  console.log('Request Body:', req.body)
  console.log('Uploaded Files:', req.files)
  try {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1]
    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    )

    if (!userId) {
      return res.status(401).json({ message: 'Authorization token is required' })
    }

    let parsedData: ParsedData
    if (req.body.data) {
      try {
        parsedData = JSON.parse(req.body.data)
        console.log('Parsed data:', parsedData)
      } catch (parseError) {
        console.error('Error parsing req.body.data:', parseError)
        return res.status(400).json({ message: 'Invalid data format' })
      }
    } else {
      return res.status(400).json({ message: 'Data field is required' })
    }

    const survivingFamily = parsedData.family?.survivingFamily || []
    const predeceasedFamily = parsedData.family?.predeceasedFamily || []
    const mediaFiles = Array.isArray(parsedData.mediaFiles) ? parsedData.mediaFiles : []

    console.log('Surviving family:', survivingFamily)

    const uploadedFiles: UploadedFiles = (req.files as UploadedFiles) || {}
    const memberImages = uploadedFiles.memberImage || []
    const files = uploadedFiles.file || []
    console.log('File Images from frontend:', files)

    // Map member images to surviving family members
    const updatedSurvivingFamily = survivingFamily.map((member, index) => ({
      ...member,
      memberImage: memberImages[index]?.path || member?.memberImage || null
    }))
    const updatedPredeceasedFamily = predeceasedFamily.map((member, index) => ({
      ...member,
      memberImage: memberImages[index]?.path || member?.memberImage || null
    }))

    const updatedmediaFiles = Array.isArray(mediaFiles)
      ? mediaFiles.map((file, index) => ({
          ...file,
          file: files[index]?.path || file?.file || null
        }))
      : []

    // Check if an existing draft form exists for the user
    let existingStep = await Step.findOne({ userId, status: 'drafted' })

    if (existingStep) {
      // Update the existing draft with the new data
      existingStep = await Step.findOneAndUpdate(
        { _id: existingStep._id },
        {
          $set: {
            basicInfo: parsedData.basicInfo,
            family: {
              ...parsedData.family,
              survivingFamily: updatedSurvivingFamily,
              predeceasedFamily: updatedPredeceasedFamily
            },
            memorialServices: parsedData.memorialServices,
            personalDetails: parsedData.personalDetails,
            mediaFiles: updatedmediaFiles, 
            status: parsedData.status || 'drafted' // Keep status as drafted
          }
        },
        { new: true }
      )

      return res.status(200).json({
        message: 'Draft form updated successfully',
        steps: existingStep
      })
    } else {
      // No draft form exists, create a new one
      const newStep = new Step({
        userId,
        basicInfo: parsedData.basicInfo,
        family: {
          ...parsedData.family,
          survivingFamily: updatedSurvivingFamily,
          predeceasedFamily: updatedPredeceasedFamily
        },
        memorialServices: parsedData.memorialServices,
        personalDetails: parsedData.personalDetails,
        mediaFiles: updatedmediaFiles,
        status: parsedData.status || 'drafted' // Set status as drafted by default
      })

      const savedStep = await newStep.save()

      return res.status(201).json({
        message: 'New form created successfully',
        steps: savedStep
      })
    }

  } catch (error) {
    console.error('Error in createOrUpdateStep:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
    return res.status(500).json({ message: errorMessage })
  }
}



// extra code 
// export const createOrUpdateStep = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     console.log('Request Body:', req.body);
//     const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
//     const userId = extractUserIdFromToken(
//       JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
//     );

//     if (!userId) {
//       return res.status(401).json({ message: 'Authorization token is required' });
//     }

//     // Ensure the data is parsed properly from the JSON string
//     let parsedData: any;
//     if (req.body.data) {
//       try {
//         parsedData = JSON.parse(req.body.data);
//         console.log('Parsed data:', parsedData);
//       } catch (parseError) {
//         console.error('Error parsing req.body.data:', parseError);
//         return res.status(400).json({ message: 'Invalid data format' });
//       }
//     } else {
//       return res.status(400).json({ message: 'Data field is required' });
//     }

//     // Extract and transform the data
//     const survivingFamily: FamilyMember[] = parsedData.step1?.family?.survivingFamily || [];
//     const predeceasedFamily: FamilyMember[] = parsedData.step1?.family?.predeceasedFamily || [];
//     const mediaFiles = Array.isArray(parsedData.step1?.mediaFiles) ? parsedData.step1.mediaFiles : [];

//     // Handle the uploaded files
//     const uploadedFiles: UploadedFiles = (req.files as UploadedFiles) || {};
//     const memberImages = uploadedFiles.memberImage || [];
//     const files = uploadedFiles.file || [];
//     console.log('File Images from frontend:', files);

//     // Map the files to the members and mediaFiles
//     const updatedSurvivingFamily = survivingFamily.map((member: FamilyMember, index: number) => ({
//       ...member,
//       memberImage: memberImages[index]?.path || member?.memberImage
//     }));

//     const updatedPredeceasedFamily = predeceasedFamily.map((member: FamilyMember, index: number) => ({
//       ...member,
//       memberImage: memberImages[index]?.path || member?.memberImage
//     }));

//     const updatedMediaFiles = Array.isArray(mediaFiles)
//       ? mediaFiles.map((file: any, index: number) => ({
//           ...file,
//           file: files[index]?.path || file?.file
//         }))
//       : [];

//     // Prepare the step data object for saving or updating
//     const stepData = {
//       userId,
//       basicInfo: parsedData.step1?.basicInfo || {},
//       family: {
//         survivingFamily: updatedSurvivingFamily,
//         predeceasedFamily: updatedPredeceasedFamily
//       },
//       memorialServices: parsedData.step1?.memorialServices || [],
//       personalDetails: parsedData.step4?.personalDetails || {},
//       mediaFiles: updatedMediaFiles,
//       status: parsedData.status || 'submitted'
//     };

//     // Check if a step already exists for the user
//     let existingStep = await Step.findOne({ userId });

//     if (existingStep) {
//       // Update the existing step document
//       existingStep.basicInfo = stepData.basicInfo;
//       existingStep.family = stepData.family;
//       existingStep.memorialServices = stepData.memorialServices;
//       existingStep.personalDetails = stepData.personalDetails;
//       existingStep.mediaFiles = stepData.mediaFiles;
//       existingStep.status = stepData.status;

//       // Save the updated step
//       await existingStep.save();

//       return res.status(200).json({
//         message: 'Step updated successfully',
//         steps: existingStep
//       });
//     } else {
//       // Create a new step document
//       const newStep = new Step({
//         userId: stepData.userId,
//         basicInfo: stepData.basicInfo,
//         family: stepData.family,
//         memorialServices: stepData.memorialServices,
//         personalDetails: stepData.personalDetails,
//         mediaFiles: stepData.mediaFiles,
//         status: stepData.status
//       });

//       // Save the new step
//       const savedStep = await newStep.save();

//       return res.status(201).json({
//         message: 'New step created successfully',
//         steps: savedStep
//       });
//     }
//   } catch (error) {
//     console.error('Error in createOrUpdateStep:', error);
//     const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
//     return res.status(500).json({ message: errorMessage });
//   }
// };




// const extractUserIdFromToken = (decodedToken: any): string | null => {
//   return decodedToken?.userId || null;
// };

// export const createOrUpdateStep = async (req: Request, res: Response) => {
//   try {
//     // Extract token from cookies or headers
//     const token =
//       req.cookies?.token || req.headers['authorization']?.split(' ')[1];

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: 'Authorization token is required.' });
//     }

//     // Decode token to extract userId
//     const decodedToken = JSON.parse(
//       Buffer.from(token.split('.')[1], 'base64').toString()
//     );
//     const userId = extractUserIdFromToken(decodedToken);

//     if (!userId) {
//       return res
//         .status(401)
//         .json({ message: 'Invalid authorization token.' });
//     }

//     // Extract step and data from the request body
//     const { step, data } = req.body;

//     if (!step || !data) {
//       return res
//         .status(400)
//         .json({ message: 'Step and data are required in the body.' });
//     }

//     // Find the form by userId or create a new one
//     let form = await CombinedForm.findOne({ userId });

//     if (!form) {
//       form = new CombinedForm({ userId });
//     }

//     // Update the form based on the step
//     switch (step) {
//       case 'basicInfo':
//         form.basicInfo = { ...form.basicInfo, ...data };
//         break;
//       case 'family':
//         form.family = { ...form.family, ...data };
//         break;
//       case 'memorialServices':
//         form.memorialServices = data;
//         break;
//       case 'personalDetails':
//         form.personalDetails = { ...form.personalDetails, ...data };
//         break;
//       case 'mediaFiles':
//         form.mediaFiles = [...(form.mediaFiles || []), ...data];
//         break;
//       default:
//         return res.status(400).json({ message: 'Invalid step.' });
//     }

//     // Save the form
//     await form.save();

//     // Return the response in the specified format
//     return res.status(200).json({
//       message: 'Form data retrieved successfully.',
//       form: {
//         _id: form._id,
//         userId: form.userId,
//         status: form.status || 'drafted', // Default to 'drafted' if no status
//         basicInfo: form.basicInfo,
//         family: form.family,
//         memorialServices: form.memorialServices,
//         personalDetails: form.personalDetails,
//         mediaFiles: form.mediaFiles,
      
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: 'An error occurred while saving the step data.', error });
//   }
// };

export const getStepDataByUserID = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token =
      req.cookies?.token || req.headers['authorization']?.split(' ')[1]
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization token is required' })
    }

    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    )
    if (!userId) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    const userStepData = await Step.findOne({ userId })

    if (!userStepData) {
      return res
        .status(404)
        .json({ message: 'No step data found for the user' })
    }

    return res.status(200).json({
      message: 'Step data retrieved successfully',
      steps: userStepData,
      status: userStepData.status || 'drafted'
    })
  } catch (error) {
    console.error('Error in getStep:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error'
    return res.status(500).json({ message: errorMessage })
  }
}

export const getStep = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // Fetch all step data with pagination
    const allSteps = await Step.find().select('basicInfo status personalDetails')

    if (!allSteps || allSteps.length === 0) {
      return res.status(404).json({ message: 'No step data found' })
    }

    // Shuffle the results randomly
    const shuffledSteps = allSteps.sort(() => 0.5 - Math.random())

    // Slice the shuffled results to implement pagination
    const paginatedSteps = shuffledSteps.slice(skip, skip + limit)

    const totalRecords = allSteps.length

    return res.status(200).json({
      message: 'Step data retrieved successfully',
      steps: paginatedSteps,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords
      }
    })
  } catch (error) {
    console.error('Error in getStep:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error'
    return res.status(500).json({ message: errorMessage })
  }
}


export const getRecordById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { recordId } = req.params

    const recordData = await CombinedForm.findById(recordId)

    if (!recordData) {
      return res
        .status(404)
        .json({ message: 'No record found for the provided ID' })
    }

    return res.status(200).json({
      message: 'Record data retrieved successfully',
      record: recordData
    })
  } catch (error) {
    console.error('Error in getRecordById:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error'
    return res.status(500).json({ message: errorMessage })
  }
}

export const searchAndSortRecords = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      nameOfDeceased,
      country,
      city,
      dateOfBirth,
      dateOfDeath,
      sortBy,
      sortOrder,
      page = 1, // Default to page 1 if not provided
      limit = 10 // Default to 10 records per page if not provided
    } = req.query;

    const searchCriteria: any = {};

    if (nameOfDeceased) {
      searchCriteria['basicInfo.nameOfDeceased'] = { $regex: nameOfDeceased, $options: 'i' };
    }
    if (country) {
      searchCriteria['memorialServices.country'] = { $regex: country, $options: 'i' };
    }
    if (city) {
      searchCriteria['memorialServices.city'] = { $regex: city, $options: 'i' };
    }

    if (dateOfBirth) {
      const dobString = new Date(dateOfBirth as string).toISOString().split('T')[0];
      searchCriteria['basicInfo.dateOfBirth'] = dobString;
    }
    if (dateOfDeath) {
      const dodString = new Date(dateOfDeath as string).toISOString().split('T')[0];
      searchCriteria['basicInfo.dateOfDeath'] = dodString;
    }

    const sortOptions: any = {};
    if (sortBy) {
      const sortFieldMap: Record<string, string> = {
        nameOfDeceased: 'basicInfo.nameOfDeceased',
        country: 'memorialServices.country',
        city: 'memorialServices.city',
        dateOfBirth: 'basicInfo.dateOfBirth',
        dateOfDeath: 'basicInfo.dateOfDeath'
      };

      const sortField = sortFieldMap[sortBy as string];
      if (sortField) {
        sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;
      }
    }

    // Ensure `limit` is a valid number (use 10 as fallback if not)
    const pageNumber = parseInt(page as string, 10);
    const pageSize = isNaN(Number(limit)) ? 10 : Number(limit); // Default to 10 if invalid limit

    const skip = (pageNumber - 1) * pageSize;

    // Fetch records with pagination
    const records = await CombinedForm.find(searchCriteria)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // Total records count for pagination
    const totalRecords = await CombinedForm.countDocuments(searchCriteria);

    return res.status(200).json({
      message: 'Records retrieved successfully',
      records,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
        totalRecords
      }
    });
  } catch (error) {
    console.error('Error in searchAndSortRecords:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ message: errorMessage });
  }
};
