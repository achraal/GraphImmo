// import React, { useState } from 'react';
// import { useQuery, useMutation } from '@apollo/client/react';
// import { gql } from '@apollo/client';
// import {
//   Box, 
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Alert,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Stack,
//   Divider,
//   Tabs,
//   Tab,
//   Button,
//   Badge
// } from '@mui/material';
// import {
//   TrendingUp,
//   TrendingDown,
//   Home,
//   Visibility,
//   Favorite,
//   AttachMoney,
//   ShowChart,
//   Notifications,
//   Assessment,
//   CheckCircle,
//   Cancel
// } from '@mui/icons-material';

// // GraphQL Queries & Mutations
// const GET_DASHBOARD_AGENT = gql`
//   query GetDashboardAgent($token: String!) {
//     dashboardAgent(token: $token) {
//       totalProprietes
//       prixMoyenProprietes
//       totalVisites
//       totalFavoris
//       statsMarche {
//         prixMoyen
//         prixMedian
//         nbProprietes
//         tendancePrix7j
//       }
//       performances {
//         id
//         titre
//         prix
//         nbVisites
//         nbFavoris
//       }
//     }
//   }
// `;

// const GET_NOTIFICATIONS_AGENT = gql`
//   query NotificationsAgent($token: String!) {
//     notificationsAgent(token: $token) {
//       notifications {
//         id
//         type
//         date
//         lu
//         message
//         proprieteId
//         proprieteTitre
//         userId
//         userNom
//         demandeid
//         dateSouhaitee
//         heure
//       }
//       nbNonLues
//     }
//   }
// `;

// const UPDATE_STATUT_DEMANDE = gql`
//   mutation UpdateStatutDemande($demandeid: String!, $statut: StatutVisite!, $token: String!) {
//     updateStatutDemande(demandeid: $demandeid, statut: $statut, token: $token)
//   }
// `;

// // Composant pour une carte de statistique
// const StatCard: React.FC<{
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   color: string;
//   subtitle?: string;
// }> = ({ title, value, icon, color, subtitle }) => (
//   <Card sx={{ height: '100%', boxShadow: 3 }}>
//     <CardContent>
//       <Stack spacing={2}>
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="subtitle2" color="text.secondary">
//             {title}
//           </Typography>
//           <Box
//             sx={{
//               backgroundColor: `${color}20`,
//               borderRadius: '50%',
//               p: 1,
//               display: 'flex'
//             }}
//           >
//             {icon}
//           </Box>
//         </Box>
//         <Typography variant="h4" fontWeight="bold">
//           {value}
//         </Typography>
//         {subtitle && (
//           <Typography variant="caption" color="text.secondary">
//             {subtitle}
//           </Typography>
//         )}
//       </Stack>
//     </CardContent>
//   </Card>
// );

// // Composant principal
// const AnalyticsAgent: React.FC = () => {
//   const token = localStorage.getItem('token') || '';
//   const [currentTab, setCurrentTab] = useState(0);

//   // Query dashboard stats
//   const { data: statsData, loading: statsLoading, error: statsError } = useQuery<{ 
//     dashboardAgent: StatsAgent 
//   }>(GET_DASHBOARD_AGENT, {
//     variables: { token },
//     skip: !token,
//     pollInterval: 60000,
//   });

//   // Query notifications
//   const { data: notifsData, loading: notifsLoading, error: notifsError, refetch: refetchNotifs } = useQuery<{
//     notificationsAgent: {
//       notifications: NotificationAgent[];
//       nbNonLues: number;
//     }
//   }>(GET_NOTIFICATIONS_AGENT, {
//     variables: { token },
//     skip: !token,
//     pollInterval: 30000, // Rafraîchir toutes les 30 secondes
//   });

//   // Mutation update statut
//   const [updateStatut, { loading: updating }] = useMutation(UPDATE_STATUT_DEMANDE);

