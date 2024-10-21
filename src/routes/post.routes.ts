import express from 'express';
import { createPost, getPosts } from '../controllers/post.controller';
import verifyJwt from '../middleware/verifyJwt';
// import { upload,uploadLocal } from '../middleware/cloudinary';
import { upload } from '../middleware/cloudinary';


const router = express.Router();

// get api with cloudinary and multer data fetching functionality
router.get('/posts', getPosts)

// local storage route 
// router.post('/create-post/local', verifyJwt, uploadLocal.single('media'), createPost);

// router.post('/create-post',verifyJwt, upload.single('media'), createPost);
router.post('/create-post', verifyJwt, upload.array('media'), createPost);


export default router;