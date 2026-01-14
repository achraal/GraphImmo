// src/components/Register.tsx
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'

const REGISTER = gql`
  mutation Register($input: UserCreateInput!) {
    register(input: $input)
  }
`

export default function Register() {
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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    const { data } = await register({  // Récupère data
      variables: {
        input: {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          password: formData.password,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          preferencesLocation: formData.preferencesLocation || null,  // Corrige nom
          surfaceMin: null,
          villePrefs: null
        }
      }
    })
    
    localStorage.setItem('token', data.register)  // Sauvegarde token
    localStorage.setItem('userEmail', formData.email)  // Sauvegarde email
    navigate('/login')
  } catch (err: any) {
    console.error(err)
  }
}


  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div style={{ 
      maxWidth: '450px', 
      margin: '80px auto', 
      padding: '32px', 
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      background: 'white'
    }}>
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Inscription</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Nom
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => updateField('nom', e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
                borderRadius: '8px', fontSize: '16px'
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Prénom
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => updateField('prenom', e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
                borderRadius: '8px', fontSize: '16px'
              }}
              required
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
              borderRadius: '8px', fontSize: '16px'
            }}
            placeholder="nom@exemple.ma"
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
              borderRadius: '8px', fontSize: '16px'
            }}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Budget max (optionnel)
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => updateField('budget', e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
                borderRadius: '8px', fontSize: '16px'
              }}
              placeholder="250000"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Localisation préférée
            </label>
            <input
              type="text"
              value={formData.preferencesLocation}
              onChange={(e) => updateField('preferencesLocation', e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
                borderRadius: '8px', fontSize: '16px'
              }}
              placeholder="Casablanca, Rabat..."
            />
          </div>
        </div>

        {error && (
          <div style={{
            marginBottom: '20px',
            padding: '12px 16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626'
          }}>
            {error.message.includes('Email déjà utilisé') 
              ? 'Cet email est déjà utilisé' 
              : error.message
            }
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '14px', 
            background: '#10b981', 
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
        <Link 
          to="/login" 
          style={{ 
            color: '#3b82f6', 
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          Déjà un compte ? Se connecter
        </Link>
      </div>
    </div>
  )
}

