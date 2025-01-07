import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the model
interface IDigitalRemembranceBook extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User who created the remembrance
  recordId: mongoose.Types.ObjectId; // Reference to the whole record (not specific step)
  images: Array<{
    imageUrl: string; // URL of the image in Cloudinary
    description: string; // Description of the image
    date: Date; // Date related to the image (when it was taken or relevant to the remembrance)
  }> ;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the Digital Remembrance Book
const DigitalRemembranceBookSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Record', required: true }, // Changed to `recordId`
    images: [
      {
        imageUrl: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true }
      }
    ]
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Create and export the Digital Remembrance Book model
const DigitalRemembranceBook: Model<IDigitalRemembranceBook> = mongoose.model<IDigitalRemembranceBook>('DigitalRemembranceBook', DigitalRemembranceBookSchema);
export default DigitalRemembranceBook;
