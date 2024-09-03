import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import User, { IUser } from '../models/user.model';
import '../services/user.service';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const signup = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    try {
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '30m' });
        const user = new User({
            name,
            email,
            password,
            verificationToken,
            verificationTokenExpiry: new Date(Date.now() + 30 * 60 * 1000),
        });

        await user.save();

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Email Verification',
            html: `<h1>Email Verification</h1><p>Please click the link below to verify your email:</p><a href="${verificationLink}">Verify Email</a>`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: 'User registered. Verification email sent.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.query;

    if (!token) return res.status(400).json({ message: 'Invalid or missing token' });
    console.log(token);
    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        console.log(decoded);
        const user = await User.findOne({ email: decoded.email, verificationToken: token });
        console.log('User :',user);
        if (!user || user.verificationTokenExpiry < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        await user.save();
        return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
