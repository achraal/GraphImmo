// // src/components/DemandesVisite.tsx
// import React, { useState } from 'react';
// import { useQuery, useMutation } from '@apollo/client/react';
// import { gql } from '@apollo/client';
// import {
//   Box,
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   Chip,
//   Stack,
//   Divider,
//   Alert,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem
// } from '@mui/material';
// import {
//   Send,
//   History,
//   AccessTime,
//   Home,
//   CheckCircle,
//   Cancel,
//   HourglassEmpty
// } from '@mui/icons-material';

// // GraphQL Queries & Mutations
// const CREER_DEMANDE_VISITE = gql`
//   mutation CreerDemandeVisite($input: DemandeVisiteInput!, $token: String!) {
//     creerDemandeVisite(input: $input, token: $token)
//   }
// `;

// const HISTORIQUE_DEMANDES = gql`
//   query HistoriqueDemandes($token: String!) {
//     historiqueDemandes(token: $token) {
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
//       nbDemandes
//     }
//   }
// `;

// // Types
// interface DemandeVisite {
//   id: string;
//   dateSouhaitee: string;
//   proprieteId: string;
//   heure: string;
//   statut: 'en_attente' | 'acceptee' | 'refusee';
//   dateCreation: string;
//   message?: string;
//   proprieteTitre: string;
// }

// const DemandesVisite: React.FC = () => {
//   const token = localStorage.getItem('token') || '';
  
//   // États du formulaire
//   const [proprieteId, setProprieteId] = useState('');
//   const [dateSouhaitee, setDateSouhaitee] = useState('');
//   const [heure, setHeure] = useState('');
//   const [message, setMessage] = useState('');

//   // Query historique
//   const { data, loading, error, refetch } = useQuery<{
//     historiqueDemandes: {
//       demandes: DemandeVisite[];
//       nbDemandes: number;
//     }
//   }>(HISTORIQUE_DEMANDES, {
//     variables: { token },
//     skip: !token,
//     //pollInterval: 10000, // Rafraîchir toutes les 30 secondes
//     fetchPolicy: 'no-cache'
//   });

//   // Mutation créer demande
//   const [creerDemande, { loading: creating }] = useMutation(CREER_DEMANDE_VISITE);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!proprieteId || !dateSouhaitee || !heure) {
//       alert('⚠️ Veuillez remplir tous les champs obligatoires');
//       return;
//     }

//     try {
//       await creerDemande({
//         variables: {
//           input: {
//             proprieteId,
//             dateSouhaitee,
//             heure,
//             message: message || null,
//           },
//           token,
//         },
//       });

//       alert('Demande de visite envoyée avec succès !');
      
//       // Réinitialiser le formulaire
//       setProprieteId('');
//       setDateSouhaitee('');
//       setHeure('');
//       setMessage('');
      
//       // Rafraîchir l'historique
//       refetch();
//     } catch (err: any) {
//       console.error(err);
//       alert(`❌ Erreur : ${err.message}`);
//     }
//   };
  

//   const getStatutChip = (statut: string) => {
//     switch (statut) {
//       case 'ACCEPTEE':
//         return <Chip icon={<CheckCircle />} label="Acceptée" color="success" size="small" />;
//       case 'REFUSEE':
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
//           Vous devez être connecté pour accéder aux demandes de visite.
//         </Alert>
//       </Container>
//     );
//   }

//   const demandes = data?.historiqueDemandes?.demandes || [];

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" fontWeight="bold" gutterBottom>
//         📅 Demandes de Visite
//       </Typography>
//       <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
//         Planifiez vos visites de propriétés
//       </Typography>

//       {/* SECTION 1: FORMULAIRE */}
//       <Paper sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h6" fontWeight="bold" gutterBottom>
//           📝 Nouvelle Demande de Visite
//         </Typography>
//         <Divider sx={{ my: 2 }} />

//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 required
//                 label="ID de la Propriété"
//                 placeholder="Ex: PROP001"
//                 value={proprieteId}
//                 onChange={(e) => setProprieteId(e.target.value)}
//                 helperText="Vous pouvez trouver l'ID sur la page de détail de la propriété"
//               />
//             </Grid>

