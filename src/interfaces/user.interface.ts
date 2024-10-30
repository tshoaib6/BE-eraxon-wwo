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
  comparePassword(candidatePassword: string): Promise<boolean>;
}
