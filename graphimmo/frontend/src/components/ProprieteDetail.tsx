// // src/components/ProprieteDetail.tsx
// import { useQuery, useMutation} from '@apollo/client/react'
// import { gql} from '@apollo/client'
// import { useParams, useNavigate } from 'react-router-dom'


// const GET_PROPRIETE_DETAIL = gql`
//   query ProprieteComplete($id: String!, $token: String) {  // + $token
//     proprieteDetail(id: $id, token: $token) {
//       id
//       titre
//       prix
//       adresse
//       description
//       surface
//       chambres
//       lat
//       lon
//       photos {
//         url
//         angle
//       }
//       amenagements {
//         id
//         type
//         qualite
//       }
//       localisation {
//         id
//         commune
//         region
//         prixM2
//         securite
//       }
//       agence {
//         id
//         nom
//         adresse
//         email
//         telephone
//       }
//       dateDepot
//       prixM2Local
//     }
//   }
// `
// const AJOUTER_FAVORI = gql`mutation AjouterFavori($proprieteId: String!, $token: String!, $note: String) { ajouterFavori(proprieteId: $proprieteId, token: $token, note: $note) }`
// const EST_FAVORI = gql`query EstFavori($proprieteId: String!, $token: String!) { estFavori(proprieteId: $proprieteId, token: $token) }`


// export default function ProprieteDetail() {
//   const { id } = useParams<{ id: string }>()
//     const navigate = useNavigate()
//   const token = localStorage.getItem('token')

//   const [ajouterFavori, { loading: loadingFavori }] = useMutation(AJOUTER_FAVORI)
//   const { data: favoriData } = useQuery(EST_FAVORI, { variables: { proprieteId: id!, token: token || '' }, skip: !id || !token })
//   const isFavori = favoriData?.estFavori || false

//   const { data, loading, error } = useQuery(GET_PROPRIETE_DETAIL, {
//     variables: { id: id || '', token: token || '' },
//     skip: !id,
//   })


//   if (loading) return <div>Chargement détails...</div>
//   if (error || !data?.proprieteDetail) 
//     return <div>Propriété introuvable ou erreur</div>

//   const prop = data.proprieteDetail

//   const handleFavori = async () => {
//   if (!token) { navigate('/login'); return }
//     await ajouterFavori({ variables: { proprieteId: id!, token }, refetchQueries: ['EstFavori'] })
//   }


//   return (
//     <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
//       {/* En-tête */}
//       <h1 style={{ color: '#1e3a8a', marginBottom: '16px' }}>{prop.titre}</h1>
      
//       {/* Infos principales */}
//       <div style={{ 
//         background: '#f8fafc', 
//         padding: '20px', 
//         borderRadius: '12px', 
//         marginBottom: '24px' 
//       }}>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
//           <div><strong>Prix :</strong> {prop.prix.toLocaleString('fr-MA')} MAD</div>
//           <div><strong>Surface :</strong> {prop.surface} m²</div>
//           <div><strong>Chambres :</strong> {prop.chambres}</div>
//           <div><strong>Adresse :</strong> {prop.adresse}</div>
//           {prop.prixM2Local && <div><strong>Prix m² local :</strong> {prop.prixM2Local} MAD</div>}
//           {prop.dateDepot && <div><strong>Dépôt :</strong> {new Date(prop.dateDepot).toLocaleDateString('fr-MA')}</div>}
//         </div>
//       </div>

//       {/* Photos */}
//       {prop.photos.length > 0 && (
//         <section style={{ marginBottom: '24px' }}>
//           <h2>Photos</h2>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
//             {prop.photos.map((photo, i) => (
//               <img 
//                 key={`${prop.id}-${i}`}
//                 src={photo.url} 
//                 alt={`Photo ${photo.angle}`}
//                 style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
//               />
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Description */}
//       <section style={{ marginBottom: '24px' }}>
//         <h2>Description</h2>
//         <p>{prop.description}</p>
//       </section>

//       {/* Aménagements */}
//       {prop.amenagements.length > 0 && (
//         <section style={{ marginBottom: '24px' }}>
//           <h2>Aménagements</h2>
//           <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
//             {prop.amenagements.map(amen => (
//               <li key={amen.id}>
//                 <strong>{amen.type}</strong> ({amen.qualite})
//               </li>
//             ))}
//           </ul>
//         </section>
//       )}