//             <Grid item xs={12} md={3}>
//               <TextField
//                 fullWidth
//                 required
//                 type="date"
//                 label="Date souhaitée"
//                 value={dateSouhaitee}
//                 onChange={(e) => setDateSouhaitee(e.target.value)}
//                 InputLabelProps={{ shrink: true }}
//                 inputProps={{
//                   min: new Date().toISOString().split('T')[0], // Date min = aujourd'hui
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} md={3}>
//               <TextField
//                 fullWidth
//                 required
//                 type="time"
//                 label="Heure"
//                 value={heure}
//                 onChange={(e) => setHeure(e.target.value)}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={3}
//                 label="Message (optionnel)"
//                 placeholder="Ajoutez des informations complémentaires..."
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 size="large"
//                 startIcon={creating ? <CircularProgress size={20} color="inherit" /> : <Send />}
//                 disabled={creating}
//                 sx={{
//                   background: 'linear-gradient(45deg, #8b5cf6 30%, #6366f1 90%)',
//                   px: 4,
//                 }}
//               >
//                 {creating ? 'Envoi en cours...' : 'Envoyer la demande'}
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </Paper>

//       {/* SECTION 2: HISTORIQUE */}
//       <Paper sx={{ p: 3 }}>
//         <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
//           <Typography variant="h6" fontWeight="bold">
//             <History sx={{ mr: 1, verticalAlign: 'middle' }} />
//             Historique de mes Demandes ({demandes.length})
//           </Typography>
          
// <Button
//   variant="outlined"
//   size="small"
//   onClick={async () => {
//     console.log('🔄 Avant refetch');
//     const result = await refetch();
//     console.log('Après refetch:', result.data.historiqueDemandes.demandes);
//   }}
//   disabled={loading}
// >
//   {loading ? '⏳' : '🔄'} Actualiser
// </Button>

//         </Box>
//         <Divider sx={{ my: 2 }} />

//         {loading ? (
//           <Box display="flex" justifyContent="center" py={4}>
//             <CircularProgress />
//           </Box>
//         ) : error ? (
//           <Alert severity="error">Erreur : {error.message}</Alert>
//         ) : demandes.length === 0 ? (
//           <Alert severity="info">
//             Vous n'avez pas encore de demandes de visite. Créez-en une ci-dessus !
//           </Alert>
//         ) : (
//           <Stack spacing={2}>
//             {demandes.map((demande) => (
//               <Card
//                 key={demande.id}
//                 sx={{
//                   border: '1px solid #e0e0e0',
//                   boxShadow: 1,
//                   '&:hover': {
//                     boxShadow: 3,
//                     borderColor: '#8b5cf6',
//                   },
//                 }}
//               >
//                 <CardContent>
//                   <Grid container spacing={2} alignItems="center">
//                     {/* Colonne 1: Propriété */}
//                     <Grid item xs={12} md={4}>
//                       <Box display="flex" alignItems="center" mb={1}>
//                         <Home sx={{ color: '#8b5cf6', mr: 1 }} />
//                         <Typography variant="subtitle1" fontWeight="bold">
//                           {demande.proprieteTitre}
//                         </Typography>
//                       </Box>
//                       <Typography variant="caption" color="text.secondary">
//                         ID: {demande.proprieteId}
//                       </Typography>
//                     </Grid>

//                     {/* Colonne 2: Date et heure */}
//                     <Grid item xs={12} md={3}>
//                       <Box display="flex" alignItems="center" mb={1}>
//                         <AccessTime sx={{ fontSize: 18, mr: 1, color: '#6b7280' }} />
//                         <Typography variant="body2">
//                           {formatDate(demande.dateSouhaitee)}
//                         </Typography>
//                       </Box>
//                       <Typography variant="body2" color="text.secondary">
//                         🕐 {demande.heure}
//                       </Typography>
//                     </Grid>

//                     {/* Colonne 3: Statut */}
//                     <Grid item xs={12} md={2}>
//                       {getStatutChip(demande.statut)}
//                     </Grid>

//                     {/* Colonne 4: Date création */}
//                     <Grid item xs={12} md={3}>
//                       <Typography variant="caption" color="text.secondary" display="block">
//                         Créée le
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {formatDateTime(demande.dateCreation)}
//                       </Typography>
//                     </Grid>
//                   </Grid>

