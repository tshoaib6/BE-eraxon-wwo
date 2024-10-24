// import mongoose, { Schema, Document } from 'mongoose';

// export interface StepData extends Document {
//   userId: mongoose.Schema.Types.ObjectId; 
//   status: 'drafted' | 'submitted'; 
//   step1: {
//     basicInfo: {
//       nameOfDeceased?: string;
//       dateOfBirth?: string | null;
//       dateOfDeath?: string | null;
//       gender?: string;
//       placeOfBirth?: string;
//       placeOfDeath?: string;
//     };
//   };
//   step2: {
//     family: {
//       survivingFamilyMembers?: {
//         memberName?: string;
//         relation?: string;
//         note?: string;
//         memberImage?: string | File | null;
//       }[];
//       predeceasedFamilyMembers?: {
//         memberName?: string;
//         relation?: string;
//         note?: string;
//         memberImage?: string | File | null;
//       }[];
//     };
//   };
//   step3: {
//     memorialServices: {
//       eventName: string;
//       specialInstructions: string;
//       date: string;
//       time: string;
//       locationName: string;
//       address: string;
//       city: string;
//       state: string;
//       zipCode: string;
//       country: string;
//       contactPhoneNumber: string;
//       timeZone: string;
//       eventViewingLink: string;
//     }[];
//   };
//   step4: {
//     personalDetails: {
//       lifeStory: string; 
//       education: {
//         schoolName?: string;
//         from?: string;
//         to?: string;
//         schoolLocation?: string;
//         degree?: string;
//       }[]; 
//       careerHighlights?: string;
//       hobbies?: string;
//       interests?: string;
//     };
//   };
//   step5: {
//     mediaFiles?: {
//       file: string; 
//       date: string; 
//       note?: string; 
//     }[];
//   };
// }

// const CombinedFormSchema: Schema<StepData> = new Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', 
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ['drafted', 'submitted'],
//       default: 'drafted', 
//     },
//     step1: {
//       basicInfo: {
//         nameOfDeceased: { type: String, required: false },
//         dateOfBirth: { type: String, required: false },
//         dateOfDeath: { type: String, required: false },
//         gender: { type: String, required: false },
//         placeOfBirth: { type: String, required: false },
//         placeOfDeath: { type: String, required: false },
//       },
//     },
//     step2: {
//       family: {
//         survivingFamilyMembers: [
//           {
//             memberName: { type: String, required: false },
//             relation: { type: String, required: false },
//             note: { type: String, required: false },
//             memberImage: { type: String, required: false },
//           },
//         ],
//         predeceasedFamilyMembers: [
//           {
//             memberName: { type: String, required: false },
//             relation: { type: String, required: false },
//             note: { type: String, required: false },
//             memberImage: { type: String, required: false },
//           },
//         ],
//       },
//     },
//     step3: {
//       memorialServices: [
//         {
//           eventName: { type: String, required: true },
//           specialInstructions: { type: String, required: false },
//           date: { type: String, required: false },
//           time: { type: String, required: false },
//           locationName: { type: String, required: false },
//           address: { type: String, required: false },
//           city: { type: String, required: false },
//           state: { type: String, required: false },
//           zipCode: { type: String, required: false },
//           country: { type: String, required: false },
//           contactPhoneNumber: { type: String, required: false },
//           timeZone: { type: String, required: false },
//           eventViewingLink: { type: String, required: false },
//         },
//       ],
//     },
//     step4: {
//       personalDetails: {
//         lifeStory: { type: String, required: true }, 
//         education: [
//           {
//             schoolName: { type: String, required: false },
//             from: { type: String, required: false },
//             to: { type: String, required: false },
//             schoolLocation: { type: String, required: false },
//             degree: { type: String, required: false },
//           },
//         ], 
//         careerHighlights: { type: String, required: false },
//         hobbies: { type: String, required: false },
//         interests: { type: String, required: false },
//       },
//     },
//     step5: {
//       mediaFiles: [
//         {
//           file: { type: String, required: true }, 
//           date: { type: String, required: true }, 
//           note: { type: String, required: false, maxlength: 500 }, 
//         },
//       ],
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const CombinedForm = mongoose.model<StepData>('CombinedForm', CombinedFormSchema);
// export default CombinedForm;



