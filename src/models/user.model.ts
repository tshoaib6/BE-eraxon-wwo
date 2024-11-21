import mongoose, { Document, Schema, Model, CallbackError } from 'mongoose'
import bcrypt from 'bcryptjs'
import { IUser } from '../interfaces/user.interface'

const UserSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { type: String, required: true, minlength: 6 },
    isVerified: { type: Boolean, default: false },
    verificationToken: {
      type: String,
      required: function () {
        return !this.isVerified // Only required if not verified
      }
    },
    verificationTokenExpiry: { type: Date, required: true }
  },
  {
    timestamps: true
  }
)

// Pre-save middleware to hash password
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as CallbackError)
  }
})

// Method to compare password for login
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)
export default User
