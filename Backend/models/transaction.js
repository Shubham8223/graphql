import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  paymentType: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  location: String,
  date: {
    type: Date,
    required: true
  }
});

const Transaction = model('Transaction', transactionSchema);

export default Transaction;
