import mongoose, { Schema, Document } from 'mongoose';

interface IUserInformation extends Document {
  city: string;
  country: string;
  phonenumber: string;
  user: mongoose.Schema.Types.ObjectId; // Reference to User model
}

const UserInformationSchema: Schema = new Schema({
  city: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  phonenumber: {
    type: String,
    required: true,
   
    },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model<IUserInformation>('UserInformation', UserInformationSchema);
