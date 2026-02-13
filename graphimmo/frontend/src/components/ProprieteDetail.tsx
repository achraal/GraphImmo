import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Container, Typography, Box, Grid, Button, CardMedia,
  Chip, Divider, Paper, Stack, Skeleton, IconButton, Avatar,
  alpha, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ContentCopy as CopyIcon,
  LocationOn as LocationIcon,
  SquareFoot as SurfaceIcon,
  KingBed as BedIcon,
  Business as AgencyIcon,
  Login as LoginIcon,
  VerifiedUser as SecurityIcon,
  TrendingUp as TrendIcon,
  Phone as PhoneIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';

// --- GRAPHQL QUERIES ---
const GET_PROPRIETE_DETAIL = gql`
  query ProprieteComplete($id: String!, $token: String) {
    proprieteDetail(id: $id, token: $token) {
      id titre prix adresse description surface chambres lat lon dateDepot prixM2Local
      photos { url angle }
      amenagements { id type qualite }
      localisation { id commune region prixM2 securite }
      agence { id nom adresse email telephone }
    }
  }
`;

const AJOUTER_FAVORI = gql`
  mutation AjouterFavori($proprieteId: String!, $token: String!, $note: String) {
    ajouterFavori(proprieteId: $proprieteId, token: $token, note: $note)
  }
`;

const EST_FAVORI = gql`
  query EstFavori($proprieteId: String!, $token: String!) {
    estFavori(proprieteId: $proprieteId, token: $token)
  }
`;

const RETIRER_FAVORI = gql`
  mutation RetirerFavori($proprieteId: String!, $token: String!) {
    retirerFavori(proprieteId: $proprieteId, token: $token)
  }
`;

export default function ProprieteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem('token') || '');
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const { data, loading, error } = useQuery(GET_PROPRIETE_DETAIL, {
    variables: { id: id || '', token },
    skip: !id,
  });

  const { data: favoriData } = useQuery(EST_FAVORI, {
    variables: { proprieteId: id || '', token },
    skip: !id || !token,
  });

  const isFavori = favoriData?.estFavori || false;

  const [ajouterFavori, { loading: loadingAdd }] = useMutation(AJOUTER_FAVORI, {
    refetchQueries: [{ query: EST_FAVORI, variables: { proprieteId: id, token } }],
  });

  const [retirerFavori, { loading: loadingRemove }] = useMutation(RETIRER_FAVORI, {
    refetchQueries: [{ query: EST_FAVORI, variables: { proprieteId: id, token } }],
  });

  const handleFavoriClick = useCallback(() => {
  if (!token) return navigate('/login');
  
  if (isFavori) {
    // Si déjà favori, on retire directement
    retirerFavori({ variables: { proprieteId: id, token } });
  } else {
    // Si pas favori, on ouvre la modal pour la note
    setOpenNoteModal(true);
  }
}, [isFavori, id, token, navigate, retirerFavori]);

const confirmAjoutFavori = async () => {
  try {
    await ajouterFavori({ 
      variables: { 
        proprieteId: id, 
        token, 
        note: note // On envoie la note saisie
      } 
    });
    setOpenNoteModal(false);
    setNote(''); // Reset la note
  } catch (e) {
    console.error(e);
  }
};

  const copyIdToClipboard = () => {
    if (data?.proprieteDetail?.id) {
      navigator.clipboard.writeText(data.proprieteDetail.id);
    }
  };

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 6 }} />
      <Skeleton width="60%" height={60} sx={{ mt: 4 }} />
    </Container>
  );

  if (error || !data?.proprieteDetail) return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
      <Typography variant="h4" fontWeight={800} color="text.secondary">Bien introuvable.</Typography>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/')} variant="contained" sx={{ mt: 3, borderRadius: 3 }}>Retour à l'accueil</Button>
    </Box>
  );

  const prop = data.proprieteDetail;

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 15 }}>
    <Dialog 
  open={openNoteModal} 
  onClose={() => {
    setOpenNoteModal(false);
    setNote(''); // Vider la note si on ferme sans enregistrer
  }}
  PaperProps={{ sx: { borderRadius: 5, p: 1, minWidth: 350 } }}
