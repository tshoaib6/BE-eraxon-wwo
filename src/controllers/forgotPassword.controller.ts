import { Request, Response } from 'express';
import { forgotPasswordService } from '../services/forgotPassword.service';

export const requestPasswordReset = async (req: Request, res: Response ) => {
  const { email } = req.body;

  try {
    await forgotPasswordService.requestReset(email);
  } catch (error:any) {
    return res.status(400).json({ message: error.message });
  }
};
