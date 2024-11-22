import { Request, Response } from "express";
import Action,{ IAction } from "../models/likesCommentsShares.model";
import { extractUserIdFromToken } from "../utils/extractUserIdFromToken";

// Unified API for Creating Like, Comment, Share, or Reply
export const createAction = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { postId, actionType, commentText, parentCommentId } = req.body;

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
    if ((actionType === "comment" || actionType === "reply") && commentText) {
      actionData.commentText = commentText;
    }
    if (actionType === "reply") {
      if (!parentCommentId) {
        return res.status(400).json({ message: "Parent comment ID is required for replies" });
      }
      actionData.parentCommentId = parentCommentId;

      // Increment reply count for the parent comment
      await Action.findByIdAndUpdate(parentCommentId, { $inc: { replyCount: 1 } });
    }

    const action = new Action(actionData);
    await action.save();

    return res.status(201).json({ message: `${actionType} created successfully`, action });
  } catch (error) {
    console.error("Error creating action:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Unified API for Deleting Like, Comment, Share, or Reply
export const deleteAction = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { actionId } = req.params;

    const action = await Action.findById(actionId);
    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }

    const typedAction = action as IAction;
    if (typedAction.actionType === "reply" && typedAction.parentCommentId) {
      await Action.findByIdAndUpdate(typedAction.parentCommentId, { $inc: { replyCount: -1 } });
    }

    await action.deleteOne();
    return res.status(200).json({ message: `${typedAction.actionType} deleted successfully` });
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
    const repliesCount = await Action.countDocuments({ postId, actionType: "reply" });

    return res.status(200).json({ likesCount, commentsCount, sharesCount, repliesCount });
  } catch (error) {
    console.error("Error fetching counts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
