// // src/components/Register.tsx
// import { useState } from 'react'
// import { useMutation } from '@apollo/client/react'
// import { gql } from '@apollo/client'
// import { Link, useNavigate } from 'react-router-dom'

// const REGISTER = gql`
//   mutation Register($input: UserCreateInput!) {
//     register(input: $input)
//   }
// `

// export default function Register() {
//   const [formData, setFormData] = useState({
//     nom: '',
//     prenom: '',
//     email: '',
//     password: '',
//     budget: '',
//     preferencesLocation: ''
//   })
//   const [register, { loading, error }] = useMutation(REGISTER)
//   const navigate = useNavigate()

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault()
//   try {
//     const { data } = await register({  // Récupère data
//       variables: {
//         input: {
//           nom: formData.nom,
//           prenom: formData.prenom,
//           email: formData.email,
//           password: formData.password,
//           budget: formData.budget ? parseFloat(formData.budget) : null,
//           preferencesLocation: formData.preferencesLocation || null,  // Corrige nom
//           surfaceMin: null,
//           villePrefs: null
//         }
//       }
//     })
    
//     localStorage.setItem('token', data.register)  // Sauvegarde token
//     localStorage.setItem('userEmail', formData.email)  // Sauvegarde email
//     navigate('/login')
//   } catch (err: any) {
//     console.error(err)
//   }
// }


//   const updateField = (field: keyof typeof formData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }))
//   }

//   return (
//     <div style={{ 
//       maxWidth: '450px', 
//       margin: '80px auto', 
//       padding: '32px', 
//       borderRadius: '12px',
//       boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//       background: 'white'
//     }}>
//       <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Inscription</h2>
      
//       <form onSubmit={handleSubmit}>
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
//           <div>
//             <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//               Nom
//             </label>
//             <input
//               type="text"
//               value={formData.nom}
//               onChange={(e) => updateField('nom', e.target.value)}
//               style={{
//                 width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
//                 borderRadius: '8px', fontSize: '16px'
//               }}
//               required
//             />
//           </div>
//           <div>
//             <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//               Prénom
//             </label>
//             <input
//               type="text"
//               value={formData.prenom}
//               onChange={(e) => updateField('prenom', e.target.value)}
//               style={{
//                 width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
//                 borderRadius: '8px', fontSize: '16px'
//               }}
//               required
//             />
//           </div>
//         </div>

//         <div style={{ marginBottom: '20px' }}>
//           <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//             Email
//           </label>
//           <input
//             type="email"
//             value={formData.email}
//             onChange={(e) => updateField('email', e.target.value)}
//             style={{
//               width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
//               borderRadius: '8px', fontSize: '16px'
//             }}
//             placeholder="nom@exemple.ma"
//             required
//           />
//         </div>

//         <div style={{ marginBottom: '20px' }}>
//           <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//             Mot de passe
//           </label>
//           <input
//             type="password"
//             value={formData.password}
//             onChange={(e) => updateField('password', e.target.value)}
//             style={{
//               width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
//               borderRadius: '8px', fontSize: '16px'
//             }}
//             placeholder="••••••••"
//             minLength={6}
//             required
//           />
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
//           <div>
//             <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//               Budget max (optionnel)
//             </label>
//             <input
//               type="number"
//               value={formData.budget}
//               onChange={(e) => updateField('budget', e.target.value)}
//               style={{
//                 width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
//                 borderRadius: '8px', fontSize: '16px'
//               }}
//               placeholder="250000"
//             />
//           </div>
//           <div>
//             <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//               Localisation préférée
//             </label>
//             <input
//               type="text"
//               value={formData.preferencesLocation}
//               onChange={(e) => updateField('preferencesLocation', e.target.value)}
//               style={{
//                 width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
//                 borderRadius: '8px', fontSize: '16px'
//               }}
//               placeholder="Casablanca, Rabat..."
//             />
//           </div>
//         </div>

//         {error && (
//           <div style={{
//             marginBottom: '20px',
//             padding: '12px 16px',
//             background: '#fef2f2',
//             border: '1px solid #fecaca',
//             borderRadius: '8px',
//             color: '#dc2626'
//           }}>
//             {error.message.includes('Email déjà utilisé') 
//               ? 'Cet email est déjà utilisé' 
//               : error.message
//             }
//           </div>
//         )}

//         <button 
//           type="submit" 
//           disabled={loading}
//           style={{ 
//             width: '100%', 
//             padding: '14px', 
//             background: '#10b981', 
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             fontSize: '16px',
//             fontWeight: 500,
//             cursor: loading ? 'not-allowed' : 'pointer'
//           }}
//         >
//           {loading ? 'Inscription...' : 'S\'inscrire'}
//         </button>
//       </form>

//       <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
//         <Link 
//           to="/login" 
//           style={{ 
//             color: '#3b82f6', 
//             textDecoration: 'none',
//             fontWeight: 500
//           }}
//         >
//           Déjà un compte ? Se connecter
//         </Link>
//       </div>
//     </div>
//   )
// }

// src/components/Register.tsx
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  IconButton,
  Fade,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Stack,
  alpha
} from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  MonetizationOn as MonetizationOnIcon,
  LocationOn as LocationOnIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as PersonAddIcon,
  Login as LoginIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const REGISTER = gql`
  mutation Register($input: UserCreateInput!) {
    register(input: $input)
  }
`

// Palette de couleurs héritée du Login
const BRAND_COLORS = {
  primary: '#4F46E5',
  secondary: '#7C3AED',
  bgGradient: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)'
}

const RegisterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 4,
  background: '#ffffff',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  maxWidth: 550,
  margin: '0 auto',
  border: `1px solid ${alpha(BRAND_COLORS.primary, 0.08)}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    background: `linear-gradient(90deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary})`,
  }
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    '& fieldset': { borderColor: alpha(theme.palette.divider, 0.1) },
    '&:hover fieldset': { borderColor: BRAND_COLORS.primary },
    '&.Mui-focused fieldset': { borderColor: BRAND_COLORS.primary, borderWidth: '2px' }
  },
  '& .MuiInputLabel-root.Mui-focused': { color: BRAND_COLORS.primary }
}))

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius * 1.5,
  fontWeight: 700,
  textTransform: 'none',
  background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%)`,
  color: '#fff',
  boxShadow: `0 10px 15px -3px ${alpha(BRAND_COLORS.primary, 0.4)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 20px 25px -5px ${alpha(BRAND_COLORS.primary, 0.4)}`,
    filter: 'brightness(1.1)',
  }
}))

const steps = ['Identité', 'Sécurité', 'Préférences'];

export default function Register() {
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    budget: '',
    preferencesLocation: ''
  })
  
  const [register, { loading, error }] = useMutation(REGISTER)
  const navigate = useNavigate()

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await register({
        variables: {
          input: {
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            password: formData.password,
            budget: formData.budget ? parseFloat(formData.budget) : null,
            preferencesLocation: formData.preferencesLocation || null,
          }
        }
      })
      localStorage.setItem('token', data.register)
      localStorage.setItem('userEmail', formData.email)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      console.error('Erreur inscription:', err)
    }
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth label="Nom" value={formData.nom}
                onChange={(e) => updateField('nom', e.target.value)}
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{color: BRAND_COLORS.primary}} /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth label="Prénom" value={formData.prenom}
                onChange={(e) => updateField('prenom', e.target.value)}
                required
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{color: BRAND_COLORS.primary}} /></InputAdornment> }}
              />
            </Grid>
          </Grid>
        )
      case 1:
        return (
          <Stack spacing={2}>
            <StyledTextField
              fullWidth label="Adresse email" type="email" value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="exemple@emsi.ma" required
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{color: BRAND_COLORS.primary}} /></InputAdornment> }}
            />
            <StyledTextField
              fullWidth label="Mot de passe" type={showPassword ? 'text' : 'password'}
              value={formData.password} onChange={(e) => updateField('password', e.target.value)}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{color: BRAND_COLORS.primary}} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        )
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth label="Budget (MAD)" type="number" value={formData.budget}
                onChange={(e) => updateField('budget', e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><MonetizationOnIcon sx={{color: BRAND_COLORS.primary}} /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth label="Ville" value={formData.preferencesLocation}
                onChange={(e) => updateField('preferencesLocation', e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{color: BRAND_COLORS.primary}} /></InputAdornment> }}
              />
            </Grid>
          </Grid>
        )
      default: return null
    }
  }

  const isStepValid = () => {
    if (activeStep === 0) return formData.nom.trim() !== '' && formData.prenom.trim() !== ''
    if (activeStep === 1) return formData.email.trim() !== '' && formData.password.length >= 6
    return true
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: BRAND_COLORS.bgGradient, py: 4 }}>
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <RegisterPaper elevation={0}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{
                width: 64, height: 64, borderRadius: 2, background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 10px 20px ${alpha(BRAND_COLORS.primary, 0.3)}`
              }}>
                <PersonAddIcon sx={{ fontSize: 32, color: '#fff' }} />
              </Box>
              <Typography variant="h4" fontWeight="800" sx={{fontFamily: 'Roboto'}}>Inscription</Typography>
              <Typography variant="body2" color="text.secondary">Rejoignez notre communauté immobilière</Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 4, '& .MuiStepIcon-root.Mui-active': { color: BRAND_COLORS.primary }, '& .MuiStepIcon-root.Mui-completed': { color: BRAND_COLORS.secondary } }}>
              {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
            </Stepper>

            <form onSubmit={handleSubmit}>
              <Box sx={{ minHeight: '140px', mb: 4 }}>{getStepContent(activeStep)}</Box>

              {error && (
                <Alert severity="error" variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                  {error.message.includes('Email') ? 'Email déjà utilisé' : error.message}
                </Alert>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Button
                  disabled={activeStep === 0 || loading}
                  onClick={() => setActiveStep(s => s - 1)}
                  startIcon={<ArrowBackIcon />}
                  sx={{ color: 'text.secondary', fontWeight: 700 }}
                >
                  Retour
                </Button>

                {activeStep === steps.length - 1 ? (
                  <SubmitButton type="submit" disabled={loading || !isStepValid()} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}>
                    {loading ? 'Création...' : 'Terminer'}
                  </SubmitButton>
                ) : (
                  <Button
                    variant="contained" onClick={() => setActiveStep(s => s + 1)}
                    disabled={!isStepValid()} endIcon={<ArrowForwardIcon />}
                    sx={{ borderRadius: 2, px: 4, bgcolor: BRAND_COLORS.primary, '&:hover': { bgcolor: BRAND_COLORS.secondary } }}
                  >
                    Suivant
                  </Button>
                )}
              </Box>

              <Divider sx={{ my: 4 }}>
                <Typography variant="caption" color="text.disabled" fontWeight="700">DÉJÀ MEMBRE ?</Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Link to="/login" style={{ textDecoration: 'none', color: BRAND_COLORS.primary, fontWeight: 700, fontSize: '0.9rem' }}>
                  Se connecter à mon compte
                </Link>
              </Box>
            </form>
          </RegisterPaper>
        </Fade>
      </Container>
    </Box>
  )
}