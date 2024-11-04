import mongoose, { Document, Schema } from 'mongoose';

interface IPayment extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the User model
  fullName: string;
  cardDetails: string;
  expiryDate: string; // MM / YY format
  cvv: string;
  address?: string; // Optional
  taxId?: string; // Optional
}

const PaymentSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: false,
  },
  fullName: {
    type: String,
    required: true,
  },
  cardDetails: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: '', // Optional
  },
  taxId: {
    type: String,
    default: '', // Optional
  },
}, { timestamps: true });

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
