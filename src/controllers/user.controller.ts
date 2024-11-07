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
 
// export const signup = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { firstName, lastName, email, password, confirmPassword } = req.body

//   if (password !== confirmPassword) {
//     return res.status(400).json({ message: 'Passwords do not match' })
//   }

//   try {
//     const user = await signUpUser(firstName, lastName, email, password)
//     getSocket().emit('notification', {
//       message: `Welcome to the WWO platform, ${firstName}!`,
//       type: 'success',
//     });
//     return res
//       .status(201)
//       .json({ message: 'User registered. Verification email sent.' })
//   } catch (error) {
//     handleError(error, res)
//     return res
//   }
// }


// export const signup = async (req: Request, res: Response): Promise<Response> => {
//   const { firstName, lastName, email, password, confirmPassword } = req.body;

//   if (password !== confirmPassword) {
//     return res.status(400).json({ message: 'Passwords do not match' });
//   }

//   try {
//     // Sign up the user
//     const user = await signUpUser(firstName, lastName, email, password);

//     // Fetch the notification dynamically based on the type (e.g., 'registration')
//     const notification = await NotificationModel.findOne({ type: 'registration' }).sort({ createdAt: -1 }); // Get the most recent notification of the 'registration' type

//     // If notification is found, emit it via socket
//     if (notification) {
//       getSocket().emit('notification', {
//         title: notification.title,
//         description: notification.description,
//         url: notification.url,
//         type: notification.type,
//       });
//     } else {
//       console.log('No notification found for the registration type.');
//     }

//     return res.status(201).json({ message: 'User registered. Verification email sent.' });
//   } catch (error) {
//     handleError(error, res);
//     return res;
//   }
// };