import mongoose, { Schema, Document } from 'mongoose';

export interface StepData extends Document {
  userId: mongoose.Schema.Types.ObjectId; 
  status: 'drafted' | 'submitted'; 
  step1: {
    basicInfo: {
      nameOfDeceased?: string;
      dateOfBirth?: string | null;
      dateOfDeath?: string | null;
      gender?: string;
      placeOfBirth?: string;
      placeOfDeath?: string;
    };
  };
  step2: {
    family: {
      survivingFamilyMembers?: {
        memberName?: string;
        lastName?: string; // Added lastName
        relation?: string;
        note?: string;
        memberImage?: string | File | null; // Retain memberImage in each family member object
      }[]; // Changed to `survivingFamilyMembers` to match frontend
      predeceasedFamilyMembers?: {
        memberName?: string;
        relation?: string;
        note?: string;
        memberImage?: string | File | null; // Retain memberImage in each family member object
      }[]; // Changed to `predeceasedFamilyMembers` to match frontend
    };
  };
  step3: {
    memorialServices: {
      eventName: string;
      specialInstructions: string;
      date: string;
      time: string;
      locationName: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      contactPhoneNumber: string;
      timeZone: string;
      eventViewingLink: string;
    }[]; 
  };
  step4: {
    personalDetails: {
      lifeStory: string; 
      education: {
        schoolName?: string;
        from?: string;
        to?: string;
        schoolLocation?: string;
        degree?: string;
      }[]; 
      careerHighlights?: string;
      hobbies?: string;
      interests?: string;
    };
  };
  step5: {
    mediaFiles?: {
      file: string; 
      date: string; 
      note?: string; 
    }[];
  };
}

const CombinedFormSchema: Schema<StepData> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    status: {
      type: String,
      enum: ['drafted', 'submitted'],
      default: 'drafted', 
    },
    step1: {
      basicInfo: {
        nameOfDeceased: { type: String, required: false },
        dateOfBirth: { type: String, required: false },
        dateOfDeath: { type: String, required: false },
        gender: { type: String, required: false },
        placeOfBirth: { type: String, required: false },
        placeOfDeath: { type: String, required: false },
      },
    },
    step2: {
      family: {
        survivingFamilyMembers: [
          {
            memberName: { type: String, required: false },
            lastName: { type: String, required: false }, // Added lastName
            relation: { type: String, required: false },
            note: { type: String, required: false },
            memberImage: { type: String, required: false }, // Retaining memberImage
          },
        ],
        predeceasedFamilyMembers: [
          {
            memberName: { type: String, required: false },
            relation: { type: String, required: false },
            note: { type: String, required: false },
            memberImage: { type: String, required: false }, // Retaining memberImage
          },
        ],
      },
    },
    step3: {
      memorialServices: [
        {
          eventName: { type: String, required: true },
          specialInstructions: { type: String, required: false },
          date: { type: String, required: false },
          time: { type: String, required: false },
          locationName: { type: String, required: false },
          address: { type: String, required: false },
          city: { type: String, required: false },
          state: { type: String, required: false },
          zipCode: { type: String, required: false },
          country: { type: String, required: false },
          contactPhoneNumber: { type: String, required: false },
          timeZone: { type: String, required: false },
          eventViewingLink: { type: String, required: false },
        },
      ],
    },
    step4: {
      personalDetails: {
        lifeStory: { type: String, required: true }, 
        education: [
          {
            schoolName: { type: String, required: false },
            from: { type: String, required: false },
            to: { type: String, required: false },
            schoolLocation: { type: String, required: false },
            degree: { type: String, required: false },
          },
        ], 
        careerHighlights: { type: String, required: false },
        hobbies: { type: String, required: false },
        interests: { type: String, required: false },
      },
    },
    step5: {
      mediaFiles: [
        {
          file: { type: String, required: true }, 
          date: { type: String, required: true }, 
          note: { type: String, required: false, maxlength: 500 }, 
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const CombinedForm = mongoose.model<StepData>('CombinedForm', CombinedFormSchema);
export default CombinedForm;
