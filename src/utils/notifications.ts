// utils/notificationUtils.ts

import Notification from '../models/notification.model'; // Adjust path as needed
import  {INotification}  from '../models/notification.model';
import { IUser } from '../interfaces/user.interface';

interface NotificationData {
    user: IUser['_id'];
    title: string;
    description: string;
    url: string;
    type: string;
}

/**
 * Utility function to create a new notification.
 * @param data - The notification data (user, title, description, url, type).
 * @returns The created notification document.
 */
export const createNotification = async (data: NotificationData): Promise<INotification> => {
    const { user, title, description, url, type } = data;

    const notification = new Notification({
        user,
        title,
        description,
        url,
        status: 'unread', // Default status
        type,
    });

    return await notification.save();
};
