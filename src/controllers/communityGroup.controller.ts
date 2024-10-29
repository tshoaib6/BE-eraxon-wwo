import Community from '../models/communityGroup.model';
import { Request, Response } from 'express';

export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await Community.find();
    console.log("Fetched communities:", communities); // Log fetched data
    res.status(200).json(communities);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
