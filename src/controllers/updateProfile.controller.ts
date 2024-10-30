import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';
import { IUser } from '../interfaces/user.interface'; // Import the IUser interface

// export const updateProfile = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'Authorization token is required' });
//     }

//     const userId = extractUserIdFromToken(
//       JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
//     );

//     const { firstName, lastName, email, gender } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(userId, {
//       firstName,
//       lastName,
//       email,
//       gender,
//       profilePic: req.file?.path
//     }, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };



export const updateProfile = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    );

    const { firstName, lastName, email, gender } = req.body;

    const updates: Partial<IUser> = {}; // Use Partial<IUser> for optional updates
    
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (gender) updates.gender = gender;

    const user = await User.findById(userId) as IUser; // Cast user to IUser type

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.file) {
      updates.profilePic = req.file.path;
    } else if (!user.profilePic) {
      updates.profilePic = ""; // Assign an empty string if profilePic is not provided
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
