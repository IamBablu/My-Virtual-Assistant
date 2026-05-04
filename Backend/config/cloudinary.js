import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
const uploadOnCloudinary = async (file) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {
        const uploadresult = await cloudinary.uploader.upload(file);
        fs.unlinkSync(file);
        return uploadresult.secure_url;
    } catch (error) {
        return res.status(500).json({ message: 'Error uploading file to Cloudinary' });
        fs.unlinkSync(file);
    }
};

export default uploadOnCloudinary;  