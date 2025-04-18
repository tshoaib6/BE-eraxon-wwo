import express from 'express';
import { createCommunity, getAllCommunities,getPostsByCommunityId } from '../controllers/communities.controller'; 

const router = express.Router();

router.get('/communities', getAllCommunities);
router.get('/community/:communityId?', getPostsByCommunityId);
router.post('/createCommunity', createCommunity); // Add POST route for creating a community

export default router;