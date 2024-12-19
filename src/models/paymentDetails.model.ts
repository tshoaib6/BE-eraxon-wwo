import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
  fullName: string;
  cardNumber: string;
  expiryDate: string;
  addressOrTaxId?: string;
  user: mongoose.Schema.Types.ObjectId; 
  plan: mongoose.Schema.Types.ObjectId; 
}

const PaymentSchema: Schema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  cardNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        // Luhn Algorithm for validating card numbers
        return /^\d{16}$/.test(value);
      },
      message: 'Invalid card number',
    },
  },
  expiryDate: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        const [month, year] = value.split('/').map(Number);
        const now = new Date();
        const expiry = new Date(`20${year}-${month}-01`);
        return expiry > now;
      },
      message: 'Invalid or expired expiry date',
    },
  },
  addressOrTaxId: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlanDetails',
    required: true,
  },
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
