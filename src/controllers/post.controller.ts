// import { Request, Response } from 'express'
// import { createPostService } from '../services/post.service'
// import { extractUserIdFromToken } from '../utils/extractUserIdFromToken'
// import Post from '../models/post.model'
// import mongoose from 'mongoose'

// interface MulterRequest extends Request {
//   file?: Express.Multer.File & { path: string } // Extend to ensure file path from Cloudinary
// }

// export const createPost = async (
//   req: Request, // req now includes Multer types
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { content } = req.body
//     const token =
//       req.cookies?.token || req.headers['authorization']?.split(' ')[1]

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: 'Authorization token is required' })
//     }

//     const userId = extractUserIdFromToken(
//       JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
//     )

//     if (!content && !req.file) {
//       return res.status(400).json({
//         message: 'Content or media is required to create a post'
//       })
//     }

//     const mediaUrl = req.file ? req.file.path : undefined // Correctly handle file

//     const postData = { userId, content, mediaUrl }

//     const post = await createPostService(postData)

//     return res.status(201).json({ message: 'Post created successfully', post })
//   } catch (error) {
//     console.error('Error creating post:', error)
//     const errorMessage =
//       error instanceof Error ? error.message : 'Internal Server Error'
//     return res.status(500).json({ message: errorMessage })
//   }
// }

// ABOVE CODE IS WITHOUT LOCAL STORAGE FUNCTIONLITY USING CLOUDINARY for creating posts

// testing purpose 

import { Request, Response } from 'express';
import { createPostService } from '../services/post.service';
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken';
import Post from '../models/post.model';
import mongoose from 'mongoose';
import { cloudinary } from '../middleware/cloudinary'; // Ensure correct Cloudinary import

// Extend Request to include file path
interface MulterRequest extends Request {
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }; // Allow multiple files as an array or an object
}

// The createPost function
export const createPost = async (
  req: MulterRequest,
  res: Response
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
      const filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat(); // Flatten to get all files

      filesArray.forEach(file => {
        if (file.path) {
          mediaUrls.push(file.path); // Collecting media URLs
        }
      });
    }

    // Prepare post data with userId, content, and mediaUrls
    const postData = { userId, content, mediaUrl: mediaUrls };

    // Create the post by calling the service
    const post = await createPostService(postData);

    return res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ message: errorMessage });
  }
};



// below code having cloudinary and muter functionality to get all data 
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
  







// below code is with localStorage functionlity too (for now not using )


// import fs from 'fs';
// import { cloudinary } from '../middleware/cloudinary'; // Ensure this path is correct

// export const createPost = async (
//   req: Request, // req now includes Multer types
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { content } = req.body;
//     const token =
//       req.cookies?.token || req.headers['authorization']?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'Authorization token is required' });
//     }

//     const userId = extractUserIdFromToken(
//       JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
//     );

//     // Check if content or media is provided
//     if (!content && !req.file) {
//       return res.status(400).json({
//         message: 'Content or media is required to create a post',
//       });
//     }

//     // Store the local file path if available
//     const mediaUrl = req.file ? req.file.path : undefined; // Local file path

//     // Prepare post data
//     const postData = { userId, content, mediaUrl };

//     // Create the post in your database (this may vary based on your setup)
//     const post = await createPostService(postData);

//     // Upload the local file to Cloudinary if it exists
//     if (req.file) {
//       try {
//         const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
//           folder: 'posts', // Specify the folder for Cloudinary
//         });
        
//         // Update post data with the Cloudinary URL
//         post.mediaUrl = cloudinaryResult.secure_url;

//         // Remove the local file after successful upload
//         fs.unlinkSync(req.file.path);
//       } catch (uploadError) {
//         console.error('Error uploading to Cloudinary:', uploadError);
//         // Optionally, handle the error and decide whether to keep the local file or not
//       }
//     }

//     return res.status(201).json({ message: 'Post created successfully', post });
//   } catch (error) {
//     console.error('Error creating post:', error);
//     const errorMessage =
//       error instanceof Error ? error.message : 'Internal Server Error';
//     return res.status(500).json({ message: errorMessage });
//   }
// };













