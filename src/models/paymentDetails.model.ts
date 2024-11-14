import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
  fullName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  addressOrTaxId?: string;
  user?: mongoose.Schema.Types.ObjectId; // Optional reference to the User model
}

const PaymentSchema: Schema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  cardNumber: {
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
  addressOrTaxId: {
    type: String,
    required: false, // Optional
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: false,
  },
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
