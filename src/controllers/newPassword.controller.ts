import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { forgotPasswordService } from '../services/forgotPassword.service';

// const JWT_SECRET = process.env.JWT_SECRET;

export const setNewPassword = async (req: Request, res: Response) => {
  const { email, newPassword, confirmPassword, token } = req.body;

  // Check if passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  // Verify the token before allowing password reset
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is required.' });
    }

    // Decode and verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // Check if the email in the token matches the provided email
    if (decoded.email !== email) {
      return res.status(400).json({ message: 'Invalid token or email mismatch.' });
    }

    // Proceed to update the password
    await forgotPasswordService.setNewPassword(email, newPassword);
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error: any) {
    // Handle token verification errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token. Password not updated.' });
    }

    // General error handling
    res.status(500).json({ message: 'Internal server error' });
  }
};
