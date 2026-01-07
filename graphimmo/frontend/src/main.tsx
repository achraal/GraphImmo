// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
// import { ApolloProvider } from '@apollo/client/react'
// import App from './App.tsx'

// // main.tsx

// const client = new ApolloClient({
//   link: new HttpLink({ uri: 'http://localhost:8000/graphql' }),
//   cache: new InMemoryCache(),
// })

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <ApolloProvider client={client}>
//       <App />
//     </ApolloProvider>
//   </React.StrictMode>,
// )

// main.tsx (version UPGRADE avec AUTH AUTO)
import React from 'react'
import ReactDOM from 'react-dom/client'
import { 
  ApolloClient, 
  InMemoryCache, 
  HttpLink, 
  from,
  ApolloLink 
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import App from './App.tsx'

// AUTO token header
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token')
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  return forward(operation)
})

const client = new ApolloClient({
  link: from([authLink, new HttpLink({ uri: 'http://localhost:8000/graphql' })]),
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)
