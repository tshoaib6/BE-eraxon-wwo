// working both image and video functionality now

import { Request, Response } from "express";
import { createPostService } from "../services/post.service";
import { extractUserIdFromToken } from "../utils/extractUserIdFromToken";
import Post from "../models/post.model";
import mongoose from "mongoose";
import { cloudinary } from "../middleware/cloudinary"; // Ensure correct Cloudinary import
import multer = require("multer");
import Notification from '../models/notification.model'; // Adjust the path accordingly
import { getSocket } from '../socket'

// // Extend Request to include file path
// interface MulterRequest extends Request {
//   files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }; // Allow multiple files as an array or an object
// }

// // // The createPost function
// export const createPost = async (
//   req: MulterRequest,
//   res: Response,
//   err: any,

// ): Promise<Response> => {

//   try {
//     const { content } = req.body;
//     const  communityId  = req.query.communityId as string;;

//     console.log(req.body);

//     if (!communityId) {
//       return res.status(400).json({ message: 'Community ID is required' });
//     }
//     const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'Authorization token is required' });
//     }

//     const userId = extractUserIdFromToken(
//       JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
//     );

//     if (!content && (!req.files || (Array.isArray(req.files) ? req.files.length === 0 : Object.values(req.files).flat().length === 0))) {
//       return res.status(400).json({
//         message: 'Content or media is required to create a post',
//       });
//     }

//     // Store media URLs
//     const mediaUrls: string[] = [];

//     // Check if files exist in the request
//     if (req.files) {
//       const filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
//       console.log(req.files);
//       filesArray.forEach(file => {
//         if (file.path) {
//           mediaUrls.push(file.path);
//         }
//         console.log(mediaUrls);
//       });
//     }

//     // Prepare post data with userId, content, and mediaUrls
//     const postData = { userId, content, mediaUrl: mediaUrls, communityId };

//     // Create the post by calling the service
//     const post = await createPostService(postData);

//     return res.status(201).json({ message: 'Post created successfully', post });
//   } catch (error) {
//     console.error('Error:', JSON.stringify(error, null, 2));
//     return res.status(501).json({ message: 'Internal Server Error' });

//   }
// };

// if community id present so accept else omit
// Extend Request to include file path
interface MulterRequest extends Request {
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] }; // Allow multiple files as an array or an object
}

// The createPost function
// export const createPost = async (
//   req: MulterRequest,
//   res: Response,
//   err: any
// ): Promise<Response> => {
//   try {
//     const { content } = req.body;
//     const communityId = req.query.communityId as string;
//     // const communityId = req.params.communityId as string;

//     console.log(req.body);

//     // Check for required fields
//     if (
//       !content &&
//       (!req.files ||
//         (Array.isArray(req.files)
//           ? req.files.length === 0
//           : Object.values(req.files).flat().length === 0))
//     ) {
//       return res.status(400).json({
//         message: "Content or media is required to create a post",
//       });
//     }

//     // Authorization token extraction
//     const token =
//       req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Authorization token is required" });
//     }

//     const userId = extractUserIdFromToken(
//       JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
//     );

//     // Store media URLs
//     const mediaUrls: string[] = [];

//     // Check if files exist in the request
//     if (req.files) {
//       const filesArray = Array.isArray(req.files)
//         ? req.files
//         : Object.values(req.files).flat();
//       console.log(req.files);
//       filesArray.forEach((file) => {
//         if (file.path) {
//           mediaUrls.push(file.path);
//         }
//         console.log(mediaUrls);
//       });
//     }

//     // Prepare post data conditionally including communityId
//     const postData: any = { userId, content, mediaUrl: mediaUrls };
//     if (communityId) {
//       postData.communityId = communityId; // Only add if communityId is present
//     }

//     // Create the post by calling the service
//     const post = await createPostService(postData);

//     return res.status(201).json({ message: "Post created successfully", post });
//   } catch (error) {
//     console.error("Error:", JSON.stringify(error, null, 2));
//     return res.status(501).json({ message: "Internal Server Error" });
//   }
// };

// new code with notifictions 

// Define the structure for notification payload
interface NotificationPayload {
  title: string;
  description: string;
  url: string;
  type: string;
  status: string;
  createdAt: Date;
}

export const createPost = async (
  req: MulterRequest,
  res: Response,
  err: any
): Promise<Response> => {
  try {
    const { content } = req.body;
    const communityId = req.query.communityId as string;

    // Check for required fields (content or media)
    if (
      !content &&
      (!req.files ||
        (Array.isArray(req.files)
          ? req.files.length === 0
          : Object.values(req.files).flat().length === 0))
    ) {
      return res.status(400).json({
        message: "Content or media is required to create a post",
      });
    }

    // Authorization token extraction
    const token =
      req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    // Extract userId from token
    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    );

    // Store media URLs
    const mediaUrls: string[] = [];

    // Check if files exist in the request and extract media URLs
    if (req.files) {
      const filesArray = Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat();
      console.log(req.files);
      filesArray.forEach((file) => {
        if (file.path) {
          mediaUrls.push(file.path);
        }
      });
    }

    // Prepare post data conditionally including communityId
    const postData: any = { userId, content, mediaUrl: mediaUrls };
    if (communityId) {
      postData.communityId = communityId; // Only add if communityId is present
    }

    // Create the post by calling the service
    const post = await createPostService(postData);

    // Create a new notification for the post creation
    const notification = new Notification({
      title: 'Your Post Has Published Successfully',
      description: "", // Shortened description
      url: "/", // Link to the new post
      type: 'post_creation',
      status: 'unread',
      createdAt: new Date(),
    });

    // Save the notification to the database
    await notification.save();

    // Emit the notification via Socket.IO
    const socket = getSocket();
    if (socket) {
      const notificationPayload: NotificationPayload = {
        title: notification.title,
        description: notification.description,
        url: notification.url,
        type: notification.type,
        status: notification.status,
        createdAt: notification.createdAt,
      };

      // Emit the notification with the correct type
      socket.emit('notification', notificationPayload);
    } else {
      console.warn('Socket.IO instance is not available');
    }

    return res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error:", JSON.stringify(error, null, 2));

    // Check if it's a specific error type or a generic one
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    // Fallback error handler
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// The getPosts function remains unchanged
export const getPosts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const posts = await Post.find()
      .populate("userId", "firstName lastName email")
      .select("content mediaUrl createdAt")
      .sort({ createdAt: -1 }); // Sorting posts in descending order by createdAt

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const getPostsByCommunity = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { communityId } = req.params;

//     const posts = await Post.find({ communityId })
//       .populate('userId', 'firstName lastName email')
//       .select('content mediaUrl createdAt');

//     return res.status(200).json(posts);
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