//   const handleUpdateStatut = async (demandeid: string, statut: 'ACCEPTEE' | 'REFUSEE') => {
//     try {
//       await updateStatut({
//         variables: { demandeid, statut, token }
//       });
//       alert(`Demande ${statut === 'ACCEPTEE' ? 'acceptée' : 'refusée'} avec succès !`);
//       refetchNotifs(); // Rafraîchir la liste
//     } catch (err: any) {
//       console.error(err);
//       alert(`❌ Erreur : ${err.message}`);
//     }
//   };

//   if (!token) {
//     return (
//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         <Alert severity="warning">
//           Vous devez être connecté en tant qu'agent pour accéder au dashboard.
//         </Alert>
//       </Container>
//     );
//   }

//   const loading = statsLoading || notifsLoading;
//   const error = statsError || notifsError;

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress size={60} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         <Alert severity="error">
//           Erreur lors du chargement : {error.message}
//         </Alert>
//       </Container>
//     );
//   }

//   const stats = statsData?.dashboardAgent;
//   const notifications = notifsData?.notificationsAgent?.notifications || [];
//   const nbNonLues = notifsData?.notificationsAgent?.nbNonLues || 0;

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'MAD',
//       minimumFractionDigits: 0
//     }).format(price);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const tendanceColor = stats?.statsMarche.tendancePrix7j >= 0 ? '#4caf50' : '#f44336';
//   const tendanceIcon = stats?.statsMarche.tendancePrix7j >= 0 ? (
//     <TrendingUp style={{ color: tendanceColor }} />
//   ) : (
//     <TrendingDown style={{ color: tendanceColor }} />
//   );

//   return (
//     <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" fontWeight="bold" gutterBottom>
//         📊 Dashboard Analytics Agent
//       </Typography>
//       <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
//         Vue d'ensemble de vos performances et demandes de visite
//       </Typography>

//       {/* Onglets */}
//       <Paper sx={{ mb: 3 }}>
//         <Tabs
//           value={currentTab}
//           onChange={(_, newValue) => setCurrentTab(newValue)}
//           indicatorColor="primary"
//           textColor="primary"
//         >
//           <Tab 
//             icon={
//               <Badge badgeContent={nbNonLues} color="error">
//                 <Notifications />
//               </Badge>
//             } 
//             label="Demandes de Visite" 
//             iconPosition="start"
//           />
//           <Tab 
//             icon={<Assessment />} 
//             label="Statistiques" 
//             iconPosition="start"
//           />
//         </Tabs>
//       </Paper>

//       {/* TAB 1: NOTIFICATIONS / DEMANDES DE VISITE */}
//       {currentTab === 0 && (
//         <Box>
//           <Paper sx={{ p: 3, mb: 3 }}>
//             <Typography variant="h6" fontWeight="bold" gutterBottom>
//               🔔 Demandes de Visite ({notifications.length})
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//               {nbNonLues > 0 ? `${nbNonLues} nouvelle(s) demande(s) non lue(s)` : 'Toutes les demandes sont à jour'}
//             </Typography>
//             <Divider sx={{ my: 2 }} />

//             {notifications.length === 0 ? (
//               <Alert severity="info">
//                 Aucune demande de visite pour le moment.
//               </Alert>
//             ) : (
//               <Stack spacing={2}>
//                 {notifications.map((notif) => (
//                   <Card
//                     key={notif.id}
//                     sx={{
//                       backgroundColor: notif.lu ? '#ffffff' : '#fff9e6',
//                       border: notif.lu ? '1px solid #e0e0e0' : '2px solid #ffc107',
//                       boxShadow: notif.lu ? 1 : 3,
//                     }}
//                   >
//                     <CardContent>
//                       <Grid container spacing={2} alignItems="center">
//                         {/* Colonne 1: Info propriété */}
//                         <Grid item xs={12} md={4}>
//                           <Typography variant="subtitle1" fontWeight="bold" color="primary">
//                             🏠 {notif.proprieteTitre}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             ID: {notif.proprieteId}
//                           </Typography>
//                         </Grid>

