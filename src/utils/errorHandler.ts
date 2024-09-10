import { Request, Response } from 'express';

class ErrorHandler extends Error {
    statusCode: number;
  
    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const handleError = (err:any , res: Response) => {
    const { statusCode, message } = err;
    
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
    });
  };
  
  export default ErrorHandler;
  