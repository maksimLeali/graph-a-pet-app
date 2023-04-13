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

const authLink = setContext((_, { headers }) => {
  const token = storage.getToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})



const logoutLink = onError((received) => {
  
  console.log(received)
  console.log(received.graphQLErrors![0].extensions)
  if (['401', '403'].includes(_.get(received, 'graphQLErrors.0.extensions.code', '') )) {
    
    toast.error('User not Authorized')
    setTimeout(()=> {
      storage.deleteToken()
      storage.deleteUser()
      window.location.reload()
    }, 1000)
  }
})

export const apolloClient = new ApolloClient({
  link: from([ authLink, logoutLink as any, httpLink]),
  cache: new InMemoryCache(),
})

root.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
);
