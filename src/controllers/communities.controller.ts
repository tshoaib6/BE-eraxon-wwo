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





export const getPostsByCommunityId = async (req: Request, res: Response,error:any) => {
  try {
    const { communityId } = req.params;

    // Find the community by communityId
    const community = await Community.findOne({ communityId });

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Return only a dynamic message with communityId
    res.status(200).json({ message: `Community ID ${communityId}: Same community people will be able to see each other's data` });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