//                   {/* Message */}
//                   {demande.message && (
//                     <Box
//                       sx={{
//                         mt: 2,
//                         p: 1.5,
//                         backgroundColor: '#f5f5f5',
//                         borderRadius: 1,
//                         borderLeft: '3px solid #8b5cf6',
//                       }}
//                     >
//                       <Typography variant="body2" color="text.secondary">
//                         💬 {demande.message}
//                       </Typography>
//                     </Box>
//                   )}

//                   {/* ID demande */}
//                   <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
//                     Demande: {demande.id}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             ))}
//           </Stack>
//         )}
//       </Paper>
//     </Container>
//   );
// };

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Box, Container, Paper, Typography, TextField, Button, Grid, Card,
  CardContent, Chip, Stack, Divider, Alert, CircularProgress,
  IconButton, Tooltip, Avatar, InputAdornment
} from '@mui/material';
import {
  Send as SendIcon,
  History as HistoryIcon,
  AccessTime as AccessTimeIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as WaitIcon,
  Refresh as RefreshIcon,
  EventAvailable as EventIcon,
  ChatBubbleOutline as MessageIcon
} from '@mui/icons-material';

const CREER_DEMANDE_VISITE = gql`
  mutation CreerDemandeVisite($input: DemandeVisiteInput!, $token: String!) {
    creerDemandeVisite(input: $input, token: $token)
  }
`;

const HISTORIQUE_DEMANDES = gql`
  query HistoriqueDemandes($token: String!) {
    historiqueDemandes(token: $token) {
      demandes {
        id
        dateSouhaitee
        proprieteId
        heure
        statut
        dateCreation
        message
        proprieteTitre
      }
      nbDemandes
    }
  }
`;

