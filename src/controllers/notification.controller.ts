// controllers/notification.controller.ts

import { Request, Response } from 'express';
import Notification from '../models/notification.model'; // Ensure your Notification model is correctly imported
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken'; // Adjust the import according to your project structure
import jwt from 'jsonwebtoken'; // Ensure you have jsonwebtoken installed

// Handler to create a new notification
export const createNotificationHandler = async (req: Request, res: Response): Promise<Response> => {
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


    const { title, description, url, type } = req.body;

    // Validate input data
    if (!title || !description || !url || !type) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Create a new notification instance
        const notification = new Notification({
            user: userId,
            title,
            description,
            url,
            type,
            status: 'unread', // Default status
            createdAt: new Date(), // Automatically set the created date
        });

        // Save the notification to the database
        await notification.save();

        return res.status(201).json({ message: 'Notification created successfully', notification });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to create notification' });
    }
};


// get api 
// notification.controller.ts


interface DecodedToken {
  userId: string;
}

// Get notifications with unread count for the user
// export const getNotifications = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized: No token provided' });
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as DecodedToken;
//     const userId = decoded.userId;

//     if (!userId) {
//       return res.status(401).json({ message: 'Invalid or expired token' });
//     }

//     // Fetch notifications for the user, sorted by creation date
//     const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
//     const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

//     return res.status(200).json({
//       message: 'Notifications fetched successfully',
//       notifications,
//       unreadCount,
//     });
//   } catch (error) {
//     console.error('Error in getNotifications:', error);
//     const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
//     return res.status(500).json({ message: errorMessage });
//   }
// };





// populated profilePic from user 
export const getNotifications = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Fetch notifications for the user, sorted by creation date, and populate profilePic
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'profilePic'); // Populate only the profilePic field from the User model

    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    return res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ message: errorMessage });
  }
};









// Mark a notification as read or mark all as read
export const markNotificationAsRead = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    if (id) {
      const notification = await Notification.findOneAndUpdate(
        { _id: id },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      return res.status(200).json({
        message: 'Notification marked as read',
        notification,
      });
    } else {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as DecodedToken;
      const userId = decoded.userId;

      const result = await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'No unread notifications found' });
      }

      return res.status(200).json({
        message: 'All notifications marked as read',
      });
    }
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
