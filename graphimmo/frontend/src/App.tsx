// App.tsx
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'  // ← AJOUTE
import ProprietesMap from './components/Map'
import ProprieteDetail from './components/ProprieteDetail'
import Search from "./components/Search"
import Navbar from "./components/Navbar"
import Login from "./components/Login"      // ← NOUVEAU
import Register from "./components/Register" // ← NOUVEAU
import Profil from "./components/Profil"     // ← NOUVEAU
import { SearchProvider } from './contexts/SearchContext'

// Apollo client avec auth (de main.tsx)
function App() {
  const token = localStorage.getItem('token')

  return (
    // <ApolloProvider client={window.apolloClient}> {/* Si défini dans main.tsx */}
    <SearchProvider>
      <HashRouter>
        <Navbar />
        <div style={{ padding: 24 }}>
          <h1>GraphImmo – Carte Immobilière</h1>
          
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected */}
            <Route 
              path="/" 
              element={token ? <ProprietesMap /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/recherche" 
              element={token ? <Search /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/propriete/:id" 
              element={token ? <ProprieteDetail /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profil" 
              element={token ? <Profil /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </HashRouter>
      </SearchProvider>
    // </ApolloProvider>
  )
}

export default App
