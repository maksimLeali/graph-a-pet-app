import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, from, gql, ApolloLink} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { onError } from 'apollo-link-error'
import { useCookies } from 'react-cookie'
import App from './App';
import './i18n'
import _ from 'lodash'
import toast from 'react-hot-toast';
import { config } from './config';
import Cookies from 'js-cookie';
// const [cookies, setCookies, removeCookie] = useCookies(['jwt'])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const httpLink = createHttpLink({
  uri: config.baseUrl,
})

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('jwt')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})


const testResponseLink = new ApolloLink((operation, forward)=> {
  return forward(operation).map(response => {
    // Access the response data here
    const responseData = response.data;
    if ([401, 403].includes(_.get(response, 'errors.0.extensions.code', 0) )) {
      toast.error('User not Authorized')
      Cookies.remove('jwt')
      Cookies.remove('user')
      localStorage.setItem('userLastLocation',window.location.pathname);
      setTimeout(()=> {
        window.location.href='/'
      }, 1500)
    
    }
    return response;
  });
})




export const apolloClient = new ApolloClient({
  link: testResponseLink.concat(authLink).concat(httpLink ),
  // link: from([ authLink, httpLink, logoutLink as any , ]),
  cache: new InMemoryCache(),
})

root.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
);
