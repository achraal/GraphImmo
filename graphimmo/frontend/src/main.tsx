// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { 
//   ApolloClient, 
//   InMemoryCache, 
//   HttpLink, 
//   from,
//   ApolloLink 
// } from '@apollo/client'
// import { ApolloProvider } from '@apollo/client/react'
// import App from './App.tsx'

// // AUTO token header
// const authLink = new ApolloLink((operation, forward) => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     operation.setContext({
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//   }
//   return forward(operation)
// })

// const client = new ApolloClient({
//   link: from([authLink, new HttpLink({ uri: 'http://localhost:8000/graphql' })]),
//   cache: new InMemoryCache(),
// })

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <ApolloProvider client={client}>
//       <App />
//     </ApolloProvider>
//   </React.StrictMode>,
// )

// src/main.tsx
import { ApolloProvider } from '@apollo/client/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from '@apollo/client'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import App from './App.tsx'
import './index.css' // Importez le CSS nettoyé

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token')
  if (token) {
    operation.setContext({
      headers: { Authorization: `Bearer ${token}` }
    })
  }
  return forward(operation)
})

const client = new ApolloClient({
  link: from([authLink, new HttpLink({ uri: 'http://localhost:8000/graphql' })]),
  cache: new InMemoryCache(),
})

// --- THEME HARMONISÉ ---
const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5', // L'Indigo du Login
      light: '#818CF8',
      dark: '#3730A3',
    },
    secondary: {
      main: '#7C3AED', // Le Violet du Login
      light: '#A78BFA',
      dark: '#5B21B6',
    },
    background: {
      default: '#f8fafc', // Gris bleuté très clair
      paper: '#ffffff',
    },
    text: {
      primary: '#1E293B', // Slate 800 (plus moderne que le noir pur)
      secondary: '#64748B',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }
      }
    }
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
)