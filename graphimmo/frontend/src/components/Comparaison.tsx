import React, { useState, useCallback, useMemo, useTransition } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia,
  Button, TextField, Paper, Chip, Stack, Divider, Avatar,
  CircularProgress, Alert, Badge, IconButton, useTheme, Zoom, Fade, GlobalStyles
} /*from '@mui/material';
import {
  Compare as CompareIcon,
  DeleteSweep as ClearIcon,
  CheckCircle as SelectedIcon,
  LocationOn as LocIcon,
  SquareFoot as AreaIcon,
  Hotel as BedIcon,
  ArrowBack as BackIcon,
  AutoAwesome as AiIcon,
  VerifiedUser as SecurityIcon,
  EuroSymbol as PriceIcon
} from '@mui/icons-material';*/

from '@mui/material';
import {
  CompareArrows as CompareIcon,
  DeleteOutline as ClearIcon,
  CheckCircle as SelectedIcon,
  LocationOn as LocIcon,
  SquareFoot as AreaIcon,
  Hotel as BedIcon,
  ArrowBackIosNew as BackIcon,
  AutoAwesome as AiIcon,
  VerifiedUser as SecurityIcon,
  TrendingUp as TrendIcon
} from '@mui/icons-material';

// --- REQUÊTES GRAPHQL ---
const GET_TOP_PROPRIETES = gql`
  query TopProprietesCompletes($limit: Int!) {
    topProprietesCompletes(limit: $limit) {
      id titre prix adresse surface chambres description lat lon
      photos { url angle }
      localisation { commune prixM2 region securite }
      amenagements { type qualite }
      agence { nom email adresse telephone }
      dateDepot prixM2Local
    }
  }
`;

const COMPARAISON_PROPRIETES = gql`
  query ComparaisonProprietes($input: ComparaisonInput!) {
    comparaisonProprietes(input: $input) {
      proprietes {
        id titre prix prixM2 surface chambres adresse localisation
        amenagements { type qualite }
      }
      similaires { id titre prix adresse surface chambres score source distanceKm }
    }
  }
`;

