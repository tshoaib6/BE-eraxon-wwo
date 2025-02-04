import { Request, Response } from "express";
import Step from "../models/stepform.model";
import { extractUserIdFromToken } from "../utils/extractUserIdFromToken";
import CombinedForm from "../models/stepform.model";

interface UploadedFiles {
  memberImage?: Express.Multer.File[];
  file?: Express.Multer.File[];
}

interface FamilyMember {
  memberName?: string;
  relation: string;
  note?: string;
  memberImage?: string;
}

interface ParsedData {
  basicInfo: object;
  family: {
    survivingFamily: FamilyMember[];
    predeceasedFamily?: FamilyMember[];
  };
  memorialServices?: object;
  personalDetails?: object;
  mediaFiles?: { file?: string; date?: string; note?: string }[];
  status?: string;
}

interface RequestWithBody extends Request {
  body: {
    data?: string;
  };
}

export const createOrUpdateStep = async (
  req: RequestWithBody,
  res: Response
): Promise<Response> => {
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);
  try {
    const token =
      req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    );

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    let parsedData: ParsedData;
    if (req.body.data) {
      try {
        parsedData = JSON.parse(req.body.data);
        console.log("Parsed data:", parsedData);
      } catch (parseError) {
        console.error("Error parsing req.body.data:", parseError);
        return res.status(400).json({ message: "Invalid data format" });
      }
    } else {
      return res.status(400).json({ message: "Data field is required" });
    }

    const survivingFamily = parsedData.family?.survivingFamily || [];
    const predeceasedFamily = parsedData.family?.predeceasedFamily || [];
    const mediaFiles = Array.isArray(parsedData.mediaFiles)
      ? parsedData.mediaFiles
      : []; // Ensure mediaFiles is always an array

    console.log("Surviving family:", survivingFamily);

    const uploadedFiles: UploadedFiles = (req.files as UploadedFiles) || {};
    const memberImages = uploadedFiles.memberImage || [];
    const files = uploadedFiles.file || [];
    console.log("File Images from frontend:", files);

    // Map member images to surviving family members
    const updatedSurvivingFamily = survivingFamily.map((member, index) => ({
      ...member,
      memberImage: memberImages[index]?.path || member?.memberImage || null,
    }));
    const updatedPredeceasedFamily = predeceasedFamily.map((member, index) => ({
      ...member,
      memberImage: memberImages[index]?.path || member?.memberImage || null,
    }));

    const updatedmediaFiles = Array.isArray(mediaFiles)
      ? mediaFiles.map((file, index) => ({
          ...file,
          file: files[index]?.path || file?.file || null,
        }))
      : [];

    const existingStep = await Step.findOneAndUpdate(
      { userId },
      {
        $set: {
          basicInfo: parsedData.basicInfo,
          family: {
            ...parsedData.family,
            survivingFamily: updatedSurvivingFamily,
            predeceasedFamily: updatedPredeceasedFamily,
          },
          memorialServices: parsedData.memorialServices,
          personalDetails: parsedData.personalDetails,
          mediaFiles: updatedmediaFiles, // Remove spreading and ensure array
          status: parsedData.status || "submitted",
        },
      },
      { new: true, upsert: true }
    );

    return res.status(existingStep ? 200 : 201).json({
      message: existingStep
        ? "Steps data updated successfully"
        : "Steps data created successfully",
      steps: existingStep,
    });
  } catch (error) {
    console.error("Error in createOrUpdateStep:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ message: errorMessage });
  }
};

export const getStepDataByUserID = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token =
      req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    );
    if (!userId) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const userStepData = await Step.findOne({ userId });

    if (!userStepData) {
      return res
        .status(404)
        .json({ message: "No step data found for the user" });
    }

    return res.status(200).json({
      message: "Step data retrieved successfully",
      steps: userStepData,
      status: userStepData.status || "drafted",
    });
  } catch (error) {
    console.error("Error in getStep:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ message: errorMessage });
  }
};

