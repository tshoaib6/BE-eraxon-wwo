import { Request, Response } from 'express';
import { loginUser, signUpUser, verifyUserEmail } from '../services/user.service';
import ErrorHandler, { handleError } from '../utils/errorHandler';

export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const user = await signUpUser(firstName, lastName, email, password);
    return res.status(201).json({ message: 'User registered. Verification email sent.' });
  } catch (error) {
    handleError(error, res);
    return res;  
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Invalid or missing token' });
  }

  try {
    await verifyUserEmail(token as string);
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    handleError(error, res);
    return res.json(); 
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await loginUser(email, password);

    res.cookie('token', response.token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 15 * 60 * 1000, 
    });

    res.json({ message: 'Login successful' , user:response.user});
  } catch (error) {
    handleError(error, res);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token'); 
  res.status(200).json({ message: 'Logged out successfully' });
};




