// import { useQuery, useMutation } from '@apollo/client/react'
// import { gql } from '@apollo/client'
// import { useEffect, useState } from 'react'

// const GET_ME = gql`
//   query GetMe {
//     me(token: "${localStorage.getItem('token') || ''}") {
//       id nom prenom email role budget surfaceMin preferencesLocation villePrefs
//     }
//   }
// `

// const UPDATE_PROFIL = gql`
//   mutation UpdateProfil($input: UserUpdateInput!) {
//     updateProfil(input: $input, token: "${localStorage.getItem('token') || ''}") {
//       id budget surfaceMin preferencesLocation villePrefs
//     }
//   }
// `

// export default function Profil() {
//   const [formData, setFormData] = useState({
//     budget: '',
//     surfaceMin: '',
//     preferencesLocation: '',
//     villePrefs: ''
//   })

//   const { data, loading, refetch } = useQuery(GET_ME)
//   const [updateProfil, { loading: updating }] = useMutation(UPDATE_PROFIL)

//   useEffect(() => {
//     if (data?.me) {
//       const user = data.me
//       setFormData({
//         budget: user.budget?.toString() || '',
//         surfaceMin: user.surfaceMin?.toString() || '',
//         preferencesLocation: user.preferencesLocation || '',
//         villePrefs: user.villePrefs?.join(', ') || ''
//       })
//     }
//   }, [data])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       await updateProfil({
//         variables: {
//           input: {
//             budget: formData.budget ? parseFloat(formData.budget) : null,
//             surfaceMin: formData.surfaceMin ? parseInt(formData.surfaceMin) : null,
//             preferencesLocation: formData.preferencesLocation || null,
//             villePrefs: formData.villePrefs ? formData.villePrefs.split(',').map(s => s.trim()) : null
//           }
//         }
//       })
//       alert('Profil mis à jour !')
//       refetch()
//     } catch (error: any) {
//       alert('Erreur: ' + error.message)
//     }
//   }

//   if (loading) return <div>Chargement...</div>
//   if (!data?.me) return <div>Profil non trouvé</div>

//   const user = data.me

//   return (
//     <div style={{ maxWidth: '600px', margin: '40px auto', padding: '32px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: 'white' }}>
//       <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Mon Profil</h2>
      
//       <div style={{
//         display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
//         marginBottom: '32px', padding: '20px', background: '#f8fafc',
//         borderRadius: '8px'
//       }}>
//         <div>
//           <strong>Identifiants :</strong><br/>
//           ID: {user.id}<br/>
//           Email: {user.email}<br/>
//           Rôle: {user.role}
//         </div>
//         <div>
//           <strong>Préférences actuelles :</strong><br/>
//           Budget: {user.budget?.toLocaleString()} MAD<br/>
//           Surface min: {user.surfaceMin} m²<br/>
//           Localisation: {user.preferencesLocation}<br/>
//           Villes: {user.villePrefs?.join(', ')}
//         </div>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
//           <div>
//             <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//               Budget max (MAD)
//             </label>
//             <input
//               type="number"
//               value={formData.budget}
//               onChange={(e) => setFormData({...formData, budget: e.target.value})}
//               style={{
//                 width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
//                 borderRadius: '8px', fontSize: '16px'
//               }}
//               placeholder="250000"
//             />
//           </div>
//           <div>
//             <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//               Surface min (m²)
//             </label>
//             <input
//               type="number"
//               value={formData.surfaceMin}
//               onChange={(e) => setFormData({...formData, surfaceMin: e.target.value})}
//               style={{
//                 width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
//                 borderRadius: '8px', fontSize: '16px'
//               }}
//               placeholder="80"
//             />
//           </div>
//         </div>

//         <div style={{ marginBottom: '24px' }}>
//           <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//             Localisation préférée
//           </label>
//           <input
//             type="text"
//             value={formData.preferencesLocation}
//             onChange={(e) => setFormData({...formData, preferencesLocation: e.target.value})}
//             style={{
//               width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
//               borderRadius: '8px', fontSize: '16px'
//             }}
//             placeholder="Casablanca Maarif, Rabat Agdal..."
//           />
//         </div>
//         <div style={{ marginBottom: '28px' }}>
//           <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//             Villes préférées (séparées par virgules)
//           </label>
//           <input
//             type="text"
//             value={formData.villePrefs}
//             onChange={(e) => setFormData({...formData, villePrefs: e.target.value})}
//             style={{
//               width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
//               borderRadius: '8px', fontSize: '16px'
//             }}
//             placeholder="Casablanca, Rabat, Marrakech"
//           />
//         </div>

//         {updating && (
//           <div style={{
//             marginBottom: '16px', padding: '12px', background: '#ecfdf5',
//             border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534'
//           }}>
//             Sauvegarde en cours...
//           </div>
//         )}

//         <button 
//           type="submit" 
//           disabled={updating}
//           style={{ 
//             width: '100%', padding: '16px', background: '#059669', color: 'white',
//             border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600,
//             cursor: updating ? 'not-allowed' : 'pointer'
//           }}
//         >
//           {updating ? 'Sauvegarde...' : 'Mettre à jour mon profil'}
//         </button>
//       </form>
//     </div>
//   )
// }

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {  gql } from '@apollo/client';

