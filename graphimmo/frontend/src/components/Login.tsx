// src/components/Login.tsx
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, { loading, error }] = useMutation(LOGIN)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await login({ variables: { email, password } })
      localStorage.setItem('token', data.login)
      localStorage.setItem('userEmail', email)
      navigate('/')
      window.location.reload() // Refresh Apollo headers
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '80px auto', 
      padding: '32px', 
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      background: 'white'
    }}>
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Connexion</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%', 
              padding: '12px 16px', 
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            placeholder="ayman@emsi.ma"
            required
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%', 
              padding: '12px 16px', 
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626'
          }}>
            {error.message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '14px', 
            background: '#3b82f6', 
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Link 
          to="/register" 
          style={{ 
            color: '#3b82f6', 
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          Créer un compte
        </Link>
      </div>
    </div>
  )
}
