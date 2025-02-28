import { Request, Response } from 'express';
import UserInformation from '../models/userInformation.model';
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';

export const createUserInformation = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    );

    if (!userId) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const { city, country, phonenumber } = req.body;

    const userInfo = new UserInformation({
      city,
      country,
      phonenumber,
      user: userId,
    });

    await userInfo.save();
    res.status(201).json({ message: 'User information saved successfully', userInfo });
  } catch (error) {
    console.error('Error saving user information:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUserInformation = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    );

    if (!userId) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const userInfo = await UserInformation.findOne({ user: userId });

    if (!userInfo) {
      return res.status(204).json({ message: 'User information not found' });
    }

    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error retrieving user information:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
