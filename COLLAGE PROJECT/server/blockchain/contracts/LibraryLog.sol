// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LibraryLog {
    enum Action { BORROW, RETURN }
    
    struct BookLog {
        uint256 bookId;
        Action action;
        uint256 timestamp;
        address user;
    }
    
    struct Book {
        uint256 id;
        string title;
        uint256 quantity;
        bool exists;
    }
    
    BookLog[] public logs;
    mapping(uint256 => Book) public books;
    
    event LogRecorded(uint256 indexed bookId, Action action, uint256 timestamp, address user);
    event BookAdded(uint256 indexed bookId, string title, uint256 quantity);
    
    function recordAction(uint256 _bookId, Action _action) public {
        require(books[_bookId].exists, "Book does not exist");
        BookLog memory newLog = BookLog({
            bookId: _bookId,
            action: _action,
            timestamp: block.timestamp,
            user: msg.sender
        });
        
        logs.push(newLog);
        emit LogRecorded(_bookId, _action, block.timestamp, msg.sender);
    }
    
    function getAllLogs() public view returns (BookLog[] memory) {
        return logs;
    }
    
    function addBook(uint256 _bookId, string memory _title, uint256 _quantity) public {
        require(!books[_bookId].exists, "Book already exists");
        books[_bookId] = Book({
            id: _bookId,
            title: _title,
            quantity: _quantity,
            exists: true
        });
        emit BookAdded(_bookId, _title, _quantity);
    }
}