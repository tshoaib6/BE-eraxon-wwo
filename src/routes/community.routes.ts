import express from 'express';
import { getAllCommunities,getPostsByCommunityId } from '../controllers/communities.controller'; 

const router = express.Router();

router.get('/communities', getAllCommunities);
router.get('/communities/:communityId/posts', getPostsByCommunityId);

export default router;