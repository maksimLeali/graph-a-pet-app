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
    console.log(response)
    console.log(responseData); // Perform any necessary logging or modifications
    console.log(_.get(response, 'errors.0.extensions.code', ''))
    if ([401, 403].includes(_.get(response, 'errors.0.extensions.code', 0) )) {
      console.log('found not auth')
      toast.error('User not Authorized')
      Cookies.remove('jwt')
      Cookies.remove('user')
      setTimeout(()=> {
        window.location.reload()
      }, 1000)
    
    }
    return response;
  });
})


const logoutLink = onError((received) => {
  
  console.log(received)
  console.log(received.graphQLErrors![0].extensions)

  if (['401', '403'].includes(_.get(received, 'graphQLErrors.0.extensions.code', '') )) {
    console.log('not auth')
    toast.error('User not Authorized')
    
  }
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
