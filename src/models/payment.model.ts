import mongoose, { Document, Schema } from 'mongoose';
// import { IUser } from './user.model'; // Import IUser interface

// Define the Payment interface
export interface IPayment extends Document {
  paymentId: string;
  payerId: string;
  user: mongoose.Schema.Types.ObjectId;  // Reference to User
  amount: number;
  currency: string;
  paymentStatus: string;
  payerEmail?: string;
  transactionId?: string;
  createdAt: Date;
}

// Define the Payment schema
const paymentSchema = new Schema<IPayment>(
  {
    paymentId: { type: String, required: true },
    payerId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    payerEmail: { type: String },
    transactionId: { type: String },
  },
  { timestamps: true }
);

// Create and export the Payment model
const Payment = mongoose.model<IPayment>('PaypalPayment', paymentSchema);

export default Payment;
