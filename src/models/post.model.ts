import mongoose, { Schema, Document } from 'mongoose'
export interface IPost extends Document {
  userId: mongoose.Schema.Types.ObjectId; 
  content: string;
  mediaUrl?: string; 
}

const PostSchema: Schema<IPost> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the 'User' model
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    mediaUrl: [{
      type: String, 
      required: false, 
      trim: true 
    }]
  },
  {
    timestamps: true 
  }
);

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;