//                         {/* Colonne 2: Info visiteur */}
//                         <Grid item xs={12} md={4}>
//                           <Typography variant="body2" gutterBottom>
//                             👤 <strong>{notif.userNom}</strong>
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             📅 {notif.dateSouhaitee} à {notif.heure}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary" display="block">
//                             Reçu le {formatDate(notif.date)}
//                           </Typography>
//                         </Grid>

//                         {/* Colonne 3: Actions */}
//                         <Grid item xs={12} md={4}>
//                           <Stack direction="row" spacing={1} justifyContent="flex-end">
//                             <Button
//                               variant="contained"
//                               color="success"
//                               size="small"
//                               startIcon={<CheckCircle />}
//                               onClick={() => handleUpdateStatut(notif.demandeid, 'ACCEPTEE')}
//                               disabled={updating}
//                             >
//                               Accepter
//                             </Button>
//                             <Button
//                               variant="contained"
//                               color="error"
//                               size="small"
//                               startIcon={<Cancel />}
//                               onClick={() => handleUpdateStatut(notif.demandeid, 'REFUSEE')}
//                               disabled={updating}
//                             >
//                               Refuser
//                             </Button>
//                           </Stack>
//                         </Grid>
//                       </Grid>

//                       {/* Message */}
//                       {notif.message && (
//                         <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
//                           <Typography variant="body2" color="text.secondary">
//                             💬 {notif.message}
//                           </Typography>
//                         </Box>
//                       )}

//                       {/* ID demande */}
//                       <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
//                         ID Demande: {notif.demandeid}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </Stack>
//             )}
//           </Paper>
//         </Box>
//       )}

//       {/* TAB 2: STATISTIQUES */}
//       {currentTab === 1 && stats && (
//         <Box>
//           {/* Section 1: Statistiques principales */}
//           <Grid container spacing={3} sx={{ mb: 4 }}>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard
//                 title="Propriétés Gérées"
//                 value={stats.totalProprietes}
//                 icon={<Home style={{ color: '#1976d2' }} />}
//                 color="#1976d2"
//                 subtitle="Total de propriétés sous gestion"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard
//                 title="Prix Moyen"
//                 value={formatPrice(stats.prixMoyenProprietes)}
//                 icon={<AttachMoney style={{ color: '#9c27b0' }} />}
//                 color="#9c27b0"
//                 subtitle="De vos propriétés"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard
//                 title="Total Visites"
//                 value={stats.totalVisites}
//                 icon={<Visibility style={{ color: '#ff9800' }} />}
//                 color="#ff9800"
//                 subtitle="Visites enregistrées"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard
//                 title="Total Favoris"
//                 value={stats.totalFavoris}
//                 icon={<Favorite style={{ color: '#e91e63' }} />}
//                 color="#e91e63"
//                 subtitle="Propriétés favorites"
//               />
//             </Grid>
//           </Grid>

//           {/* Section 2: Statistiques du marché */}
//           <Paper sx={{ p: 3, mb: 4, boxShadow: 3 }}>
//             <Typography variant="h6" fontWeight="bold" gutterBottom>
//               <ShowChart sx={{ mr: 1, verticalAlign: 'middle' }} />
//               Statistiques du Marché Immobilier
//             </Typography>
//             <Divider sx={{ my: 2 }} />
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={3}>
//                 <Box textAlign="center">
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Prix Moyen Marché
//                   </Typography>
//                   <Typography variant="h5" fontWeight="bold" color="primary">
//                     {formatPrice(stats.statsMarche.prixMoyen)}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Box textAlign="center">
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Prix Médian
//                   </Typography>
//                   <Typography variant="h5" fontWeight="bold" color="secondary">
//                     {formatPrice(stats.statsMarche.prixMedian)}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Box textAlign="center">
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Propriétés sur le Marché
//                   </Typography>
//                   <Typography variant="h5" fontWeight="bold">
//                     {stats.statsMarche.nbProprietes}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} md={3}>
//                 <Box textAlign="center">
//                   <Typography variant="subtitle2" color="text.secondary">
//                     Tendance 7 Jours
//                   </Typography>
//                   <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
//                     {tendanceIcon}
//                     <Typography
//                       variant="h5"
//                       fontWeight="bold"
//                       sx={{ color: tendanceColor, ml: 1 }}
//                     >
//                       {stats.statsMarche.tendancePrix7j > 0 ? '+' : ''}
//                       {stats.statsMarche.tendancePrix7j.toFixed(2)}%
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* Section 3: Performance des propriétés */}
//           <Paper sx={{ p: 3, boxShadow: 3 }}>
//             <Typography variant="h6" fontWeight="bold" gutterBottom>
//               🏆 Performance de vos Propriétés (Top 15)
//             </Typography>
//             <Divider sx={{ my: 2 }} />
            
