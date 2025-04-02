class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    /* Error.captureStackTrace(this, this.constructor); */
  }
}

/* export const login = (req, res, next) => {};
export const register = (req, res, next) => {}; */

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  console.log(err);

  if (err.code === 11000) {
    const statusCode = 400;
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "JsonWebTokenError") {
    const statusCode = 400;
    const message = "Json Web Token is invalid, try again";
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "TokenExpiredError") {
    const statusCode = 400;
    const message = "Json Web Token is expired, try again";
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "CastError") {
    const statusCode = 400;
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "ValidationError") {
    const statusCode = 400;
    const message = Object.values(err.errors)
      .map((value) => value.message)
      .join(" ");
    err = new ErrorHandler(message, statusCode);
  }
  

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;


    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;


/* class Error{
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}



throw new Error("This is an error message", 500); */
