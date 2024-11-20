import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Like, Comment, and Share model
export interface IAction extends Document {
  userId: mongoose.Schema.Types.ObjectId; // User who liked/commented/shared
  postId: mongoose.Schema.Types.ObjectId; // Post that was liked/commented/shared
  actionType: 'like' | 'comment' | 'share'; // Type of action
  commentText?: string; // Only required for comments
  likeCount?: number; // Total likes for the post
  commentCount?: number; // Total comments for the post
  shareCount?: number; // Total shares for the post
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
    likeCount: {
      type: Number,
      default: 0, // Default value
    },
    commentCount: {
      type: Number,
      default: 0, // Default value
    },
    shareCount: {
      type: Number,
      default: 0, // Default value
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to update counts
ActionSchema.pre('save', async function (next) {
  const action = this as IAction;

  if (!action.isModified('actionType')) return next();

  // Increment count based on actionType
  const update: Record<string, number> = {}; // Explicitly type the update object
  if (action.actionType === 'like') update['likeCount'] = 1;
  if (action.actionType === 'comment') update['commentCount'] = 1;
  if (action.actionType === 'share') update['shareCount'] = 1;

  // Update post counts
  await mongoose
    .model('Post')
    .findByIdAndUpdate(action.postId, { $inc: update });

  next();
});


const Action = mongoose.model<IAction>('Action', ActionSchema);

export default Action;
