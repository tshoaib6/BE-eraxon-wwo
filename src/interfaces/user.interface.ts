import { Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender:string;
  profilePic: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry: Date;
  resetOTP?: string; // Add this line
  otpExpires?: Date; // Add this line 
  comparePassword(candidatePassword: string): Promise<boolean>;
}
