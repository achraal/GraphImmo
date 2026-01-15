// // src/components/NotificationsUser.tsx
// import React from 'react';
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
//   IconButton,
//   Badge
// } from '@mui/material';
// import {
//   Notifications,
//   CheckCircle,
//   Cancel,
//   HourglassEmpty,
//   Home,
//   DoneAll,
//   MarkEmailRead
// } from '@mui/icons-material';

// // GraphQL Queries & Mutations
// const GET_NOTIFICATIONS_USER = gql`
//   query NotificationsUser($token: String!) {
//     notificationsUser(token: $token) {
//       notifications {
//         id
//         type
//         date
//         lu
//         message
//         proprieteId
//         proprieteTitre
//         agentNom
//         demandeid
//         nouveauStatut
//       }
//       nbNonLues
//     }
//   }
// `;

// const MARQUER_NOTIFICATION_LUE = gql`
//   mutation MarquerNotificationLue($notificationId: String!, $token: String!) {
//     marquerNotificationLue(notificationId: $notificationId, token: $token)
//   }
// `;

// const MARQUER_TOUTES_LUES = gql`
//   mutation MarquerToutesNotificationsLues($token: String!) {
//     marquerToutesNotificationsLues(token: $token)
//   }
// `;

// // Types
// interface NotificationUser {
//   id: string;
//   type: string;
//   date: string;
//   lu: boolean;
//   message: string;
//   proprieteId: string;
//   proprieteTitre: string;
//   agentNom: string;
//   demandeid: string;
//   nouveauStatut: string;
// }

// const NotificationsUser: React.FC = () => {
//   const token = localStorage.getItem('token') || '';

//   // Query notifications
//   const { data, loading, error, refetch } = useQuery<{
//     notificationsUser: {
//       notifications: NotificationUser[];
//       nbNonLues: number;
//     }
//   }>(GET_NOTIFICATIONS_USER, {
//     variables: { token },
//     skip: !token,
//     pollInterval: 30000, // Rafraîchir toutes les 30 secondes
//   });

//   // Mutations
//   const [marquerLue] = useMutation(MARQUER_NOTIFICATION_LUE);
//   const [marquerToutesLues] = useMutation(MARQUER_TOUTES_LUES);

//   const handleMarquerLue = async (notificationId: string) => {
//     try {
//       await marquerLue({
//         variables: { notificationId, token }
//       });
//       refetch();
//     } catch (err: any) {
//       console.error(err);
//     }
//   };

//   const handleMarquerToutesLues = async () => {
//     try {
//       await marquerToutesLues({
//         variables: { token }
//       });
//       refetch();
//     } catch (err: any) {
//       console.error(err);
//       alert(`❌ Erreur : ${err.message}`);
//     }
//   };

//   const getStatutChip = (statut: string) => {
//     switch (statut) {
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
//           Vous devez être connecté pour voir vos notifications.
//         </Alert>
//       </Container>
//     );
//   }

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
//         <Alert severity="error">Erreur : {error.message}</Alert>
//       </Container>
//     );
//   }

//   const notifications = data?.notificationsUser?.notifications || [];
//   const nbNonLues = data?.notificationsUser?.nbNonLues || 0;

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
//         <Box display="flex" alignItems="center" gap={2}>
//           <Badge badgeContent={nbNonLues} color="error">
//             <Notifications sx={{ fontSize: 40, color: '#8b5cf6' }} />
//           </Badge>
//           <Box>
//             <Typography variant="h4" fontWeight="bold">
//               Mes Notifications
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {nbNonLues > 0 ? `${nbNonLues} nouvelle(s) notification(s)` : 'Tout est à jour'}
//             </Typography>
//           </Box>
//         </Box>

//         <Stack direction="row" spacing={2}>
//           <Button
//             variant="outlined"
//             size="small"
//             onClick={() => refetch()}
//           >
//             🔄 Actualiser
//           </Button>
//           {nbNonLues > 0 && (
//             <Button
//               variant="contained"
//               size="small"
//               startIcon={<DoneAll />}
//               onClick={handleMarquerToutesLues}
//               sx={{ background: '#8b5cf6' }}
//             >
//               Tout marquer lu
//             </Button>
//           )}
//         </Stack>
//       </Box>

//       <Divider sx={{ mb: 3 }} />

