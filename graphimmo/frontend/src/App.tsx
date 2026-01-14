// App.tsx - VERSION CORRIGÉE avec routes anonymes
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
import AnalyticsAgent from "./components/AnalyticsAgent"
import { SearchProvider } from './contexts/SearchContext'
import Recommendations from "./components/Recommendations"
import Comparaison from './components/Comparaison'
import { useUserRole } from './hooks/useUserRole'
import DemandesVisite from './components/DemandesVisite'
import NotificationsUser from './components/NotificationsUser'
import HistoriqueDemandesAgent from './components/HistoriqueDemandesAgent'

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
              {/* ✅ ROUTES PUBLIQUES (anonymes) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProprietesMap />} />
              <Route path="/recherche" element={<Search />} />
              <Route path="/comparaison" element={<Comparaison />} />
              
              {/* ✅ DÉTAIL PROPRIÉTÉ (anonyme ou connecté) */}
              <Route path="/propriete/:id" element={<ProprieteDetail />} />

              {/* ✅ PROFIL (connecté uniquement) */}
              <Route path="/profil" element={token ? <Profil /> : <Navigate to="/login" />} />

              {/* ✅ ROUTES ACHETEUR (connecté + pas agent) */}
              {!isAgent && token && (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/demandes-visite" element={<DemandesVisite />} />
                  <Route path="/notifications" element={<NotificationsUser />} />
                </>
              )}

              {/* ✅ ROUTES AGENT (connecté + agent) */}
              {isAgent && token && (
                <>
                  <Route path="/analytics" element={<AnalyticsAgent />} />
                  <Route path="/dashboard" element={<AnalyticsAgent />} />
                  <Route path="/historique-demandes" element={<HistoriqueDemandesAgent />} />
                </>
              )}

              {/* ✅ REDIRECTIONS AGENT sur routes acheteur */}
              {isAgent && (
                <>
                  <Route path="/recommendations" element={<Navigate to="/analytics" replace />} />
                  <Route path="/demandes-visite" element={<Navigate to="/historique-demandes" replace />} />
                  <Route path="/notifications" element={<Navigate to="/analytics" replace />} />
                </>
              )}

              {/* ✅ REDIRECTIONS ACHETEUR sur routes agent */}
              {!isAgent && token && (
                <>
                  <Route path="/analytics-agent" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/historique-demandes" element={<Navigate to="/demandes-visite" replace />} />
                </>
              )}

              {/* ✅ Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </HashRouter>
      </SearchProvider>
    </ApolloProvider>
  );
}

export default App;
