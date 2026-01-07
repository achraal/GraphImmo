import { NavLink, useNavigate } from "react-router-dom"

export default function Navbar() {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
    window.location.reload()
  }

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
        <NavLink 
          to="/" 
          style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}
        >
          🏠 Home
        </NavLink>
        <NavLink 
          to="/recherche" 
          style={{ textDecoration: 'none', color: '#111827' }}
        >
          🔍 Recherche
        </NavLink>
      </div>
      
      {/* Actions droite */}
      <div>
        {token ? (
          /* ✅ CONNECTÉ : Profil + Déconnexion */
          <>
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
          /* ❌ PAS CONNECTÉ : Login + Register */
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