//       {notifications.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: 'center' }}>
//           <Notifications sx={{ fontSize: 60, color: '#d1d5db', mb: 2 }} />
//           <Typography variant="h6" color="text.secondary">
//             Aucune notification pour le moment
//           </Typography>
//         </Paper>
//       ) : (
//         <Stack spacing={2}>
//           {notifications.map((notif) => (
//             <Card
//               key={notif.id}
//               sx={{
//                 backgroundColor: notif.lu ? '#ffffff' : '#fef3c7',
//                 border: notif.lu ? '1px solid #e0e0e0' : '2px solid #fbbf24',
//                 boxShadow: notif.lu ? 1 : 3,
//                 position: 'relative'
//               }}
//             >
//               <CardContent>
//                 {/* Badge non lu */}
//                 {!notif.lu && (
//                   <Chip
//                     label="NOUVEAU"
//                     size="small"
//                     color="warning"
//                     sx={{ position: 'absolute', top: 16, right: 16 }}
//                   />
//                 )}

//                 <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
//                   <Box flex={1}>
//                     {/* Propriété */}
//                     <Box display="flex" alignItems="center" mb={1}>
//                       <Home sx={{ color: '#8b5cf6', mr: 1, fontSize: 20 }} />
//                       <Typography variant="subtitle1" fontWeight="bold">
//                         {notif.proprieteTitre}
//                       </Typography>
//                     </Box>

//                     {/* Message principal */}
//                     <Typography variant="body1" color="text.primary" mb={1}>
//                       {notif.message}
//                     </Typography>

//                     {/* Statut */}
//                     <Box display="flex" alignItems="center" gap={2} mb={1}>
//                       <Typography variant="body2" color="text.secondary">
//                         Nouveau statut :
//                       </Typography>
//                       {getStatutChip(notif.nouveauStatut)}
//                     </Box>

//                     {/* Agent */}
//                     <Typography variant="caption" color="text.secondary" display="block">
//                       👤 Agent : {notif.agentNom}
//                     </Typography>

//                     {/* Date */}
//                     <Typography variant="caption" color="text.secondary" display="block">
//                       📅 {formatDate(notif.date)}
//                     </Typography>

//                     {/* ID demande */}
//                     <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
//                       Demande : {notif.demandeid}
//                     </Typography>
//                   </Box>

//                   {/* Bouton marquer comme lu */}
//                   {!notif.lu && (
//                     <IconButton
//                       color="primary"
//                       onClick={() => handleMarquerLue(notif.id)}
//                       sx={{ ml: 2 }}
//                     >
//                       <MarkEmailRead />
//                     </IconButton>
//                   )}
//                 </Box>
//               </CardContent>
//             </Card>
//           ))}
//         </Stack>
//       )}
//     </Container>
//   );
// };

// export default NotificationsUser;
import React from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Button,
  IconButton,
  Badge,
  Tooltip,
  Grid,
  Avatar
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as WaitIcon,
  Home as HomeIcon,
  DoneAll as DoneAllIcon,
  MarkEmailRead as ReadIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Layers as LayersIcon
} from '@mui/icons-material';

const GET_NOTIFICATIONS_USER = gql`
  query NotificationsUser($token: String!) {
    notificationsUser(token: $token) {
      notifications {
        id
        type
        date
        lu
        message
        proprieteId
        proprieteTitre
        agentNom
        demandeid
        nouveauStatut
      }
      nbNonLues
    }
  }
`;

const MARQUER_NOTIFICATION_LUE = gql`
  mutation MarquerNotificationLue($notificationId: String!, $token: String!) {
    marquerNotificationLue(notificationId: $notificationId, token: $token)
  }
`;

const MARQUER_TOUTES_LUES = gql`
  mutation MarquerToutesNotificationsLues($token: String!) {
    marquerToutesNotificationsLues(token: $token)
  }
`;

