import { Request, Response } from "express";
import Action, { IAction } from "../models/likesCommentsShares.model";
import { extractUserIdFromToken } from "../utils/extractUserIdFromToken";
import Notification from "../models/notification.model"; // Assuming you have a Notification model
import Post from "../models/post.model"; // Assuming you have a Notification model
import { getSocket } from "../socket";
import User from "../models/user.model"; // Assuming you have a Notification model
import mongoose from "mongoose";
export const createAction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { postId, actionType, commentText, parentCommentId } = req.body;
    // Validate required fields
    if (!postId || !actionType) {
      return res
        .status(400)
        .json({ message: "Post ID and action type are required" });
    }
    // Extract user ID from token
    const token =
      req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }
    const decodedToken = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    const userId = extractUserIdFromToken(decodedToken);
    // Handle reply-specific logic
    const actionData: any = { userId, postId, actionType };
    if ((actionType === "comment" || actionType === "reply") && commentText) {
      actionData.commentText = commentText;
    }
    if (actionType === "reply") {
      if (!parentCommentId) {
        return res
          .status(400)
          .json({ message: "Parent comment ID is required for replies" });
      }
      actionData.parentCommentId = parentCommentId;
      // Increment reply count for the parent comment
      await Action.findByIdAndUpdate(parentCommentId, {
        $inc: { replyCount: 1 },
      });
    }
    // Save the action (comment or reply)
    const action = new Action(actionData);
    await action.save();
    const populatedAction = await Action.findById(action._id).populate(
      "userId",
      "firstName lastName"
    );
    // Fetch the post to get the user ID (creator of the post)
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const user = await User.findById(userId).select("firstName");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const postCreatorId = post.userId;
    // Create notifications based on actionType
    if (actionType === "like") {
      const likeNotification = new Notification({
        user: postCreatorId,
        title: "Your post got a new like!",
        description: `User ${user.firstName} liked your post.`,
        url: `/posts/${postId}`,
        type: "like",
        status: "unread",
        createdAt: new Date(),
      });
      await likeNotification.save();
      const socket = getSocket();
      if (socket) {
        socket
          .to(postCreatorId.toString())
          .emit("notification", likeNotification);
      }
    }
    if (actionType === "comment") {
      const commentNotification = new Notification({
        user: postCreatorId,
        title: "New comment on your post!",
        description: `User ${user.firstName} commented on your post.`,
        url: `/posts/${postId}`,
        type: "comment",
        status: "unread",
        createdAt: new Date(),
      });
      await commentNotification.save();
      const socket = getSocket();
      if (socket) {
        socket
          .to(postCreatorId.toString())
          .emit("notification", commentNotification);
      }
    }
    // Fetch the updated comment count for the post
    const commentsCount = await Action.countDocuments({
      postId,
      actionType: "comment",
    });
    return res.status(201).json({
      message: `${actionType} created successfully`,
      action: populatedAction,
      commentCount: commentsCount, // Return the updated comment count
    });
  } catch (error) {
    console.error("Error creating action:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    // Correct way to create ObjectId using 'new'
    const objectIdPostId = new mongoose.Types.ObjectId(postId);
    // Find all comments for the post
    const comments = await Action.aggregate([
      {
        $match: { postId: objectIdPostId, actionType: "comment" },
      },
      {
        $lookup: {
          from: "actions", // The collection name where actions are stored
          localField: "_id",
          foreignField: "parentCommentId",
          as: "replies", // Populate the replies for the comment
        },
      },
      {
        $lookup: {
          from: "users", // The collection where users are stored
          localField: "userId", // Field in Action collection
          foreignField: "_id", // Field in User collection
          as: "user", // New field to store the populated user data
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true }, // Unwind user to avoid nested array
      },
      {
        $project: {
          userId: 1,
          postId: 1,
          actionType: 1,
          commentText: 1,
          parentCommentId: 1,
          likeCount: 1,
          commentCount: 1,
          shareCount: 1,
          replyCount: 1,
          replies: 1, // Include replies in the result
          createdAt: 1,
          updatedAt: 1,
          "user.firstName": 1, // Include firstName of the user
          "user.lastName": 1, // Include lastName of the user
        },
      },
    ]);
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching comments and replies" });
  }
};
export const deleteAction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { actionId } = req.params;
    // Find the action to be deleted
    const action = await Action.findById(actionId);
    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }
    const typedAction = action as IAction;
    // Extract user ID from token to check if the user owns the action
    const token =
      req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }
    const decodedToken = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    const userId = extractUserIdFromToken(decodedToken);
    // Check if the action is a reply and if the user is the owner of the reply
    if (typedAction.actionType === "reply") {
      if (typedAction.userId.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "You can only delete your own replies" });
      }
      // Decrement the reply count of the parent comment
      if (typedAction.parentCommentId) {
        await Action.findByIdAndUpdate(typedAction.parentCommentId, {
          $inc: { replyCount: -1 },
        });
      }
    }
    // Now delete the action (whether it's a like, comment, or reply)
    await action.deleteOne();
    // Return a success message
    return res
      .status(200)
      .json({ message: `${typedAction.actionType} deleted successfully` });
  } catch (error) {
    console.error("Error deleting action:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// export const getCounts = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { postId } = req.params;
//     // Validate required fields
//     if (!postId) {
//       return res.status(400).json({ message: "Post ID is required" });
//     }
//     // Get counts for each action type
//     const likesCount = await Action.countDocuments({
//       postId,
//       actionType: "like",
//     });
//     const commentsCount = await Action.countDocuments({
//       postId,
//       actionType: "comment",
//     });
//     const sharesCount = await Action.countDocuments({
//       postId,
//       actionType: "share",
//     });
//     const repliesCount = await Action.countDocuments({
//       postId,
//       actionType: "reply",
//     });
//     return res
//       .status(200)
//       .json({ likesCount, commentsCount, sharesCount, repliesCount });
//   } catch (error) {
//     console.error("Error fetching counts:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const getCounts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { postId } = req.params;
    // Validate required fields
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    // Log the received postId for debugging purposes
    console.log("Received postId:", postId);
    // Get counts for each action type
    const likesCount = await Action.countDocuments({
      postId,
      actionType: "like",
    });
    const commentsCount = await Action.countDocuments({
      postId,
      actionType: "comment",
    });
    const sharesCount = await Action.countDocuments({
      postId,
      actionType: "share",
    });
    const repliesCount = await Action.countDocuments({
      postId,
      actionType: "reply",
    });
    // Log the counts to verify they are being fetched correctly
    console.log("Likes Count:", likesCount);
    console.log("Comments Count:", commentsCount);
    console.log("Shares Count:", sharesCount);
    console.log("Replies Count:", repliesCount);
    // Optionally, also update the post document itself with counts
    // If the post document itself keeps the counts, you can update them here
    // await Post.findByIdAndUpdate(postId, {
    //   likeCount: likesCount,
    //   commentCount: commentsCount,
    //   shareCount: sharesCount,
    //   replyCount: repliesCount,
    // });
    return res.status(200).json({
      likesCount,
      commentsCount,
      sharesCount,
      repliesCount,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};