import { Request, Response } from 'express'
import Step from '../models/stepform.model'
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken'
import CombinedForm from '../models/stepform.model'

interface UploadedFiles {
  memberImage?: Express.Multer.File[]
  file?: Express.Multer.File[]
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

    // Log surviving family if present
    const survivingFamily = parsedData.family?.survivingFamily || []
    const predeceasedFamily = parsedData.family?.predeceasedFamily || []
    const mediaFiles = parsedData.mediaFiles || []

    console.log('Surviving family:', survivingFamily)

    const uploadedFiles: UploadedFiles = (req.files as UploadedFiles) || {}
    const memberImages = uploadedFiles.memberImage || []
    const files = uploadedFiles.file || []
    console.log('result from request . file:', req.file)

    // console.log('Files received:', files);
    // console.log('Member Images:', memberImages);
    console.log('File Images from frontend:', files)

    // Map member images to surviving family members
    const updatedSurvivingFamily = survivingFamily.map((member, index) => ({
      ...member,
      memberImage: memberImages[index]?.path || null // Set the path if it exists
    }))
    const updatedpredeceasedFamily = predeceasedFamily.map((member, index) => ({
      ...member,
      memberImage: memberImages[index]?.path || null // Set the path if it exists
    }))

    const updatedmediaFiles = mediaFiles.map((file, index) => ({
      ...file,
      file: files[index]?.path || null // Set the path if it exists
    }))

    // tried this one too
    // const validFiles = parsedData.mediaFiles?.map(mediaFile => ({
    //   file: mediaFile.file || null,
    //   date: mediaFile.date || new Date().toISOString(),
    //   note: mediaFile.note || '',
    // })).filter(mediaFile => mediaFile.file) || [];
    // Create or update the step data
    const existingStep = await Step.findOneAndUpdate(
      { userId },
      {
        $set: {
          basicInfo: parsedData.basicInfo,
          family: {
            ...parsedData.family,
            survivingFamily: updatedSurvivingFamily,
            predeceasedFamily: updatedpredeceasedFamily // Update with new member images
          },
          memorialServices: parsedData.memorialServices,
          personalDetails: parsedData.personalDetails,
          mediaFiles: {
            ...parsedData.mediaFiles,
            files: updatedmediaFiles
          },
          status: parsedData.status
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
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // Fetch all step data with pagination
    const allSteps = await Step.find().select('basicInfo status')

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

// getrequest for getting all data based on obituary record id

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
