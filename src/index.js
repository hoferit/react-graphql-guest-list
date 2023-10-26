import './index.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const client = new ApolloClient({
  uri: 'http://localhost:5050/graphql', // Your GraphQL server URL
  cache: new InMemoryCache(),
});
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
);
