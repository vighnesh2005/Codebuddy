import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer upload (for route-based multipart/form-data use)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

export const upload = multer({ storage });

// Programmatic image upload (from base64 or URL)
export const uploadImage = async (file) => {
  try {
    // If it's already a Cloudinary URL, return as is
    if (typeof file === "string" && file.startsWith("https://res.cloudinary.com/")) {
      return { secure_url: file }; // mimic cloudinary upload response format
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: 'uploads',
    });

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete utility
export const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default cloudinary;
