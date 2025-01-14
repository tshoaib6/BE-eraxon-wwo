import Notification from '../models/notification.model'; // Adjust path as needed
import { INotification } from '../models/notification.model';
import { IUser } from '../interfaces/user.interface';
import User from '../models/user.model'; // Adjust the path if needed

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
 * @returns The created notification document with user profile picture.
 */
export const createNotification = async (data: NotificationData): Promise<INotification> => {
    const { user, title, description, url, type } = data;

    // Create a new notification
    const notification = new Notification({
        user,
        title,
        description,
        url,
        status: 'unread', // Default status
        type,
    });

    // Save the notification
    await notification.save();

    // Populate user field to include the profilePic
    const populatedNotification = await Notification.findById(notification._id)
        .populate('user', 'profilePic') // Only populate profilePic from the User model
        .exec();

    return populatedNotification!;
};
