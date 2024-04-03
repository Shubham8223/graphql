import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthenticationError } from 'apollo-server-express';

dotenv.config();

const authMiddleware = (req, res) => {
  try {
    const token = req.cookies['access_token'];

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