>
  <DialogTitle sx={{ fontWeight: 800 }}>Ajouter une note personnelle</DialogTitle>
  <DialogContent>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      Pourquoi ce bien vous intéresse-t-il ? (Optionnel)
    </Typography>
    <TextField
      autoFocus
      multiline
      rows={3}
      fullWidth
      variant="outlined"
      placeholder="Ex: Cuisine spacieuse, proche du travail..."
      value={note}
      onChange={(e) => setNote(e.target.value)}
      // Désactiver le champ pendant l'envoi
      disabled={loadingAdd} 
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
    />
  </DialogContent>
  <DialogActions sx={{ p: 3 }}>
    <Button 
      onClick={() => {
        setOpenNoteModal(false);
        setNote('');
      }} 
      color="inherit" 
      sx={{ fontWeight: 700 }}
      disabled={loadingAdd}
    >
      Annuler
    </Button>
    <Button 
      onClick={confirmAjoutFavori} 
      variant="contained" 
      disabled={loadingAdd}
      sx={{ 
        borderRadius: 3, 
        px: 3, 
        fontWeight: 800,
        minWidth: 100 // Garde une taille stable si tu ajoutes un spinner
      }}
    >
      {loadingAdd ? 'Enregistrement...' : 'Enregistrer'}
    </Button>
  </DialogActions>
