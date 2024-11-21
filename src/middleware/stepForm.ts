import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from 'cloudinary'
import { RequestHandler } from 'express'

require('dotenv').config()

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const stepFormStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    return {
      folder: 'stepform/uploads',
      allowed_formats: ['jpg', 'png', 'jpeg'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    }
  }
})

const stepFormUpload = multer({
  storage: stepFormStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB file size limit
  }
})

const stepFormUploadMiddleware: RequestHandler = stepFormUpload.fields([
  { name: 'memberImage', maxCount: 5 },
  { name: 'file', maxCount: 5 }
  // ...Array.from({ length: 10 }, (_, i) => ({ name: `file_${i}`, maxCount: 1 }))]);
])

export { stepFormUploadMiddleware as stepFormUpload }
