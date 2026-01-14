// src/components/NotificationsUser.tsx
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
  Badge
} from '@mui/material';
import {
  Notifications,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Home,
  DoneAll,
  MarkEmailRead
} from '@mui/icons-material';

// GraphQL Queries & Mutations
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

// Types
interface NotificationUser {
  id: string;
  type: string;
  date: string;
  lu: boolean;
  message: string;
  proprieteId: string;
  proprieteTitre: string;
  agentNom: string;
  demandeid: string;
  nouveauStatut: string;
}

const NotificationsUser: React.FC = () => {
  const token = localStorage.getItem('token') || '';

  // Query notifications
  const { data, loading, error, refetch } = useQuery<{
    notificationsUser: {
      notifications: NotificationUser[];
      nbNonLues: number;
    }
  }>(GET_NOTIFICATIONS_USER, {
    variables: { token },
    skip: !token,
    pollInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  // Mutations
  const [marquerLue] = useMutation(MARQUER_NOTIFICATION_LUE);
  const [marquerToutesLues] = useMutation(MARQUER_TOUTES_LUES);

  const handleMarquerLue = async (notificationId: string) => {
    try {
      await marquerLue({
        variables: { notificationId, token }
      });
      refetch();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleMarquerToutesLues = async () => {
    try {
      await marquerToutesLues({
        variables: { token }
      });
      refetch();
    } catch (err: any) {
      console.error(err);
      alert(`❌ Erreur : ${err.message}`);
    }
  };

  const getStatutChip = (statut: string) => {
    switch (statut) {
      case 'acceptee':
        return <Chip icon={<CheckCircle />} label="Acceptée" color="success" size="small" />;
      case 'refusee':
        return <Chip icon={<Cancel />} label="Refusée" color="error" size="small" />;
      case 'en_attente':
      default:
        return <Chip icon={<HourglassEmpty />} label="En attente" color="warning" size="small" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!token) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Vous devez être connecté pour voir vos notifications.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Erreur : {error.message}</Alert>
      </Container>
    );
  }

  const notifications = data?.notificationsUser?.notifications || [];
  const nbNonLues = data?.notificationsUser?.nbNonLues || 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Badge badgeContent={nbNonLues} color="error">
            <Notifications sx={{ fontSize: 40, color: '#8b5cf6' }} />
          </Badge>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Mes Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {nbNonLues > 0 ? `${nbNonLues} nouvelle(s) notification(s)` : 'Tout est à jour'}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => refetch()}
          >
            🔄 Actualiser
          </Button>
          {nbNonLues > 0 && (
            <Button
              variant="contained"
              size="small"
              startIcon={<DoneAll />}
              onClick={handleMarquerToutesLues}
              sx={{ background: '#8b5cf6' }}
            >
              Tout marquer lu
            </Button>
          )}
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {notifications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Notifications sx={{ fontSize: 60, color: '#d1d5db', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Aucune notification pour le moment
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              sx={{
                backgroundColor: notif.lu ? '#ffffff' : '#fef3c7',
                border: notif.lu ? '1px solid #e0e0e0' : '2px solid #fbbf24',
                boxShadow: notif.lu ? 1 : 3,
                position: 'relative'
              }}
            >
              <CardContent>
                {/* Badge non lu */}
                {!notif.lu && (
                  <Chip
                    label="NOUVEAU"
                    size="small"
                    color="warning"
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                  />
                )}

                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box flex={1}>
                    {/* Propriété */}
                    <Box display="flex" alignItems="center" mb={1}>
                      <Home sx={{ color: '#8b5cf6', mr: 1, fontSize: 20 }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {notif.proprieteTitre}
                      </Typography>
                    </Box>

                    {/* Message principal */}
                    <Typography variant="body1" color="text.primary" mb={1}>
                      {notif.message}
                    </Typography>

                    {/* Statut */}
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Nouveau statut :
                      </Typography>
                      {getStatutChip(notif.nouveauStatut)}
                    </Box>

                    {/* Agent */}
                    <Typography variant="caption" color="text.secondary" display="block">
                      👤 Agent : {notif.agentNom}
                    </Typography>

                    {/* Date */}
                    <Typography variant="caption" color="text.secondary" display="block">
                      📅 {formatDate(notif.date)}
                    </Typography>

                    {/* ID demande */}
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Demande : {notif.demandeid}
                    </Typography>
                  </Box>

                  {/* Bouton marquer comme lu */}
                  {!notif.lu && (
                    <IconButton
                      color="primary"
                      onClick={() => handleMarquerLue(notif.id)}
                      sx={{ ml: 2 }}
                    >
                      <MarkEmailRead />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default NotificationsUser;
