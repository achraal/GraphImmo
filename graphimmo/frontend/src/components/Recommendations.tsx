// import { useQuery } from '@apollo/client/react'
// import { useState } from 'react'  // ← Enlever useEffect
// import { gql } from '@apollo/client'

// const GET_RECOMMENDATIONS = gql`
//   query GetRecommendations($token: String!, $limit: Int, $minScore: Float) {
//     recommandations(token: $token, input: { limit: $limit, minScore: $minScore }) {
//       id
//       titre
//       prix
//       adresse
//       surface
//       chambres
//       lat
//       lon
//       score
//       source
//       distanceKm
//     }
//   }
// `

// interface Recommendation {
//   id: string
//   titre: string
//   prix: number
//   adresse: string
//   surface: number
//   chambres: number
//   lat: number
//   lon: number
//   score: number
//   source: string
//   distanceKm: number | null
// }

// const SOURCE_CONFIG = {
//   PROCHE: { label: '📍 Proximité', color: '#10b981', emoji: '📍' },
//   SIMILAIRE_A: { label: '🔄 Similaire', color: '#3b82f6', emoji: '🔄' },
//   AMENAGEMENT: { label: '🏠 Équipements', color: '#8b5cf6', emoji: '🏠' },
//   COLLABORATIF: { label: '👥 Populaire', color: '#f59e0b', emoji: '👥' },
//   PAGERANK: { label: '⭐ Tendance', color: '#ec4899', emoji: '⭐' }
// }

// export default function Recommendations() {
//   const token = localStorage.getItem('token')
  
//   // États utilisés pour la requête (ne changent QUE au clic sur Actualiser)
//   const [limit, setLimit] = useState(12)
//   const [minScore, setMinScore] = useState(30)
  
//   // États temporaires pour les inputs (changent à chaque frappe)
//   const [tempLimit, setTempLimit] = useState(12)
//   const [tempMinScore, setTempMinScore] = useState(30)

//   const { data, loading, error, refetch } = useQuery(GET_RECOMMENDATIONS, {
//     variables: { token, limit, minScore },
//     skip: !token
//   })

//   // ❌ SUPPRIMER le useEffect qui causait l'auto-actualisation

//   if (!token) {
//     return <div style={{ padding: 20, textAlign: 'center' }}>
//       <p>Vous devez être connecté pour voir les recommandations.</p>
//     </div>
//   }

//   if (loading) {
//     return <div style={{ padding: 20, textAlign: 'center' }}>
//       <p>⏳ Chargement des recommandations personnalisées...</p>
//     </div>
//   }

//   if (error) {
//     return <div style={{ padding: 20, textAlign: 'center', color: '#ef4444' }}>
//       <p>❌ Erreur : {error.message}</p>
//     </div>
//   }

//   const recommendations: Recommendation[] = data?.recommandations || []

//   // Grouper par source
//   const groupedBySource = recommendations.reduce((acc, reco) => {
//     if (!acc[reco.source]) acc[reco.source] = []
//     acc[reco.source].push(reco)
//     return acc
//   }, {} as Record<string, Recommendation[]>)

//   return (
//     <div style={{ maxWidth: 1400, margin: '0 auto', padding: 20 }}>
//       {/* Header */}
//       <div style={{ marginBottom: 32 }}>
//         <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
//           ✨ Recommandations personnalisées
//         </h1>
//         <p style={{ color: '#6b7280', fontSize: 16 }}>
//           {recommendations.length} propriétés sélectionnées pour vous
//         </p>
//       </div>

//       {/* Filtres */}
//       <div style={{ 
//         display: 'flex', 
//         gap: 16, 
//         marginBottom: 24,
//         padding: 16,
//         background: '#f9fafb',
//         borderRadius: 8,
//         alignItems: 'flex-end'
//       }}>
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
//             Nombre de résultats
//           </label>
//           <input 
//             type="number" 
//             value={tempLimit}
//             onChange={(e) => setTempLimit(Number(e.target.value))}
//             min={1}
//             max={50}
//             style={{
//               padding: '8px 12px',
//               border: '1px solid #d1d5db',
//               borderRadius: 6,
//               width: 100
//             }}
//           />
//         </div>
        
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
//             Score minimum
//           </label>
//           <input 
//             type="number" 
//             value={tempMinScore}
//             onChange={(e) => setTempMinScore(Number(e.target.value))}
//             min={0}
//             max={100}
//             step={5}
//             style={{
//               padding: '8px 12px',
//               border: '1px solid #d1d5db',
//               borderRadius: 6,
//               width: 100
//             }}
//           />
//         </div>

