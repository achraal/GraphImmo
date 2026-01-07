import { useQuery, useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useEffect, useState } from 'react'

const GET_ME = gql`
  query GetMe {
    me(token: "${localStorage.getItem('token') || ''}") {
      id nom prenom email role budget surfaceMin preferencesLocation villePrefs
    }
  }
`

const UPDATE_PROFIL = gql`
  mutation UpdateProfil($input: UserUpdateInput!) {
    updateProfil(input: $input, token: "${localStorage.getItem('token') || ''}") {
      id budget surfaceMin preferencesLocation villePrefs
    }
  }
`

export default function Profil() {
  const [formData, setFormData] = useState({
    budget: '',
    surfaceMin: '',
    preferencesLocation: '',
    villePrefs: ''
  })

  const { data, loading, refetch } = useQuery(GET_ME)
  const [updateProfil, { loading: updating }] = useMutation(UPDATE_PROFIL)

  useEffect(() => {
    if (data?.me) {
      const user = data.me
      setFormData({
        budget: user.budget?.toString() || '',
        surfaceMin: user.surfaceMin?.toString() || '',
        preferencesLocation: user.preferencesLocation || '',
        villePrefs: user.villePrefs?.join(', ') || ''
      })
    }
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfil({
        variables: {
          input: {
            budget: formData.budget ? parseFloat(formData.budget) : null,
            surfaceMin: formData.surfaceMin ? parseInt(formData.surfaceMin) : null,
            preferencesLocation: formData.preferencesLocation || null,
            villePrefs: formData.villePrefs ? formData.villePrefs.split(',').map(s => s.trim()) : null
          }
        }
      })
      alert('Profil mis à jour !')
      refetch()
    } catch (error: any) {
      alert('Erreur: ' + error.message)
    }
  }

  if (loading) return <div>Chargement...</div>
  if (!data?.me) return <div>Profil non trouvé</div>

  const user = data.me

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '32px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: 'white' }}>
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Mon Profil</h2>
      
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
        marginBottom: '32px', padding: '20px', background: '#f8fafc',
        borderRadius: '8px'
      }}>
        <div>
          <strong>Identifiants :</strong><br/>
          ID: {user.id}<br/>
          Email: {user.email}<br/>
          Rôle: {user.role}
        </div>
        <div>
          <strong>Préférences actuelles :</strong><br/>
          Budget: {user.budget?.toLocaleString()} MAD<br/>
          Surface min: {user.surfaceMin} m²<br/>
          Localisation: {user.preferencesLocation}<br/>
          Villes: {user.villePrefs?.join(', ')}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Budget max (MAD)
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              style={{
                width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
                borderRadius: '8px', fontSize: '16px'
              }}
              placeholder="250000"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Surface min (m²)
            </label>
            <input
              type="number"
              value={formData.surfaceMin}
              onChange={(e) => setFormData({...formData, surfaceMin: e.target.value})}
              style={{
                width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
                borderRadius: '8px', fontSize: '16px'
              }}
              placeholder="80"
            />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Localisation préférée
          </label>
          <input
            type="text"
            value={formData.preferencesLocation}
            onChange={(e) => setFormData({...formData, preferencesLocation: e.target.value})}
            style={{
              width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
              borderRadius: '8px', fontSize: '16px'
            }}
            placeholder="Casablanca Maarif, Rabat Agdal..."
          />
        </div>
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Villes préférées (séparées par virgules)
          </label>
          <input
            type="text"
            value={formData.villePrefs}
            onChange={(e) => setFormData({...formData, villePrefs: e.target.value})}
            style={{
              width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
              borderRadius: '8px', fontSize: '16px'
            }}
            placeholder="Casablanca, Rabat, Marrakech"
          />
        </div>

        {updating && (
          <div style={{
            marginBottom: '16px', padding: '12px', background: '#ecfdf5',
            border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534'
          }}>
            Sauvegarde en cours...
          </div>
        )}

        <button 
          type="submit" 
          disabled={updating}
          style={{ 
            width: '100%', padding: '16px', background: '#059669', color: 'white',
            border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600,
            cursor: updating ? 'not-allowed' : 'pointer'
          }}
        >
          {updating ? 'Sauvegarde...' : 'Mettre à jour mon profil'}
        </button>
      </form>
    </div>
  )
}
