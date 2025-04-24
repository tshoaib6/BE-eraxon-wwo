// import User from '../models/user.model';
// import { sendEmail } from '../utils/email';
// import crypto from 'crypto';
// import bcrypt from 'bcryptjs';
// import handlebars from 'handlebars';
// import fs from 'fs';
// import path from 'path';
// export const forgotPasswordService = {
//   requestReset: async (email: string) => {
//     const user = await User.findOne({ email: email.toLowerCase() });

//     if (!user) {
//       throw new Error('Email not found.');
//     }

//     // Generate a 6-digit OTP
//     const otp = crypto.randomInt(100000, 999999).toString();

//     // Set OTP and expiration time
//     user.resetOTP = otp;
//     user.otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
//     await user.save();

//     // Load and compile the HTML template
//     const templatePath = path.resolve(__dirname, '../views/resetPassword.template.html'); // Correct path to the template
//     console.log("Template Path:", templatePath); // Log the path for debugging

//     let templateSource;
//     try {
//       templateSource = fs.readFileSync(templatePath, 'utf8');
//     } catch (error) {
//       console.error("Error reading template file:", error);
//       throw new Error("Failed to load the email template.");
//     }

//     const template = handlebars.compile(templateSource);

//     // Render the template with the OTP
//     const emailContent = template({ OTP_CODE: otp });

//     // Send the OTP to the user's email
//     await sendEmail(user.email, 'Password Reset OTP', templatePath, emailContent); // Ensure this matches the template path correctly
//   },

//   verifyOTP: async (email: string, otp: string): Promise<boolean> => {
//     const user = await User.findOne({ email, resetOTP: otp });

//     if (!user) {
//       console.log("User not found or OTP doesn't match");
//       return false;
//     }

//     if (user.otpExpires && user.otpExpires < new Date()) {
//       console.log("OTP has expired");
//       return false;
//     }

//     // Clear OTP and expiration time
//     user.resetOTP = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     console.log("OTP verified successfully");
//     return true;
//   },

//   setNewPassword: async (email: string, newPassword: string, confirmPassword: string): Promise<void> => {
//     if (newPassword !== confirmPassword) {
//       throw new Error('Passwords do not match.');
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       throw new Error('User not found.');
//     }

//     // Hash the new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     // Update the user's password and clear OTP fields
//     user.password = hashedPassword;
//     user.resetOTP = undefined;
//     user.otpExpires = undefined;

//     await user.save();
//   }
// };