</Dialog>
      {/* BARRE DE NAVIGATION CENTRÉE */}
      <Paper elevation={0} sx={{ borderBottom: '1px solid #E2E8F0', bgcolor: 'white', position: 'sticky', top: 0, zIndex: 1000 }}>
        <Container maxWidth="lg" sx={{ py: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button startIcon={<BackIcon />} onClick={() => navigate(-1)} color="inherit" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}>
              Retour
            </Button>
            <Chip 
              label={`Référence: ${prop.id.substring(0,8)}`} 
              size="small" 
              onClick={copyIdToClipboard}
              onDelete={copyIdToClipboard}
              deleteIcon={<CopyIcon sx={{ fontSize: '14px !important' }} />}
              sx={{ fontWeight: 800, bgcolor: '#F1F5F9', px: 1 }} 
            />
          </Stack>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* GRILLE PRINCIPALE - CENTRÉE PAR DEFAUT PAR LE CONTAINER */}
        <Grid container spacing={4} justifyContent="center">
          
          {/* COLONNE GAUCHE (CONTENU) */}
          <Grid item xs={12} md={8}>
            {/* GALERIE PHOTO STYLE "BENTO" */}
            <Grid container spacing={1.5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={8}>
                <CardMedia
                  component="img" image={prop.photos[0]?.url}
                  sx={{ height: 480, borderRadius: 6, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack spacing={1.5} height="100%">
                  <CardMedia
                    component="img" image={prop.photos[1]?.url || prop.photos[0]?.url}
                    sx={{ height: 232, borderRadius: 6, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                  />
                  <Box sx={{ position: 'relative', height: 232 }}>
                    <CardMedia
                      component="img" image={prop.photos[2]?.url || prop.photos[0]?.url}
                      sx={{ height: '100%', borderRadius: 6, objectFit: 'cover', filter: prop.photos.length > 3 ? 'brightness(0.6)' : 'none' }}
                    />
                    {prop.photos.length > 3 && (
                      <Typography variant="h4" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontWeight: 900 }}>
                        +{prop.photos.length - 2}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            {/* INFOS PRINCIPALES */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" fontWeight={950} sx={{ color: '#0F172A', mb: 1, letterSpacing: '-0.04em' }}>
                {prop.titre}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ color: '#64748B' }}>
                <LocationIcon fontSize="small" />
                <Typography variant="h6" fontWeight={500}>{prop.adresse}</Typography>
              </Stack>
            </Box>

            {/* CARTE DES CARACTÉRISTIQUES (CENTRÉE) */}
            <Paper sx={{ p: 4, borderRadius: 6, mb: 5, border: '1px solid #E2E8F0', bgcolor: 'white' }} elevation={0}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  <SurfaceIcon sx={{ color: theme.palette.primary.main, mb: 1, fontSize: 30 }} />
                  <Typography variant="h5" fontWeight={900}>{prop.surface} m²</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Surface</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem sx={{ mx: 0, borderColor: '#E2E8F0' }} />
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  <BedIcon sx={{ color: theme.palette.primary.main, mb: 1, fontSize: 30 }} />
                  <Typography variant="h5" fontWeight={900}>{prop.chambres} Ch.</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Pièces</Typography>
                </Grid>
                <Divider orientation="vertical" flexItem sx={{ mx: 0, borderColor: '#E2E8F0' }} />
                <Grid item xs={3.5} sx={{ textAlign: 'center' }}>
                  <TrendIcon sx={{ color: theme.palette.primary.main, mb: 1, fontSize: 30 }} />
                  <Typography variant="h5" fontWeight={900}>{Math.round(prop.prix/prop.surface).toLocaleString()}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>MAD / m²</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="h5" fontWeight={800} sx={{ mb: 2, color: '#1e293b' }}>Description du bien</Typography>
            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 6, fontSize: '1.1rem' }}>
              {prop.description}
            </Typography>

            {/* ÉQUIPEMENTS */}
            <Typography variant="h5" fontWeight={800} sx={{ mb: 3, color: '#1e293b' }}>Équipements & Aménagements</Typography>
            <Grid container spacing={2}>
              {prop.amenagements.map((amen: any) => (
                <Grid item xs={12} sm={6} key={amen.id}>
                  <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white', borderRadius: 5, border: '1px solid #E2E8F0' }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, fontWeight: 800 }}>
                      {amen.type[0]}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={800} variant="body1">{amen.type}</Typography>
                      <Typography variant="body2" color="text.secondary">{amen.qualite}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* COLONNE DROITE (PRIX & CONTACT) - STICKY */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 90 }}>
              
              {/* PRIX */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #E2E8F0', bgcolor: 'white', mb: 3 }}>
                <Typography variant="caption" fontWeight={800} color="primary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Prix de vente
                </Typography>
                <Typography variant="h2" fontWeight={950} sx={{ color: '#0F172A', mt: 1, mb: 3, letterSpacing: '-0.02em' }}>
                  {prop.prix.toLocaleString('fr-MA')} <span style={{ fontSize: '1.2rem', color: '#64748B' }}>MAD</span>
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, bgcolor: '#F0FDF4', borderRadius: 4, border: '1px solid #DCFCE7' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <SecurityIcon sx={{ color: '#16A34A' }} />
                      <Typography variant="body2" fontWeight={800} color="#16A34A">Sécurité Quartier</Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight={900} color="#16A34A">{prop.localisation.securite}/10</Typography>
                  </Box>

                  <Box sx={{ px: 1 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                      <Typography color="text.secondary" fontWeight={500}>Commune</Typography>
                      <Typography fontWeight={700}>{prop.localisation.commune}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary" fontWeight={500}>Région</Typography>
                      <Typography fontWeight={700}>{prop.localisation.region}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>

              {/* AGENCE */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 6, bgcolor: '#0F172A', color: 'white' }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 50, height: 50 }}>
                    <AgencyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={800} noWrap sx={{ maxWidth: 200 }}>
                      {prop.agence.nom}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 600 }}>Agence Certifiée</Typography>
                  </Box>
                </Stack>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<PhoneIcon />} 
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    borderRadius: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    textTransform: 'none',
                    boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  {prop.agence.telephone}
                </Button>
                <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', mt: 2, opacity: 0.5 }}>
                  {prop.agence.email}
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ACTION BAR FLOTTANTE CENTRÉE */}
      <Box sx={{ 
        position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', 
        zIndex: 1100, width: 'auto'
      }}>
        <Paper elevation={12} sx={{ p: 1, borderRadius: 10, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', border: '1px solid #E2E8F0' }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleFavoriClick}
              disabled={loadingAdd || loadingRemove}
              startIcon={isFavori ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              sx={{ 
                borderRadius: 8, px: 6, py: 1.5,
                bgcolor: isFavori ? '#EF4444' : '#0F172A',
                '&:hover': { bgcolor: isFavori ? '#DC2626' : '#1e293b' },
                textTransform: 'none', fontWeight: 900, minWidth: 250,
                fontSize: '1rem'
              }}
            >
              {isFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
            </Button>
            {!token && (
              <IconButton component={Link} to="/login" sx={{ bgcolor: '#F1F5F9', p: 2 }}>
                <LoginIcon />
              </IconButton>
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
    
  );
}
