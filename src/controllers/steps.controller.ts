import { Request, Response } from 'express'
import Step from '../models/stepform.model'
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken'
import CombinedForm from '../models/stepform.model'

interface UploadedFiles {
  memberImage?: Express.Multer.File[]
  predeceasedImage?: Express.Multer.File[]
  file?: Express.Multer.File[]
}

export const createOrUpdateStep = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token =
      req.cookies?.token || req.headers['authorization']?.split(' ')[1]
    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    )

    if (!userId) {
      return res
        .status(401)
        .json({ message: 'Authorization token is required' })
    }

    // Parse the nested data JSON if it's present
    let parsedData
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

    const { step1, step2, step3, step4, step5, status } = parsedData
    const uploadedFiles: UploadedFiles = (req.files as UploadedFiles) || {}
    const memberImages = uploadedFiles.memberImage || []
    const files = uploadedFiles.file || []

    console.log('Files received:', files)
    console.log('Member Images:', memberImages)

    const existingStep = await Step.findOneAndUpdate(
      { userId },
      {
        $set: {
          step1,
          step2,
          step3,
          step4,
          step5,
          status
        },
        $push: {
          'step2.family.survivingFamily': {
            $each: memberImages.map(image => ({ memberImage: image.path }))
          },
          'step5.mediaFiles': {
            $each: files.map(file => ({
              file: file.path,
              date: new Date().toISOString()
            }))
          }
        }
      },
      { new: true, upsert: true }
    )

    return res.status(existingStep ? 200 : 201).json({
      message: existingStep
        ? 'Steps data updated successfully'
        : 'Steps data created successfully',
      steps: existingStep
    })
  } catch (error) {
    console.error('Error in createOrUpdateStep:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error'
    return res.status(500).json({ message: errorMessage })
  }
}














// below are get apis 

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

    // Include the status of each step data
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

// get api with pagination without user id

export const getStep = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // Fetch all step data with pagination
    const allSteps = await Step.find().select('step1.basicInfo status')

    if (!allSteps || allSteps.length === 0) {
      return res.status(404).json({ message: 'No step data found' })
    }

    // Shuffle the results randomly
    const shuffledSteps = allSteps.sort(() => 0.5 - Math.random())

    // Slice the shuffled results to implement pagination
    const paginatedSteps = shuffledSteps.slice(skip, skip + limit)

    // Count total records for pagination
    const totalRecords = allSteps.length

    return res.status(200).json({
      message: 'Step data retrieved successfully',
      steps: paginatedSteps,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit), // Total pages
        totalRecords // Total number of records
      }
    })
  } catch (error) {
    console.error('Error in getStep:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error'
    return res.status(500).json({ message: errorMessage })
  }
}

// getrequest for getting all data based on obituary record id

export const getRecordById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { recordId } = req.params // Get the record ID from the request parameters

    // Find the record by ID
    const recordData = await CombinedForm.findById(recordId)

    if (!recordData) {
      return res
        .status(404)
        .json({ message: 'No record found for the provided ID' })
    }

    return res.status(200).json({
      message: 'Record data retrieved successfully',
      record: recordData // Return all step data for the specified ID
    })
  } catch (error) {
    console.error('Error in getRecordById:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error'
    return res.status(500).json({ message: errorMessage })
  }
}
