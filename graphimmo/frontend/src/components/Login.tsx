// // src/components/Login.tsx
// import { useState } from 'react'
// import { useMutation } from '@apollo/client/react'
// import { gql } from '@apollo/client'
// import { Link, useNavigate } from 'react-router-dom'

// const LOGIN = gql`
//   mutation Login($email: String!, $password: String!) {
//     login(email: $email, password: $password)
//   }
// `

// export default function Login() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [login, { loading, error }] = useMutation(LOGIN)
//   const navigate = useNavigate()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const { data } = await login({ variables: { email, password } })
//       localStorage.setItem('token', data.login)
//       localStorage.setItem('userEmail', email)
//       navigate('/')
//       window.location.reload() // Refresh Apollo headers
//     } catch (err: any) {
//       console.error(err)
//     }
//   }

//   return (
//     <div style={{ 
//       maxWidth: '400px', 
//       margin: '80px auto', 
//       padding: '32px', 
//       borderRadius: '12px',
//       boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//       background: 'white'
//     }}>
//       <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Connexion</h2>
      
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '20px' }}>
//           <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//             Email
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={{
//               width: '100%', 
//               padding: '12px 16px', 
//               border: '1px solid #d1d5db',
//               borderRadius: '8px',
//               fontSize: '16px'
//             }}
//             placeholder="ayman@emsi.ma"
//             required
//           />
//         </div>

//         <div style={{ marginBottom: '24px' }}>
//           <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
//             Mot de passe
//           </label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             style={{
//               width: '100%', 
//               padding: '12px 16px', 
//               border: '1px solid #d1d5db',
//               borderRadius: '8px',
//               fontSize: '16px'
//             }}
//             placeholder="••••••••"
//             required
//           />
//         </div>

//         {error && (
//           <div style={{
//             marginBottom: '16px',
//             padding: '12px',
//             background: '#fef2f2',
//             border: '1px solid #fecaca',
//             borderRadius: '8px',
//             color: '#dc2626'
//           }}>
//             {error.message}
//           </div>
//         )}

//         <button 
//           type="submit" 
//           disabled={loading}
//           style={{ 
//             width: '100%', 
//             padding: '14px', 
//             background: '#3b82f6', 
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             fontSize: '16px',
//             fontWeight: 500,
//             cursor: loading ? 'not-allowed' : 'pointer'
//           }}
//         >
//           {loading ? 'Connexion...' : 'Se connecter'}
//         </button>
//       </form>

//       <div style={{ textAlign: 'center', marginTop: '24px' }}>
//         <Link 
//           to="/register" 
//           style={{ 
//             color: '#3b82f6', 
//             textDecoration: 'none',
//             fontWeight: 500
//           }}
//         >
//           Créer un compte
//         </Link>
//       </div>
//     </div>
//   )
// }
// src/components/Login.tsx
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
  alpha
} from '@mui/material'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

// Palette de couleurs personnalisée pour une esthétique "Premium"
const BRAND_COLORS = {
  primary: '#4F46E5', // Indigo moderne
  secondary: '#7C3AED', // Violet vibrant
  bgGradient: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)'
}

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 4,
  background: '#ffffff',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  maxWidth: 460,
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
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    '& fieldset': {
      borderColor: alpha(theme.palette.divider, 0.1),
    },
    '&:hover fieldset': {
      borderColor: BRAND_COLORS.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: BRAND_COLORS.primary,
      borderWidth: '2px',
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: BRAND_COLORS.primary,
  }
}))

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.8),
  borderRadius: theme.shape.borderRadius * 1.5,
  fontSize: '1rem',
  fontWeight: 700,
  textTransform: 'none',
  background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%)`,
  color: '#fff',
  boxShadow: `0 10px 15px -3px ${alpha(BRAND_COLORS.primary, 0.4)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 20px 25px -5px ${alpha(BRAND_COLORS.primary, 0.4)}`,
    filter: 'brightness(1.1)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: theme.palette.action.disabledBackground,
    boxShadow: 'none'
  }
}))

const RegisterLink = styled(Link)(({ theme }) => ({
  color: BRAND_COLORS.primary,
  textDecoration: 'none',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  '&:hover': {
    textDecoration: 'underline',
    color: BRAND_COLORS.secondary,
  }
}))

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [login, { loading, error }] = useMutation(LOGIN)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await login({ variables: { email, password } })
      localStorage.setItem('token', data.login)
      localStorage.setItem('userEmail', email)
      navigate('/')
      setTimeout(() => window.location.reload(), 100)
    } catch (err) {
      console.error('Erreur login:', err)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: BRAND_COLORS.bgGradient,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Éléments décoratifs en arrière-plan */}
      <Box sx={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(BRAND_COLORS.primary, 0.1)} 0%, transparent 70%)`
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -100,
        left: -100,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(BRAND_COLORS.secondary, 0.1)} 0%, transparent 70%)`
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={800}>
          <LoginPaper elevation={0}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: `0 10px 20px ${alpha(BRAND_COLORS.primary, 0.3)}`
                }}
              >
                <LoginIcon sx={{ fontSize: 32, color: '#fff' }} />
              </Box>
              <Typography variant="h4" component="h1" fontWeight="800" letterSpacing="-0.5px" gutterBottom>
                Ravi de vous revoir
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="500">
                Connectez-vous pour gérer vos propriétés
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <StyledTextField
                  fullWidth
                  label="Adresse email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@emsi.ma"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: BRAND_COLORS.primary, fontSize: 20 }} />
                      </InputAdornment>
                    )
                  }}
                />

                <StyledTextField
                  fullWidth
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: BRAND_COLORS.primary, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {error && (
                  <Fade in>
                    <Alert 
                      severity="error" 
                      variant="outlined"
                      sx={{ borderRadius: 2, borderColor: alpha('#d32f2f', 0.2), bgcolor: alpha('#d32f2f', 0.02) }}
                    >
                      {error.message.includes('invalid') ? 'Email ou mot de passe incorrect' : error.message}
                    </Alert>
                  </Fade>
                )}

                <SubmitButton
                  type="submit"
                  disabled={loading}
                  fullWidth
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                >
                  {loading ? 'Authentification...' : 'Se connecter'}
                </SubmitButton>
              </Stack>

              <Divider sx={{ my: 4 }}>
                <Typography variant="caption" color="text.disabled" fontWeight="700" sx={{ textTransform: 'uppercase' }}>
                  Ou
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" fontWeight="500">
                  Pas encore de compte ? {' '}
                  <RegisterLink to="/register">
                    Créer un compte
                  </RegisterLink>
                </Typography>
              </Box>
            </form>
          </LoginPaper>
        </Fade>
      </Container>
    </Box>
  )
}

// Remplacement du Stack importé
import { Stack } from '@mui/material'