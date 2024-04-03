import Transaction from '../models/transaction.js';
import User from '../models/user.js';
import authMiddleware from '../middleware/authenticated.js';

const transactionResolvers = {
  Query: {
    transactions: async (_,__,context) => {
      try {
        const user =  authMiddleware(context.req, context.res);
        if (!user)
        {
            throw new Error('Failed Authentication')
        }
        return await Transaction.find({userId:user});
      } catch (error) {
        throw new Error('Failed to fetch transactions');
      }
    },
    transaction: async (_, { transactionId },context) => {
    try {
        const user =  authMiddleware(context.req, context.res);
        if (!user)
        {
            throw new Error('Failed Authentication')
        }
        return await Transaction.findById(transactionId);
      } catch (error) {
        throw new Error('Failed to fetch transaction');
      }
    },
    categoryStatistics: async (_, __, context) => {
			const userId =  authMiddleware(context.req, context.res);
        if (!userId)
        {
            throw new Error('Failed Authentication')
        }
			const transactions = await Transaction.find({ userId });
			const categoryMap = {};
			transactions.forEach((transaction) => {
				if (!categoryMap[transaction.category]) {
					categoryMap[transaction.category] = 0;
				}
				categoryMap[transaction.category] += transaction.amount;
			});
			return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));

		},
  },
  Mutation: {
    createTransaction: async (_, { input },context) => {
      try {
        const user =  authMiddleware(context.req, context.res);
        if (!user)
        {
            throw new Error('Failed Authentication')
        }
        const newTransaction = await Transaction.create({...input,userId:user});
        return newTransaction;
      } catch (error) {
        throw new Error('Failed to create transaction');
      }
    },
    updateTransaction: async (_, { input },context) => {
      try {
        const user =  authMiddleware(context.req, context.res);
        if (!user)
        {
            throw new Error('Failed Authentication')
        }
        const { transactionId, ...updates } = input;
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          transactionId,
          updates,
          { new: true }
        );
        return updatedTransaction;
      } catch (error) {
        throw new Error('Failed to update transaction');
      }
    },
    deleteTransaction: async (_, { transactionId },context) => {
      try {
        const user =  authMiddleware(context.req, context.res);
        if (!user)
        {
            throw new Error('Failed Authentication')
        }
        const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
        return deletedTransaction;
      } catch (error) {
        throw new Error('Failed to delete transaction');
      }
    }
  },
  Transaction: {
    user: async (parent) => {
      try {
        return await User.findById(parent.userId);
      } catch (error) {
        throw new Error('Failed to fetch user');
      }
    }
  }
};

export default transactionResolvers;
