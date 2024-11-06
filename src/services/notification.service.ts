


import  Notification  from '../models/notification.model'; // Assuming you have a Notification model

// Function to fetch notifications for a specific user and type
export const getNotificationsForUser = async (
  userId: string,
  type: string
): Promise<any> => {
  try {
    // Fetch notifications from the database based on user ID and type
    const notifications = await Notification.find({ user: userId, type });

    return notifications;
  } catch (error) {
    throw new Error('Error fetching notifications');
  }
};
