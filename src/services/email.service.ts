// import nodemailer from 'nodemailer';
// import ErrorHandler from '../utils/errorHandler';

// export const sendVerificationEmail = async (email: string, token: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, 
//       },
//     });

//     const verificationLink = `${process.env.FRONT_END_URL}/verify-email?token=${token}`;
//     console.log('Lin',process.env.FRONT_END_URL)
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Email Verification',
//       html: `<h1>Email Verification</h1><p>Please click the link below to verify your email:</p><a href="${verificationLink}">Verify Email</a>`,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     throw new ErrorHandler(500, 'Failed to send verification email');
//   }
// };


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

    // Replace the token placeholder with the actual link
    const htmlContent = template.replace('{{verificationLink}}', verificationLink);

    // Set up nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: htmlContent, // Use the modified HTML content
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ErrorHandler(500, 'Failed to send verification email');
  }
};
