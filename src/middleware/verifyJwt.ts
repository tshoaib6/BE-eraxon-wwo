import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ErrorHandler from '../utils/errorHandler';


export interface CustomRequest extends Request {
    token: string | JwtPayload;
   }

const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as CustomRequest).token = decoded; 
    next(); 
  } catch (error) {
    throw new ErrorHandler(403, 'Invalid or expired token.');
  }
};

export default verifyJwt;