const NotificationsUser: React.FC = () => {
  const token = localStorage.getItem('token') || '';

  const { data, loading, error, refetch } = useQuery(GET_NOTIFICATIONS_USER, {
    variables: { token },
    skip: !token,
    pollInterval: 30000,
  });

  const [marquerLue] = useMutation(MARQUER_NOTIFICATION_LUE);
  const [marquerToutesLues] = useMutation(MARQUER_TOUTES_LUES);

  const handleMarquerLue = async (notificationId: string) => {
    try {
      await marquerLue({ variables: { notificationId, token } });
      refetch();
    } catch (err) { console.error(err); }
  };

  const handleMarquerToutesLues = async () => {
    try {
      await marquerToutesLues({ variables: { token } });
      refetch();
    } catch (err: any) { alert(`❌ Erreur : ${err.message}`); }
  };

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'acceptee':
        return { color: 'success', icon: <CheckCircleIcon />, label: 'Acceptée', bg: '#ecfdf5' };
      case 'refusee':
        return { color: 'error', icon: <CancelIcon />, label: 'Refusée', bg: '#fef2f2' };
      default:
        return { color: 'warning', icon: <WaitIcon />, label: 'En attente', bg: '#fffbeb' };
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress size={50} thickness={4} />
    </Box>
  );

  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error.message}</Alert></Container>;

  const notifications = data?.notificationsUser?.notifications || [];
  const nbNonLues = data?.notificationsUser?.nbNonLues || 0;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* HEADER SECTION */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Badge badgeContent={nbNonLues} color="error" overlap="circular">
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <NotificationsIcon sx={{ fontSize: 32 }} />
              </Avatar>
            </Badge>
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.02em' }}>
              Notifications
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            {nbNonLues > 0 ? `Vous avez ${nbNonLues} messages non lus.` : 'Vous êtes à jour dans vos notifications.'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Tooltip title="Actualiser">
            <IconButton onClick={() => refetch()} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {nbNonLues > 0 && (
            <Button
              variant="contained"
              startIcon={<DoneAllIcon />}
              onClick={handleMarquerToutesLues}
              sx={{ borderRadius: 2.5, fontWeight: 700, textTransform: 'none', px: 3 }}
            >
              Tout marquer lu
            </Button>
          )}
        </Stack>
      </Box>

      {/* LIST SECTION */}
      {notifications.length === 0 ? (
        <Paper elevation={0} sx={{ p: 10, textAlign: 'center', borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: '#fcfcfd' }}>
          <NotificationsIcon sx={{ fontSize: 80, color: 'divider', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} color="text.secondary">
            Aucune notification
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Nous vous préviendrons dès qu'il y aura du nouveau sur vos demandes.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2.5}>
          {notifications.map((notif: any) => {
            const style = getStatutStyle(notif.nouveauStatut);
            return (
              <Card
                key={notif.id}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  transition: '0.2s',
                  border: '1px solid',
                  borderColor: notif.lu ? 'divider' : 'primary.light',
                  bgcolor: notif.lu ? 'white' : 'rgba(59, 130, 246, 0.02)',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.06)', borderColor: 'primary.main' }
                }}
              >
                {!notif.lu && (
                  <Box sx={{
                    position: 'absolute', left: -5, top: '50%', transform: 'translateY(-50%)',
                    width: 10, height: 10, bgcolor: 'primary.main', borderRadius: '50%', boxShadow: '0 0 10px #3b82f6'
                  }} />
                )}

                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    {/* Icone / Type */}
                    <Grid item xs={12} sm={1.5} sx={{ display: 'flex', justifyContent: 'center' }}>
                       <Avatar sx={{ bgcolor: style.bg, color: `${style.color}.main`, width: 50, height: 50 }}>
                          {style.icon}
                       </Avatar>
                    </Grid>

                    {/* Contenu principal */}
                    <Grid item xs={12} sm={8.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <HomeIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                          {notif.proprieteTitre}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">•</Typography>
                        <Typography variant="caption" color="text.disabled" fontWeight={600}>
                          {new Date(notif.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>

                      <Typography variant="body1" fontWeight={500} sx={{ mb: 1, color: notif.lu ? 'text.secondary' : 'text.primary' }}>
                        {notif.message}
                      </Typography>

                      <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                        <Chip 
                          label={style.label} 
                          size="small" 
                          color={style.color as any} 
                          sx={{ fontWeight: 800, borderRadius: 1.5 }} 
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PersonIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.secondary">Agent: <b>{notif.agentNom}</b></Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LayersIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.secondary">ID: {notif.demandeid.slice(0,8)}</Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Action */}
                    <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {!notif.lu && (
                        <Tooltip title="Marquer comme lu">
                          <IconButton 
                            onClick={() => handleMarquerLue(notif.id)}
                            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                          >
                            <ReadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Container>
  );
};

export default NotificationsUser;