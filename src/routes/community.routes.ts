import express from 'express';
import { getAllCommunities } from '../controllers/communities.controller'; 

const router = express.Router();

router.get('/communities', getAllCommunities);

export default router;