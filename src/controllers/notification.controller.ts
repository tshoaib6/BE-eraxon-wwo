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

export const getNotifications = async (req: Request, res: Response): Promise<Response> => {
    try {
      // Retrieve token from headers (sent from frontend)
      const token = req.headers['authorization']?.split(' ')[1]; // Token in the form "Bearer <token>"
  
      let notifications;
      
      if (token) {
        // Token exists, decode token to extract user ID
        const userId = extractUserIdFromToken(
          JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        );
  
        if (!userId) {
          return res.status(401).json({ message: 'Invalid or expired token' });
        }
  
        // Fetch notifications for the user from the database
        notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }); // Sorted by creation date
      } else {
        // No token, get all notifications
        notifications = await Notification.find().sort({ createdAt: -1 });
      }
  
      if (!notifications.length) {
        return res.status(404).json({ message: 'No notifications found' });
      }
  
      return res.status(200).json({
        message: 'Notifications fetched successfully',
        notifications,
      });
    } catch (error) {
      console.error('Error in getNotifications:', error);
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({ message: errorMessage });
    }
  };
  


  // controllers/notification.controller.ts

// Handler to mark a notification as read
export const markNotificationAsRead = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;  // Extract notification ID from URL parameters
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }
  
    try {
      // Decode the token and extract user ID (if available)
      let userId;
      try {
        userId = extractUserIdFromToken(
          JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
        );
      } catch (error) {
        console.log("Error extracting userId from token:", error);
      }
  
      // Find the notification by ID
      let notification;
      if (userId) {
        // If userId is available, check if the notification belongs to the user
        notification = await Notification.findOneAndUpdate(
          { _id: id, user: userId },  // Ensure it's the correct user's notification
          { status: 'read' },
          { new: true }  // Return the updated notification
        );
      } else {
        // If userId is not available, allow marking the notification as read regardless of the user
        notification = await Notification.findOneAndUpdate(
          { _id: id },  // Only match by notification ID, without user filter
          { status: 'read' },
          { new: true }  // Return the updated notification
        );
      }
  
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      // Return the updated notification
      return res.status(200).json({
        message: 'Notification marked as read',
        notification,
      });
    } catch (error) {
      console.error('Error in markNotificationAsRead:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  