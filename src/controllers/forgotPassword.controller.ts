import { Request, Response } from 'express';
import { forgotPasswordService } from '../services/forgotPassword.service';

export const requestPasswordReset = async (req: Request, res: Response) => {
  const email = req.query.email as string; // Get email from query

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    await forgotPasswordService.requestReset(email);
    return res.status(200).json({ message: "OTP sent to email." });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};


export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const isValid = await forgotPasswordService.verifyOTP(email, otp);
    if (isValid) {
      res.status(200).json({ message: 'OTP verified successfully. You may proceed to reset your password.' });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error' });
  }
};