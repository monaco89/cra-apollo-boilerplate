import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/link-error';
import { RetryLink } from '@apollo/link-retry';
import { config } from './constants/config';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
    },
  }));

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      // TODO Log errors
      console.log('Error', message);
    });
  }
  if (networkError) {
    // TODO Log errors
    console.log('Network error', networkError);
  }
});

const link = ApolloLink.from([
  authLink,
  new RetryLink(),
  errorLink,
  new HttpLink({
    uri: config.env.serverUri,
  }),
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
