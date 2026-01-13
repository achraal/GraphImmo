// import { useQuery } from '@apollo/client/react'
// import { gql } from '@apollo/client'
// import { useNavigate } from 'react-router-dom'

// const DASHBOARD_PERSONNEL = gql`
//   query DashboardPersonnel($token: String!) {
//     dashboardPersonnel(token: $token) {
//       favoris {
//         proprieteId
//         dateAjout
//         note
//       }
//       visites {
//         id
//         dateVisite
//         impression
//         prixPropose
//       }
//       nbFavoris
//       nbVisites
//     }
//   }
// `


// export default function Dashboard() {
//   const navigate = useNavigate()
//   const token = localStorage.getItem('token') || ''

//   const { data, loading, error, refetch } = useQuery(DASHBOARD_PERSONNEL, {
//     variables: { token },
//     skip: !token,
//   })

//   if (!token) {
//     return (
//       <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
//         <h1>🔐 Dashboard Personnel</h1>
//         <p>Connectez-vous pour voir vos favoris et visites</p>
//         <button 
//           onClick={() => navigate('/login')}
//           style={{
//             padding: '12px 32px', borderRadius: '8px', border: 'none',
//             background: '#3b82f6', color: 'white', fontSize: '16px', fontWeight: 600
//           }}
//         >
//           Se connecter
//         </button>
//       </div>
//     )
//   }

//   if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Chargement...</div>
//   if (error) return <div>Erreur chargement</div>

//   const dash = data.dashboardPersonnel

//   return (
//     <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
//       <div style={{ textAlign: 'center', marginBottom: '40px' }}>
//         <h1 style={{ color: '#1e3a8a', fontSize: '32px' }}>📊 Dashboard Personnel</h1>
//         <button 
//           onClick={() => refetch()}
//           style={{ marginTop: '8px', padding: '8px 16px', borderRadius: '6px', background: '#f3f4f6' }}
//         >
//           🔄 Rafraîchir
//         </button>
//       </div>

//       {/* Stats principales */}
//       <div style={{ 
//         display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
//         gap: '24px', marginBottom: '40px' 
//       }}>
//         <div style={{ 
//           background: '#dbeafe', padding: '24px', borderRadius: '12px', textAlign: 'center' 
//         }}>
//           <div style={{ fontSize: '36px', color: '#1e40af', fontWeight: 'bold' }}>
//             {dash.nbFavoris}
//           </div>
//           <div style={{ color: '#1e40af', fontWeight: 600 }}>❤️ Favoris</div>
//         </div>
//         <div style={{ 
//           background: '#d1fae5', padding: '24px', borderRadius: '12px', textAlign: 'center' 
//         }}>
//           <div style={{ fontSize: '36px', color: '#059669', fontWeight: 'bold' }}>
//             {dash.nbVisites}
//           </div>
//           <div style={{ color: '#059669', fontWeight: 600 }}>👀 Visites</div>
//         </div>
//       </div>

//       {/* Favoris récents */}
//       <section style={{ marginBottom: '40px' }}>
//         <h2 style={{ color: '#1e3a8a', marginBottom: '16px' }}>❤️ Favoris ({dash.nbFavoris})</h2>
//         {dash.favoris.length === 0 ? (
//           <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
//             Aucun favori pour le moment
//           </div>
//         ) : (
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
//             {dash.favoris.map((fav, i) => (
//               <div key={i} style={{ 
//                 background: '#fef3c7', padding: '20px', borderRadius: '12px', cursor: 'pointer' 
//               }} onClick={() => navigate(`/propriete/${fav.proprieteId}`)}>
//                 <div style={{ fontWeight: 600, marginBottom: '8px' }}>
//                   Propriété {fav.proprieteId.slice(-4)}
//                 </div>
//                 <div style={{ color: '#92400e', fontSize: '14px' }}>
//                   Ajouté: {new Date(fav.dateAjout).toLocaleDateString('fr-MA')}
//                 </div>
//                 {fav.note && <div style={{ marginTop: '8px', fontStyle: 'italic' }}>"{fav.note}"</div>}
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Visites récentes */}
//       <section>
//         <h2 style={{ color: '#1e3a8a', marginBottom: '16px' }}>👀 Visites ({dash.nbVisites})</h2>
//         {dash.visites.length === 0 ? (
//           <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
//             Aucune visite enregistrée
//           </div>
//         ) : (
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
//             {dash.visites.slice(0, 10).map((visite, i) => (  // Top 10
//               <div key={visite.id} style={{ 
//                 background: '#f0f9ff', padding: '20px', borderRadius: '12px' 
//               }}>
//                 <div style={{ fontWeight: 600, marginBottom: '4px' }}>
//                   {visite.id}
//                 </div>
//                 <div style={{ color: '#0369a1', fontSize: '14px' }}>
//                   {new Date(visite.dateVisite).toLocaleDateString('fr-MA')}
//                 </div>
//                 {visite.impression && (
//                   <div style={{ marginTop: '8px', fontStyle: 'italic', color: '#0c4a6e' }}>
//                     "{visite.impression}"
//                   </div>
//                 )}
//                 {visite.prixPropose && (
//                   <div style={{ marginTop: '4px', fontWeight: 600, color: '#059669' }}>
//                     💰 {visite.prixPropose.toLocaleString('fr-MA')} MAD
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   )
// }

