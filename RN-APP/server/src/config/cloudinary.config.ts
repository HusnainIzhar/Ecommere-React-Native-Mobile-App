import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import ErrorHandler from "../utils/errorHandler.utils";
require("dotenv").config();

export const cloudinaryConnect = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API,
        api_secret: process.env.CLOUD_SECRET_KEY
    });
    if (!cloudinary.config().cloud_name) {
        return new ErrorHandler("Cloudinary configuration failed", 400);
    };
    return null;
};
interface IParams {
    folder: string;
    allowedFormats: string[];
};

export const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile",
        allowedFormats: ["jpg", "jpeg", "png"]
    } as IParams
});

