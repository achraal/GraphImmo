// src/components/HistoriqueDemandesAgent.tsx
import React, { useState } from 'react';
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
  Grid,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  History,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Home,
  Person,
  AccessTime,
  Refresh,
  Check,
  Close
} from '@mui/icons-material';

// GraphQL Queries & Mutations
const HISTORIQUE_DEMANDES_AGENT = gql`
  query HistoriqueDemandesAgent($token: String!) {
    historiqueDemandesAgent(token: $token) {
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
    }
  }
`;

const UPDATE_STATUT_DEMANDE = gql`
  mutation UpdateStatutDemande($demandeid: String!, $statut: StatutVisite!, $token: String!) {
    updateStatutDemande(demandeid: $demandeid, statut: $statut, token: $token)
  }
`;

// Types
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
  const token = localStorage.getItem('token') || '';
  const [filterTab, setFilterTab] = useState<'all' | 'en_attente' | 'acceptee' | 'refusee'>('all');

  // Query historique
  const { data, loading, error, refetch } = useQuery<{
    historiqueDemandesAgent: {
      demandes: DemandeVisite[];
    }
  }>(HISTORIQUE_DEMANDES_AGENT, {
    variables: { token },
    skip: !token,
    fetchPolicy: 'network-only',
    pollInterval: 30000,
  });

  // Mutation update statut
  const [updateStatut] = useMutation(UPDATE_STATUT_DEMANDE);

  const handleUpdateStatut = async (demandeid: string, statut: 'ACCEPTEE' | 'REFUSEE') => {
    try {
      await updateStatut({
        variables: { demandeid, statut, token }
      });
      alert(`Demande ${statut === 'ACCEPTEE' ? 'acceptée' : 'refusée'} !`);
      refetch();
    } catch (err: any) {
      console.error(err);
      alert(`❌ Erreur : ${err.message}`);
    }
  };

  const getStatutChip = (statut: string) => {
    const statutLower = statut.toLowerCase();
    
    switch (statutLower) {
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
          Vous devez être connecté en tant qu'agent.
        </Alert>
      </Container>
    );
  }

  if (loading && !data) {
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

  const allDemandes = data?.historiqueDemandesAgent?.demandes || [];
  
  // Filtrer selon l'onglet
  const filteredDemandes = filterTab === 'all' 
    ? allDemandes 
    : allDemandes.filter(d => d.statut.toLowerCase() === filterTab);

  // Statistiques
  const nbEnAttente = allDemandes.filter(d => d.statut.toLowerCase() === 'en_attente').length;
  const nbAcceptees = allDemandes.filter(d => d.statut.toLowerCase() === 'acceptee').length;
  const nbRefusees = allDemandes.filter(d => d.statut.toLowerCase() === 'refusee').length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            📋 Historique des Demandes de Visite
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez toutes les demandes de visite de vos propriétés
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => refetch()}
          disabled={loading}
        >
          Actualiser
        </Button>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', background: '#fef3c7' }}>
            <Typography variant="h4" fontWeight="bold" color="#92400e">
              {nbEnAttente}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              En attente
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', background: '#d1fae5' }}>
            <Typography variant="h4" fontWeight="bold" color="#065f46">
              {nbAcceptees}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acceptées
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', background: '#fee2e2' }}>
            <Typography variant="h4" fontWeight="bold" color="#991b1b">
              {nbRefusees}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Refusées
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', background: '#e0e7ff' }}>
            <Typography variant="h4" fontWeight="bold" color="#3730a3">
              {allDemandes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Onglets de filtrage */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={filterTab}
          onChange={(_, newValue) => setFilterTab(newValue)}
          variant="fullWidth"
        >
          <Tab label={`Toutes (${allDemandes.length})`} value="all" />
          <Tab label={`En attente (${nbEnAttente})`} value="en_attente" />
          <Tab label={`Acceptées (${nbAcceptees})`} value="acceptee" />
          <Tab label={`Refusées (${nbRefusees})`} value="refusee" />
        </Tabs>
      </Paper>

      {/* Liste des demandes */}
      {filteredDemandes.length === 0 ? (
        <Alert severity="info">
          Aucune demande dans cette catégorie.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {filteredDemandes.map((demande) => (
            <Card
              key={demande.id}
              sx={{
                border: '1px solid #e0e0e0',
                boxShadow: demande.statut.toLowerCase() === 'en_attente' ? 3 : 1,
                borderLeft: demande.statut.toLowerCase() === 'en_attente' 
                  ? '4px solid #fbbf24' 
                  : '1px solid #e0e0e0',
                '&:hover': { boxShadow: 4 },
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

                  {/* Colonne 4: Actions */}
                  <Grid item xs={12} md={3}>
                    {demande.statut.toLowerCase() === 'en_attente' ? (
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Accepter">
                          <IconButton
                            color="success"
                            onClick={() => handleUpdateStatut(demande.id, 'ACCEPTEE')}
                            size="small"
                          >
                            <Check />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Refuser">
                          <IconButton
                            color="error"
                            onClick={() => handleUpdateStatut(demande.id, 'REFUSEE')}
                            size="small"
                          >
                            <Close />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Traitée le {formatDateTime(demande.dateCreation)}
                      </Typography>
                    )}
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

                {/* Footer */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    Demande: {demande.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Créée: {formatDateTime(demande.dateCreation)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default HistoriqueDemandesAgent;
