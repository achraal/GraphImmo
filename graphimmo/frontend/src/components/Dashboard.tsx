// import { useQuery } from '@apollo/client/react'
// import { gql } from '@apollo/client'
// import { useNavigate } from 'react-router-dom'

// const DASHBOARD_PERSONNEL = gql`
//   query DashboardPersonnel($token: String!) {
//     dashboardPersonnel(token: $token) {
//       favoris {
//         proprieteId
//         dateAjout
//         note
//       }
//       visites {
//         id
//         dateVisite
//         impression
//         prixPropose
//       }
//       nbFavoris
//       nbVisites
//     }
//   }
// `

// export default function Dashboard() {
//   const navigate = useNavigate()
//   const token = localStorage.getItem('token') || ''

//   const { data, loading, error, refetch } = useQuery(DASHBOARD_PERSONNEL, {
//     variables: { token },
//     skip: !token,
//   })

//   if (!token) {
//     return (
//       <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
//         <h1>🔐 Dashboard Personnel</h1>
//         <p>Connectez-vous pour voir vos favoris et visites</p>
//         <button 
//           onClick={() => navigate('/login')}
//           style={{
//             padding: '12px 32px', borderRadius: '8px', border: 'none',
//             background: '#3b82f6', color: 'white', fontSize: '16px', fontWeight: 600
//           }}
//         >
//           Se connecter
//         </button>
//       </div>
//     )
//   }

//   if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Chargement...</div>
//   if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Erreur: {error.message}</div>

//   const dash = data.dashboardPersonnel

//   return (
//     <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
//       <div style={{ textAlign: 'center', marginBottom: '40px' }}>
//         <h1 style={{ color: '#1e3a8a', fontSize: '32px' }}>📊 Dashboard Personnel</h1>
//         <button 
//           onClick={() => refetch()}
//           style={{ marginTop: '8px', padding: '8px 16px', borderRadius: '6px', background: '#f3f4f6' }}
//         >
//           🔄 Rafraîchir
//         </button>
//       </div>

//       {/* Stats principales */}
//       <div style={{ 
//         display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
//         gap: '24px', marginBottom: '40px' 
//       }}>
//         <div style={{ 
//           background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', padding: '24px', 
//           borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(59,130,246,0.2)' 
//         }}>
//           <div style={{ fontSize: '48px', color: '#1e40af', fontWeight: 'bold' }}>
//             {dash.nbFavoris}
//           </div>
//           <div style={{ color: '#1e40af', fontWeight: 600, fontSize: '18px' }}>❤️ Favoris</div>
//         </div>
//         <div style={{ 
//           background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', padding: '24px', 
//           borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(5,150,105,0.2)' 
//         }}>
//           <div style={{ fontSize: '48px', color: '#059669', fontWeight: 'bold' }}>
//             {dash.nbVisites}
//           </div>
//           <div style={{ color: '#059669', fontWeight: 600, fontSize: '18px' }}>👀 Visites</div>
//         </div>
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
//         {/* Favoris récents - PLUS D'INFOS */}
//         <section style={{ background: '#fef3c7', padding: '24px', borderRadius: '16px' }}>
//           <h2 style={{ color: '#92400e', marginBottom: '20px', fontSize: '24px' }}>
//             ❤️ Favoris ({dash.nbFavoris})
//           </h2>
//           {dash.favoris.length === 0 ? (
//             <div style={{ padding: '32px', textAlign: 'center', color: '#d97706' }}>
//               <span style={{ fontSize: '48px' }}>💚</span><br/>
//               Aucun favori. Ajoutez-en depuis les détails propriétés !
//             </div>
//           ) : (
//             <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
//               {dash.favoris.slice(0, 8).map((fav, i) => (
//                 <div key={i} style={{ 
//                   background: 'white', padding: '20px', borderRadius: '12px', 
//                   marginBottom: '12px', cursor: 'pointer', 
//                   borderLeft: '4px solid #f59e0b', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//                 }} onClick={() => navigate(`/propriete/${fav.proprieteId}`)}>
//                   <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
//                     PROP-{fav.proprieteId.slice(-8).toUpperCase()}
//                   </div>
//                   <div style={{ color: '#92400e', fontSize: '14px', marginBottom: '8px' }}>
//                     Ajouté: {new Date(fav.dateAjout).toLocaleDateString('fr-MA')}
//                   </div>
//                   {fav.note && (
//                     <div style={{ 
//                       background: '#fef3c7', padding: '8px', borderRadius: '6px', 
//                       fontStyle: 'italic', fontSize: '14px', marginTop: '4px'
//                     }}>
//                       "{fav.note}"
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Visites récentes - PLUS D'INFOS */}
//         <section style={{ background: '#f0f9ff', padding: '24px', borderRadius: '16px' }}>
//           <h2 style={{ color: '#0369a1', marginBottom: '20px', fontSize: '24px' }}>
//             👀 Visites ({dash.nbVisites})
//           </h2>
//           {dash.visites.length === 0 ? (
//             <div style={{ padding: '32px', textAlign: 'center', color: '#0c4a6e' }}>
//               <span style={{ fontSize: '48px' }}>🔍</span><br/>
//               Visitez des propriétés pour voir l'historique ici !
//             </div>
//           ) : (
//             <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
//               {dash.visites.slice(0, 8).map((visite) => (
//                 <div key={visite.id} style={{ 
//                   background: 'white', padding: '16px', borderRadius: '12px', 
//                   marginBottom: '12px', borderLeft: '4px solid #0ea5e9'
//                 }}>
//                   <div style={{ fontWeight: 600, fontSize: '14px', color: '#0c4a6e' }}>
//                     {visite.id}
//                   </div>
//                   <div style={{ color: '#0369a1', fontSize: '13px' }}>
//                     {new Date(visite.dateVisite).toLocaleDateString('fr-MA')}
//                   </div>
//                   {visite.impression && (
//                     <div style={{ marginTop: '6px', fontStyle: 'italic', color: '#0c4a6e' }}>
//                       {visite.impression}
//                     </div>
//                   )}
//                   {visite.prixPropose && (
//                     <div style={{ 
//                       marginTop: '6px', fontWeight: 700, color: '#059669', fontSize: '15px' 
//                     }}>
//                       💰 {visite.prixPropose.toLocaleString('fr-MA')} MAD
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   )
// }

