import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Location model
export interface ILocation extends Document {
  userId: mongoose.Types.ObjectId; // User associated with the location
  city: string; // City of the user
  country: string; // Country of the user
  createdAt?: Date; // Automatically managed by Mongoose
  updatedAt?: Date; // Automatically managed by Mongoose
}

// Schema definition for Location model
const LocationSchema: Schema = new Schema<ILocation>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Location model
const Location = mongoose.model<ILocation>('Location', LocationSchema);

export default Location;
