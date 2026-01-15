// // src/components/HistoriqueDemandesAgent.tsx
// import React, { useState } from 'react';
// import { useQuery, useMutation } from '@apollo/client/react';
// import { gql } from '@apollo/client';
// import {
//   Box,
//   Container,
//   Paper,
//   Typography,
//   Card,
//   CardContent,
//   Chip,
//   Stack,
//   Divider,
//   Alert,
//   CircularProgress,
//   Button,
//   Grid,
//   Tabs,
//   Tab,
//   IconButton,
//   Tooltip
// } from '@mui/material';
// import {
//   History,
//   CheckCircle,
//   Cancel,
//   HourglassEmpty,
//   Home,
//   Person,
//   AccessTime,
//   Refresh,
//   Check,
//   Close
// } from '@mui/icons-material';

// // GraphQL Queries & Mutations
// const HISTORIQUE_DEMANDES_AGENT = gql`
//   query HistoriqueDemandesAgent($token: String!) {
//     historiqueDemandesAgent(token: $token) {
//       demandes {
//         id
//         dateSouhaitee
//         proprieteId
//         heure
//         statut
//         dateCreation
//         message
//         proprieteTitre
//       }
//     }
//   }
// `;

// const UPDATE_STATUT_DEMANDE = gql`
//   mutation UpdateStatutDemande($demandeid: String!, $statut: StatutVisite!, $token: String!) {
//     updateStatutDemande(demandeid: $demandeid, statut: $statut, token: $token)
//   }
// `;

// // Types
// interface DemandeVisite {
//   id: string;
//   dateSouhaitee: string;
//   proprieteId: string;
//   heure: string;
//   statut: string;
//   dateCreation: string;
//   message?: string;
//   proprieteTitre: string;
// }

// const HistoriqueDemandesAgent: React.FC = () => {
//   const token = localStorage.getItem('token') || '';
//   const [filterTab, setFilterTab] = useState<'all' | 'en_attente' | 'acceptee' | 'refusee'>('all');

//   // Query historique
//   const { data, loading, error, refetch } = useQuery<{
//     historiqueDemandesAgent: {
//       demandes: DemandeVisite[];
//     }
//   }>(HISTORIQUE_DEMANDES_AGENT, {
//     variables: { token },
//     skip: !token,
//     fetchPolicy: 'network-only',
//     pollInterval: 30000,
//   });

//   // Mutation update statut
//   const [updateStatut] = useMutation(UPDATE_STATUT_DEMANDE);

//   const handleUpdateStatut = async (demandeid: string, statut: 'ACCEPTEE' | 'REFUSEE') => {
//     try {
//       await updateStatut({
//         variables: { demandeid, statut, token }
//       });
//       alert(`Demande ${statut === 'ACCEPTEE' ? 'acceptée' : 'refusée'} !`);
//       refetch();
//     } catch (err: any) {
//       console.error(err);
//       alert(`❌ Erreur : ${err.message}`);
//     }
//   };

//   const getStatutChip = (statut: string) => {
//     const statutLower = statut.toLowerCase();
    
//     switch (statutLower) {
//       case 'acceptee':
//         return <Chip icon={<CheckCircle />} label="Acceptée" color="success" size="small" />;
//       case 'refusee':
//         return <Chip icon={<Cancel />} label="Refusée" color="error" size="small" />;
//       case 'en_attente':
//       default:
//         return <Chip icon={<HourglassEmpty />} label="En attente" color="warning" size="small" />;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: 'long',
//       year: 'numeric',
//     });
//   };

//   const formatDateTime = (dateString: string) => {
//     return new Date(dateString).toLocaleString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   if (!token) {
//     return (
//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         <Alert severity="warning">
//           Vous devez être connecté en tant qu'agent.
//         </Alert>
//       </Container>
//     );
//   }