export const getStep = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Fetch all step data with pagination
    const allSteps = await Step.find().select(
      "basicInfo status personalDetails"
    );

    if (!allSteps || allSteps.length === 0) {
      return res.status(404).json({ message: "No step data found" });
    }

    // Shuffle the results randomly
    const shuffledSteps = allSteps.sort(() => 0.5 - Math.random());

    // Slice the shuffled results to implement pagination
    const paginatedSteps = shuffledSteps.slice(skip, skip + limit);

    const totalRecords = allSteps.length;

    return res.status(200).json({
      message: "Step data retrieved successfully",
      steps: paginatedSteps,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
      },
    });
  } catch (error) {
    console.error("Error in getStep:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ message: errorMessage });
  }
};

export const getRecordById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { recordId } = req.params;

    const recordData = await CombinedForm.findById(recordId);

    if (!recordData) {
      return res
        .status(404)
        .json({ message: "No record found for the provided ID" });
    }

    return res.status(200).json({
      message: "Record data retrieved successfully",
      record: recordData,
    });
  } catch (error) {
    console.error("Error in getRecordById:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ message: errorMessage });
  }
};
export const searchAndSortRecords = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      firstNameOfDeceased,
      lastNameOfDeceased,
      country,
      city,
      dateOfBirth,
      dateOfDeath,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = req.query;

    // Initialize search criteria
    const searchCriteria: any = {};

    // Log incoming query parameters for debugging
    console.log("Received Query Parameters:", req.query);

    // Handle first and last name separately with regex
    if (firstNameOfDeceased) {
      searchCriteria["basicInfo.firstNameOfDeceased"] = {
        $regex: `^${firstNameOfDeceased}`,
        $options: "i",
      };
    }
    if (lastNameOfDeceased) {
      searchCriteria["basicInfo.lastNameOfDeceased"] = {
        $regex: `^${lastNameOfDeceased}`,
        $options: "i",
      };
    }

    // If previously the data was stored as a full name, we need to search in `nameOfDeceased` as well
    if (firstNameOfDeceased || lastNameOfDeceased) {
      searchCriteria["basicInfo.firstNameOfDeceased"] = {
        $regex: `${firstNameOfDeceased || ""} ${
          lastNameOfDeceased || ""
        }`.trim(),
        $options: "i",
      };
    }

    // Search by country and city using regex for partial matches
    if (country) {
      searchCriteria["memorialServices.country"] = {
        $regex: country,
        $options: "i",
      };
    }
    if (city) {
      searchCriteria["memorialServices.city"] = { $regex: city, $options: "i" };
    }

    // Exact match for date fields
    if (dateOfBirth) {
      const dobString = new Date(dateOfBirth as string)
        .toISOString()
        .split("T")[0];
      searchCriteria["basicInfo.dateOfBirth"] = dobString;
    }
    if (dateOfDeath) {
      const dodString = new Date(dateOfDeath as string)
        .toISOString()
        .split("T")[0];
      searchCriteria["basicInfo.dateOfDeath"] = dodString;
    }

    // Define sorting options
    const sortOptions: any = {};
    if (sortBy) {
      const sortFieldMap: Record<string, string> = {
        firstNameOfDeceased: "basicInfo.firstNameOfDeceased",
        lastNameOfDeceased: "basicInfo.lastNameOfDeceased",
        country: "memorialServices.country",
        city: "memorialServices.city",
        dateOfBirth: "basicInfo.dateOfBirth",
        dateOfDeath: "basicInfo.dateOfDeath",
      };

      const sortField = sortFieldMap[sortBy as string];
      if (sortField) {
        sortOptions[sortField] = sortOrder === "desc" ? -1 : 1;
      }
    }

    // Pagination settings
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = isNaN(Number(limit)) ? 10 : Number(limit); // Default to 10 if invalid limit
    const skip = (pageNumber - 1) * pageSize;

    // Log the final search criteria for debugging
    console.log("Search Criteria:", searchCriteria);

    // Fetch records with pagination
    const records = await CombinedForm.find(searchCriteria)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // Total records count for pagination
    const totalRecords = await CombinedForm.countDocuments(searchCriteria);

    return res.status(200).json({
      message: "Records retrieved successfully",
      records,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
        totalRecords,
      },
    });
  } catch (error) {
    console.error("Error in searchAndSortRecords:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ message: errorMessage });
  }
};