import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Avatar,
  Stack,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Visibility as VisitIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  EventNote as DateIcon,
  ChevronRight as ArrowIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const DASHBOARD_PERSONNEL = gql`
  query DashboardPersonnel($token: String!) {
    dashboardPersonnel(token: $token) {
      favoris {
        proprieteId
        dateAjout
        note
      }
      visites {
        id
        dateVisite
        impression
        prixPropose
      }
      nbFavoris
      nbVisites
    }
  }
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';

  const { data, loading, error, refetch } = useQuery(DASHBOARD_PERSONNEL, {
    variables: { token },
    skip: !token,
  });

  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.light', margin: '0 auto 24px' }}>
            <LockIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Avatar>
          <Typography variant="h4" fontWeight={900} gutterBottom>Accès Restreint</Typography>
          <Button variant="contained" onClick={() => navigate('/login')} sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}>
            Se connecter
          </Button>
        </Paper>
      </Container>
    );
  }

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Container sx={{ py: 10 }}><Alert severity="error">{error.message}</Alert></Container>
  );

  const dash = data.dashboardPersonnel;

  return (
    // Utilisation de maxWidth="xl" pour une largeur maximale très généreuse
    <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, md: 6 } }}>
      
      {/* HEADER SECTION - LARGE ET CENTRÉ */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" fontWeight={900} sx={{ letterSpacing: '-0.04em', mb: 1, color: '#1e293b' }}>
          Tableau de Bord
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 400 }}>
          Gérez vos coups de cœur et l'historique de vos recherches immobilières.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => refetch()} 
          startIcon={<RefreshIcon />}
          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, px: 4, py: 1.2, boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
        >
          Mettre à jour les données
        </Button>
      </Box>

      {/* STATS CARDS - TRÈS LARGES */}
      <Grid container spacing={4} sx={{ mb: 10, justifyContent: 'center' }}>
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ borderRadius: 5, bgcolor: '#eff6ff', border: '1px solid #dbeafe', transition: '0.3s', '&:hover': { boxShadow: '0 10px 20px rgba(0,0,0,0.05)' } }}>
            <CardContent sx={{ p: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#3b82f6', boxShadow: '0 8px 16px rgba(59,130,246,0.3)' }}>
                <FavoriteIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography variant="h2" fontWeight={900} color="#1e3a8a">{dash.nbFavoris}</Typography>
                <Typography variant="h6" fontWeight={600} color="#1e3a8a" sx={{ opacity: 0.8 }}>Propriétés Favorites</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ borderRadius: 5, bgcolor: '#f0fdf4', border: '1px solid #dcfce7', transition: '0.3s', '&:hover': { boxShadow: '0 10px 20px rgba(0,0,0,0.05)' } }}>
            <CardContent sx={{ p: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#22c55e', boxShadow: '0 8px 16px rgba(34,197,94,0.3)' }}>
                <VisitIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography variant="h2" fontWeight={900} color="#14532d">{dash.nbVisites}</Typography>
                <Typography variant="h6" fontWeight={600} color="#14532d" sx={{ opacity: 0.8 }}>Visites Effectuées</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SECTIONS PRINCIPALES - ÉTENDUES SUR LA LARGEUR */}
      <Grid container spacing={8} sx={{ justifyContent: 'center' }}>
        
        {/* --- COLONNE FAVORIS --- */}
        <Grid item xs={12} lg={5.5}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FavoriteIcon sx={{ color: '#ef4444', fontSize: 35 }} /> Mes Favoris
            </Typography>
            <Chip label={`${dash.nbFavoris} biens`} sx={{ fontWeight: 800, px: 2, py: 2, fontSize: '1rem' }} color="primary" variant="outlined" />
          </Box>
          
          <Stack spacing={3} sx={{ maxHeight: 700, overflowY: 'auto', pr: 2 }}>
            {dash.favoris.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: 5, borderStyle: 'dashed', bgcolor: '#f8fafc' }}>
                <Typography variant="h6" color="text.secondary">Vous n'avez pas encore de favoris.</Typography>
              </Paper>
            ) : (
              dash.favoris.map((fav: any, i: number) => (
                <Card 
                  key={i} 
                  elevation={0}
                  onClick={() => navigate(`/propriete/${fav.proprieteId}`)}
                  sx={{ 
                    borderRadius: 4, border: '1px solid', borderColor: 'divider', p: 1,
                    transition: 'all 0.3s ease', cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', borderColor: 'primary.main' }
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ width: 60, height: 60, bgcolor: '#f1f5f9', borderRadius: 3 }}><HomeIcon color="primary" /></Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={800}>Référence: {fav.proprieteId.slice(-8).toUpperCase()}</Typography>
                      <Typography variant="body2" color="text.secondary">Ajouté le {new Date(fav.dateAjout).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</Typography>
                      {fav.note && (
                        <Typography variant="body2" sx={{ mt: 1.5, p: 2, bgcolor: '#fffbeb', borderRadius: 2, color: '#92400e', borderLeft: '4px solid #f59e0b', fontStyle: 'italic' }}>
                          "{fav.note}"
                        </Typography>
                      )}
                    </Box>
                    <ArrowIcon sx={{ color: 'divider' }} />
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </Grid>

        {/* --- COLONNE JOURNAL DES VISITES --- */}
        <Grid item xs={12} lg={5.5}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <VisitIcon sx={{ color: '#3b82f6', fontSize: 35 }} /> Journal de Visites
            </Typography>
            <Chip label={`${dash.nbVisites} sessions`} sx={{ fontWeight: 800, px: 2, py: 2, fontSize: '1rem' }} color="info" variant="outlined" />
          </Box>

          <Box sx={{ maxHeight: 700, overflowY: 'auto', pr: 2 }}>
            {dash.visites.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: 5, borderStyle: 'dashed', bgcolor: '#f8fafc' }}>
                <Typography variant="h6" color="text.secondary">Aucune visite enregistrée pour le moment.</Typography>
              </Paper>
            ) : (
              dash.visites.map((visite: any) => (
                <Box key={visite.id} sx={{ position: 'relative', pl: 5, pb: 5, '&::before': {
                  content: '""', position: 'absolute', left: '9px', top: 0, bottom: 0, width: '3px', bgcolor: '#e2e8f0'
                }}}>
                  {/* Indicateur visuel Timeline */}
                  <Box sx={{ 
                    position: 'absolute', left: 0, top: 0, width: 22, height: 22, 
                    borderRadius: '50%', bgcolor: 'white', border: '4px solid #3b82f6', zIndex: 1, boxShadow: '0 0 0 4px #eff6ff'
                  }} />
                  
                  <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DateIcon color="action" fontSize="small" />
                        <Typography variant="subtitle1" fontWeight={800} color="primary">
                          {new Date(visite.dateVisite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Typography>
                      </Stack>
                      {visite.prixPropose && (
                        <Typography variant="h6" sx={{ color: '#059669', fontWeight: 900 }}>
                          {visite.prixPropose.toLocaleString()} MAD
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#475569', bgcolor: '#fcfcfd', p: 3, borderRadius: 3, border: '1px solid #f1f5f9' }}>
                      {visite.impression || "Visite confirmée sans commentaires additionnels."}
                    </Typography>
                  </Paper>
                </Box>
              ))
            )}
          </Box>
        </Grid>

      </Grid>
    </Container>
  );
}