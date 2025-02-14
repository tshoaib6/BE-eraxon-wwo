// import nodemailer from 'nodemailer';
// import ejs from 'ejs';
// import fs from 'fs';
// import path from 'path';

// export const sendEmail = async (to: string, subject: string, templatePath: string, templateData: any) => {
//   // Check if the environment variables are set
//   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//     throw new Error('Email configuration is not set.');
//   }

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   try {
//     // Read the HTML template file
//     const templateFilePath = path.join(__dirname, templatePath);
//     const template = await fs.promises.readFile(templateFilePath, 'utf-8');

//     // Render the template with EJS
//     const emailBody = ejs.render(template, { otp: templateData.otp });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       html: emailBody, // Send rendered HTML content
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Email sent to ${to} successfully.`);
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send email. Please try again later.');
//   }
// };

// import nodemailer from "nodemailer";
// import ejs from "ejs";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
// import SMTPTransport from "nodemailer/lib/smtp-transport";
// import ErrorHandler from "../utils/errorHandler";

// dotenv.config();

// export const sendEmail = async (
//   to: string,
//   subject: string,
//   templatePath: string,
//   templateData: any
// ) => {
//   try {
//     // Environment validation
//     if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//       throw new ErrorHandler(
//         500,
//         "Email configuration not found in environment variables"
//       );
//     }

//     console.log("SMTP User:", process.env.EMAIL_USER);
//     console.log(
//       "SMTP Password:",
//       process.env.EMAIL_PASS ? "Loaded" : "Not Loaded"
//     );
//     console.log("SMTP Port:", process.env.SMTP_PORT || 465);

//     // Configure SMTP transporter
//     const transporter = nodemailer.createTransport({
//       host: "smtp.hostinger.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//         method: "LOGIN",
//       },
//       logger: true,
//       debug: true,
//     } as SMTPTransport.Options);

//     // Verify SMTP connection
//     await transporter.verify();
//     console.log("✅ SMTP connection verified");

//     // Read and render template
//     const resolvedTemplatePath = path.resolve(__dirname, templatePath);
//     const template = await fs.promises.readFile(resolvedTemplatePath, "utf-8");
//     const htmlContent = ejs.render(template, templateData);

//     // Configure email options
//     const mailOptions = {
//       from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html: htmlContent,
//     };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ Email sent to ${to} (Message ID: ${info.messageId})`);

//     return info;
//   } catch (error: any) {
//     console.error("❌ Email sending error:", error.response || error);
//     throw new ErrorHandler(
//       500,
//       error.message || "Failed to send email. Please try again later."
//     );
//   }
// };

// import nodemailer from "nodemailer";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
// import SMTPTransport from "nodemailer/lib/smtp-transport";
// import ErrorHandler from "../utils/errorHandler";

// dotenv.config();

// export const sendEmail = async (
//   email: string,
//   subject: string,
//   templatePath: string,
//   replacements: Record<string, string> = {}
// ) => {
//   try {
//     console.log("SMTP User:", process.env.EMAIL_USER);
//     console.log(
//       "SMTP Password:",
//       process.env.EMAIL_PASS ? "Loaded" : "Not Loaded"
//     );
//     console.log("SMTP Port:", process.env.SMTP_PORT);

//     const resolvedTemplatePath = path.resolve(__dirname, templatePath);
//     let template = fs.readFileSync(resolvedTemplatePath, "utf-8");

//     // Replace placeholders dynamically
//     Object.keys(replacements).forEach((key) => {
//       template = template.replace(
//         new RegExp(`{{${key}}}`, "g"),
//         replacements[key]
//       );
//     });

//     // Updated transporter configuration
//     const transporter = nodemailer.createTransport({
//       host: "smtp.hostinger.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       logger: true,
//       debug: true,
//     } as SMTPTransport.Options);

//     await transporter.verify();
//     console.log("✅ SMTP connection successful!");

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject,
//       html: template,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Email sent successfully to ${email}`);
//   } catch (error: any) {
//     console.error("Error sending email:", error.response || error);
//     throw new ErrorHandler(500, "Failed to send email");
//   }
// };

import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import ejs from "ejs";
import ErrorHandler from "../utils/errorHandler";
dotenv.config();
export const sendEmail = async (
  email: string,
  subject: string,
  templatePath: string,
  replacements: Record<string, string> = {}
) => {
  try {
    console.log("SMTP User:", process.env.EMAIL_USER);
    console.log("SMTP Port:", process.env.SMTP_PORT);
    console.log(
      "Resolved template path:",
      path.resolve(__dirname, templatePath)
    );
    // Read and render the template using EJS
    const templateContent = fs.readFileSync(
      path.resolve(__dirname, templatePath),
      "utf-8"
    );
    const template = ejs.render(templateContent, replacements);
    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,
      debug: true,
    } as SMTPTransport.Options);
    await transporter.verify();
    console.log(":white_check_mark: SMTP connection successful!");
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: template,
    });
    console.log(`:white_check_mark: Email sent successfully to ${email}`);
  } catch (error: any) {
    console.error("Error sending email:", error.response || error);
    throw new ErrorHandler(500, "Failed to send email");
  }
};
