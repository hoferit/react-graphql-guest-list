import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express, { json } from 'express';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import connectToDatabase from './db/conn.js';
import resolvers from './resolvers/resolvers.js';

const PORT = process.env.PORT || 5050;
const app = express();
const db = await connectToDatabase();

app.use(cors());
app.use(express.json());

//highlight-start
const typeDefs = gql(
  readFileSync('./db/schema.gql', {
    encoding: 'utf-8',
  }),
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { db },
});
// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
await server.start();

app.use('/graphql', cors(), json(), expressMiddleware(server));

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
