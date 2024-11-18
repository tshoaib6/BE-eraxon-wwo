import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the GuestBook entry
interface IGuestBook extends Document {
  message: string;
  relationToDeceased: string;
  image?: string; // This will store the image URL after uploading (or null if no image)
  user: mongoose.Schema.Types.ObjectId; // Reference to the User model
}

// Define the schema for the GuestBook model
const guestBookSchema: Schema<IGuestBook> = new Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relationToDeceased: {
      type: String,
      required: true,
      enum: ['father', 'mother', 'sibling', 'spouse', 'friend', 'other'], // Add any other relations as needed
    },
    image: {
      type: String, // Assuming you're storing the image URL or path here after uploading
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // This field will store the ObjectId of the user
      ref: 'User', // This links the field to the 'User' collection in MongoDB
      required: true, // Ensure that every guestbook entry has an associated user
    },
  },
  { timestamps: true } // To track when the entry was created/updated
);

// Create the model using the schema
const GuestBook = mongoose.model<IGuestBook>('GuestBook', guestBookSchema);

export default GuestBook;