//   if (loading && !data) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//         <CircularProgress size={60} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         <Alert severity="error">Erreur : {error.message}</Alert>
//       </Container>
//     );
//   }

//   const allDemandes = data?.historiqueDemandesAgent?.demandes || [];
  
//   // Filtrer selon l'onglet
//   const filteredDemandes = filterTab === 'all' 
//     ? allDemandes 
//     : allDemandes.filter(d => d.statut.toLowerCase() === filterTab);

//   // Statistiques
//   const nbEnAttente = allDemandes.filter(d => d.statut.toLowerCase() === 'en_attente').length;
//   const nbAcceptees = allDemandes.filter(d => d.statut.toLowerCase() === 'acceptee').length;
//   const nbRefusees = allDemandes.filter(d => d.statut.toLowerCase() === 'refusee').length;

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       {/* En-tête */}
//       <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
//         <Box>
//           <Typography variant="h4" fontWeight="bold">
//             📋 Historique des Demandes de Visite
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Gérez toutes les demandes de visite de vos propriétés
//           </Typography>
//         </Box>
//         <Button
//           variant="outlined"
//           startIcon={<Refresh />}
//           onClick={() => refetch()}
//           disabled={loading}
//         >
//           Actualiser
//         </Button>
//       </Box>

//       {/* Statistiques */}
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={3}>
//           <Paper sx={{ p: 2, textAlign: 'center', background: '#fef3c7' }}>
//             <Typography variant="h4" fontWeight="bold" color="#92400e">
//               {nbEnAttente}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               En attente
//             </Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <Paper sx={{ p: 2, textAlign: 'center', background: '#d1fae5' }}>
//             <Typography variant="h4" fontWeight="bold" color="#065f46">
//               {nbAcceptees}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Acceptées
//             </Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <Paper sx={{ p: 2, textAlign: 'center', background: '#fee2e2' }}>
//             <Typography variant="h4" fontWeight="bold" color="#991b1b">
//               {nbRefusees}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Refusées
//             </Typography>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <Paper sx={{ p: 2, textAlign: 'center', background: '#e0e7ff' }}>
//             <Typography variant="h4" fontWeight="bold" color="#3730a3">
//               {allDemandes.length}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Total
//             </Typography>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Onglets de filtrage */}
//       <Paper sx={{ mb: 3 }}>
//         <Tabs
//           value={filterTab}
//           onChange={(_, newValue) => setFilterTab(newValue)}
//           variant="fullWidth"
//         >
//           <Tab label={`Toutes (${allDemandes.length})`} value="all" />
//           <Tab label={`En attente (${nbEnAttente})`} value="en_attente" />
//           <Tab label={`Acceptées (${nbAcceptees})`} value="acceptee" />
//           <Tab label={`Refusées (${nbRefusees})`} value="refusee" />
//         </Tabs>
//       </Paper>

//       {/* Liste des demandes */}
//       {filteredDemandes.length === 0 ? (
//         <Alert severity="info">
//           Aucune demande dans cette catégorie.
//         </Alert>
//       ) : (
//         <Stack spacing={2}>
//           {filteredDemandes.map((demande) => (
//             <Card
//               key={demande.id}
//               sx={{
//                 border: '1px solid #e0e0e0',
//                 boxShadow: demande.statut.toLowerCase() === 'en_attente' ? 3 : 1,
//                 borderLeft: demande.statut.toLowerCase() === 'en_attente' 
//                   ? '4px solid #fbbf24' 
//                   : '1px solid #e0e0e0',
//                 '&:hover': { boxShadow: 4 },
//               }}
//             >
//               <CardContent>
//                 <Grid container spacing={2} alignItems="center">
//                   {/* Colonne 1: Propriété */}
//                   <Grid item xs={12} md={4}>
//                     <Box display="flex" alignItems="center" mb={1}>
//                       <Home sx={{ color: '#8b5cf6', mr: 1 }} />
//                       <Typography variant="subtitle1" fontWeight="bold">
//                         {demande.proprieteTitre}
//                       </Typography>
//                     </Box>
//                     <Typography variant="caption" color="text.secondary">
//                       ID: {demande.proprieteId}
//                     </Typography>
//                   </Grid>

