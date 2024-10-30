import Community from '../models/community.model'; // Adjust the path as needed
import { Request, Response } from 'express';

export const getAllCommunities = async (req: Request, res: Response, err:any) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    const err = error as Error; // Type assertion to ensure error is treated as an Error object
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};