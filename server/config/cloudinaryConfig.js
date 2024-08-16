// config/cloudinaryConfig.js
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config(); // Load environment variables from .env file

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary.v2; 