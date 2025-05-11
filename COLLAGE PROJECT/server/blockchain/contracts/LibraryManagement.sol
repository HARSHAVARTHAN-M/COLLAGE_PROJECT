// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LibraryManagement is Ownable {
    struct Book {
        uint256 id;
        string title;
        uint256 quantity;
        bool exists;
    }

    mapping(uint256 => Book) public books;
    mapping(address => mapping(uint256 => bool)) public borrowedBooks;

    event BookAdded(uint256 indexed id, string title, uint256 quantity);
    event BookBorrowed(address indexed borrower, uint256 indexed bookId);
    event BookReturned(address indexed borrower, uint256 indexed bookId);

    function addBook(uint256 _id, string memory _title, uint256 _quantity) public onlyOwner {
        require(!books[_id].exists, "Book already exists");
        books[_id] = Book(_id, _title, _quantity, true);
        emit BookAdded(_id, _title, _quantity);
    }

    function borrowBook(uint256 _bookId) public {
        require(books[_bookId].exists, "Book does not exist");
        require(books[_bookId].quantity > 0, "Book not available");
        require(!borrowedBooks[msg.sender][_bookId], "You already borrowed this book");

        books[_bookId].quantity--;
        borrowedBooks[msg.sender][_bookId] = true;
        emit BookBorrowed(msg.sender, _bookId);
    }

    function returnBook(uint256 _bookId) public {
        require(borrowedBooks[msg.sender][_bookId], "You have not borrowed this book");

        books[_bookId].quantity++;
        borrowedBooks[msg.sender][_bookId] = false;
        emit BookReturned(msg.sender, _bookId);
    }
}