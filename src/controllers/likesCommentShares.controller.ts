import { Request, Response } from "express";
import Action from "../models/likesCommentsShares.model";
import { extractUserIdFromToken } from "../utils/extractUserIdFromToken";

// Unified API for Creating Like, Comment, or Share
export const createAction = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { postId, actionType, commentText } = req.body;

    // Validate required fields
    if (!postId || !actionType) {
      return res.status(400).json({ message: "Post ID and action type are required" });
    }

    // Extract user ID from token
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }
    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    );

    // Check for duplicate like if actionType is "like"
    if (actionType === "like") {
      const existingLike = await Action.findOne({ userId, postId, actionType });
      if (existingLike) {
        return res.status(400).json({ message: "You already liked this post" });
      }
    }

    // Create action
    const actionData: any = { userId, postId, actionType };
    if (actionType === "comment" && commentText) {
      actionData.commentText = commentText;
    }

    const action = new Action(actionData);
    await action.save();

    return res.status(201).json({ message: `${actionType} created successfully`, action });
  } catch (error) {
    console.error("Error creating action:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Unified API for Deleting Like, Comment, or Share
export const deleteAction = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { actionId } = req.params;

    // Extract user ID from token
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }
    const userId = extractUserIdFromToken(
      JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    );

    // Find action by ID and check ownership
    const action = await Action.findById(actionId);
    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }
    if (action.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this action" });
    }

    // Delete action
    await action.deleteOne();
    return res.status(200).json({ message: `${action.actionType} deleted successfully` });
  } catch (error) {
    console.error("Error deleting action:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// API for Getting Total Counts of Likes, Comments, and Shares
export const getCounts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { postId } = req.params;

    // Validate required fields
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // Get counts for each action type
    const likesCount = await Action.countDocuments({ postId, actionType: "like" });
    const commentsCount = await Action.countDocuments({ postId, actionType: "comment" });
    const sharesCount = await Action.countDocuments({ postId, actionType: "share" });

    return res.status(200).json({ likesCount, commentsCount, sharesCount });
  } catch (error) {
    console.error("Error fetching counts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
