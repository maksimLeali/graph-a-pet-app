import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, from} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { onError } from 'apollo-link-error'

import App from './App';
import './i18n'
import _ from 'lodash'
import toast from 'react-hot-toast';
import { config } from './config';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const httpLink = createHttpLink({
  uri: config.baseUrl,
})






export const apolloClient = new ApolloClient({
  link: from([ httpLink]),
  cache: new InMemoryCache(),
})

root.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
);