//             {stats.performances.length === 0 ? (
//               <Alert severity="info">
//                 Aucune propriété trouvée. Commencez par ajouter des propriétés pour voir leurs performances.
//               </Alert>
//             ) : (
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell><strong>Propriété</strong></TableCell>
//                       <TableCell align="right"><strong>Prix</strong></TableCell>
//                       <TableCell align="center"><strong>Visites</strong></TableCell>
//                       <TableCell align="center"><strong>Favoris</strong></TableCell>
//                       <TableCell align="center"><strong>Score</strong></TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {stats.performances.map((prop, index) => {
//                       const score = prop.nbVisites * 1 + prop.nbFavoris * 2;
//                       const scoreColor = score > 10 ? 'success' : score > 5 ? 'warning' : 'default';
            
//                       return (
//                         <TableRow
//                           key={prop.id}
//                           sx={{ 
//                             '&:hover': { backgroundColor: '#f5f5f5' },
//                             backgroundColor: index < 3 ? '#fff3e0' : 'transparent'
//                           }}
//                         >
//                           <TableCell>
//                             <Box display="flex" alignItems="center">
//                               {index < 3 && (
//                                 <Chip
//                                   label={`#${index + 1}`}
//                                   size="small"
//                                   color="warning"
//                                   sx={{ mr: 1 }}
//                                 />
//                               )}
//                               <Typography variant="body2" fontWeight={index < 3 ? 'bold' : 'normal'}>
//                                 {prop.titre}
//                               </Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell align="right">
//                             <Typography variant="body2" color="primary" fontWeight="bold">
//                               {formatPrice(prop.prix)}
//                             </Typography>
//                           </TableCell>
//                           <TableCell align="center">
//                             <Chip
//                               icon={<Visibility fontSize="small" />}
//                               label={prop.nbVisites}
//                               size="small"
//                               variant="outlined"
//                               color="info"
//                             />
//                           </TableCell>
//                           <TableCell align="center">
//                             <Chip
//                               icon={<Favorite fontSize="small" />}
//                               label={prop.nbFavoris}
//                               size="small"
//                               variant="outlined"
//                               color="error"
//                             />
//                           </TableCell>
//                           <TableCell align="center">
//                             <Chip
//                               label={score}
//                               size="small"
//                               color={scoreColor}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Paper>
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default AnalyticsAgent;

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Box, Container, Grid, Card, CardContent, Typography, CircularProgress,
  Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, Stack, Divider, Tabs, Tab, Button, Badge, Avatar, useTheme, Fade, IconButton
} from '@mui/material';
import {
  TrendingUp, TrendingDown, Home, Visibility, Favorite, AttachMoney,
  ShowChart, Notifications, Assessment, CheckCircle, Cancel,
  Star as StarIcon, ArrowForward as ArrowIcon
} from '@mui/icons-material';

// --- GRAPHQL ---
const GET_DASHBOARD_AGENT = gql`
  query GetDashboardAgent($token: String!) {
    dashboardAgent(token: $token) {
      totalProprietes
      prixMoyenProprietes
      totalVisites
      totalFavoris
      statsMarche {
        prixMoyen prixMedian nbProprietes tendancePrix7j
      }
      performances {
        id titre prix nbVisites nbFavoris
      }
    }
  }
`;

