import mongoose, { Schema, Model, Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

interface IPlanDetails extends Document {
  planName: string;
  planPrice: string;
  planFeatures: string[]; // Array of features (strings)
  user: mongoose.Types.ObjectId; // Reference to the User schema
  createdAt: Date;
  updatedAt: Date;
}

const PlanDetailsSchema: Schema<IPlanDetails> = new Schema(
  {
    planName: { type: String, required: false, trim: true },
    planPrice: { type: String, required: false, trim: true },
    planFeatures: { type: [String], required: true }, // Array of strings for features
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Reference to User schema
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the PlanDetails model
const PlanDetails: Model<IPlanDetails> = mongoose.model<IPlanDetails>('PlanDetails', PlanDetailsSchema);

export default PlanDetails;
