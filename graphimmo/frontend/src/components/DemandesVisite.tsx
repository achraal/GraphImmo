// src/components/DemandesVisite.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Send,
  History,
  AccessTime,
  Home,
  CheckCircle,
  Cancel,
  HourglassEmpty
} from '@mui/icons-material';

// GraphQL Queries & Mutations
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

// Types
interface DemandeVisite {
  id: string;
  dateSouhaitee: string;
  proprieteId: string;
  heure: string;
  statut: 'en_attente' | 'acceptee' | 'refusee';
  dateCreation: string;
  message?: string;
  proprieteTitre: string;
}

const DemandesVisite: React.FC = () => {
  const token = localStorage.getItem('token') || '';
  
  // États du formulaire
  const [proprieteId, setProprieteId] = useState('');
  const [dateSouhaitee, setDateSouhaitee] = useState('');
  const [heure, setHeure] = useState('');
  const [message, setMessage] = useState('');

  // Query historique
  const { data, loading, error, refetch } = useQuery<{
    historiqueDemandes: {
      demandes: DemandeVisite[];
      nbDemandes: number;
    }
  }>(HISTORIQUE_DEMANDES, {
    variables: { token },
    skip: !token,
    //pollInterval: 10000, // Rafraîchir toutes les 30 secondes
    fetchPolicy: 'no-cache'
  });

  // Mutation créer demande
  const [creerDemande, { loading: creating }] = useMutation(CREER_DEMANDE_VISITE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proprieteId || !dateSouhaitee || !heure) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await creerDemande({
        variables: {
          input: {
            proprieteId,
            dateSouhaitee,
            heure,
            message: message || null,
          },
          token,
        },
      });

      alert('Demande de visite envoyée avec succès !');
      
      // Réinitialiser le formulaire
      setProprieteId('');
      setDateSouhaitee('');
      setHeure('');
      setMessage('');
      
      // Rafraîchir l'historique
      refetch();
    } catch (err: any) {
      console.error(err);
      alert(`❌ Erreur : ${err.message}`);
    }
  };
  

  const getStatutChip = (statut: string) => {
    switch (statut) {
      case 'ACCEPTEE':
        return <Chip icon={<CheckCircle />} label="Acceptée" color="success" size="small" />;
      case 'REFUSEE':
        return <Chip icon={<Cancel />} label="Refusée" color="error" size="small" />;
      case 'en_attente':
      default:
        return <Chip icon={<HourglassEmpty />} label="En attente" color="warning" size="small" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
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
          Vous devez être connecté pour accéder aux demandes de visite.
        </Alert>
      </Container>
    );
  }

  const demandes = data?.historiqueDemandes?.demandes || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📅 Demandes de Visite
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Planifiez vos visites de propriétés
      </Typography>

      {/* SECTION 1: FORMULAIRE */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📝 Nouvelle Demande de Visite
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="ID de la Propriété"
                placeholder="Ex: PROP001"
                value={proprieteId}
                onChange={(e) => setProprieteId(e.target.value)}
                helperText="Vous pouvez trouver l'ID sur la page de détail de la propriété"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                required
                type="date"
                label="Date souhaitée"
                value={dateSouhaitee}
                onChange={(e) => setDateSouhaitee(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0], // Date min = aujourd'hui
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                required
                type="time"
                label="Heure"
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Message (optionnel)"
                placeholder="Ajoutez des informations complémentaires..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={creating ? <CircularProgress size={20} color="inherit" /> : <Send />}
                disabled={creating}
                sx={{
                  background: 'linear-gradient(45deg, #8b5cf6 30%, #6366f1 90%)',
                  px: 4,
                }}
              >
                {creating ? 'Envoi en cours...' : 'Envoyer la demande'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* SECTION 2: HISTORIQUE */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            <History sx={{ mr: 1, verticalAlign: 'middle' }} />
            Historique de mes Demandes ({demandes.length})
          </Typography>
          
<Button
  variant="outlined"
  size="small"
  onClick={async () => {
    console.log('🔄 Avant refetch');
    const result = await refetch();
    console.log('Après refetch:', result.data.historiqueDemandes.demandes);
  }}
  disabled={loading}
>
  {loading ? '⏳' : '🔄'} Actualiser
</Button>

        </Box>
        <Divider sx={{ my: 2 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">Erreur : {error.message}</Alert>
        ) : demandes.length === 0 ? (
          <Alert severity="info">
            Vous n'avez pas encore de demandes de visite. Créez-en une ci-dessus !
          </Alert>
        ) : (
          <Stack spacing={2}>
            {demandes.map((demande) => (
              <Card
                key={demande.id}
                sx={{
                  border: '1px solid #e0e0e0',
                  boxShadow: 1,
                  '&:hover': {
                    boxShadow: 3,
                    borderColor: '#8b5cf6',
                  },
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Colonne 1: Propriété */}
                    <Grid item xs={12} md={4}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Home sx={{ color: '#8b5cf6', mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="bold">
                          {demande.proprieteTitre}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        ID: {demande.proprieteId}
                      </Typography>
                    </Grid>

                    {/* Colonne 2: Date et heure */}
                    <Grid item xs={12} md={3}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AccessTime sx={{ fontSize: 18, mr: 1, color: '#6b7280' }} />
                        <Typography variant="body2">
                          {formatDate(demande.dateSouhaitee)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        🕐 {demande.heure}
                      </Typography>
                    </Grid>

                    {/* Colonne 3: Statut */}
                    <Grid item xs={12} md={2}>
                      {getStatutChip(demande.statut)}
                    </Grid>

                    {/* Colonne 4: Date création */}
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Créée le
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(demande.dateCreation)}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Message */}
                  {demande.message && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        borderLeft: '3px solid #8b5cf6',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        💬 {demande.message}
                      </Typography>
                    </Box>
                  )}

                  {/* ID demande */}
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Demande: {demande.id}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default DemandesVisite;
