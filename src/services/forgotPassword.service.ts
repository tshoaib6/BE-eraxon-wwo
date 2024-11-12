import User from '../models/user.model';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';
import bcrypt from 'bcryptjs'
// import resetPasswordTemplate from '../views/resetPassword.template.html';
export const forgotPasswordService = {
  requestReset: async (email: string) => {
    // Convert the provided email to lowercase to match the format in the database
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
    // await sendEmail(user.email, 'Password Reset OTP', `Your OTP is ${otp}`);
    await sendEmail(user.email, 'Password Reset OTP', '../views/resetPassword.templete.html', { otp });

  },

  verifyOTP: async (email: string, otp: string): Promise<boolean> => {
    const user = await User.findOne({ email, resetOTP: otp });
  
    // Check if the user exists and log relevant information
    if (!user) {
      console.log("User not found or OTP doesn't match");
      return false;
    }
  
    console.log("User found:", user.email);
    console.log("Stored OTP:", user.resetOTP);
    console.log("Provided OTP:", otp);
    console.log("OTP Expiration Time:", user.otpExpires);
    console.log("Current Time:", new Date());
  
    // Check if OTP has expired
    if (user.otpExpires && user.otpExpires < new Date()) {
      console.log("OTP has expired");
      return false;
    }
  
    // OTP is valid; clear the OTP and expiration time
    user.resetOTP = undefined;
    user.otpExpires = undefined;
    await user.save();
  
    console.log("OTP verified successfully");
    return true;
  },

  // In forgotPasswordService
  setNewPassword: async (email: string, newPassword: string) => {
    const user = await User.findOne({ email });
 
    if (!user) throw new Error('User not found.');
 
    // Set the new password directly without hashing
    user.password = newPassword;
 
    // Clear OTP fields
    user.resetOTP = undefined;
    user.otpExpires = undefined;
 
    await user.save(); // The pre-save middleware will hash the password
 }
 

};
