import { Request, Response } from 'express';
import DigitalRemembranceBook from '../models/digitalRemembranceBook.model';
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';

export const createDigitalRemembranceBook = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract userId from the token
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token;
    const userId = extractUserIdFromToken(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()));

    if (!userId) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    // Extract the recordId from URL params
    const { recordId } = req.params;  // Get the recordId from the URL parameter
    const { imagesData } = req.body; // Assuming imagesData is an array of { description, date }
    
    console.log('Record ID:', recordId);  // Log the record ID for debugging
    console.log('Images Data:', imagesData);  // Log the images data for debugging
    
    // Validate if data is present
    if (!recordId || !imagesData || !Array.isArray(imagesData) || imagesData.length === 0) {
      return res.status(400).json({ message: 'Record ID and images data are required' });
    }

    // Ensure req.files is of type { [fieldname: string]: File[] }
    let images: Express.Multer.File[] = [];

    if (Array.isArray(req.files)) {
      // req.files is an array of files (not the object form)
      return res.status(400).json({ message: 'Please upload files in the correct format' });
    } else if (req.files && req.files['image']) {
      // req.files is an object and contains the 'image' field
      images = req.files['image'] as Express.Multer.File[];
    } else {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Collect image URLs from Cloudinary and map them with description and date
    const imageUrls = images.map((image, index) => ({
      imageUrl: image.path, // Image URL from Cloudinary
      description: imagesData[index]?.description, // Description from the frontend
      date: imagesData[index]?.date // Date from the frontend
    }));

    // Create the Digital Remembrance Book record
    const newBook = new DigitalRemembranceBook({
      userId,
      recordId,  // Associate with the specific record ID
      images: imageUrls  // Attach images directly to the record
    });

    // Save the new record to the database
    const savedBook = await newBook.save();

    return res.status(201).json({
      message: 'Digital Remembrance Book created successfully',
      book: savedBook
    });
  } catch (error) {
    console.error('Error creating Digital Remembrance Book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const getDigitalRemembranceBookByRecordId = async (req: Request, res: Response): Promise<Response> => {
    try {
      // Extract the recordId from the URL parameters
      const { recordId } = req.params;
      
      // Validate if recordId is provided
      if (!recordId) {
        return res.status(400).json({ message: 'Record ID is required' });
      }
  
      // Find the Digital Remembrance Book by the recordId
      const remembranceBook = await DigitalRemembranceBook.findOne({ recordId }).populate('userId', 'name email'); // Optional: Populate userId with name and email
  
      if (!remembranceBook) {
        return res.status(404).json({ message: 'Digital Remembrance Book not found for this record ID' });
      }
  
      return res.status(200).json({
        message: 'Digital Remembrance Book fetched successfully',
        remembranceBook
      });
    } catch (error) {
      console.error('Error fetching Digital Remembrance Book:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };