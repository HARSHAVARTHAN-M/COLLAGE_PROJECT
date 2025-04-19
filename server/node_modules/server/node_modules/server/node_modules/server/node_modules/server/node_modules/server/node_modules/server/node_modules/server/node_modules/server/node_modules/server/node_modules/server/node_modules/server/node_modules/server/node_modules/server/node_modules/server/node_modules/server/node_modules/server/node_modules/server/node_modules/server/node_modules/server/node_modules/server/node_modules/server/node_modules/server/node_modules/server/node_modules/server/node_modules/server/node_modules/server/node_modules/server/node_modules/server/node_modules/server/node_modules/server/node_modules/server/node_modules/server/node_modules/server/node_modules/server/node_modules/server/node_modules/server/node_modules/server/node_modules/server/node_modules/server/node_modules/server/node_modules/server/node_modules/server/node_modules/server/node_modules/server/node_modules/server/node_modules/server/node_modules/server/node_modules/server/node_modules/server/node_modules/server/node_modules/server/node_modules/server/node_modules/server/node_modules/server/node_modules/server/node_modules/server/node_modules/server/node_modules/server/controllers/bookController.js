import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { blockchainService } from '../services/blockchainService.js';

// Add this to your existing addBook controller
export const addBook = catchAsyncErrors(async (req, res, next) => {
    // Your existing MongoDB logic
    const book = await Book.create(req.body);

    // Add to blockchain
    await blockchainService.addBookToBlockchain(
        book._id.toString(),
        book.title,
        book.quantity
    );

    res.status(201).json({
        success: true,
        message: "Book added successfully",
        book,
    });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  await book.deleteOne();
  res.status(200).json({
    success: true,
    message: "Book deleted successfully.",
  });
});

export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();

  if (!books || books.length === 0) {
    return next(new ErrorHandler("No books found.", 404));
  }
  res.status(200).json({
    success: true,
    books,
  });
});