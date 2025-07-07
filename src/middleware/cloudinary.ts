import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Generic file uploader (posts)
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "posts",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov"],
    resource_type: "auto",
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ✅ Profile picture uploader
const profilePicStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "profile_pics",
    allowed_formats: ["jpg", "png", "jpeg"],
    resource_type: "image",
  }),
});

const uploadProfilePic = multer({
  storage: profilePicStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ✅ Guestbook image uploader
const guestBookImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "guestbook_images",
    allowed_formats: ["jpg", "png", "jpeg"],
    resource_type: "image",
  }),
});

const uploadGuestBookImage = multer({
  storage: guestBookImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export {
  cloudinary,
  upload,
  uploadProfilePic,
  uploadGuestBookImage
};