//       {/* Localisation */}
//       {prop.localisation && (
//         <section style={{ marginBottom: '24px', background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
//           <h2>Localisation</h2>
//           <div>
//             <strong>Commune :</strong> {prop.localisation.commune}<br/>
//             <strong>Région :</strong> {prop.localisation.region}<br/>
//             <strong>Prix m² :</strong> {prop.localisation.prixM2} MAD<br/>
//             <strong>Sécurité :</strong> {prop.localisation.securite}
//           </div>
//         </section>
//       )}

//       {/* Agence */}
//       {prop.agence && (
//         <section style={{ marginBottom: '24px', background: '#f0fdf4', padding: '16px', borderRadius: '8px' }}>
//           <h2>Agence</h2>
//           <div>
//             <strong>{prop.agence.nom}</strong><br/>
//             {prop.agence.adresse}<br/>
//             📧 {prop.agence.email}<br/>
//             📞 {prop.agence.telephone}
//           </div>
//         </section>
//       )}
//         <div style={{ position: 'sticky', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', display: 'flex', gap: '12px', justifyContent: 'center' }}>
//     <button onClick={handleFavori} disabled={loadingFavori} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: isFavori ? '#ef4444' : '#10b981', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '16px' }}>
//       {loadingFavori ? '...' : (isFavori ? '❤️ Retirer' : '💚 Favori')}
//     </button>
//   </div>

//     </div>
//   )
// }
// src/components/ProprieteDetail.tsx COMPLET corrigé


