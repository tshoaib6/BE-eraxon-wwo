import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

export const sendEmail = async (to: string, subject: string, templatePath: string, templateData: any) => {
  // Check if the environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration is not set.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Read the HTML template file
    const templateFilePath = path.join(__dirname, templatePath);
    const template = await fs.promises.readFile(templateFilePath, 'utf-8');

    // Render the template with EJS
    const emailBody = ejs.render(template, { otp: templateData.otp });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: emailBody, // Send rendered HTML content
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} successfully.`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email. Please try again later.');
  }
};
