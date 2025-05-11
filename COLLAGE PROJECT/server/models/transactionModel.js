import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  transactionHash: {
    type: String,
    required: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  action: {
    type: String,
    enum: ['BORROW', 'RETURN'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const Transaction = mongoose.model('Transaction', transactionSchema);