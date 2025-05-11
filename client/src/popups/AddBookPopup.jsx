import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";

const AddBookPopup = () => {
  const dispatch = useDispatch();
  const { message, loading, error } = useSelector((state) => state.book);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setPrice("");
    setQuantity("");
    setDescription("");
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      resetForm();  // Reset form fields on success
      // Removed the toggleAddBookPopup dispatch to keep popup open
    }
    if (error) {
      toast.error(error);
    }
  }, [dispatch, message, error]);

  const handleAddBook = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim() || !author.trim() || !price || !quantity) {
      toast.error("Please fill all required fields");
      return;
    }

    if (price < 0) {
      toast.error("Price cannot be negative");
      return;
    }

    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("author", author.trim());
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description.trim());

    await dispatch(addBook(formData));

/*     useEffect(() => {
      if (message) {
        toast.success(message);
        dispatch(fetchAllBooks());
        dispatch(toggleAddBookPopup());
      }
      if (error) {
        toast.error(error);
      }
    }, [dispatch, message, error]); */
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
        <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Record Book</h3>
            <form onSubmit={handleAddBook}>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Book's Title"
                  className="w-full border border-black rounded-md px-4 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Book Author"
                  className="w-full border border-black rounded-md px-4 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Price (Price for borrowing)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Book Price"
                  className="w-full border border-black rounded-md px-4 py-2"
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Book Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Book Quantity"
                  className="w-full border border-black rounded-md px-4 py-2"
                  min="1"
                  required
                />
              </div>


              <div className="mb-4">
                <label className="block text-gray-900 font-medium">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Book's Description"
                  rows={4}
                  className="w-full border border-black rounded-md px-4 py-2"

                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  type="button"
                  // Wrong action being dispatched
                  onClick={() => {
                      dispatch(toggleAddBookPopup());
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBookPopup;
