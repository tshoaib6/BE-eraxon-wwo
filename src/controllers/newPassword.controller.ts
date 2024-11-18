// import jwt from "jsonwebtoken";
// import { Request, Response } from "express";
// import { forgotPasswordService } from "../services/forgotPassword.service";

// // const JWT_SECRET = process.env.JWT_SECRET;

// export const setNewPassword = async (req: Request, res: Response) => {
//   const { email, newPassword, confirmPassword, token } = req.body;

//   // Check if passwords match
//   if (newPassword !== confirmPassword) {
//     return res.status(400).json({ message: "Passwords do not match." });
//   }

//   // Verify the token before allowing password reset
//   try {
//     // Extract token from Authorization header (Bearer <token>)
//     const token = req.headers["authorization"]?.split(" ")[1]; // 'Bearer <token>'   // added this line by umar
//     if (!token) {
//       return res.status(401).json({ message: "Token is required." });
//     }

//     // Decode and verify the token
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

//     // Check if the email in the token matches the provided email
//     if (decoded.email !== email) {
//       return res
//         .status(400)
//         .json({ message: "Invalid token or email mismatch." });
//     }

//     // Proceed to update the password
//     await forgotPasswordService.setNewPassword(email, newPassword);
//     res.status(200).json({ message: "Password updated successfully." });
//   } catch (error: any) {
//     // Handle token verification errors
//     if (
//       error.name === "JsonWebTokenError" ||
//       error.name === "TokenExpiredError"
//     ) {
//       return res
//         .status(401)
//         .json({ message: "Invalid or expired token. Password not updated." });
//     }

//     // General error handling
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// with notification functionality 
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { Request, Response } from "express";
// import { forgotPasswordService } from "../services/forgotPassword.service";
// import Notification  from "../models/notification.model"; // Import your notification model
// import { getSocket } from "../socket"; // Import your Socket.IO instance getter
// import { extractUserIdFromToken } from "../utils/extractUserIdFromToken"; // Import your utility function

// export const setNewPassword = async (req: Request, res: Response) => {
//   const { email, newPassword, confirmPassword } = req.body;

//   // Check if passwords match
//   if (newPassword !== confirmPassword) {
//     return res.status(400).json({ message: "Passwords do not match." });
//   }

//   try {
//     // Extract token from cookies or Authorization header
//     const token =
//       req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Authorization token is required." });
//     }

//     // Decode and verify the token
//     const decodedToken = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     ) as JwtPayload;

//     // Extract userId from the decoded token
//     const userId = extractUserIdFromToken(decodedToken);
//     if (!userId) {
//       return res.status(401).json({ message: "Invalid or expired token." });
//     }

//     // Verify email in the token matches the provided email
//     if (decodedToken.email !== email) {
//       return res
//         .status(400)
//         .json({ message: "Invalid token or email mismatch." });
//     }

//     // Proceed to update the password
//     await forgotPasswordService.setNewPassword(email, newPassword);

//     // Create a notification for password update
//     const passwordUpdateNotification = new Notification({
//       user: userId,
//       title: "Password Updated Successfully",
//       description:
//         "Your password has been updated. If this was not you, please contact support.",
//       url: "/login",
//       status: "unread",
//       type: "password-update",
//       createdAt: new Date(),
//     });

//     // Save the notification to the database
//     await passwordUpdateNotification.save();

//     // Emit the notification via Socket.IO
//     const socket = getSocket();
//     if (socket) {
//       socket.to(userId).emit("notification", {
//         user: userId,
//         title: passwordUpdateNotification.title,
//         description: passwordUpdateNotification.description,
//         url: passwordUpdateNotification.url,
//         type: passwordUpdateNotification.type,
//         status: passwordUpdateNotification.status,
//         createdAt: passwordUpdateNotification.createdAt,
//       });
//     } else {
//       console.warn("Socket.IO instance is not available");
//     }

//     // Respond with success
//     res.status(200).json({ message: "Password updated successfully." });
//   } catch (error: any) {
//     // Handle token verification errors
//     if (
//       error.name === "JsonWebTokenError" ||
//       error.name === "TokenExpiredError"
//     ) {
//       return res
//         .status(401)
//         .json({ message: "Invalid or expired token. Password not updated." });
//     }

//     // General error handling
//     res.status(500).json({ message: "Internal server error" });
//   }
// };




import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { forgotPasswordService } from "../services/forgotPassword.service";
import Notification from "../models/notification.model"; // Assuming you have a Notification model
import { getSocket } from '../socket';
import { JwtPayload } from 'jsonwebtoken';
import { extractUserIdFromToken } from '../utils/extractUserIdFromToken'; // Adjust the path if needed

export const setNewPassword = async (req: Request, res: Response) => {
  const { email, newPassword, confirmPassword } = req.body;

  // Check if passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Extract token from Authorization header (Bearer <token>)
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is required." });
    }

    // Debug: Log the token to ensure it's being received correctly
    console.log("Token from setNewPassword controller:", token);

    // Decode and verify the token
    const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Debug: Log the decoded token to check if userId is present
    console.log("Decoded token from setNewPassword controller:", decoded);

    // Extract userId using the utility function
    const userId = extractUserIdFromToken(decoded);
    console.log("Extracted userId from token:", userId);

    // Check if the email in the token matches the provided email
    if (decoded.email !== email) {
      return res.status(400).json({ message: "Invalid token or email mismatch." });
    }

    // Proceed to update the password
    await forgotPasswordService.setNewPassword(email, newPassword);

    // Create a success notification
    const passwordUpdatedNotification = new Notification({
      user: userId, // Use extracted userId
      title: "Password Updated Successfully",
      description: "Your password has been updated successfully.",
      url: "/profile/settings",
      status: "unread",
      type: "password-update",
      createdAt: new Date(),
    });

    // Debug: Log the notification object
    console.log("Notification to be saved:", passwordUpdatedNotification);

    // Save the notification to the database
    await passwordUpdatedNotification.save();

    // Emit the notification via Socket.IO
    const socket = getSocket();
    if (socket) {
      socket.to(userId).emit('notification', {
        user: userId,
        title: passwordUpdatedNotification.title,
        description: passwordUpdatedNotification.description,
        url: passwordUpdatedNotification.url,
        type: passwordUpdatedNotification.type,
        status: passwordUpdatedNotification.status,
        createdAt: passwordUpdatedNotification.createdAt,
      });
    } else {
      console.warn('Socket.IO instance is not available');
    }

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error: any) {
    // Handle token verification errors
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token. Password not updated." });
    }

    // General error handling
    res.status(500).json({ message: "Internal server error" });
  }
};
