import mongoose, { Schema, Document } from "mongoose";

interface IInvoice extends Document {
  invoiceId: string;
  user: mongoose.Types.ObjectId;
  subscriptionDate: Date;
  subscriptionEndDate: Date;
  planName: string;
  planPrice: string;
//   paymentStatus: string; // 'paid' or 'unpaid'
}

const invoiceSchema = new Schema<IInvoice>({
  invoiceId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionDate: { type: Date, required: true },
  subscriptionEndDate: { type: Date, required: true },
  planName: { type: String, required: true },
  planPrice: { type: String, required: true },
//   paymentStatus: { type: String, required: true },
}, { timestamps: true });

const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);

export default Invoice;
