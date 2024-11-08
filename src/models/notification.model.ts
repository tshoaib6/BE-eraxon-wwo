import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import User from './user.model'; // Import the User model if needed

// Define the Notification interface
export interface INotification extends Document {
    user: IUser; // Reference the entire User document
    title: string;
    description: string;
    url: string;
    status: 'read' | 'unread';
    type: 'registration' | 'application' | 'system';
    createdAt: Date;
}

// Define the Notification schema
const notificationSchema: Schema<INotification> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // Reference to full User document
    title: { type: String, required: true },
    description: { type: String, required: false },
    url: { type: String, required: true }, // URL or frontend path for navigation
    status: { type: String, enum: ['read', 'unread'], default: 'unread' },
    type: { type: String, enum: ['registration', 'login', 'post_creation','email_verification',"profile-completion","welcome"], required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create and export the Notification model
const Notification: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;
