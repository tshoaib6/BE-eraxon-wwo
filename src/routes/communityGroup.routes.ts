import express from 'express';
import { getAllCommunities } from '../controllers/communityGroup.controller'; 

const router = express.Router();

router.get('/communities', getAllCommunities);

export default router;