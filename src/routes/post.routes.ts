import express from 'express';
import { createPost, getPosts } from '../controllers/post.controller';
import verifyJwt from '../middleware/verifyJwt';
import { upload } from '../middleware/cloudinary';

const router = express.Router();
router.get('/posts', getPosts)
router.post('/create-post', verifyJwt, upload.array('media'), createPost);


export default router;