//         <button
//           onClick={() => {
//             // Met à jour les vraies valeurs utilisées par la requête
//             setLimit(tempLimit)
//             setMinScore(tempMinScore)
//           }}
//           style={{
//             padding: '8px 16px',
//             background: '#3b82f6',
//             color: 'white',
//             border: 'none',
//             borderRadius: 6,
//             cursor: 'pointer',
//             fontWeight: 500,
//             height: '40px'
//           }}
//         >
//           🔄 Actualiser
//         </button>
//       </div>

//       {/* Stats par source */}
//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//         gap: 16,
//         marginBottom: 32
//       }}>
//         {Object.entries(groupedBySource).map(([source, items]) => {
//           const config = SOURCE_CONFIG[source as keyof typeof SOURCE_CONFIG]
//           return (
//             <div 
//               key={source}
//               style={{
//                 padding: 16,
//                 background: 'white',
//                 border: `2px solid ${config?.color || '#d1d5db'}`,
//                 borderRadius: 8,
//                 textAlign: 'center'
//               }}
//             >
//               <div style={{ fontSize: 32, marginBottom: 8 }}>
//                 {config?.emoji || '📌'}
//               </div>
//               <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
//                 {items.length}
//               </div>
//               <div style={{ color: '#6b7280', fontSize: 14 }}>
//                 {config?.label || source}
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* Liste des recommandations */}
//       {recommendations.length === 0 ? (
//         <div style={{ 
//           padding: 40, 
//           textAlign: 'center',
//           background: '#f9fafb',
//           borderRadius: 8
//         }}>
//           <p style={{ fontSize: 18, color: '#6b7280' }}>
//             Aucune recommandation disponible. Commencez par aimer des propriétés ! ❤️
//           </p>
//         </div>
//       ) : (
//         <div style={{ 
//           display: 'grid', 
//           gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
//           gap: 24
//         }}>
//           {recommendations.map((reco) => {
//             const config = SOURCE_CONFIG[reco.source as keyof typeof SOURCE_CONFIG]
//             return (
//               <div 
//                 key={reco.id}
//                 style={{
//                   background: 'white',
//                   border: '1px solid #e5e7eb',
//                   borderRadius: 12,
//                   overflow: 'hidden',
//                   transition: 'transform 0.2s, box-shadow 0.2s',
//                   cursor: 'pointer'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'translateY(-4px)'
//                   e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'translateY(0)'
//                   e.currentTarget.style.boxShadow = 'none'
//                 }}
//                 onClick={() => window.location.hash = `#/propriete/${reco.id}`}
//               >
//                 {/* Badge source */}
//                 <div style={{
//                   background: config?.color || '#d1d5db',
//                   color: 'white',
//                   padding: '8px 16px',
//                   fontWeight: 600,
//                   fontSize: 14
//                 }}>
//                   {config?.emoji} {config?.label || reco.source}
//                 </div>

//                 {/* Contenu */}
//                 <div style={{ padding: 20 }}>
//                   <h3 style={{ 
//                     fontSize: 18, 
//                     fontWeight: 700, 
//                     marginBottom: 12,
//                     color: '#111827'
//                   }}>
//                     {reco.titre}
//                   </h3>

//                   <div style={{ 
//                     fontSize: 24, 
//                     fontWeight: 700, 
//                     color: '#8b5cf6',
//                     marginBottom: 12
//                   }}>
//                     {reco.prix.toLocaleString('fr-MA')} MAD
//                   </div>

//                   <div style={{ 
//                     color: '#6b7280', 
//                     fontSize: 14,
//                     marginBottom: 12
//                   }}>
//                     📍 {reco.adresse}
//                   </div>

//                   <div style={{ 
//                     display: 'flex', 
//                     gap: 12, 
//                     fontSize: 14,
//                     marginBottom: 12
//                   }}>
//                     <span>📐 {reco.surface}m²</span>
//                     <span>🛏️ {reco.chambres} ch.</span>
//                     {reco.distanceKm !== null && (
//                       <span>📍 {reco.distanceKm}km</span>
//                     )}
//                   </div>

