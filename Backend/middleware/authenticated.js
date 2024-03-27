import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthenticationError } from 'apollo-server-express';
dotenv.config();

const authMiddleware = (req, res) => {
  try {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      throw new Error('Unauthorized: No authorization header found');
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
      throw new Error('Unauthorized: Missing token');
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.userId;
    return ;
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
};

export default authMiddleware;
