// import mongoose, { Schema, Document } from 'mongoose';

// // Define the interface for the Like, Comment, and Share model
// export interface IAction extends Document {
//   userId: mongoose.Schema.Types.ObjectId;
//   postId: mongoose.Schema.Types.ObjectId;
//   actionType: "like" | "comment" | "share" | "reply"; // Includes "reply"
//   commentText?: string;
//   parentCommentId?: mongoose.Schema.Types.ObjectId;
//   likeCount?: number;
//   commentCount?: number;
//   shareCount?: number;
//   replyCount?: number;
//   createdAt?: Date;
// }


// const ActionSchema: Schema<IAction> = new Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // Reference to the 'User' model
//       required: true,
//     },
//     postId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Post', // Reference to the 'Post' model
//       required: true,
//     },
//     actionType: {
//       type: String,
//       enum: ['like', 'comment', 'share','reply'], // Action types
//       required: true,
//     },
//     commentText: {
//       type: String, // Optional field for comments
//       required: function () {
//         return this.actionType === 'comment'; // Required only if actionType is 'comment'
//       },
//       trim: true,
//     },
//     likeCount: {
//       type: Number,
//       default: 0, // Default value
//     },
//     commentCount: {
//       type: Number,
//       default: 0, // Default value
//     },
//     shareCount: {
//       type: Number,
//       default: 0, // Default value
//     },
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt fields
//   }
// );

// // Pre-save middleware to update counts
// ActionSchema.pre('save', async function (next) {
//   const action = this as IAction;

//   if (!action.isModified('actionType')) return next();

//   // Increment count based on actionType
//   const update: Record<string, number> = {}; // Explicitly type the update object
//   if (action.actionType === 'like') update['likeCount'] = 1;
//   if (action.actionType === 'comment') update['commentCount'] = 1;
//   if (action.actionType === 'share') update['shareCount'] = 1;

//   // Update post counts
//   await mongoose
//     .model('Post')
//     .findByIdAndUpdate(action.postId, { $inc: update });

//   next();
// });


// const Action = mongoose.model<IAction>('Action', ActionSchema);

// export default Action;






import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Like, Comment, Share, and Reply model
export interface IAction extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  postId: mongoose.Schema.Types.ObjectId;
  actionType: "like" | "comment" | "share" | "reply"; // Includes "reply"
  commentText?: string;
  parentCommentId?: mongoose.Types.ObjectId; // Reference to the parent comment (for replies)
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  replyCount?: number; // Count of replies for comments
  createdAt?: Date;
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
      enum: ['like', 'comment', 'share', 'reply'], // Action types
      required: true,
    },
    commentText: {
      type: String, // Optional field for comments
      required: function () {
        return this.actionType === 'comment'; // Required only if actionType is 'comment'
      },
      trim: true,
    },
    parentCommentId: {
      type: mongoose.Types.ObjectId,
      ref: 'Action', // Reference to the parent comment (for replies)
      default: null, // Default to null, as it only applies for replies
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
    replyCount: {
      type: Number,
      default: 0, // Default value, used for counting replies under comments
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to update counts and handle replyCount
ActionSchema.pre('save', async function (next) {
  const action = this as IAction;

  if (!action.isModified('actionType')) return next();

  const update: Record<string, number> = {}; // Explicitly type the update object

  // Increment count based on actionType
  if (action.actionType === 'like') update['likeCount'] = 1;
  if (action.actionType === 'comment') update['commentCount'] = 1;
  if (action.actionType === 'share') update['shareCount'] = 1;
  if (action.actionType === 'reply' && action.parentCommentId) {
    // If it's a reply, increment the reply count of the parent comment
    update['replyCount'] = 1;

    // Increment the comment count of the post if it's a comment or reply
    await mongoose.model('Action').updateOne(
      { _id: action.parentCommentId },
      { $inc: { replyCount: 1 } }
    );
  }

  // Update post counts
  if (action.actionType === 'like' || action.actionType === 'comment' || action.actionType === 'share') {
    await mongoose
      .model('Post')
      .findByIdAndUpdate(action.postId, { $inc: update });
  }

  next();
});

const Action = mongoose.model<IAction>('Action', ActionSchema);

export default Action;
