import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthenticationError } from 'apollo-server-express';

dotenv.config();

const authMiddleware = (req, res) => {
  try {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      throw new AuthenticationError('Unauthorized: No authorization header found');
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('Unauthorized: Missing token');
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded.userId;
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
};

export default authMiddleware;
