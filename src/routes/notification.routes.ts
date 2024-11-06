// routes/notification.routes.ts

import { Router } from 'express';
import { createNotificationHandler,getNotifications,markNotificationAsRead } from '../controllers/notification.controller';

const router = Router();

// POST route to create a new notification
router.post('/notifications', createNotificationHandler);
router.get('/getnotifications', getNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);

export default router;
