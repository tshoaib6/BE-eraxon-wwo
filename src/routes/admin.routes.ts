import express from 'express';
import { getAllUsers, updateUserStatus,deleteUser } from '../controllers/admin.controller';

const router = express.Router();

// Route to get all users
router.get('/users', getAllUsers);

// Route to update a user's status
router.patch('/users/:userId/status', updateUserStatus);

router.delete('/users/:userId', deleteUser);


export default router;