export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Sign up the user
    const user = await signUpUser(firstName, lastName, email, password);

    // Create a new signup notification in case one doesn't already exist
    let notification = await NotificationModel.findOne({ type: 'registration' }).sort({ createdAt: -1 });

    if (!notification) {
      // Create a new notification as a fallback if none exists
      notification = new NotificationModel({
        title: 'You have successfully registered.!',
        description: '',
        url: '/create-obituary',
        type: 'registration',
        status: 'unread',
        createdAt: new Date(),
      });
      await notification.save();
    }

    // Emit the notification via Socket.IO
    const socket = getSocket();
    if (socket) {
      socket.emit('notification', {
        title: notification.title,
        description: notification.description,
        url: notification.url,
        type: notification.type,
        status: notification.status,
        createdAt: notification.createdAt,
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




// export const verifyEmail = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { token } = req.query

//   if (!token) {
//     return res.status(400).json({ message: 'Invalid or missing token' })
//   }

//   try {
//     await verifyUserEmail(token as string)
//     return res.status(200).json({ message: 'Email verified successfully' })
//   } catch (error) {
//     handleError(error, res)
//     return res.json()
//   }
// }

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Invalid or missing token' });
  }

  try {
    // Verify the user's email using the provided token
    await verifyUserEmail(token as string);

    // Create a new notification for successful email verification
    const notification = new Notification({
      title: 'Welcome to WWO Platform!',
      description: '',
      url: '/create-obituary', // Adjust URL as needed for your frontend
      type: 'email_verification',
      status: 'unread',
      createdAt: new Date(),
    });

    // Save the notification to the database
    await notification.save();

    // Emit the notification via Socket.IO
    const socket = getSocket();
    if (socket) {
      socket.emit('notification', {
        title: notification.title,
        description: notification.description,
        url: notification.url,
        type: notification.type,
        status: notification.status,
        createdAt: notification.createdAt,
      });
    } else {
      console.warn('Socket.IO instance is not available');
    }

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);

    // Handle error correctly by sending a response with a valid status code
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    // Fallback error handler
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
};


// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const response = await loginUser(email, password);

//     res.cookie('token', response.token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 15 * 60 * 1000,
//     });

//     res.json({ message: 'Login successful' , user:response.user});
//   } catch (error) {
//     handleError(error, res);
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body

//     // Call the service to log in the user
//     const response = await loginUser(email, password)

//     // Check if the user is authenticated and a token is generated
//     if (!response.token) {
//       return res.status(401).json({ message: 'Invalid credentials' })
//     }

//     // Set the JWT token as a cookie (optional)
//     res.cookie('token', response.token, {
//       httpOnly: true, // Prevents client-side access to the cookie
//       secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
//       sameSite: 'strict', // Mitigates CSRF attacks
//       maxAge: 15 * 60 * 1000 // Cookie expiration time
//     })

//     // Return the token and user information in the response
//     return res.status(200).json({
//       message: 'Login successful',
//       user: response.user, // Include user information
//       token: response.token // Include the JWT token in the response
//     })
//   } catch (error) {
//     handleError(error, res)
//   }
// }

import Notification from '../models/notification.model';
const jwt = require('jsonwebtoken');



// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     // Call the service to log in the user
//     const response = await loginUser(email, password);

//     // Log the response to inspect the structure
//     console.log('Login Response:', response);

//     // Check if response exists and contains the token
//     if (!response || !response.token) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Set the JWT token as a cookie (optional)
//     res.cookie('token', response.token, {
//       httpOnly: true, // Prevents client-side access to the cookie
//       secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
//       sameSite: 'strict', // Mitigates CSRF attacks
//       maxAge: 15 * 60 * 1000 // Cookie expiration time
//     });

//     // Extract token from cookies
//     // const token = req.cookies.token;
//     // console.log("token from cookies",token)
//     // let userId: string | undefined;

//     // if (token) {
//     //   try {
//     //     // Verify and decode the token
//     //     const decoded = jwt.verify(token, process.env.JWT_SECRET as string); // Use the same secret that you used to sign the token
        
//     //     // Extract userId from the decoded payload
//     //     userId = (decoded as any).userId;
//     //     console.log('Decoded UserId:', userId); // Ensure we have userId here
//     //   } catch (err) {
//     //     console.error('Invalid token:', err);
//     //     return res.status(401).json({ message: 'Invalid or expired token' });
//     //   }
//     // } else {
//     //   console.log('Token not found');
//     //   return res.status(401).json({ message: 'Token not found' });
//     // }

//     // Create a new login notification
//     const notification = new Notification({
//       // user: userId,
//       title: 'Welcom to WWO platform',
//       description: 'You have successfullyyyyy logged in.',
//       url: '/',
//       status: 'unread',
//       type: 'login',
//       createdAt: new Date()
//     });

//     // Save the notification to the database
//     await notification.save();

//     // Emit the notification via Socket.IO
//     const socket = getSocket();
//     if (socket) {
//       socket.emit('notification', {
//         // user: userId,
//         title: notification.title,
//         description: notification.description,
//         url: notification.url,
//         type: notification.type,
//         status: notification.status,
//         createdAt: notification.createdAt,
//       });
//     } else {
//       console.warn('Socket.IO instance is not available');
//     }

//     // Return the token and user information in the response
//     return res.status(200).json({
//       message: 'Login successful',
//       user: response.user,  // Make sure this is accessible
//       token: response.token,  // Make sure this is accessible
//     });
//   } catch (error) {
//     console.error('Login error:', error);

//     // Handle error correctly by sending a response with a valid status code
//     if (error instanceof Error) {
//       return res.status(500).json({ message: error.message });
//     }

//     // Fallback error handler
//     return res.status(500).json({ message: 'An unexpected error occurred' });
//   }
// };

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

    // Set the JWT token as a cookie (optional)
    res.cookie('token', response.token, {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      sameSite: 'strict', // Mitigates CSRF attacks
      maxAge: 15 * 60 * 1000 // Cookie expiration time
    });


    // Create a new login notification
    const notification = new Notification({
      // user: userId,
      title: 'Successfully Logged In',
      description: 'Please complete Your Profile',
      url: '/create-obituary',
      status: 'unread',
      type: 'login',
      createdAt: new Date()
    });

    // Save the notification to the database
    await notification.save();

    // Emit the notification via Socket.IO
    const socket = getSocket();
    if (socket) {
      socket.emit('notification', {
        // user: userId,
        title: notification.title,
        description: notification.description,
        url: notification.url,
        type: notification.type,
        status: notification.status,
        createdAt: notification.createdAt,
      });
    } else {
      console.warn('Socket.IO instance is not available');
    }

    // Return the token and user information in the response
    return res.status(200).json({
      message: 'Login successful',
      user: response.user,  // Make sure this is accessible
      token: response.token,  // Make sure this is accessible
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
