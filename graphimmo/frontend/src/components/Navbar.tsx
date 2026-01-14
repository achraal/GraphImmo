// Navbar.tsx - VERSION FINALE CORRIGÉE
import { NavLink, useNavigate } from "react-router-dom"
import { useUserRole } from "../hooks/useUserRole";
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const GET_NB_NOTIFS = gql`
  query NotificationsUser($token: String!) {
    notificationsUser(token: $token) {
      nbNonLues
    }
  }
`;

export default function Navbar() {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { isAgent } = useUserRole();

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/')
    window.location.reload()
  }

  // ✅ Query pour le badge notifications (UNIQUEMENT pour acheteurs)
  const { data: notifsData } = useQuery(GET_NB_NOTIFS, {
    variables: { token: token || '' },
    skip: !token || isAgent,
    pollInterval: 30000,
  });

  const nbNotifs = notifsData?.notificationsUser?.nbNonLues || 0;

  return (
    <nav style={{ 
      padding: "12px 16px", 
      borderBottom: "1px solid #e5e7eb",
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Liens gauche */}
      <div>
        {/* ✅ LIENS TOUJOURS VISIBLES */}
        <NavLink to="/" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
          🏠 Home
        </NavLink>
        <NavLink to="/recherche" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
          🔍 Recherche
        </NavLink>
        
        {/* ✅ COMPARAISON : Visible UNIQUEMENT si pas agent */}
        {!isAgent && (
          <NavLink to="/comparaison" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
            🆚 Comparaison
          </NavLink>
        )}
        
        {/* ✅ LIENS ACHETEUR (authentifié + pas agent) */}
        {token && !isAgent && (
          <>
            <NavLink to="/recommendations" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
              ✨ Recommandations
            </NavLink>
            <NavLink to="/demandes-visite" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
              📅 Demandes
            </NavLink>
            
            {/* ✅ NOTIFICATIONS AVEC BADGE */}
            <NavLink 
              to="/notifications" 
              style={{ 
                textDecoration: 'none', 
                color: '#111827',
                position: 'relative',
                marginRight: 12
              }}
            >
              🔔 Notifications
              {nbNotifs > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 'bold'
                }}>
                  {nbNotifs}
                </span>
              )}
            </NavLink>
          </>
        )}
        
        {/* ✅ LIENS AGENT (authentifié + agent) */}
        {token && isAgent && (
          <>
            <NavLink to="/analytics" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
              📊 Analytics
            </NavLink>
            <NavLink to="/historique-demandes" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
              📋 Demandes Visite
            </NavLink>
          </>
        )}
      </div>

      {/* Actions droite */}
      <div>
        {token ? (
          /* ✅ CONNECTÉ */
          <>
            {/* DASHBOARD ACHETEUR */}
            {!isAgent && (
              <NavLink 
                to="/dashboard"
                style={{ 
                  marginRight: 12, 
                  padding: '8px 16px',
                  background: '#8b5cf6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: '14px'
                }}
              >
                📊 Dashboard
              </NavLink>
            )}
            
            {/* PROFIL (TOUS) */}
            <NavLink 
              to="/profil" 
              style={{ 
                marginRight: 12, 
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 500,
                fontSize: '14px'
              }}
            >
              👤 Profil
            </NavLink>
            
            {/* DÉCONNEXION */}
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '14px'
              }}
            >
              🚪 Déconnexion
            </button>
          </>
        ) : (
          /* ❌ PAS CONNECTÉ */
          <>
            <NavLink 
              to="/login" 
              style={{ 
                marginRight: 12, 
                padding: '8px 16px', 
                background: '#3b82f6', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '6px', 
                fontWeight: 500, 
                fontSize: '14px' 
              }}
            >
              🔑 Connexion
            </NavLink>
            <NavLink 
              to="/register" 
              style={{ 
                padding: '8px 16px', 
                background: '#10b981', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '6px', 
                fontWeight: 500, 
                fontSize: '14px' 
              }}
            >
              ➕ Inscription
            </NavLink>
          </>
        )}
      </div>
    </nav>
  )
}
