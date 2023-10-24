import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from 'cors';
import express, { json } from 'express';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import resolvers from './resolvers/resolvers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

//highlight-start
const typeDefs = gql(
  readFileSync(resolve(__dirname, './db/schema.graphql'), {
    encoding: 'utf-8',
  }),
);

const schema = buildSubgraphSchema({
  typeDefs,
  resolvers,
});
const server = new ApolloServer({
  schema,
});
// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
await server.start();

app.use('/graphql', cors(), json(), expressMiddleware(server));

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
