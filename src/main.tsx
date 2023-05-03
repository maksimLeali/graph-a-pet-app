import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache, from, gql} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { onError } from 'apollo-link-error'
import { useCookies } from 'react-cookie'
import App from './App';
import './i18n'
import _ from 'lodash'
import toast from 'react-hot-toast';
import { config } from './config';

// const [cookies, setCookies, removeCookie] = useCookies(['jwt'])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const httpLink = createHttpLink({
  uri: config.baseUrl,
})

// const authLink = setContext((_, { headers }) => {
  
//   const token = cookies.jwt
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   }
// })



// const logoutLink = onError((received) => {
  
//   console.log(received)
//   console.log(received.graphQLErrors![0].extensions)
// 
//   if (['401', '403'].includes(_.get(received, 'graphQLErrors.0.extensions.code', '') )) {
    
//     toast.error('User not Authorized')
//     setTimeout(()=> {
//       removeCookie('jwt')
//       window.location.reload()
//     }, 1000)
//   }
// })

export const apolloClient = new ApolloClient({
  link: from([  httpLink]),
  cache: new InMemoryCache(),
})


root.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
);
