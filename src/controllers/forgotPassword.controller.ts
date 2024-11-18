import { Request, Response } from 'express';
import { forgotPasswordService } from '../services/forgotPassword.service';

// export const requestPasswordReset = async (req: Request, res: Response) => {
//   const email = req.query.email as string; // Get email from query

//   if (!email) {
//     return res.status(400).json({ message: "Email is required." });
//   }

//   try {
//     await forgotPasswordService.requestReset(email);
//     return res.status(200).json({ message: "OTP sent to email." });
//   } catch (error: any) {
//     return res.status(400).json({ message: error.message });
//   }
// };


// export const verifyOTP = async (req: Request, res: Response) => {
//   const { email, otp } = req.body;

//   try {
//     const isValid = await forgotPasswordService.verifyOTP(email, otp);
//     if (isValid) {
//       res.status(200).json({ message: 'OTP verified successfully. You may proceed to reset your password.' });
//     } else {
//       res.status(400).json({ message: 'Invalid or expired OTP.' });
//     }
//   } catch (error: any) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


import jwt from 'jsonwebtoken';
import User from '../models/user.model';  // Adjust the import path based on your project structure
import mongoose from 'mongoose';

// Secret for JWT (use a secure secret in production)
// const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate JWT token
const generateToken = (email: string,userId: string) => {
  // Check if JWT_SECRET exists in the environment variables
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  // Use JWT_SECRET from the environment
  return jwt.sign({ email,userId  }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const email = req.query.email as string; // Get email from query

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    await forgotPasswordService.requestReset(email);
    return res.status(200).json({ message: "OTP sent to email." });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const isValid = await forgotPasswordService.verifyOTP(email, otp);
    if (isValid) {
      // Generate JWT token to track OTP verification success
      const user = await User.findOne({ email });

      // Check if user is not found
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const userId = (user._id as mongoose.Types.ObjectId).toString();

      const token = generateToken(email,userId);

      // Return token to the client
      res.status(200).json({
        message: 'OTP verified successfully. You may proceed to reset your password.',
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const setNewPassword = async (req: Request, res: Response) => {
  const { email, newPassword, confirmPassword, token } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Verify the token to ensure OTP verification was successful
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // Check if the email in the token matches the one provided
    if (decoded.email !== email) {
      return res.status(400).json({ message: 'Invalid token or email mismatch.' });
    }

    // Proceed to update the password
    await forgotPasswordService.setNewPassword(email, newPassword);
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error: any) {
    // Catch token verification errors or other issues
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token. Password not updated.' });
    }

    // General error handling
    res.status(500).json({ message: 'Internal server error' });
  }
};