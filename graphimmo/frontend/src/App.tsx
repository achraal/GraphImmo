// App.tsx - MODIFICATIONS UNIQUEMENT
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import ProprietesMap from './components/Map'
import ProprieteDetail from './components/ProprieteDetail'
import Search from "./components/Search"
import Navbar from "./components/Navbar"
import Login from "./components/Login"
import Register from "./components/Register"
import Profil from "./components/Profil"
import Dashboard from "./components/Dashboard" 
import AnalyticsAgent from "./components/AnalyticsAgent" // ← AJOUTER
import { SearchProvider } from './contexts/SearchContext'
import Recommendations from "./components/Recommendations"
import Comparaison from './components/Comparaison'
import { useUserRole } from './hooks/useUserRole';

function App() {
  const token = localStorage.getItem('token')
  const { role, isAgent, loading: roleLoading } = useUserRole();

  if (roleLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Chargement...</div>;
  }

  return (
    <ApolloProvider client={window.apolloClient}>
      <SearchProvider>
        <HashRouter>
          <Navbar />
          <div style={{ padding: 24 }}>
            <h1>GraphImmo - Carte Immobilière</h1>
            <Routes>
              {/* Public toujours */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Si pas connecté → login */}
              <Route path="/" element={!token ? <Navigate to="/login" /> : <ProprietesMap />} />
              <Route path="/recherche" element={!token ? <Navigate to="/login" /> : <Search />} />
              <Route path="/propriete/:id" element={!token ? <Navigate to="/login" /> : <ProprieteDetail />} />

              {/* Profil pour TOUS connectés */}
              <Route path="/profil" element={token ? <Profil /> : <Navigate to="/login" />} />

              {/* ACHETEUR seulement (pas AGENT) */}
              {!isAgent && token && (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/comparaison" element={<Comparaison />} />
                </>
              )}

              {/* AGENT seulement - DASHBOARD SPÉCIAL 👇 AJOUTER ICI */}
              {isAgent && token && (
                <>
                  <Route path="/analytics-agent" element={<AnalyticsAgent />} />
                  <Route path="/dashboard" element={<AnalyticsAgent />} />
                </>
              )}

              {/* Redirections AGENT sur routes acheteur */}
              {isAgent && (
                <>
                  <Route path="/recommendations" element={<Navigate to="/analytics-agent" replace />} />
                  <Route path="/comparaison" element={<Navigate to="/analytics-agent" replace />} />
                </>
              )}

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </HashRouter>
      </SearchProvider>
    </ApolloProvider>
  );
}

export default App;
