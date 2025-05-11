import React from "react";
import { BookA } from "lucide-react";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState({});

  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

/*   const openReadPopup = (id) => {
    const borrowedBook = booksToDisplay.find((book) => book.bookId._id === id);
    console.log("Found borrowed book:", borrowedBook); // Debug log
    if (borrowedBook && borrowedBook.bookId) {
      const bookData = {
        title: borrowedBook.bookTitle || borrowedBook.bookId.title,
        author: borrowedBook.bookId.author,
        description: borrowedBook.bookId.description
      };
      setReadBook(bookData);
      dispatch(toggleReadBookPopup());
    }
  }; */


  const openReadPopup = (id) => {
    const borrowedBook = booksToDisplay.find((book) => book.bookId._id === id || book.bookId === id);
    const fullBook = books.find((b) => b._id === (borrowedBook?.bookId?._id || borrowedBook?.bookId));
  
    if (borrowedBook && fullBook) {
      const bookData = {
        title: borrowedBook.bookTitle || fullBook.title,
        author: fullBook.author,
        description: fullBook.description,
      };
      setReadBook(bookData);
      dispatch(toggleReadBookPopup());
    }
  };
  

  // Remove the redundant useEffect
  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
  
      const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getFullYear())}`;
  
      const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
  
      return `${formattedDate} ${formattedTime}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const [filter, setFilter] = useState("returned");

  const returnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returned === true;
  });
  const nonReturnedBooks = userBorrowedBooks?.filter((book) => {
    return book.returned === false;
  });

  const booksToDisplay =
    filter === "returned" ? returnedBooks : nonReturnedBooks;

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            Borrowed Books
          </h2>
        </header>

        <header className="flex flex-col gap-3 sm:flex-row md:items-center">
          <button
            onClick={() => setFilter("returned")}
            className={`relative px-4 py-2 rounded-md sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center border-2 font-semibold w-full sm:w-72 ${
              filter === "returned"
                ? "bg-black text-white border-black"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`}
          >
            Returned Books
          </button>
          <button
            onClick={() => setFilter("nonReturned")}
            className={`relative px-4 py-2 rounded-md sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center border-2 font-semibold w-full sm:w-72 ${
              filter === "nonReturned"
                ? "bg-black text-white border-black"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`}
          >
            Non-Returned Books
          </button>
        </header>

        {/* Table */}
        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Book Title</th>
                  <th className="px-4 py-2 text-left">Borrowed Date</th>
                  <th className="px-4 py-2 text-left">Return Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-center">View</th>
                </tr>
              </thead>
              <tbody>
                {booksToDisplay.map((book, index) => (
                  <tr
                    key={index}
                    className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{book.bookTitle}</td>
                    <td className="px-4 py-2">{formatDate(book.borrowedDate)}</td>
                    <td className="px-4 py-2">
                      {formatDate(book.dueDate)}
                    </td>
                    <td className="px-4 py-2">
                      {book.returned ? "Returned" : "Not Returned"}
                    </td>
                    <td className="px-4 py-2 flex justify-center">
                      <BookA
                        className="cursor-pointer"
                        onClick={() => openReadPopup(book.bookId._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filter === "returned" ? (
           <div className="mt-6 text-center">
            <h3 className="text-2xl mt-5 font-medium">
           {/* No {filter === "returned" ? "returned" : "borrowed"} books found! */}
           No returned books found!
            </h3>
          </div>
        ):(
          <div className="mt-6 text-center">
          <h3 className="text-2xl mt-5 font-medium">
         {/* No {filter === "returned" ? "returned" : "borrowed"} books found! */}
         No Non-returned books found!
          </h3>
        </div>
          )}
      </main>

      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;
