// working both image and video functionality now 

import { Request, Response } from 'express';
import { createPostService } from '../services/post.service';
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';
import Post from '../models/post.model';
import mongoose from 'mongoose';
import { cloudinary } from '../middleware/cloudinary'; // Ensure correct Cloudinary import
import multer = require('multer');



// Extend Request to include file path
interface MulterRequest extends Request {
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }; // Allow multiple files as an array or an object
}

// // The createPost function
export const createPost = async (
  req: MulterRequest,
  res: Response,
  err: any,


): Promise<Response> => {



  try {
    const { content } = req.body;
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }

    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    );

    if (!content && (!req.files || (Array.isArray(req.files) ? req.files.length === 0 : Object.values(req.files).flat().length === 0))) {
      return res.status(400).json({
        message: 'Content or media is required to create a post',
      });
    }

    // Store media URLs
    const mediaUrls: string[] = [];

    // Check if files exist in the request
    if (req.files) {
      const filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat(); 
      console.log(req.files);
      filesArray.forEach(file => {
        if (file.path) {
          mediaUrls.push(file.path); 
        }
        console.log(mediaUrls);
      });
    }

    // Prepare post data with userId, content, and mediaUrls
    const postData = { userId, content, mediaUrl: mediaUrls };

    // Create the post by calling the service
    const post = await createPostService(postData);

    return res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error:', JSON.stringify(error, null, 2)); 
    return res.status(501).json({ message: 'Internal Server Error' });

  
  }
};


// The getPosts function remains unchanged
export const getPosts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const posts = await Post.find()
      .populate('userId', 'firstName lastName email') 
      .select('content mediaUrl createdAt'); 

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};






