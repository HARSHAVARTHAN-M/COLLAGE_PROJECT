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
    
    BookLog[] public logs;
    
    event LogRecorded(uint256 indexed bookId, Action action, uint256 timestamp, address user);
    
    function recordAction(uint256 _bookId, Action _action) public {
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
}