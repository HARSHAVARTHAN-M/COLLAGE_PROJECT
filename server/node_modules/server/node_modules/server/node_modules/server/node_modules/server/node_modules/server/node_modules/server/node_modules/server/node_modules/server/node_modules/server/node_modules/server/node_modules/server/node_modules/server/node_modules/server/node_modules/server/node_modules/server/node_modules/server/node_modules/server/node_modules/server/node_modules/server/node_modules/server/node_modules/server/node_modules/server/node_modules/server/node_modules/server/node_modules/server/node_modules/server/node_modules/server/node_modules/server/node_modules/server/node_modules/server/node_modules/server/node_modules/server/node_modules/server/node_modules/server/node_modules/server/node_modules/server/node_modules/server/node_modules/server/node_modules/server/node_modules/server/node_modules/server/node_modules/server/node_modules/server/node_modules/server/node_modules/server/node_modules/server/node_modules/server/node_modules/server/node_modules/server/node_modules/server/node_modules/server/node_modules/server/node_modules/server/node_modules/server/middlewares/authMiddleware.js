import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import ErrorHandler from "./errorMiddlewares.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    /* console.log("Decoded Token:", decoded); */

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found.", 404));
    }

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return next(new ErrorHandler("Invalid or expired token.", 401));
  }
});

export const isAuthorized = (...roles) => {
  return catchAsyncErrors((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
         `Role: ${req.user.role} is not allowed to access this resource.`,
          400
        )
      );
    }
    next();
  });
};