import { useQuery, useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'

const GET_PROPRIETE_DETAIL = gql`
  query ProprieteComplete($id: String!, $token: String) {
    proprieteDetail(id: $id, token: $token) {
      id
      titre
      prix
      adresse
      description
      surface
      chambres
      lat
      lon
      photos {
        url
        angle
      }
      amenagements {
        id
        type
        qualite
      }
      localisation {
        id
        commune
        region
        prixM2
        securite
      }
      agence {
        id
        nom
        adresse
        email
        telephone
      }
      dateDepot
      prixM2Local
    }
  }
`

const AJOUTER_FAVORI = gql`mutation AjouterFavori($proprieteId: String!, $token: String!, $note: String) { 
  ajouterFavori(proprieteId: $proprieteId, token: $token, note: $note) 
}`

const EST_FAVORI = gql`query EstFavori($proprieteId: String!, $token: String!) { 
  estFavori(proprieteId: $proprieteId, token: $token) 
}`

const RETIRER_FAVORI = gql`mutation RetirerFavori($proprieteId: String!, $token: String!) { 
  retirerFavori(proprieteId: $proprieteId, token: $token) 
}`

export default function ProprieteDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  // Token réactif pour éviter stale closure
  const [token, setToken] = useState('')
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token') || ''
      setToken(storedToken)
    }
  }, [])

  // Écoute changements localStorage (autres tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        setToken(e.newValue || '')
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const { data, loading, error, refetch } = useQuery(GET_PROPRIETE_DETAIL, {
    variables: { id: id || '', token },
    skip: !id || !token,
  })

  const [ajouterFavori, { loading: loadingFavori }] = useMutation(AJOUTER_FAVORI, {
    refetchQueries: [
      EST_FAVORI,
      GET_PROPRIETE_DETAIL,  // Refresh détails si besoin
    ],
  })
  const [retirerFavori] = useMutation(RETIRER_FAVORI)

  const { data: favoriData } = useQuery(EST_FAVORI, { 
    variables: { proprieteId: id || '', token }, 
    skip: !id || !token 
  })
  const isFavori = favoriData?.estFavori || false


  const handleFavori = useCallback(async () => {
  if (!token || !id) { 
    alert('Connectez-vous pour gérer les favoris')
    navigate('/login') 
    return 
  }
  try {
    if (isFavori) {
      // Retire
      await retirerFavori({ 
        variables: { proprieteId: id, token },
        refetchQueries: [EST_FAVORI],
      })
    } else {
      // Ajoute
      await ajouterFavori({ 
        variables: { proprieteId: id, token, note: '' },
        refetchQueries: [EST_FAVORI],
      })
    }
  } catch (e) {
    alert('Erreur favori')
  }
}, [isFavori, ajouterFavori, retirerFavori, id, token, navigate])

  if (loading) return <div>Chargement détails...</div>
  if (error || !data?.proprieteDetail) 
    return <div>Propriété introuvable ou erreur</div>

  const prop = data.proprieteDetail

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      {/* En-tête */}
      <h1 style={{ color: '#1e3a8a', marginBottom: '16px' }}>{prop.titre}</h1>
      
      {/* AJOUTER L'ID ICI */}
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      marginBottom: '16px',
      padding: '12px',
      background: '#f0f9ff',
      borderRadius: '8px',
      border: '1px solid #bae6fd'
    }}>
      <span style={{ 
        fontWeight: 600, 
        color: '#0369a1',
        fontSize: '14px'
      }}>
        🏷️ ID : <code style={{ 
          background: '#e0f2fe', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '15px',
          color: '#075985',
          userSelect: 'all'  // Permet de sélectionner facilement
        }}>{prop.id}</code>
      </span>
      <button
        onClick={() => {
          navigator.clipboard.writeText(prop.id)
          alert('ID copié dans le presse-papier !')
        }}
        style={{
          padding: '6px 12px',
          background: '#0ea5e9',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500
        }}
      >
        📋 Copier
      </button>
    </div>
    
    {/* Infos principales */}
    <div style={{ 
      background: '#f8fafc', 
      padding: '20px', 
      borderRadius: '12px', 
      marginBottom: '24px' 
    }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div><strong>Prix :</strong> {prop.prix.toLocaleString('fr-MA')} MAD</div>
          <div><strong>Surface :</strong> {prop.surface} m²</div>
          <div><strong>Chambres :</strong> {prop.chambres}</div>
          <div><strong>Adresse :</strong> {prop.adresse}</div>
          {prop.prixM2Local && <div><strong>Prix m² local :</strong> {prop.prixM2Local} MAD</div>}
          {prop.dateDepot && <div><strong>Dépôt :</strong> {new Date(prop.dateDepot).toLocaleDateString('fr-MA')}</div>}
        </div>
      </div>

      {/* Photos */}
      {prop.photos?.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2>Photos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
            {prop.photos.map((photo, i) => (
              <img 
                key={`${prop.id}-${i}`}
                src={photo.url} 
                alt={`Photo ${photo.angle || i + 1}`}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      <section style={{ marginBottom: '24px' }}>
        <h2>Description</h2>
        <p>{prop.description}</p>
      </section>

      {/* Aménagements */}
      {prop.amenagements?.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2>Aménagements</h2>
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
            {prop.amenagements.map(amen => (
              <li key={amen.id}>
                <strong>{amen.type}</strong> ({amen.qualite})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Localisation */}
      {prop.localisation && (
        <section style={{ marginBottom: '24px', background: '#f0f9ff', padding: '16px', borderRadius: '8px' }}>
          <h2>Localisation</h2>
          <div>
            <strong>Commune :</strong> {prop.localisation.commune}<br/>
            <strong>Région :</strong> {prop.localisation.region}<br/>
            <strong>Prix m² :</strong> {prop.localisation.prixM2} MAD<br/>
            <strong>Sécurité :</strong> {prop.localisation.securite}
          </div>
        </section>
      )}

      {/* Agence */}
      {prop.agence && (
        <section style={{ marginBottom: '24px', background: '#f0fdf4', padding: '16px', borderRadius: '8px' }}>
          <h2>Agence</h2>
          <div>
            <strong>{prop.agence.nom}</strong><br/>
            {prop.agence.adresse}<br/>
            📧 {prop.agence.email}<br/>
            📞 {prop.agence.telephone}
          </div>
        </section>
      )}

      {/* BOUTONS ACTIONS */}
      <div style={{ 
        position: 'sticky', bottom: '20px', left: '50%', 
        transform: 'translateX(-50%)', 
        background: 'white', padding: '16px', borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 10,
        display: 'flex', gap: '12px', justifyContent: 'center'
      }}>
        <button 
          onClick={handleFavori}
          disabled={loadingFavori}
          style={{
            padding: '12px 24px', borderRadius: '8px', border: 'none',
            background: isFavori ? '#ef4444' : '#10b981',
            color: 'white', fontWeight: 600, cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loadingFavori ? '...' : (isFavori ? '❤️ Retirer favori' : '💚 Ajouter favori')}
        </button>
        {!token && (
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 24px', borderRadius: '8px', border: '1px solid #3b82f6',
              background: 'white', color: '#3b82f6', fontWeight: 600, cursor: 'pointer'
            }}
          >
            🔑 Se connecter
          </button>
        )}
      </div>
    </div>
  )
}