const ComparaisonPage: React.FC = () => {
  const theme = useTheme();
  const [selectedProps, setSelectedProps] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);
  const [limit, setLimit] = useState<number>(9);
  const [isPending, startTransition] = useTransition();

  const { loading, error, data } = useQuery(GET_TOP_PROPRIETES, { 
    variables: { limit },
    skip: showComparison
  });

  const [lancerComparaisonQuery, { loading: compLoading }] = useLazyQuery(COMPARAISON_PROPRIETES);

  const toggleSelection = useCallback((prop: any) => {
    startTransition(() => {
      const isSelected = selectedProps.find(p => p.id === prop.id);
      if (isSelected) {
        setSelectedProps(prev => prev.filter(p => p.id !== prop.id));
      } else if (selectedProps.length < 3) {
        setSelectedProps(prev => [...prev, prop]);
      }
    });
  }, [selectedProps]);

  const executerComparaison = async () => {
    if (selectedProps.length === 3) {
      try {
        const { data: res } = await lancerComparaisonQuery({
          variables: { input: { proprieteIds: selectedProps.map(p => p.id) } }
        });
        if (res) {
          const enrichedProps = res.comparaisonProprietes.proprietes.map((p: any) => ({
            ...p,
            photo: selectedProps.find(sp => sp.id === p.id)?.photos?.[0]?.url,
            prixM2Local: selectedProps.find(sp => sp.id === p.id)?.prixM2Local
          }));
          setComparisonResult({ ...res.comparaisonProprietes, proprietes: enrichedProps });
          setShowComparison(true);
        }
      } catch (err) { console.error(err); }
    }
  };

  const sortedProperties = useMemo(() => {
    if (!data?.topProprietesCompletes) return [];
    
    return [...data.topProprietesCompletes].sort((a, b) => {
      const aHasPhoto = a.photos && a.photos.length > 0 ? 1 : 0;
      const bHasPhoto = b.photos && b.photos.length > 0 ? 1 : 0;
      return bHasPhoto - aHasPhoto; // Les "1" (avec photos) passent devant les "0"
    });
  }, [data]);

  if (loading) return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80vh">
      <CircularProgress thickness={5} size={50} sx={{ mb: 2, borderRadius: '50%' }} />
      <Typography variant="h6" color="text.secondary" fontWeight={600}>Analyse du marché en cours...</Typography>
    </Box>
  );

  return (
    <>
      <GlobalStyles styles={{ 
        '#root': { 
          maxWidth: '100% !important', 
          width: '100vw',
          padding: '0 !important',
          margin: '0 !important',
          textAlign: 'center !important'
        } 
      }} />
      
      <Container 
  maxWidth={false} 
  disableGutters 
  sx={{ 
    width: '100vw', 
    maxWidth: '100% !important', 
    px: 4, // Marge légère sur les côtés pour ne pas coller à l'écran
    py: 4 
  }}
>
        {!showComparison ? (
  <Fade in={true}>
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
      {/* 1. HEADER */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Comparateur Intelligent
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sélectionnez jusqu'à 3 biens pour une analyse comparative détaillée.
        </Typography>
      </Box>

      {/* 2. FORMULAIRE (LARGEUR RÉDUITE & CENTRÉ) */}
      <Paper 
        elevation={4} 
        sx={{ 
          p: 1.5, mb: 6, borderRadius: 4, display: 'flex', alignItems: 'center', 
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
          maxWidth: 850, mx: 'auto', // Ta demande de largeur réduite
          border: '1px solid', borderColor: 'divider',
          position: 'sticky', top: 20, zIndex: 100, backdropFilter: 'blur(10px)',
          bgcolor: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField 
            label="Nb. Biens" type="number" size="small" variant="filled"
            value={limit} onChange={(e) => setLimit(Number(e.target.value))}
            sx={{ width: 90, '& .MuiInputBase-root': { borderRadius: 2 } }}
          />
          <Divider orientation="vertical" flexItem />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: selectedProps.length === 3 ? 'success.main' : 'text.primary' }}>
            {selectedProps.length} / 3 sélectionnés
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button 
            onClick={() => setSelectedProps([])} 
            variant="text" color="inherit" 
            disabled={selectedProps.length === 0}
            startIcon={<ClearIcon />}
          >
            Réinitialiser
          </Button>
          <Button 
            variant="contained" 
            disabled={selectedProps.length !== 3 || compLoading}
            onClick={executerComparaison}
            startIcon={compLoading ? <CircularProgress size={20} color="inherit" /> : <CompareIcon />}
            sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}
          >
            Comparer
          </Button>
        </Stack>
      </Paper>

      {/* 3. GRID DES CARTES */}
<Grid container spacing={3} justifyContent="center">
  {sortedProperties.map((prop: any) => { 
    const isSelected = selectedProps.some(p => p.id === prop.id);
    const hasPhoto = prop.photos && prop.photos.length > 0;
    const imageAffichée = hasPhoto ? prop.photos[0].url : null;

    return (
      <Grid item xs={12} sm={6} lg={4} key={prop.id} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card 
          onClick={() => toggleSelection(prop)}
          sx={{ 
            width: '100%', maxWidth: 400, borderRadius: 5,
            border: isSelected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: theme.shadows[10] },
            cursor: 'pointer'
          }}
        >
          <Box sx={{ position: 'relative', height: 220, bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  {prop.photos && prop.photos.length > 0 ? (
    <CardMedia
      component="img"
      height="220"
      image={prop.photos[0].url}
      sx={{ width: '100%', objectFit: 'cover' }} // On assure un remplissage propre sans bordures
    />
  ) : (
    <Typography variant="subtitle2" sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: 1 }}>
      PAS DE PHOTO
    </Typography>
  )}

  <Zoom in={isSelected}>
    <Avatar sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'primary.main', zIndex: 2 }}>
      <SelectedIcon />
    </Avatar>
  </Zoom>
  <Chip 
    label={`${prop.prix.toLocaleString()} MAD`} 
    sx={{ position: 'absolute', bottom: 12, left: 12, bgcolor: 'rgba(0,0,0,0.7)', color: 'white', fontWeight: 700, backdropFilter: 'blur(4px)' }} 
  />
</Box>
                <CardContent sx={{ textAlign: 'left' }}>
                  <Typography variant="h6" fontWeight={700} noWrap>{prop.titre}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 2, color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AreaIcon fontSize="small" /> <Typography variant="body2">{prop.surface}m²</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BedIcon fontSize="small" /> <Typography variant="body2">{prop.chambres} ch.</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocIcon fontSize="small" color="error" /> <Typography variant="body2" noWrap>{prop.localisation?.commune}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  </Fade>
) : (
  /* --- VUE COMPARAISON OPTIMISÉE --- */
  <Fade in={true}>
    {/* Box parent qui prend TOUTE la largeur disponible */}
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 } }}> 
      
      <Button 
        startIcon={<BackIcon sx={{ fontSize: 16 }} />} 
        onClick={() => setShowComparison(false)} 
        sx={{ mb: 4, borderRadius: 2, fontWeight: 700 }}
      >
        Retour à la sélection
      </Button>

      {/* 1. GRILLE DES 3 PROPRIÉTÉS : 3 COLONNES FIXES (4/12 chacune) */}
<Grid 
  container 
  spacing={3} 
  justifyContent="center" 
  alignItems="stretch" 
  sx={{ 
    width: '100%', 
    margin: 0, 
    maxWidth: 1400, // On augmente la largeur max pour que ce soit plus large
    mx: 'auto',     // Centrage horizontal
    mb: 8
  }}
>
  {comparisonResult?.proprietes.map((prop: any, idx: number) => (
    <Grid 
      item 
      xs={12}    // Mobile : Pleine largeur
      md={4}     // Desktop : Exactement 1/3 de la largeur (4 * 3 = 12)
      key={prop.id} 
      sx={{ display: 'flex' }}
    >
       <Card sx={{ 
         width: '100%', 
         borderRadius: 6,
         overflow: 'hidden', 
         display: 'flex',
         flexDirection: 'column',
         border: '1px solid', 
         borderColor: 'divider',
         transition: 'all 0.3s ease',
         '&:hover': { boxShadow: theme.shadows[6] }
       }}>
         {/* Reste du contenu de la carte... */}
         <Box sx={{ position: 'relative', height: 120 }}>
            <CardMedia component="img" height="100%" image={prop.photo} />
            <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
               <Chip label={`Option ${idx + 1}`} color={idx === 0 ? "primary" : "secondary"} sx={{ fontWeight: 800, px: 1 }} />
            </Box>
         </Box>
          <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" fontWeight={800} gutterBottom sx={{ minHeight: '3rem', fontSize: '1.2rem' }}>
              {prop.titre}
            </Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 3 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 0.5 }}>PRIX DE VENTE</Typography>
              <Typography variant="h4" color="primary.main" fontWeight={900}>
                {prop.prix.toLocaleString()} <small style={{ fontSize: 14 }}>MAD</small>
              </Typography>
            </Box>

            <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
               <DataRow 
                 icon={<TrendIcon color="info" />} 
                 label="Prix au m²" 
                 value={`${Math.round(prop.prix / prop.surface).toLocaleString()} MAD/m²`} 
                 subValue={prop.prixM2Local ? `Moyenne: ${prop.prixM2Local}` : "N/A"} 
               />
               <DataRow icon={<LocIcon color="error" />} label="Quartier" value={prop.localisation?.commune} subValue={prop.localisation?.region} />
               <DataRow icon={<SecurityIcon color="success" />} label="Sécurité" value={prop.localisation?.securite || 'N/A'} />
               
               <Divider />
               
               <Box>
                 <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ letterSpacing: 1, mb: 1, display: 'block' }}>ÉQUIPEMENTS</Typography>
                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                   {prop.amenagements?.slice(0, 4).map((a: any) => (
                     <Chip key={a.type} label={a.type} size="small" variant="soft" color="primary" sx={{ fontWeight: 600, borderRadius: 1.5 }} />
                   ))}
                 </Box>
               </Box>
            </Stack>
         </CardContent>
       </Card>
    </Grid>
  ))}