//                   {/* Colonne 2: Date et heure */}
//                   <Grid item xs={12} md={3}>
//                     <Box display="flex" alignItems="center" mb={1}>
//                       <AccessTime sx={{ fontSize: 18, mr: 1, color: '#6b7280' }} />
//                       <Typography variant="body2">
//                         {formatDate(demande.dateSouhaitee)}
//                       </Typography>
//                     </Box>
//                     <Typography variant="body2" color="text.secondary">
//                       🕐 {demande.heure}
//                     </Typography>
//                   </Grid>

//                   {/* Colonne 3: Statut */}
//                   <Grid item xs={12} md={2}>
//                     {getStatutChip(demande.statut)}
//                   </Grid>

//                   {/* Colonne 4: Actions */}
//                   <Grid item xs={12} md={3}>
//                     {demande.statut.toLowerCase() === 'en_attente' ? (
//                       <Stack direction="row" spacing={1}>
//                         <Tooltip title="Accepter">
//                           <IconButton
//                             color="success"
//                             onClick={() => handleUpdateStatut(demande.id, 'ACCEPTEE')}
//                             size="small"
//                           >
//                             <Check />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title="Refuser">
//                           <IconButton
//                             color="error"
//                             onClick={() => handleUpdateStatut(demande.id, 'REFUSEE')}
//                             size="small"
//                           >
//                             <Close />
//                           </IconButton>
//                         </Tooltip>
//                       </Stack>
//                     ) : (
//                       <Typography variant="caption" color="text.secondary">
//                         Traitée le {formatDateTime(demande.dateCreation)}
//                       </Typography>
//                     )}
//                   </Grid>
//                 </Grid>

//                 {/* Message */}
//                 {demande.message && (
//                   <Box
//                     sx={{
//                       mt: 2,
//                       p: 1.5,
//                       backgroundColor: '#f5f5f5',
//                       borderRadius: 1,
//                       borderLeft: '3px solid #8b5cf6',
//                     }}
//                   >
//                     <Typography variant="body2" color="text.secondary">
//                       💬 {demande.message}
//                     </Typography>
//                   </Box>
//                 )}

//                 {/* Footer */}
//                 <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
//                   <Typography variant="caption" color="text.secondary">
//                     Demande: {demande.id}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     Créée: {formatDateTime(demande.dateCreation)}
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           ))}
//         </Stack>
//       )}
//     </Container>
//   );
// };

// export default HistoriqueDemandesAgent;
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Box, Container, Paper, Typography, Card, CardContent, Chip, Stack,
  Divider, Alert, CircularProgress, Button, Grid, Tabs, Tab,
  IconButton, Tooltip, Avatar, useTheme, Fade
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CloseIcon,
  HourglassEmpty as PendingIcon,
  Home as HomeIcon,
  EventNote as DateIcon,
  Schedule as TimeIcon,
  Refresh as RefreshIcon,
  ChatBubbleOutline as MessageIcon,
  AssignmentTurnedIn as TaskIcon
} from '@mui/icons-material';

// --- GRAPHQL ---
const HISTORIQUE_DEMANDES_AGENT = gql`
  query HistoriqueDemandesAgent($token: String!) {
    historiqueDemandesAgent(token: $token) {
      demandes {
        id dateSouhaitee proprieteId heure statut dateCreation message proprieteTitre
      }
    }
  }
`;

const UPDATE_STATUT_DEMANDE = gql`
  mutation UpdateStatutDemande($demandeid: String!, $statut: StatutVisite!, $token: String!) {
    updateStatutDemande(demandeid: $demandeid, statut: $statut, token: $token)
  }
`;