const GET_NOTIFICATIONS_AGENT = gql`
  query NotificationsAgent($token: String!) {
    notificationsAgent(token: $token) {
      notifications {
        id type date lu message proprieteId proprieteTitre userNom demandeid dateSouhaitee heure
      }
      nbNonLues
    }
  }
`;

const UPDATE_STATUT_DEMANDE = gql`
  mutation UpdateStatutDemande($demandeid: String!, $statut: StatutVisite!, $token: String!) {
    updateStatutDemande(demandeid: $demandeid, statut: $statut, token: $token)
  }
`;

// --- COMPOSANT STAT CARD (CENTRÉ ET SYMÉTRIQUE) ---
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; subtitle: string }> = ({ title, value, icon, color, subtitle }) => (
  <Paper 
    elevation={0} 
    sx={{ 
      p: 3, borderRadius: 5, border: '1px solid #e2e8f0', bgcolor: 'white',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', height: '100%', minHeight: '180px'
    }}
  >
    <Avatar sx={{ bgcolor: `${color}15`, color: color, mb: 1.5, width: 50, height: 50 }}>
      {icon}
    </Avatar>
    <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b', mb: 0.5 }}>
      {value}
    </Typography>
    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="caption" color="text.disabled">{subtitle}</Typography>
  </Paper>
);

