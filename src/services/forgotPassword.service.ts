import User from '../models/user.model';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';

export const forgotPasswordService = {
  requestReset: async (email: string) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Email not found.');
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Set OTP and expiration time
    user.resetOTP = otp;
    user.otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    await user.save();

    // Send the OTP to the user's email
    await sendEmail(user.email, 'Password Reset OTP', `Your OTP is ${otp}`);
  },
};
