import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  res.status(200).json({
    success: true,
    users,
  });
});

/* export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("No files were uploaded.", 400));
  }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }
  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(
      new ErrorHandler("User already registered with this email.", 400)
    );
  }
  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler(
        "Password length should be between 8 and 16 characters",
        400
      )
    );
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const cloudinaryResponse = await cloudinary.uploader.upload(
    
    avatar.tempFilePath,
    {
      folder: "BIBLIOGEN/admin-avatar",
    }
  );
  if (!cloudinaryResponse || !cloudinaryResponse.error) {
    console.log(
      "Cloudinary error:",
      cloudinaryResponse.error || "Unknown cloudinary error."
    );
    return next(new ErrorHandler("Failed to upload avatar.", 500));
  }
  console.log("Avatar file path:", avatar.tempFilePath);
  console.log("Avatar mimetype:", avatar.mimetype);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    user,
  });
});
 */


export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("No files were uploaded.", 400));
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(
      new ErrorHandler("User already registered with this email.", 400)
    );
  }

  if (password.length < 8 || password.length > 16) {
    return next(
      new ErrorHandler(
        "Password length should be between 8 and 16 characters",
        400
      )
    );
  }

  const { avatar } = req.files;

/*   console.log("Avatar file path:", avatar.tempFilePath);
  console.log("Avatar mimetype:", avatar.mimetype); */

  const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
      folder: process.env.CLOUDINARY_FOLDER,
    });
    console.log("Cloudinary folder:", process.env.CLOUDINARY_FOLDER);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(
        "Cloudinary error:",
        cloudinaryResponse.error || "Unknown cloudinary error."
      );
      return next(new ErrorHandler("Failed to upload avatar.", 500));
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      accountVerified: true,
      avatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user,
    });
  } catch (error) {
    console.error("Error during Cloudinary upload:", error.message);
    return next(new ErrorHandler("Failed to upload avatar.", 500));
  }
});