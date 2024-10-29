import mongoose, { Document, Schema, Model } from 'mongoose';
import User from './user.model'; // Update with the correct path to your User model

interface ICommunity extends Document {
  communityId: number;
  communityName: string;
  profilePic: string;
  members: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
}

const communitySchema: Schema<ICommunity> = new Schema(
  {
    communityId: {
      type: Number,
      required: true,
      unique: true
    },
    communityName: {
      type: String,
      required: true
    },
    profilePic: {
      type: String,
      required: true
    },
    members: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const Community: Model<ICommunity> = mongoose.model<ICommunity>('Community', communitySchema);
export default Community;