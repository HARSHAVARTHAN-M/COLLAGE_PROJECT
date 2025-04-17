import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { sendToken } from "../utils/sendToken.js";
import { generatePasswordResetEmailTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";

export const register = catchAsyncErrors(async (req, res, next) => {
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
    if (password.length < 8 || password.length > 16) {
      return next(
        new ErrorHandler(
          "Password length should be between 8 and 16 characters",
          400
        )
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const verificationCode = user.generateVerificationCode();
    await user.save();

    try {
      await sendVerificationCode(verificationCode, email, res);
    } catch (error) {
      return next(new ErrorHandler("Failed to send verification email.", 500));
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new ErrorHandler(
          "Email already exists. Please use a different email.",
          400
        )
      );
    }
    return next(new ErrorHandler(error.message, 500));
  }
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(new ErrorHandler("Email or otp is missing.", 400));
  }
  try {
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    if (!userAllEntries) {
      return next(new ErrorHandler("No user found with this email.", 400));
    }

    let user;

    if (userAllEntries.length > 1) {
      user = userAllEntries[0];
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP.", 400));
    }
    const currentTime = Date.now();

    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();

    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP has expired.", 400));
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });

    sendToken(user, 200, res, "Account verified successfully.");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email or password is missing.", 400));
  }
  const user = await User.findOne({ email, accountVerified: true }).select(
    "+password"
  );

  if (!user) {
    return next(new ErrorHandler("Invalid credentials.", 401));
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid credentials.", 401));
  }
  sendToken(user, 200, res, "Login successful.");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorHandler("Email is required.", 400));
  }
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = generatePasswordResetEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "BIBLIOGEN Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

/* export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required.", 400));
  }

  const user = await User.findOne({
    email,
    accountVerified: true,
  });

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = generatePasswordResetEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "BIBLIOGEN Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Failed to send email. Please try again later.", 500));
  }
}); */

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  /* console.log("Raw Token:", token);
console.log("Hashed Token:", resetPasswordToken);
console.log("User Found:", user);
console.log("Reset Password Expire:", user?.resetPasswordExpire);
console.log("Current Time:", Date.now()); */

  /*   if (!user) {
    return next(new ErrorHandler("Invalid or expired reset token.", 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password do not match.", 400)
    );
  } */

  // Import the validator package for input sanitization
  // const validator = require('validator');

  if (
    validator.isLength(req.body.password, { min: 8, max: 100 }) &&
    validator.isLength(req.body.confirmPassword, { min: 8, max: 100 }) &&
    validator.equals(req.body.password, req.body.confirmPassword)
  ) {
    // Passwords match and meet length requirements
  } else {
    return next(
      new ErrorHandler(
        "Password and confirm password do not match or are invalid.",
        400
      )
    );
  }

  if (
    req.body.password.length < 8 ||
    req.body.password.length > 16 ||
    req.body.confirmPassword.length < 8 ||
    req.body.confirmPassword.length > 16
  ) {
    return next(
      new ErrorHandler(
        "Password length should be between 8 and 16 characters",
        400
      )
    );
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res, "Password reset successfully.");
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  const isPasswordMatched = await bcrypt.compare(
    currentPassword,
    user.password
  );
  if (!isPasswordMatched) {
    return next(new ErrorHandler("current password is incorrect.", 400));
  }
  if (
    newPassword.length < 8 ||
    newPassword.length > 16 ||
    confirmNewPassword.length < 8 ||
    confirmNewPassword.length > 16
  ) {
    return next(
      new ErrorHandler(
        "Password length should be between 8 and 16 characters",
        400
      )
    );
  }

  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("Passwords do not match.", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
});
