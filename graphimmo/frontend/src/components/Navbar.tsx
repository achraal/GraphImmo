// // Navbar.tsx - VERSION FINALE CORRIGÉE
// import { NavLink, useNavigate } from "react-router-dom"
// import { useUserRole } from "../hooks/useUserRole";
// import { useQuery } from '@apollo/client/react';
// import { gql } from '@apollo/client';

// const GET_NB_NOTIFS = gql`
//   query NotificationsUser($token: String!) {
//     notificationsUser(token: $token) {
//       nbNonLues
//     }
//   }
// `;

// export default function Navbar() {
//   const token = localStorage.getItem('token')
//   const navigate = useNavigate()
//   const { isAgent } = useUserRole();

//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('role')
//     navigate('/')
//     window.location.reload()
//   }

//   // ✅ Query pour le badge notifications (UNIQUEMENT pour acheteurs)
//   const { data: notifsData } = useQuery(GET_NB_NOTIFS, {
//     variables: { token: token || '' },
//     skip: !token || isAgent,
//     pollInterval: 30000,
//   });

//   const nbNotifs = notifsData?.notificationsUser?.nbNonLues || 0;

//   return (
//     <nav style={{ 
//       padding: "12px 16px", 
//       borderBottom: "1px solid #e5e7eb",
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     }}>
//       {/* Liens gauche */}
//       <div>
//         {/* ✅ LIENS TOUJOURS VISIBLES */}
//         <NavLink to="/" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
//           🏠 Home
//         </NavLink>
//         <NavLink to="/recherche" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
//           🔍 Recherche
//         </NavLink>
        
//         {/* ✅ COMPARAISON : Visible UNIQUEMENT si pas agent */}
//         {!isAgent && (
//           <NavLink to="/comparaison" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
//             🆚 Comparaison
//           </NavLink>
//         )}
        
//         {/* ✅ LIENS ACHETEUR (authentifié + pas agent) */}
//         {token && !isAgent && (
//           <>
//             <NavLink to="/recommendations" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
//               ✨ Recommandations
//             </NavLink>
//             <NavLink to="/demandes-visite" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
//               📅 Demandes
//             </NavLink>
            
//             {/* ✅ NOTIFICATIONS AVEC BADGE */}
//             <NavLink 
//               to="/notifications" 
//               style={{ 
//                 textDecoration: 'none', 
//                 color: '#111827',
//                 position: 'relative',
//                 marginRight: 12
//               }}
//             >
//               🔔 Notifications
//               {nbNotifs > 0 && (
//                 <span style={{
//                   position: 'absolute',
//                   top: -8,
//                   right: -8,
//                   background: '#ef4444',
//                   color: 'white',
//                   borderRadius: '50%',
//                   width: 20,
//                   height: 20,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: 11,
//                   fontWeight: 'bold'
//                 }}>
//                   {nbNotifs}
//                 </span>
//               )}
//             </NavLink>
//           </>
//         )}
        
//         {/* ✅ LIENS AGENT (authentifié + agent) */}
//         {token && isAgent && (
//           <>
//             <NavLink to="/analytics" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
//               📊 Analytics
//             </NavLink>
//             <NavLink to="/historique-demandes" style={{ marginRight: 12, textDecoration: 'none', color: '#111827' }}>
//               📋 Demandes Visite
//             </NavLink>
//           </>
//         )}
//       </div>

//       {/* Actions droite */}
//       <div>
//         {token ? (
//           /* ✅ CONNECTÉ */
//           <>
//             {/* DASHBOARD ACHETEUR */}
//             {!isAgent && (
//               <NavLink 
//                 to="/dashboard"
//                 style={{ 
//                   marginRight: 12, 
//                   padding: '8px 16px',
//                   background: '#8b5cf6',
//                   color: 'white',
//                   textDecoration: 'none',
//                   borderRadius: '6px',
//                   fontWeight: 500,
//                   fontSize: '14px'
//                 }}
//               >
//                 📊 Dashboard
//               </NavLink>
//             )}
            
//             {/* PROFIL (TOUS) */}
//             <NavLink 
//               to="/profil" 
//               style={{ 
//                 marginRight: 12, 
//                 padding: '8px 16px',
//                 background: '#3b82f6',
//                 color: 'white',
//                 textDecoration: 'none',
//                 borderRadius: '6px',
//                 fontWeight: 500,
//                 fontSize: '14px'
//               }}
//             >
//               👤 Profil
//             </NavLink>
            
