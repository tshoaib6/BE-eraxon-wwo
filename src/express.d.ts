import { Request } from 'express';
import { IUser } from './interfaces/user.interface'; // Adjust the import according to your file structure

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Add the user property
    }
  }
}
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File; // Single file
      files?: Multer.File[]; // Multiple files
    }
  }
}
