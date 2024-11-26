import express from "express";
import { createAction, deleteAction, getCounts,getComments } from "../controllers/likesCommentShares.controller";

const router = express.Router();

// Route for creating like, comment, or share
router.post("/actions", createAction);

// Route for deleting like, comment, or share
router.delete("/actions/:actionId", deleteAction);

// Route for getting the total counts of likes, comments, and shares for a post
router.get("/actions/counts/:postId", getCounts);
router.get('/comments/:postId', getComments);  // :postId is the dynamic route parameter

export default router;