const AnalyticsAgent: React.FC = () => {
  const theme = useTheme();
  const token = localStorage.getItem('token') || '';
  const [currentTab, setCurrentTab] = useState(0);

  const { data: statsData, loading: statsLoading } = useQuery(GET_DASHBOARD_AGENT, { 
    variables: { token }, skip: !token 
  });

  const { data: notifsData, loading: notifsLoading, refetch: refetchNotifs } = useQuery(GET_NOTIFICATIONS_AGENT, { 
    variables: { token }, skip: !token 
  });

  const [updateStatut] = useMutation(UPDATE_STATUT_DEMANDE);

  const handleUpdateStatut = async (demandeid: string, statut: 'ACCEPTEE' | 'REFUSEE') => {
    try {
      await updateStatut({ variables: { demandeid, statut, token } });
      refetchNotifs();
    } catch (err) { console.error(err); }
  };

  if (!token) return <Container sx={{ py: 10 }}><Alert severity="warning">Session requise</Alert></Container>;
  if (statsLoading || notifsLoading) return <Box display="flex" justifyContent="center" py={20}><CircularProgress /></Box>;

  const stats = statsData?.dashboardAgent;
  const notifications = notifsData?.notificationsAgent?.notifications || [];
  const nbNonLues = notifsData?.notificationsAgent?.nbNonLues || 0;

  const formatPrice = (p: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(p);

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        
        {/* HEADER SECTION */}
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="h3" fontWeight={950} sx={{ letterSpacing: '-0.03em', color: '#1e293b' }}>
              Analytics <span style={{ color: theme.palette.primary.main }}>Pro</span>
            </Typography>
            <Typography variant="body1" color="text.secondary">Performance de votre parc immobilier en temps réel</Typography>
          </Box>
          <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)} sx={{ mb: 0.5 }}>
            <Tab label="Demandes" icon={<Badge badgeContent={nbNonLues} color="error"><Notifications /></Badge>} iconPosition="start" />
            <Tab label="Performance" icon={<Assessment />} iconPosition="start" />
          </Tabs>
        </Box>

        {currentTab === 1 && stats && (
          <Fade in timeout={500}>
            <Box>
              {/* TOP STATS - CENTRÉES */}
              <Grid 
                container 
                spacing={3} 
                sx={{ mb: 4 }} 
                justifyContent="center" // <-- Ajouté pour centrer les cartes
              >
                <Grid item xs={12} sm={6} md={3}><StatCard title="Parc Immobilier" value={stats.totalProprietes} icon={<Home />} color="#3b82f6" subtitle="Unités sous gestion" /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Prix Moyen" value={formatPrice(stats.prixMoyenProprietes)} icon={<AttachMoney />} color="#8b5cf6" subtitle="Valeur de votre catalogue" /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Visites" value={stats.totalVisites} icon={<Visibility />} color="#10b981" subtitle="Total des rendez-vous" /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Favoris" value={stats.totalFavoris} icon={<Favorite />} color="#ef4444" subtitle="Intérêt des clients" /></Grid>
              </Grid>

              {/* MARKET TRENDS SECTION */}
              
              <Paper sx={{ p: 4, borderRadius: 6, mb: 4, border: '1px solid #e2e8f0' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight={800} display="flex" alignItems="center" gap={1}>
                    <ShowChart color="primary" /> Tendance du Marché Local
                  </Typography>
                  <Chip 
                    label={stats.statsMarche.tendancePrix7j >= 0 ? `+${stats.statsMarche.tendancePrix7j}%` : `${stats.statsMarche.tendancePrix7j}%`}
                    color={stats.statsMarche.tendancePrix7j >= 0 ? "success" : "error"}
                    icon={stats.statsMarche.tendancePrix7j >= 0 ? <TrendingUp /> : <TrendingDown />}
                    sx={{ fontWeight: 900, borderRadius: 2 }}
                  />
                </Box>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>PRIX MOYEN MARCHÉ</Typography>
                    <Typography variant="h4" fontWeight={900}>{formatPrice(stats.statsMarche.prixMoyen)}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>UNITÉS DISPONIBLES</Typography>
                    <Typography variant="h4" fontWeight={900}>{stats.statsMarche.nbProprietes}</Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>INDICE DE CONFIANCE</Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      {[1,2,3,4,5].map(s => <StarIcon key={s} sx={{ color: s <= 4 ? '#f59e0b' : '#e2e8f0' }} />)}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* TABLE PERFORMANCE */}
              <TableContainer component={Paper} sx={{ borderRadius: 6, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Propriété</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>Visites</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>Favoris</TableCell>
                      {/* Colonne Statut supprimée ici */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.performances.map((prop: any) => (
                      <TableRow key={prop.id} sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700}>{prop.titre}</Typography>
                          <Typography variant="caption" color="text.disabled">ID: {prop.id.substring(0,8)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={prop.nbVisites} size="small" sx={{ fontWeight: 700, bgcolor: '#eff6ff', color: '#1e40af' }} />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={prop.nbFavoris} size="small" sx={{ fontWeight: 700, bgcolor: '#fff1f2', color: '#9f1239' }} />
                        </TableCell>
                        {/* Cellule avec le bouton Détails supprimée ici */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Fade>
        )}

        {currentTab === 0 && (
          <Fade in timeout={500}>
            <Stack spacing={2.5}>
              {notifications.map((notif: any) => (
                <Card key={notif.id} sx={{ borderRadius: 5, border: notif.lu ? '1px solid #e2e8f0' : '2px solid #3b82f6', position: 'relative' }}>
                  {!notif.lu && <Box sx={{ position: 'absolute', top: 15, right: 15, width: 10, height: 10, bgcolor: '#3b82f6', borderRadius: '50%' }} />}
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" fontWeight={900}>{notif.proprieteTitre}</Typography>
                        <Typography variant="body2" color="primary" fontWeight={700}>Client: {notif.userNom}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Stack direction="row" spacing={2} color="text.secondary">
                          <Box display="flex" alignItems="center" gap={0.5}><ShowChart fontSize="small" /> {notif.dateSouhaitee}</Box>
                          <Box display="flex" alignItems="center" gap={0.5}><Visibility fontSize="small" /> {notif.heure}</Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button variant="contained" color="success" onClick={() => handleUpdateStatut(notif.demandeid, 'ACCEPTEE')} sx={{ borderRadius: 3, fontWeight: 800 }}>Accepter</Button>
                          <IconButton onClick={() => handleUpdateStatut(notif.demandeid, 'REFUSEE')} sx={{ color: '#ef4444' }}><Cancel /></IconButton>
                        </Stack>
                      </Grid>
                    </Grid>
                    {notif.message && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#f1f5f9', borderRadius: 3, borderLeft: '4px solid #cbd5e1' }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"{notif.message}"</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default AnalyticsAgent;