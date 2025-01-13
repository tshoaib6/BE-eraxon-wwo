
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'posts',
    allowedFormats: ['jpg', 'png', 'jpeg', 'mp4', 'mov'], 
    resource_type: "auto",
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit for post uploads
  },
});

// New storage configuration for profile pictures
const profilePicStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pics', // Separate folder for profile pictures
    allowedFormats: ['jpg', 'png', 'jpeg'],
    resource_type: 'auto',
  },
});

// New upload function for profile pictures
const uploadProfilePic = multer({
  storage: profilePicStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit for profile pictures
  },
});


const guestBookImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'guestbook_images', // Separate folder for guestbook images
    allowedFormats: ['jpg', 'png', 'jpeg'], // Only allow image formats
    resource_type: 'image', // Explicitly set to handle images
  },
});

const uploadGuestBookImage = multer({
  storage: guestBookImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit for guestbook image uploads
  },
});
// Export existing upload function and new profile picture upload function
export { cloudinary, upload, uploadProfilePic,uploadGuestBookImage  };
