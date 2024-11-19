import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Like, Comment, and Share model
export interface IAction extends Document {
  userId: mongoose.Schema.Types.ObjectId; // User who liked/commented/shared
  postId: mongoose.Schema.Types.ObjectId; // Post that was liked/commented/shared
  actionType: 'like' | 'comment' | 'share'; // Type of action
  commentText?: string; // Only required for comments
  createdAt?: Date; // Action creation timestamp
}

const ActionSchema: Schema<IAction> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Reference to the 'Post' model
      required: true,
    },
    actionType: {
      type: String,
      enum: ['like', 'comment', 'share'], // Action types
      required: true,
    },
    commentText: {
      type: String, // Optional field for comments
      required: function () {
        return this.actionType === 'comment'; // Required only if actionType is 'comment'
      },
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Action = mongoose.model<IAction>('Action', ActionSchema);

export default Action;
