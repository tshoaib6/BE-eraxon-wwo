import { Request, Response } from "express";
import Action from "../models/likesCommentsShares.model"; // Import Action model
import { extractUserIdFromToken } from "../utils/extractUserIdFromToken"; // Token utility

export const createLike = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { postId } = req.body;

    // Validate the presence of a post ID
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // Extract user ID from token
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }
    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    );

    // Check if the like already exists
    const existingLike = await Action.findOne({ userId, postId, actionType: "like" });
    if (existingLike) {
      return res.status(400).json({ message: "You already liked this post" });
    }

    // Create a new like
    const like = new Action({
      userId,
      postId,
      actionType: "like",
    });
    await like.save();

    return res.status(201).json({ message: "Post liked successfully", like });
  } catch (error) {
    console.error("Error creating like:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const createComment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { postId, commentText } = req.body;
  
      // Validate required fields
      if (!postId || !commentText) {
        return res.status(400).json({ message: "Post ID and comment text are required" });
      }
  
      // Extract user ID from token
      const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
      }
      const userId = extractUserIdFromToken(
        JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      );
  
      // Create a new comment
      const comment = new Action({
        userId,
        postId,
        actionType: "comment",
        commentText,
      });
      await comment.save();
  
      return res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
      console.error("Error creating comment:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  
  export const createShare = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { postId } = req.body;
  
      // Validate the presence of a post ID
      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
      }
  
      // Extract user ID from token
      const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
      }
      const userId = extractUserIdFromToken(
        JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      );
  
      // Create a new share
      const share = new Action({
        userId,
        postId,
        actionType: "share",
      });
      await share.save();
  
      return res.status(201).json({ message: "Post shared successfully", share });
    } catch (error) {
      console.error("Error creating share:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  export const getLikes = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { postId } = req.params;
  
      const likes = await Action.find({ postId, actionType: "like" }).populate(
        "userId",
        "firstName lastName"
      );
  
      return res.status(200).json({ likes });
    } catch (error) {
      console.error("Error fetching likes:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Get Comments
  export const getComments = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { postId } = req.params;
  
      const comments = await Action.find({ postId, actionType: "comment" }).populate(
        "userId",
        "firstName lastName"
      );
  
      return res.status(200).json({ comments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  
  // Get Shares
  export const getShares = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { postId } = req.params;
  
      const shares = await Action.find({ postId, actionType: "share" }).populate(
        "userId",
        "firstName lastName"
      );
  
      return res.status(200).json({ shares });
    } catch (error) {
      console.error("Error fetching shares:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  



// Delete Like
export const deleteLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { likeId } = req.params;
  
      // Extract user ID from token
      const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
      }
      const userId = extractUserIdFromToken(
        JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      );
  
      // Find the like by ID and check ownership
      const like = await Action.findById(likeId);
      if (!like) {
        return res.status(404).json({ message: "Like not found" });
      }
      if (like.userId.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to delete this like" });
      }
  
      // Delete the like
      await like.deleteOne();
      return res.status(200).json({ message: "Like deleted successfully" });
    } catch (error) {
      console.error("Error deleting like:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Delete Comment
  export const deleteComment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { commentId } = req.params;
  
      // Extract user ID from token
      const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
      }
      const userId = extractUserIdFromToken(
        JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      );
  
      // Find the comment by ID and check ownership
      const comment = await Action.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if (comment.userId.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to delete this comment" });
      }
  
      // Delete the comment
      await comment.deleteOne();
      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Delete Share
  export const deleteShare = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { shareId } = req.params;
  
      // Extract user ID from token
      const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Authorization token is required" });
      }
      const userId = extractUserIdFromToken(
        JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      );
  
      // Find the share by ID and check ownership
      const share = await Action.findById(shareId);
      if (!share) {
        return res.status(404).json({ message: "Share not found" });
      }
      if (share.userId.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to delete this share" });
      }
  
      // Delete the share
      await share.deleteOne();
      return res.status(200).json({ message: "Share deleted successfully" });
    } catch (error) {
      console.error("Error deleting share:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  