import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const register = catchAsyncError(async (req, res, next) => {
  try {
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

    const registrationAttemptsByUser = await User.find({
      email,
      accountVerified: false,
    });

    if (registrationAttemptsByUser.length >= 5) {
      return next(
        new ErrorHandler(
          "You have exceeded the number of registration attempts. Please try again later.",
          400
        )
      );
    }
    if (password.length < 8 || password.length > 16){
        return next(new ErrorHandler("Password length should be between 8 and 16 characters", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const verificationCode = await User.generateVerificationCode();
    await user.save();
    sendVerificationCode(verificationCode, email, res);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
