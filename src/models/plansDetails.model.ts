import mongoose, { Document, Schema } from 'mongoose';

interface IPlanDetails extends Document {
  name: string;
  price: string;
  mediaUploads: string; 
  features: {
    tributeDuration?: string;
    websiteDuration?: string;
    digitalRemembranceBook?: string;
    aiGeneratedContent?: string;
  }[];
}

const PlanDetailsSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['Standard', 'Premium', 'Plus'], // Enum for the plan names
  },
  price: {
    type: String,
    required: false,
  },
  mediaUploads: {
    type: String,
    required: false,
  },
  features: [
    {
      tributeDuration: {
        type: String,
        required: false,
      },
      websiteDuration: {
        type: String,
        required: false,
      },
      digitalRemembranceBook: {
        type: String,
        required: false,
      },
      aiGeneratedContent: {
        type: String,
        required: false,
      },
    },
  ],
});

// Create the model from the schema and export it
const PlanDetails = mongoose.model<IPlanDetails>('PlanDetails', PlanDetailsSchema);
export default PlanDetails;
