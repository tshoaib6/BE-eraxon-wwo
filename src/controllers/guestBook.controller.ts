import { Request, Response } from 'express';
import GuestBook from '../models/guestBook.model'; // Adjust the path as needed
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken'; // Adjust the path as needed

export const createGuestBookEntry = async (req: Request, res: Response) => {
  try {
    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization token is required' });
    }

    // Decode the token to extract userId
    const decodedPayload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    const userId = extractUserIdFromToken(decodedPayload);

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Extract data from the request body
    const { message, relationToDeceased } = req.body;

    if (!message || !relationToDeceased) {
      return res
        .status(400)
        .json({ message: 'Message and relationToDeceased are required' });
    }

    // Check if an image was uploaded
    const imageUrl = req.file?.path || null;

    // Create a new GuestBook entry
    const guestBookEntry = new GuestBook({
      message,
      relationToDeceased,
      image: imageUrl, // Save the uploaded image URL
      user: userId, // Associate the entry with the extracted userId
    });

    // Save the entry to the database
    const savedEntry = await guestBookEntry.save();

    return res.status(201).json({
      message: 'GuestBook entry created successfully',
      data: savedEntry,
    });
  } catch (error) {
    console.error('Error creating GuestBook entry:', error);
    return res
      .status(500)
      .json({ message: 'Failed to create GuestBook entry' });
  }
};



// Get All GuestBook Entries
export const getGuestBookEntries = async (req: Request, res: Response) => {
    try {
      // Fetch all entries from the database and populate user data (firstName, lastName)
      const entries = await GuestBook.find().populate('user', 'firstName lastName'); // Specify the fields you want to populate
  
      if (entries.length === 0) {
        return res.status(404).json({ message: 'No guestbook entries found' });
      }
  
      return res.status(200).json({
        message: 'GuestBook entries retrieved successfully',
        data: entries,
      });
    } catch (error) {
      console.error('Error fetching GuestBook entries:', error);
      return res.status(500).json({ message: 'Failed to retrieve GuestBook entries' });
    }
  };
