import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import ErrorHandler from '../utils/errorHandler';

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    // Read the template file
    const templatePath = path.resolve(__dirname, '../views/verifyEmail.templete.html');
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Create the verification link
    const verificationLink = `${process.env.FRONT_END_URL}/verify-email?token=${token}`;

    // Replace the token placeholder
    const htmlContent = template.replace('{{verificationLink}}', verificationLink);

    // Updated Hostinger SMTP configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com', // Hostinger's SMTP server
      port: 465, // Recommended secure port
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER, // Your Hostinger email address
        pass: process.env.EMAIL_PASS, // Your Hostinger email password
      },
      debug: true,
      logger: true,
      tls: {
        // For local development only (bypass SSL verification)
        rejectUnauthorized: false
      }
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: htmlContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ErrorHandler(500, 'Failed to send verification email');
  }
};