import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const DASHBOARD_PERSONNEL = gql`
  query DashboardPersonnel($token: String!) {
    dashboardPersonnel(token: $token) {
      favoris {
        proprieteId
        dateAjout
        note
      }
      visites {
        id
        dateVisite
        impression
        prixPropose
      }
      nbFavoris
      nbVisites
    }
  }
`

export default function Dashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token') || ''

  const { data, loading, error, refetch } = useQuery(DASHBOARD_PERSONNEL, {
    variables: { token },
    skip: !token,
  })

  if (!token) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
        <h1>🔐 Dashboard Personnel</h1>
        <p>Connectez-vous pour voir vos favoris et visites</p>
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 32px', borderRadius: '8px', border: 'none',
            background: '#3b82f6', color: 'white', fontSize: '16px', fontWeight: 600
          }}
        >
          Se connecter
        </button>
      </div>
    )
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Chargement...</div>
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Erreur: {error.message}</div>

  const dash = data.dashboardPersonnel

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1e3a8a', fontSize: '32px' }}>📊 Dashboard Personnel</h1>
        <button 
          onClick={() => refetch()}
          style={{ marginTop: '8px', padding: '8px 16px', borderRadius: '6px', background: '#f3f4f6' }}
        >
          🔄 Rafraîchir
        </button>
      </div>

      {/* Stats principales */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '24px', marginBottom: '40px' 
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', padding: '24px', 
          borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(59,130,246,0.2)' 
        }}>
          <div style={{ fontSize: '48px', color: '#1e40af', fontWeight: 'bold' }}>
            {dash.nbFavoris}
          </div>
          <div style={{ color: '#1e40af', fontWeight: 600, fontSize: '18px' }}>❤️ Favoris</div>
        </div>
        <div style={{ 
          background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', padding: '24px', 
          borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(5,150,105,0.2)' 
        }}>
          <div style={{ fontSize: '48px', color: '#059669', fontWeight: 'bold' }}>
            {dash.nbVisites}
          </div>
          <div style={{ color: '#059669', fontWeight: 600, fontSize: '18px' }}>👀 Visites</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Favoris récents - PLUS D'INFOS */}
        <section style={{ background: '#fef3c7', padding: '24px', borderRadius: '16px' }}>
          <h2 style={{ color: '#92400e', marginBottom: '20px', fontSize: '24px' }}>
            ❤️ Favoris ({dash.nbFavoris})
          </h2>
          {dash.favoris.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#d97706' }}>
              <span style={{ fontSize: '48px' }}>💚</span><br/>
              Aucun favori. Ajoutez-en depuis les détails propriétés !
            </div>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {dash.favoris.slice(0, 8).map((fav, i) => (
                <div key={i} style={{ 
                  background: 'white', padding: '20px', borderRadius: '12px', 
                  marginBottom: '12px', cursor: 'pointer', 
                  borderLeft: '4px solid #f59e0b', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }} onClick={() => navigate(`/propriete/${fav.proprieteId}`)}>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                    PROP-{fav.proprieteId.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ color: '#92400e', fontSize: '14px', marginBottom: '8px' }}>
                    Ajouté: {new Date(fav.dateAjout).toLocaleDateString('fr-MA')}
                  </div>
                  {fav.note && (
                    <div style={{ 
                      background: '#fef3c7', padding: '8px', borderRadius: '6px', 
                      fontStyle: 'italic', fontSize: '14px', marginTop: '4px'
                    }}>
                      "{fav.note}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Visites récentes - PLUS D'INFOS */}
        <section style={{ background: '#f0f9ff', padding: '24px', borderRadius: '16px' }}>
          <h2 style={{ color: '#0369a1', marginBottom: '20px', fontSize: '24px' }}>
            👀 Visites ({dash.nbVisites})
          </h2>
          {dash.visites.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#0c4a6e' }}>
              <span style={{ fontSize: '48px' }}>🔍</span><br/>
              Visitez des propriétés pour voir l'historique ici !
            </div>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {dash.visites.slice(0, 8).map((visite) => (
                <div key={visite.id} style={{ 
                  background: 'white', padding: '16px', borderRadius: '12px', 
                  marginBottom: '12px', borderLeft: '4px solid #0ea5e9'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#0c4a6e' }}>
                    {visite.id}
                  </div>
                  <div style={{ color: '#0369a1', fontSize: '13px' }}>
                    {new Date(visite.dateVisite).toLocaleDateString('fr-MA')}
                  </div>
                  {visite.impression && (
                    <div style={{ marginTop: '6px', fontStyle: 'italic', color: '#0c4a6e' }}>
                      {visite.impression}
                    </div>
                  )}
                  {visite.prixPropose && (
                    <div style={{ 
                      marginTop: '6px', fontWeight: 700, color: '#059669', fontSize: '15px' 
                    }}>
                      💰 {visite.prixPropose.toLocaleString('fr-MA')} MAD
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}