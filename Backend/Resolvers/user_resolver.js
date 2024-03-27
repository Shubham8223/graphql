import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Transaction from '../models/transaction.js';
import authMiddleware from '../middleware/authenticated.js';

const userResolvers = {
  Query: {
    user: async (_, { userId }, context) => { 
      try {
        authMiddleware(context.req, context.res);
        
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Internal server error");
      }
    },
    authUser: async (_, __, context) => {
      try {
        authMiddleware(context.req, context.res); 
        
        const users = await User.find();
        return users;
      } catch (err) {
        console.error(err);
        throw new Error(err.message || "Internal server error");
      }
    }
  },
  Mutation: {
    signUp: async (_, { input }) => {
      try {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = await User.create({
          username: input.username,
          name: input.name,
          password: hashedPassword,
          gender: input.gender
        });
        return user;
      } catch (error) {
        console.error('Error signing up:', error);
        throw new Error('Could not sign up user');
      }
    },
    login: async (_, { input }, context) => {
      try {
        const user = await User.findOne({ username: input.username });

        if (!user || !(await bcrypt.compare(input.password, user.password))) {
          throw new Error('Invalid username or password');
        }
        const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        context.res.cookie('access_token', token, {
          httpOnly: true,
          maxAge: 3600000
        });
        console.log(token)
        return user;
      } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Could not log in');
      }
    } ,
    logout: async (_, __, context) => {
      try {
        authMiddleware(context.req, context.res);

        context.res.clearCookie('access_token');
        return { message: 'Logged out successfully' };
      } catch (error) {
        console.error('Error logging out:', error);
        throw new Error('Could not log out');
      }
    }
  },
  User: {
    transactions: async (parent) => {
      try {
        const transactions = await Transaction.find({ userId: parent._id });
        return transactions;
      } catch (err) {
        console.log("Error in user.transactions resolver: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
  };

export default userResolvers;
