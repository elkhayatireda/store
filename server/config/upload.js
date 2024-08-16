import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'categories', // Folder name in Cloudinary where images will be stored
    allowed_formats: ['jpg', 'png'], // Allowed image formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional: resize images
  },
});

// Configure multer with file size limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // Set the file size limit here
  },
  fileFilter: (req, file, cb) => {
    // Ensure only allowed image formats are uploaded
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'), false);
    }

    // Perform file size check (this is redundant since Cloudinary will handle this)
    if (file.size > MAX_FILE_SIZE) {
      return cb(new Error('File size too large. Max size is 5MB'), false);
    }

    cb(null, true);
  }
});

export default upload;
