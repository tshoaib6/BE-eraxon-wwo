import Community from '../models/community.model'; // Adjust the path as needed
import { Request, Response } from 'express';
import Post from '../models/post.model'; // Import the Post model

export const getAllCommunities = async (req: Request, res: Response, err:any) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    const err = error as Error; // Type assertion to ensure error is treated as an Error object
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};





export const getPostsByCommunityId = async (req: Request, res: Response) => {
    try {
      const { communityId } = req.params;
  
      // Find the posts by communityId
      const posts = await Post.find({ communityId });
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this community' });
      }
  
      // Return posts for the specified community
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: (error as Error).message });
    }
  };

