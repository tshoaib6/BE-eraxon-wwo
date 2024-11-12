import { Request, Response } from 'express';
import { forgotPasswordService } from '../services/forgotPassword.service';

export const setNewPassword = async (req: Request, res: Response) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }
  try {
    await forgotPasswordService.setNewPassword(email, newPassword, );
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