//                   {/* Score de pertinence */}
//                   <div style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 8,
//                     padding: '8px 12px',
//                     background: '#f3f4f6',
//                     borderRadius: 6
//                   }}>
//                     <div style={{
//                       flex: 1,
//                       height: 8,
//                       background: '#e5e7eb',
//                       borderRadius: 4,
//                       overflow: 'hidden'
//                     }}>
//                       <div style={{
//                         width: `${reco.score}%`,
//                         height: '100%',
//                         background: `linear-gradient(90deg, ${config?.color || '#3b82f6'}, ${config?.color || '#8b5cf6'})`,
//                         transition: 'width 0.3s'
//                       }} />
//                     </div>
//                     <span style={{ 
//                       fontWeight: 700, 
//                       fontSize: 14,
//                       color: config?.color || '#111827'
//                     }}>
//                       {reco.score}/100
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, Stack,
  LinearProgress, Button, TextField, Paper, Avatar, CircularProgress,
  Alert, Divider, InputAdornment
} from '@mui/material';
import {
  AutoAwesome as MagicIcon,
  LocationOn as LocIcon,
  SquareFoot as AreaIcon,
  Hotel as BedIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendIcon,
  People as PeopleIcon,
  SettingsSuggest as GearIcon,
  SwapHoriz as SimilarIcon
} from '@mui/icons-material';

const GET_RECOMMENDATIONS = gql`
  query GetRecommendations($token: String!, $limit: Int, $minScore: Float) {
    recommandations(token: $token, input: { limit: $limit, minScore: $minScore }) {
      id titre prix adresse surface chambres lat lon score source distanceKm
    }
  }
`;

const SOURCE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  PROCHE: { label: 'Proximité', color: '#10b981', icon: <LocIcon /> },
  SIMILAIRE_A: { label: 'Similaire', color: '#3b82f6', icon: <SimilarIcon /> },
  AMENAGEMENT: { label: 'Équipements', color: '#8b5cf6', icon: <GearIcon /> },
  COLLABORATIF: { label: 'Populaire', color: '#f59e0b', icon: <PeopleIcon /> },
  PAGERANK: { label: 'Tendance', color: '#ec4899', icon: <TrendIcon /> }
};