</Grid>
      
      {/* 2. BENCHMARK CENTRÉ ET LARGEUR RÉDUITE */}
      <Paper sx={{ p: 4, mb: 6, borderRadius: 6, width: '100%', maxWidth: 850, mx: 'auto' }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 3, textAlign: 'center' }}>
          <TrendIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
          Benchmark Prix au m²
        </Typography>
        
        <Stack spacing={3}>
        {comparisonResult?.proprietes.map((prop: any) => {
          
          const vraiPrixM2 = prop.prix / prop.surface;
          const prixLocal = prop.prixM2Local || 15000; 
          const ratio = (vraiPrixM2 / prixLocal) * 100;
          const isOverpriced = ratio > 100;

    return (
      <Box key={prop.id}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={700}>{prop.titre}</Typography>
          <Typography variant="subtitle2" color={isOverpriced ? "error.main" : "success.main"}>
            {/* Affichage du prix recalculé proprement */}
            {Math.round(vraiPrixM2).toLocaleString()} MAD/m² 
            <span style={{ opacity: 0.6, fontWeight: 400, marginLeft: 8 }}>
              ({isOverpriced ? '+' : ''}{(ratio - 100).toFixed(1)}% vs quartier)
            </span>
          </Typography>
        </Box>
        <Box sx={{ 
          height: 12, width: '100%', bgcolor: '#f1f5f9', 
          borderRadius: 6, position: 'relative', overflow: 'hidden' 
        }}>
          <Box sx={{ 
            height: '100%', 
            width: `${Math.min(ratio, 100)}%`, 
            bgcolor: isOverpriced ? 'warning.main' : 'success.main',
            borderRadius: 6,
            transition: 'width 1s ease-in-out'
          }} />
        </Box>
      </Box>
          );
        })}
      </Stack>
      </Paper>

      {/* 3. SUGGESTIONS IA CENTRÉES */}
      <Box 
  sx={{ 
    width: '100%', 
    maxWidth: 1200, 
    mx: 'auto', // <--- AJOUT : Centre la boîte elle-même
    mt: 6,      // Ajout d'une marge haute pour respirer
    p: 4, 
    bgcolor: 'primary.dark', 
    borderRadius: 8, 
    color: 'white', 
    position: 'relative', 
    overflow: 'hidden' 
  }}
>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 4, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <AiIcon color="secondary" /> Alternatives Intelligentes
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {comparisonResult?.similaires.map((sim: any) => (
            <Grid item xs={12} sm={6} md={3} key={sim.id}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', color: 'white', height: '100%' }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Chip label={`${Number(sim.score).toFixed(2)}% Match`} size="small" color="secondary" sx={{ fontWeight: 900 }} />
                  <Typography variant="caption">{sim.distanceKm?.toFixed(1)} km</Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight={700} noWrap>{sim.titre}</Typography>
                <Typography variant="h6" fontWeight={800} color="secondary.light">{sim.prix.toLocaleString()} MAD</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  </Fade>
      )}
    </Container>
    </>
  );
};


const DataRow = ({ icon, label, value, subValue }: any) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
    <Avatar sx={{ bgcolor: 'transparent', border: '1px solid', borderColor: 'divider', width: 32, height: 32 }}>
      {React.cloneElement(icon, { sx: { fontSize: 18 } })}
    </Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', lineHeight: 1 }}>{label}</Typography>
      <Typography variant="body1" fontWeight={700}>{value}</Typography>
      {subValue && <Typography variant="caption" color="text.secondary">{subValue}</Typography>}
    </Box>
  </Box>
);

export default ComparaisonPage;
