import { Request, Response } from "express";
import GuestBook from "../models/guestBook.model";
import { extractUserIdFromToken } from "../utils/extractUserIdFromToken";
import { v2 as cloudinary } from "cloudinary";

export const createGuestBookEntry = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Incoming guestbook entry request...");

    // Extract token
    const token =
      req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decodedPayload = JSON.parse(
      Buffer.from(parts[1], "base64").toString()
    );
    const userId = extractUserIdFromToken(decodedPayload);

    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { message, relationToDeceased } = req.body;

    if (!message || !relationToDeceased) {
      return res.status(400).json({
        message: "Message and relationToDeceased are required",
      });
    }

    // ✅ Handle Cloudinary image upload
    let imageUrl = null;
    if (req.file && req.file.path) {
      // cloudinaryStorage gives you the file info
      console.log("📷 Uploaded File from multer-cloudinary:", req.file);
      imageUrl = req.file.path; // This is already the Cloudinary URL!
    }

    // Save to MongoDB
    const guestBookEntry = new GuestBook({
      message,
      relationToDeceased,
      image: imageUrl,
      user: userId,
    });

    const savedEntry = await guestBookEntry.save();

    return res.status(201).json({
      message: "GuestBook entry created successfully",
      data: savedEntry,
    });
  } catch (error) {
    console.error("❌ Error creating GuestBook entry:", error);
    return res
      .status(500)
      .json({ message: "Failed to create GuestBook entry" });
  }
};

// ✅ Get All Entries
export const getGuestBookEntries = async (req: Request, res: Response) => {
  try {
    const entries = await GuestBook.find().populate(
      "user",
      "firstName lastName"
    );

    if (entries.length === 0) {
      return res.status(404).json({ message: "No guestbook entries found" });
    }

    return res.status(200).json({
      message: "GuestBook entries retrieved successfully",
      data: entries,
    });
  } catch (error) {
    console.error("Error fetching GuestBook entries:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve GuestBook entries" });
  }
};
