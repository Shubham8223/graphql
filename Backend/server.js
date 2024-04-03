import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mergedResolvers from './Resolvers/merge_resolver.js';
import mergedSchema from './Schemas/merge_schema.js';
import connectToDB from './db.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors'; 

dotenv.config(); 

async function startApolloServer() {
  const server = new ApolloServer({ 
    typeDefs: mergedSchema, 
    resolvers: mergedResolvers,
    context: ({ req, res }) => ({ req, res }),
    playground: true 
  });
  await server.start();
  
  const app = express();
  app.use(cookieParser());

  app.use(cors({
    origin: [process.env.CORS_ORIGIN, 'https://studio.apollographql.com'],
    credentials: true
  }));
  
  server.applyMiddleware({ 
    app,
    cors: false 
  });

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT);
  console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
}

async function initializeApp() {
  try {
    await connectToDB();
    await startApolloServer();
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
}

initializeApp();