interface DemandeVisite {
  id: string;
  dateSouhaitee: string;
  proprieteId: string;
  heure: string;
  statut: string;
  dateCreation: string;
  message?: string;
  proprieteTitre: string;
}

const HistoriqueDemandesAgent: React.FC = () => {
  const theme = useTheme();
  const token = localStorage.getItem('token') || '';
  const [filterTab, setFilterTab] = useState<'all' | 'en_attente' | 'acceptee' | 'refusee'>('all');

  const { data, loading, error, refetch } = useQuery(HISTORIQUE_DEMANDES_AGENT, {
    variables: { token },
    skip: !token,
    fetchPolicy: 'network-only',
    pollInterval: 30000,
  });

  const [updateStatut] = useMutation(UPDATE_STATUT_DEMANDE);

  const handleUpdateStatut = async (demandeid: string, statut: 'ACCEPTEE' | 'REFUSEE') => {
    try {
      await updateStatut({ variables: { demandeid, statut, token } });
      refetch();
    } catch (err: any) {
      console.error(err);
    }
  };

  const getStatutStyles = (statut: string) => {
    const s = statut.toLowerCase();
    if (s === 'acceptee') return { color: theme.palette.success.main, label: 'Confirmée', icon: <CheckIcon fontSize="small" />, bg: '#ecfdf5' };
    if (s === 'refusee') return { color: theme.palette.error.main, label: 'Annulée', icon: <CloseIcon fontSize="small" />, bg: '#fef2f2' };
    return { color: theme.palette.warning.main, label: 'À traiter', icon: <PendingIcon fontSize="small" />, bg: '#fffbeb' };
  };

  if (!token) return <Container sx={{ py: 10 }}><Alert severity="warning" variant="filled" sx={{ borderRadius: 4 }}>Session expirée. Veuillez vous reconnecter en tant qu'agent.</Alert></Container>;
  if (loading && !data) return <Box display="flex" justifyContent="center" py={20}><CircularProgress thickness={5} size={60} /></Box>;
  if (error) return <Container sx={{ py: 10 }}><Alert severity="error">Erreur de synchronisation : {error.message}</Alert></Container>;

  const allDemandes = data?.historiqueDemandesAgent?.demandes || [];
  const filteredDemandes = filterTab === 'all' ? allDemandes : allDemandes.filter((d: any) => d.statut.toLowerCase() === filterTab);

  const stats = {
    pending: allDemandes.filter((d: any) => d.statut.toLowerCase() === 'en_attente').length,
    done: allDemandes.filter((d: any) => d.statut.toLowerCase() === 'acceptee').length,
    canceled: allDemandes.filter((d: any) => d.statut.toLowerCase() === 'refusee').length
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* HEADER AREA */}
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h3" fontWeight={900} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
            Gestion des Visites
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Suivi en temps réel de vos opportunités de vente
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />} 
          onClick={() => refetch()}
          sx={{ borderRadius: 3, fontWeight: 700, px: 3, py: 1, boxShadow: 0 }}
        >
          Actualiser
        </Button>
      </Box>

      {/* STATS CARDS */}
      <Grid 
        container 
        spacing={3} 
        sx={{ mb: 6 }} 
        justifyContent="center" // <-- Cette ligne centre les éléments horizontalement
      >
        {[
          { label: 'En attente', value: stats.pending, color: '#f59e0b', icon: <PendingIcon /> },
          { label: 'Acceptées', value: stats.done, color: '#10b981', icon: <CheckIcon /> },
          { label: 'Refusées', value: stats.canceled, color: '#ef4444', icon: <CloseIcon /> },
          { label: 'Total', value: allDemandes.length, color: '#6366f1', icon: <TaskIcon /> }
        ].map((stat, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 5, 
                border: '1px solid #e2e8f0', 
                bgcolor: 'white',
                textAlign: 'center', // Optionnel : centre aussi le texte à l'intérieur des cartes
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center' // Centre l'icône et les chiffres verticalement
              }}
            >
              <Avatar sx={{ bgcolor: stat.color, mb: 2, width: 40, height: 40, boxShadow: `0 8px 16px -4px ${stat.color}60` }}>
                {stat.icon}
              </Avatar>
              <Typography variant="h4" fontWeight={900}>{stat.value}</Typography>
              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* TABS FILTER */}
      <Paper elevation={0} sx={{ mb: 4, borderRadius: 4, p: 0.5, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
        <Tabs 
          value={filterTab} 
          onChange={(_, v) => setFilterTab(v)} 
          variant="fullWidth"
          sx={{ '& .MuiTabs-indicator': { height: '100%', borderRadius: 3, zIndex: 0, opacity: 0.1, bgcolor: 'primary.main' }, '& .MuiTab-root': { zIndex: 1, fontWeight: 800, textTransform: 'none', fontSize: '1rem' } }}
        >
          <Tab label="Toutes" value="all" />
          <Tab label={`En attente (${stats.pending})`} value="en_attente" />
          <Tab label="Acceptées" value="acceptee" />
          <Tab label="Refusées" value="refusee" />
        </Tabs>
      </Paper>

      {/* LIST OF DEMANDS */}
      <Stack spacing={3}>
        {filteredDemandes.length === 0 ? (
          <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 6, border: '2px dashed #cbd5e1' }}>
            <Typography variant="h5" color="text.secondary">Aucune demande enregistrée</Typography>
          </Paper>
        ) : (
          filteredDemandes.map((demande: DemandeVisite) => {
            const style = getStatutStyles(demande.statut);
            const isPending = demande.statut.toLowerCase() === 'en_attente';
            
            return (
              <Fade in key={demande.id}>
                <Card sx={{ 
                  borderRadius: 6, 
                  border: '1px solid #e2e8f0',
                  boxShadow: isPending ? '0 10px 25px -5px rgba(0,0,0,0.05)' : 0,
                  '&:hover': { borderColor: theme.palette.primary.main }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      {/* Prop Details */}
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}><HomeIcon /></Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={800} noWrap>{demande.proprieteTitre}</Typography>
                            <Typography variant="caption" color="text.secondary">REF: {demande.proprieteId.split('-')[0]}</Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Date Details */}
                      <Grid item xs={12} md={3}>
                        <Stack direction="row" spacing={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DateIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={600}>
                              {new Date(demande.dateSouhaitee).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimeIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={600}>{demande.heure}</Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Status */}
                      <Grid item xs={6} md={2}>
                        <Chip 
                          icon={style.icon} 
                          label={style.label} 
                          sx={{ bgcolor: style.bg, color: style.color, fontWeight: 900, px: 1 }} 
                        />
                      </Grid>

                      {/* Actions */}
                      <Grid item xs={6} md={3} sx={{ textAlign: 'right' }}>
                        {isPending ? (
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button 
                              size="small" variant="contained" color="success"
                              onClick={() => handleUpdateStatut(demande.id, 'ACCEPTEE')}
                              sx={{ borderRadius: 2, fontWeight: 800, boxShadow: 0 }}
                            >
                              Accepter
                            </Button>
                            <Button 
                              size="small" variant="outlined" color="error"
                              onClick={() => handleUpdateStatut(demande.id, 'REFUSEE')}
                              sx={{ borderRadius: 2, fontWeight: 800 }}
                            >
                              Refuser
                            </Button>
                          </Stack>
                        ) : (
                          <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                            Traitée le {new Date(demande.dateCreation).toLocaleDateString()}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>

                    {/* Message Box */}
                    {demande.message && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: '#f1f5f9', borderRadius: 4, display: 'flex', gap: 1.5 }}>
                        <MessageIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          "{demande.message}"
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Fade>
            );
          })
        )}
      </Stack>
    </Container>
  );
};

export default HistoriqueDemandesAgent;