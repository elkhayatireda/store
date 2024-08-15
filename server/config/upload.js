// config/upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'categories', // Folder name in Cloudinary where images will be stored
    allowed_formats: ['jpg', 'png'], // Allowed image formats
  },
});

const upload = multer({ storage: storage });

export default upload;
