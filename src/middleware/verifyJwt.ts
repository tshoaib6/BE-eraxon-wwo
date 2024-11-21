// import { Request, Response, NextFunction } from 'express';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import ErrorHandler from '../utils/errorHandler';

// export interface CustomRequest extends Request {
//     token: string | JwtPayload;
//    }

// const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     (req as CustomRequest).token = decoded;
//     next();
//   } catch (error) {
//     throw new ErrorHandler(403, 'Invalid or expired token.');
//   }
// };

// export default verifyJwt;

// maine code is above

// // src/middleware/verifyJwt.ts
// import { Request, Response, NextFunction } from 'express';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import ErrorHandler from '../utils/errorHandler';

// export interface CustomRequest extends Request {
//     user?: { _id: string }; // Include user properties here as needed
// }

// const verifyJwt = (req: CustomRequest, res: Response, next: NextFunction) => {
//     const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
//         req.user = { _id: decoded._id }; // Set the user ID or other user properties here
//         next();
//     } catch (error) {
//         throw new ErrorHandler(403, 'Invalid or expired token.');
//     }
// };

// export default verifyJwt;

import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

export interface CustomRequest extends Request {
  token: JwtPayload
}

const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  // Safely access token from cookies or authorization header
  const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1]

  // Check if token is available
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' })
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload
    // Attach the decoded token to the request object
    ;(req as CustomRequest).token = decoded
    next() // Proceed to the next middleware
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' })
  }
}

export default verifyJwt