import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Stack,
  Alert,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Chip
} from '@mui/material';
import {
  Email as EmailIcon,
  Badge as BadgeIcon,
  AccountBalanceWallet as WalletIcon,
  SquareFoot as SurfaceIcon,
  LocationCity as CityIcon,
  Map as MapIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const GET_ME = gql`
  query GetMe($token: String!) {
    me(token: $token) {
      id
      nom
      prenom
      email
      role
      budget
      surfaceMin
      preferencesLocation
      villePrefs
    }
  }
`;

const UPDATE_PROFIL = gql`
  mutation UpdateProfil($input: UserUpdateInput!, $token: String!) {
    updateProfil(input: $input, token: $token) {
      id
      budget
      surfaceMin
      preferencesLocation
      villePrefs
    }
  }
`;

export default function Profil() {
  const token = localStorage.getItem('token') || '';
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    budget: '',
    surfaceMin: '',
    preferencesLocation: '',
    villePrefs: ''
  });

  const { data, loading, refetch } = useQuery(GET_ME, {
    variables: { token },
    skip: !token
  });

  const [updateProfil, { loading: updating }] = useMutation(UPDATE_PROFIL);

  useEffect(() => {
    if (data?.me) {
      const user = data.me;
      setFormData({
        budget: user.budget?.toString() || '',
        surfaceMin: user.surfaceMin?.toString() || '',
        preferencesLocation: user.preferencesLocation || '',
        villePrefs: user.villePrefs?.join(', ') || ''
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfil({
        variables: {
          token,
          input: {
            budget: formData.budget ? parseFloat(formData.budget) : null,
            surfaceMin: formData.surfaceMin ? parseInt(formData.surfaceMin) : null,
            preferencesLocation: formData.preferencesLocation || null,
            villePrefs: formData.villePrefs ? formData.villePrefs.split(',').map(s => s.trim()) : null
          }
        }
      });
      setOpenSnackbar(true);
      refetch();
    } catch (error: any) {
      console.error(error);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );

  if (!data?.me) return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Alert severity="error">Veuillez vous reconnecter pour accéder à votre profil.</Alert>
    </Container>
  );

  const user = data.me;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4} alignItems="center">
        
        {/* --- BLOC 1 : INFOS UTILISATEUR (CENTRE ET PLUS LARGE) --- */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            border: '1px solid', 
            borderColor: 'divider', 
            bgcolor: '#fcfcfd',
            width: '100%', 
            maxWidth: 700, 
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                width: 90, 
                height: 90, 
                margin: '0 auto 16px', 
                bgcolor: 'primary.main', 
                fontSize: '2.2rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              {user.prenom[0]}{user.nom[0]}
            </Avatar>
            <Typography variant="h4" fontWeight={800}>{user.prenom} {user.nom}</Typography>
            <Chip 
              label={user.role} 
              color="secondary" 
              size="small" 
              sx={{ mt: 1, fontWeight: 700, textTransform: 'uppercase', px: 2 }} 
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* --- SECTION CENTRÉE POUR EMAIL ET ID --- */}
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Box>
              <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ letterSpacing: 1 }}>
                EMAIL DE CONTACT
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 0.5 }}>
                <EmailIcon fontSize="small" color="primary" sx={{ opacity: 0.8 }} />
                <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary' }}>
                  {user.email}
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ letterSpacing: 1 }}>
                IDENTIFIANT COMPTE
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 0.5 }}>
                <BadgeIcon fontSize="small" color="action" />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace', 
                    bgcolor: '#f1f5f9', 
                    px: 1.5, 
                    py: 0.5, 
                    borderRadius: 1,
                    color: 'text.secondary',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  {user.id}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* Petit résumé des données actuelles */}
          <Box sx={{ 
            mt: 4, 
            p: 2, 
            bgcolor: 'rgba(0,0,0,0.02)', 
            borderRadius: 2, 
            border: '1px dashed #ddd', 
            display: 'flex', 
            justifyContent: 'space-around', 
            flexWrap: 'wrap', 
            gap: 2 
          }}>
              <Typography variant="caption"><strong>💰 Budget :</strong> {user.budget?.toLocaleString() || 'N/A'} MAD</Typography>
              <Typography variant="caption"><strong>📏 Surface :</strong> {user.surfaceMin || 'N/A'} m²</Typography>
              <Typography variant="caption"><strong>📍 Villes :</strong> {user.villePrefs?.join(', ') || 'N/A'}</Typography>
          </Box>
        </Paper>

        {/* --- BLOC 2 : FORMULAIRE DES PRÉFÉRENCES (EN DESSOUS) --- */}
        <Box sx={{ width: '100%', maxWidth: 700 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={900}>Modifier mes critères</Typography>
            <Typography variant="body2" color="text.secondary">
              Mettez à jour vos informations pour affiner les recommandations de l'IA.
            </Typography>
          </Box>

          <Paper 
            elevation={0} 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget Maximum"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><WalletIcon fontSize="small" /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">MAD</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Surface Minimum"
                  value={formData.surfaceMin}
                  onChange={(e) => setFormData({...formData, surfaceMin: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SurfaceIcon fontSize="small" /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">m²</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quartiers préférés"
                  placeholder="Ex: Maârif, Agdal..."
                  value={formData.preferencesLocation}
                  onChange={(e) => setFormData({...formData, preferencesLocation: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><MapIcon fontSize="small" /></InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Villes préférées"
                  placeholder="Casablanca, Rabat..."
                  value={formData.villePrefs}
                  onChange={(e) => setFormData({...formData, villePrefs: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><CityIcon fontSize="small" /></InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  type="submit"
                  disabled={updating}
                  startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ py: 1.8, borderRadius: 3, fontWeight: 700, mt: 1 }}
                >
                  {updating ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>

      </Stack>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
          Profil mis à jour avec succès !
        </Alert>
      </Snackbar>
    </Container>
  );
}