const DemandesVisite: React.FC = () => {
  const token = localStorage.getItem('token') || '';
  const [proprieteId, setProprieteId] = useState('');
  const [dateSouhaitee, setDateSouhaitee] = useState('');
  const [heure, setHeure] = useState('');
  const [message, setMessage] = useState('');

  const { data, loading, error, refetch } = useQuery(HISTORIQUE_DEMANDES, {
    variables: { token },
    skip: !token,
    fetchPolicy: 'network-only'
  });

  const [creerDemande, { loading: creating }] = useMutation(CREER_DEMANDE_VISITE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await creerDemande({
        variables: {
          input: { proprieteId, dateSouhaitee, heure, message: message || null },
          token,
        },
      });
      alert('🚀 Demande envoyée avec succès !');
      setProprieteId(''); setDateSouhaitee(''); setHeure(''); setMessage('');
      refetch();
    } catch (err: any) {
      alert(`❌ Erreur : ${err.message}`);
    }
  };

  const getStatutStyle = (statut: string) => {
    switch (statut.toUpperCase()) {
      case 'ACCEPTEE': return { color: 'success', icon: <CheckCircleIcon />, label: 'Confirmée' };
      case 'REFUSEE': return { color: 'error', icon: <CancelIcon />, label: 'Refusée' };
      default: return { color: 'warning', icon: <WaitIcon />, label: 'En attente' };
    }
  };

  if (!token) return <Container sx={{ py: 10 }}><Alert severity="warning">Veuillez vous connecter.</Alert></Container>;

  const demandes = data?.historiqueDemandes?.demandes || [];

  return (
    // maxWidth="xl" combiné à une largeur à 100%
    <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, md: 4 } }}>
      
      {/* HEADER SECTION - Centré et large */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight={900} sx={{ letterSpacing: '-0.04em', mb: 2, color: '#1e293b' }}>
          Gestion des Visites
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
          Organisez vos rendez-vous immobiliers et suivez l'état de vos demandes en temps réel.
        </Typography>
      </Box>

      {/* GRID PRINCIPALE - Occupe tout l'espace */}
      <Grid container spacing={4} sx={{ width: '100%', margin: 0 }}>
        
        {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
        <Grid item xs={12} lg={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 5, 
              borderRadius: 6, 
              border: '1px solid', 
              borderColor: 'divider', 
              bgcolor: '#ffffff',
              position: { lg: 'sticky' }, 
              top: 40,
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}
          >
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <EventIcon sx={{ fontSize: 35, color: 'primary.main' }} /> Nouvelle Demande
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <TextField
                  fullWidth label="Référence Propriété" required placeholder="Ex: PROP-1234"
                  value={proprieteId} onChange={(e) => setProprieteId(e.target.value)}
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start"><HomeIcon color="action" /></InputAdornment>,
                    sx: { borderRadius: 3 }
                  }}
                />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth label="Date" type="date" required
                    value={dateSouhaitee} onChange={(e) => setDateSouhaitee(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                  <TextField
                    fullWidth label="Heure" type="time" required
                    value={heure} onChange={(e) => setHeure(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Box>

                <TextField
                  fullWidth multiline rows={4} label="Message pour l'agent"
                  placeholder="Précisez vos disponibilités ou posez une question..."
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />

                <Button
                  type="submit" variant="contained" size="large"
                  disabled={creating}
                  startIcon={creating ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                  sx={{ 
                    py: 2.5, borderRadius: 4, fontWeight: 900, fontSize: '1.1rem', 
                    textTransform: 'none', boxShadow: '0 10px 20px rgba(59,130,246,0.3)',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                  }}
                >
                  {creating ? 'Envoi de la demande...' : 'Confirmer la demande'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* --- COLONNE DROITE : HISTORIQUE --- */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
            <Typography variant="h4" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <HistoryIcon sx={{ fontSize: 35, color: 'text.secondary' }} /> Historique des demandes
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip label={`${demandes.length} demandes`} color="default" sx={{ fontWeight: 700, borderRadius: 2 }} />
                <Tooltip title="Rafraîchir">
                  <IconButton onClick={() => refetch()} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
            </Box>
          </Box>

          <Box sx={{ pr: 1 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress size={60} /></Box>
            ) : demandes.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 15, textAlign: 'center', borderStyle: 'dashed', borderRadius: 6, bgcolor: '#f8fafc' }}>
                <HistoryIcon sx={{ fontSize: 100, color: 'divider', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" fontWeight={600}>Vous n'avez pas encore envoyé de demandes.</Typography>
              </Paper>
            ) : (
              <Stack spacing={3}>
                {demandes.map((demande: any) => {
                  const style = getStatutStyle(demande.statut);
                  return (
                    <Card 
                      key={demande.id} 
                      elevation={0} 
                      sx={{ 
                        borderRadius: 5, 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        transition: 'all 0.3s ease', 
                        '&:hover': { 
                          borderColor: 'primary.main', 
                          transform: 'translateX(8px)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.04)' 
                        } 
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={3} alignItems="center">
                          {/* Info Bien */}
                          <Grid item xs={12} md={5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', borderRadius: 4, width: 60, height: 60 }}>
                                <HomeIcon fontSize="large" />
                              </Avatar>
                              <Box>
                                <Typography variant="h6" fontWeight={900} sx={{ mb: 0.5 }}>{demande.proprieteTitre}</Typography>
                                <Typography variant="body2" color="primary" fontWeight={700} sx={{ fontFamily: 'monospace', bgcolor: '#eff6ff', px: 1, borderRadius: 1, display: 'inline-block' }}>
                                  REF: {demande.proprieteId.toUpperCase()}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Date & Heure */}
                          <Grid item xs={12} sm={6} md={3}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Box sx={{ p: 1.5, bgcolor: '#f1f5f9', borderRadius: 3 }}>
                                <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                              </Box>
                              <Box>
                                <Typography variant="subtitle1" fontWeight={800}>
                                  {new Date(demande.dateSouhaitee).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">à {demande.heure}</Typography>
                              </Box>
                            </Stack>
                          </Grid>

                          {/* Statut & Date Envoi */}
                          <Grid item xs={12} sm={6} md={4} sx={{ textAlign: { md: 'right' } }}>
                             <Chip 
                              label={style.label} color={style.color as any} 
                              icon={style.icon} sx={{ fontWeight: 900, px: 2, py: 2.5, borderRadius: 3, mb: 1, fontSize: '0.9rem' }} 
                            />
                             <Typography variant="caption" color="text.disabled" display="block">
                               Demandé le {new Date(demande.dateCreation).toLocaleDateString()}
                             </Typography>
                          </Grid>
                        </Grid>

                        {demande.message && (
                          <Box sx={{ mt: 3, p: 3, bgcolor: '#f8fafc', borderRadius: 4, borderLeft: '5px solid', borderColor: 'primary.light' }}>
                            <Typography variant="body2" sx={{ display: 'flex', gap: 1.5, color: '#475569', lineHeight: 1.6, fontStyle: 'italic' }}>
                              <MessageIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                              "{demande.message}"
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DemandesVisite;