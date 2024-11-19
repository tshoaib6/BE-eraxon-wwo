import { Router } from "express";
import { createLike, createComment, createShare,getLikes,getComments,getShares,deleteLike,deleteComment,deleteShare } from "../controllers/likesCommentShares.controller";

const router = Router();

// Route for creating a like
router.post("/like", createLike);

// Route for creating a comment
router.post("/comment", createComment);

// Route for creating a share
router.post("/share", createShare);


// Get APIs
router.get("/likes/:postId", getLikes);
router.get("/comments/:postId", getComments);
router.get("/shares/:postId", getShares);

// Delete APIs
router.delete("/like/:likeId", deleteLike);
router.delete("/comment/:commentId", deleteComment);
router.delete("/share/:shareId", deleteShare);

export default router;
