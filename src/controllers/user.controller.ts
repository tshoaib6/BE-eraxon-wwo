import { Request, Response } from 'express'
import {
  loginUser,
  signUpUser,
  verifyUserEmail
} from '../services/user.service'
import ErrorHandler, { handleError } from '../utils/errorHandler'
import { getSocket } from '../socket'
import { getNotifications } from '../controllers/notification.controller'; // Import getNotifications method
import { extractUserIdFromToken } from "../utils/extractUserIdFromToken";
import { getNotificationsForUser } from '../services/notification.service'; // Import the new service
import NotificationModel from '../models/notification.model'; // Adjust the path accordingly

// new code with user ID 
export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Sign up the user and retrieve the user object with userId
    const user = await signUpUser(firstName, lastName, email, password);
    const userId = user.id;  // Assuming `signUpUser` returns a user object with `id`
    user.paymentStatus = user.paymentStatus || 'unpaid'; // Set default status

console.log("userId from backend",userId)
    // Create the welcome notification
    const welcomeNotification = new Notification({
      user: userId,  // Associate the notification with the registered user
      title: 'Welcome to WWO Platform!',
      description: 'We are excited to have you here.',
      url: '/welcome',
      status: 'unread',
      type: 'welcome',
      createdAt: new Date(),
    });

    // Create the profile completion notification
    const profileNotification = new Notification({
      user: userId,  // Associate the notification with the registered user
      title: 'Please complete your profile',
      description: 'Complete your profile to get started.',
      url: '/profile/settings',
      status: 'unread',
      type: 'profile-completion',
      createdAt: new Date(),
    });

    // Save both notifications to the database
    await welcomeNotification.save();
    await profileNotification.save();

    // Emit both notifications via Socket.IO
   // Emit to a specific room named after the userId
const socket = getSocket();
if (socket) {
  socket.to(userId).emit('notification', {
    user: userId,
    title: welcomeNotification.title,
    description: welcomeNotification.description,
    url: welcomeNotification.url,
    type: welcomeNotification.type,
    status: welcomeNotification.status,
    createdAt: welcomeNotification.createdAt,
  });

  socket.to(userId).emit('notification', {
    user: userId,
    title: profileNotification.title,
    description: profileNotification.description,
    url: profileNotification.url,
    type: profileNotification.type,
    status: profileNotification.status,
    createdAt: profileNotification.createdAt,
  });
} else {
  console.warn('Socket.IO instance is not available');
}


    return res.status(201).json({ message: 'User registered. Verification email sent.' });
  } catch (error) {
    console.error('Signup error:', error);

    // Handle error correctly by sending a response with a valid status code
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    // Fallback error handler
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
};





export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { token } = req.query

  if (!token) {
    return res.status(400).json({ message: 'Invalid or missing token' })
  }

  try {
    await verifyUserEmail(token as string)
    return res.status(200).json({ message: 'Email verified successfully' })
  } catch (error) {
    handleError(error, res)
    return res.json()
  }
}


import Notification from '../models/notification.model';
const jwt = require('jsonwebtoken');




// Notification with user Id 
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Call the service to log in the user
    const response = await loginUser(email, password);

    // Log the response to inspect the structure
    console.log('Login Response:', response);

    // Check if response exists and contains the token
    if (!response || !response.token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the user is active
    if (!response.user.isActive) {
      return res
        .status(403)
        .json({ message: 'Your account is inactive. Please contact support.' });
    }

    // Set the JWT token as a cookie (optional)
    res.cookie('token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    // Decode the token to get the userId
    const decodedToken = jwt.verify(response.token, process.env.JWT_SECRET as string);
    const userId = decodedToken.userId; // Adjust based on your token structure
    console.log('The user id is', userId);

    // Return the token and user information in the response
    return res.status(200).json({
      message: 'Login successful',
      user: response.user,

      token: response.token,
    });
  } catch (error) {
    console.error('Login error:', error);

    // Handle error correctly by sending a response with a valid status code
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    // Fallback error handler
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
};





export const logout = (req: Request, res: Response) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logged out successfully' })
}