//             {/* DÉCONNEXION */}
//             <button 
//               onClick={handleLogout}
//               style={{
//                 padding: '8px 16px',
//                 background: '#ef4444',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 fontWeight: 500,
//                 fontSize: '14px'
//               }}
//             >
//               🚪 Déconnexion
//             </button>
//           </>
//         ) : (
//           /* ❌ PAS CONNECTÉ */
//           <>
//             <NavLink 
//               to="/login" 
//               style={{ 
//                 marginRight: 12, 
//                 padding: '8px 16px', 
//                 background: '#3b82f6', 
//                 color: 'white', 
//                 textDecoration: 'none', 
//                 borderRadius: '6px', 
//                 fontWeight: 500, 
//                 fontSize: '14px' 
//               }}
//             >
//               🔑 Connexion
//             </NavLink>
//             <NavLink 
//               to="/register" 
//               style={{ 
//                 padding: '8px 16px', 
//                 background: '#10b981', 
//                 color: 'white', 
//                 textDecoration: 'none', 
//                 borderRadius: '6px', 
//                 fontWeight: 500, 
//                 fontSize: '14px' 
//               }}
//             >
//               ➕ Inscription
//             </NavLink>
//           </>
//         )}
//       </div>
//     </nav>
//   )
// }
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Badge,
  Typography,
  Stack,
  IconButton,
  alpha,
} from "@mui/material"
import {
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  CompareArrows as CompareArrowsIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Analytics as AnalyticsIcon,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material"

import { NavLink, useNavigate } from "react-router-dom"
import { useUserRole } from "../hooks/useUserRole"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"

const GET_NB_NOTIFS = gql`
  query NotificationsUser($token: String!) {
    notificationsUser(token: $token) {
      nbNonLues
    }
  }
`

export default function Navbar() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const { isAgent } = useUserRole()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/")
    window.location.reload()
  }

  const { data } = useQuery(GET_NB_NOTIFS, {
    variables: { token: token || "" },
    skip: !token || isAgent,
    pollInterval: 30000,
  })

  const nbNotifs = data?.notificationsUser?.nbNonLues || 0

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#0F172A", // Slate 900 pour un look très pro
        borderBottom: "1px solid",
        borderColor: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 70 }}>
        
        {/* ================= LEFT: LOGO & NAV ================= */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              fontWeight: 900,
              textDecoration: "none",
              color: "white",
              fontFamily: "Roboto",
              letterSpacing: "-0.5px",
              mr: 2,
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            
          </Typography>

          <Stack direction="row" spacing={0.5}>
            <NavButton to="/" icon={<HomeIcon fontSize="small" />} label="Accueil" />
            <NavButton to="/recherche" icon={<SearchIcon fontSize="small" />} label="Recherche" />

            {!isAgent && (
              <NavButton
                to="/comparaison"
                icon={<CompareArrowsIcon fontSize="small" />}
                label="Comparer"
              />
            )}

            {token && !isAgent && (
              <>
                <NavButton
                  to="/recommendations"
                  icon={<DashboardIcon fontSize="small" />}
                  label="Pour vous"
                />
                <NavButton
                  to="/demandes-visite"
                  icon={<CalendarMonthIcon fontSize="small" />}
                  label="Mes Visites"
                />
              </>
            )}

            {token && isAgent && (
              <>
                <NavButton
                  to="/analytics"
                  icon={<AnalyticsIcon fontSize="small" />}
                  label="Statistiques"
                />
                <NavButton
                  to="/historique-demandes"
                  icon={<CalendarMonthIcon fontSize="small" />}
                  label="Gestion Visites"
                />
              </>
            )}
          </Stack>
        </Stack>

        {/* ================= RIGHT: USER ACTIONS ================= */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {token && !isAgent && (
            <IconButton
              component={NavLink}
              to="/notifications"
              sx={{ 
                color: "rgba(255,255,255,0.7)", 
                "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.05)" } 
              }}
            >
              <Badge badgeContent={nbNotifs} color="error" overlap="circular">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          )}

          {token ? (
            <>
              {!isAgent && (
                <Button
                  component={NavLink}
                  to="/dashboard"
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    px: 3
                  }}
                >
                  Dashboard
                </Button>
              )}

              <Button
                component={NavLink}
                to="/profil"
                variant="text"
                startIcon={<PersonIcon />}
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": { color: "white" }
                }}
              >
                Mon Profil
              </Button>

              <IconButton 
                onClick={handleLogout}
                sx={{ 
                    color: "#FCA5A5", 
                    "&:hover": { bgcolor: alpha("#ef4444", 0.1), color: "#f87171" } 
                }}
                title="Déconnexion"
              >
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                component={NavLink}
                to="/login"
                variant="text"
                sx={{ color: "white", textTransform: "none", fontWeight: 600 }}
              >
                Connexion
              </Button>
              <Button
                component={NavLink}
                to="/register"
                variant="contained"
                startIcon={<PersonAddIcon />}
                sx={{
                  bgcolor: "white",
                  color: "#0F172A",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "10px",
                  "&:hover": { bgcolor: "#E2E8F0" }
                }}
              >
                S'inscrire
              </Button>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

/* ================= NAV BUTTON COMPONENT ================= */

function NavButton({
  to,
  icon,
  label,
}: {
  to: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Button
      component={NavLink}
      to={to}
      startIcon={icon}
      sx={{
        color: "rgba(255,255,255,0.7)",
        textTransform: "none",
        fontFamily: "Roboto",
        fontWeight: 500,
        fontSize: "0.9rem",
        px: 2,
        py: 1,
        borderRadius: "8px",
        transition: "all 0.2s",
        "&:hover": {
          color: "white",
          backgroundColor: "rgba(255,255,255,0.05)",
        },
        "&.active": {
          color: "white",
          backgroundColor: "rgba(255,255,255,0.1)",
          fontWeight: 700,
          "& .MuiButton-startIcon": {
            color: "#818CF8" // Accentuation de l'icône active en bleu clair
          }
        },
      }}
    >
      {label}
    </Button>
  )
}