const Recommendations: React.FC = () => {
  const token = localStorage.getItem('token');
  const [limit, setLimit] = useState(12);
  const [minScore, setMinScore] = useState(30);
  const [tempLimit, setTempLimit] = useState(12);
  const [tempMinScore, setTempMinScore] = useState(30);

  const { data, loading, error, refetch } = useQuery(GET_RECOMMENDATIONS, {
    variables: { token, limit, minScore },
    skip: !token,
    fetchPolicy: 'network-only'
  });

  if (!token) return <Container sx={{ py: 10 }}><Alert severity="warning">Connectez-vous pour voir vos recommandations.</Alert></Container>;
  if (loading) return <Box textAlign="center" py={20}><CircularProgress size={60} /><Typography sx={{ mt: 2 }}>IA en cours d'analyse...</Typography></Box>;
  if (error) return <Container sx={{ py: 10 }}><Alert severity="error">{error.message}</Alert></Container>;

  const recommendations = data?.recommandations || [];
  const groupedBySource = recommendations.reduce((acc: any, reco: any) => {
    acc[reco.source] = (acc[reco.source] || 0) + 1;
    return acc;
  }, {});

  return (
    // On passe à maxWidth="xl" pour occuper toute la largeur disponible
    <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, md: 5 } }}>
      
      {/* HEADER SECTION */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight={900} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, letterSpacing: '-0.04em', mb: 1 }}>
          <MagicIcon sx={{ fontSize: 50, color: '#8b5cf6' }} /> Recommandations IA
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={400}>
          Algorithmes personnalisés basés sur vos interactions
        </Typography>
      </Box>

      {/* SECTION FILTRES - CENTRÉE */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
        <Paper elevation={0} sx={{ p: 2, borderRadius: 5, border: '1px solid', borderColor: 'divider', display: 'inline-flex', gap: 3, alignItems: 'center', bgcolor: '#f8fafc', px: 4 }}>
          <TextField
            label="Résultats" type="number" size="small"
            value={tempLimit} onChange={(e) => setTempLimit(Number(e.target.value))}
            sx={{ width: 100, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
          />
          <TextField
            label="Score Min %" type="number" size="small"
            value={tempMinScore} onChange={(e) => setTempMinScore(Number(e.target.value))}
            sx={{ width: 110, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
          />
          <Button 
            variant="contained" startIcon={<RefreshIcon />}
            onClick={() => { setLimit(tempLimit); setMinScore(tempMinScore); }}
            sx={{ borderRadius: 3, fontWeight: 800, px: 4, py: 1, textTransform: 'none', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}
          >
            Mettre à jour
          </Button>
        </Paper>
      </Box>

      {/* GRIDS ÉQUIPEMENTS / SOURCES - CENTRÉS */}
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 10 }}>
        {Object.entries(SOURCE_CONFIG).map(([key, config]) => (
          <Grid item xs={6} sm={4} md={2.2} key={key}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, textAlign: 'center', borderRadius: 6, 
                border: '2px solid', 
                borderColor: groupedBySource[key] ? config.color : '#f1f5f9', 
                bgcolor: groupedBySource[key] ? 'white' : 'rgba(241, 245, 249, 0.5)',
                transition: 'all 0.3s ease',
                transform: groupedBySource[key] ? 'scale(1)' : 'scale(0.95)',
                boxShadow: groupedBySource[key] ? `0 10px 20px -10px ${config.color}40` : 'none'
              }}
            >
              <Avatar sx={{ bgcolor: config.color, mx: 'auto', mb: 1.5, width: 48, height: 48, boxShadow: 3 }}>
                {config.icon}
              </Avatar>
              <Typography variant="h4" fontWeight={900}>{groupedBySource[key] || 0}</Typography>
              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {config.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 8, opacity: 0.6 }}>
        <Chip label="PROPRIÉTÉS SÉLECTIONNÉES" sx={{ fontWeight: 800, px: 2 }} />
      </Divider>

      {/* LISTE DES CARDS - CENTRÉE ET LARGE */}
      {recommendations.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Typography variant="h5" color="text.secondary">Aucun résultat trouvé. Ajustez vos filtres.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Grid 
            container 
            spacing={4} 
            justifyContent="center" // <-- Centre les cartes si la ligne n'est pas pleine
            sx={{ 
              maxWidth: '1600px', // Limite la largeur max pour éviter que les cartes soient trop éparpillées
              width: '100%',
              margin: '0 auto' 
            }}
          >
            {recommendations.map((reco: any) => {
              const config = SOURCE_CONFIG[reco.source] || { label: reco.source, color: '#64748b', icon: <MagicIcon /> };
              return (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={reco.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card 
                    onClick={() => window.location.hash = `#/propriete/${reco.id}`}
                    sx={{ 
                      borderRadius: 7, 
                      width: '100%', // Prend toute la largeur du grid item
                      maxWidth: '380px', // Empêche la carte de devenir trop géante sur tablette
                      height: '100%', 
                      cursor: 'pointer', 
                      position: 'relative',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      border: '1px solid #e2e8f0',
                      '&:hover': { 
                        transform: 'translateY(-12px)', 
                        boxShadow: '0 30px 60px rgba(0,0,0,0.12)', 
                        borderColor: config.color 
                      }
                    }}
                  >
                    {/* Badge Source */}
                    <Chip 
                      label={config.label}
                      size="small"
                      sx={{ position: 'absolute', top: 20, right: 20, bgcolor: config.color, color: 'white', fontWeight: 900, zIndex: 2, boxShadow: 2 }}
                    />

                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" fontWeight={800} gutterBottom noWrap sx={{ pr: 6, mb: 1 }}>
                        {reco.titre}
                      </Typography>
                      
                      <Typography variant="h3" fontWeight={950} sx={{ mb: 3, color: '#1e293b', display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        {reco.prix.toLocaleString('fr-MA')} <Typography variant="h6" fontWeight={700} color="text.secondary">MAD</Typography>
                      </Typography>

                      <Stack spacing={2.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
                          <LocIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                          <Typography variant="body2" fontWeight={500} noWrap>{reco.adresse}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AreaIcon sx={{ color: 'action.active' }} />
                            <Typography variant="body1" fontWeight={800}>{reco.surface}m²</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BedIcon sx={{ color: 'action.active' }} />
                            <Typography variant="body1" fontWeight={800}>{reco.chambres} ch.</Typography>
                          </Box>
                        </Box>

                        <Divider />

                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                            <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                              Match IA
                            </Typography>
                            <Typography variant="h6" fontWeight={950} sx={{ color: config.color }}>{reco.score}%</Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={reco.score} 
                            sx={{ 
                              height: 10, borderRadius: 5, bgcolor: '#f1f5f9',
                              '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: config.color }
                            }} 
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Recommendations;