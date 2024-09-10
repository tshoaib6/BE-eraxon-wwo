import nodemailer from 'nodemailer';
import ErrorHandler from '../utils/errorHandler';

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const verificationLink = `${process.env.FRONT_END_URL}/verify-email?token=${token}`;
    console.log('Lin',process.env.FRONT_END_URL)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: `<h1>Email Verification</h1><p>Please click the link below to verify your email:</p><a href="${verificationLink}">Verify Email</a>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ErrorHandler(500, 'Failed to send verification email');
  }
};
