// // src/components/Recommendations.tsx
// import { useQuery } from '@apollo/client/react'
// import { useState } from 'react'
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
//   const [limit, setLimit] = useState(12)
//   const [minScore, setMinScore] = useState(30)

//   const { data, loading, error, refetch } = useQuery(GET_RECOMMENDATIONS, {
//     variables: { token, limit, minScore },
//     skip: !token
//   })

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
//         borderRadius: 8
//       }}>
//         <div>
//           <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
//             Nombre de résultats
//           </label>
//           <input 
//             type="number" 
//             value={limit}
//             onChange={(e) => setLimit(Number(e.target.value))}
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
//             value={minScore}
//             onChange={(e) => setMinScore(Number(e.target.value))}
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
//           onClick={() => refetch()}
//           style={{
//             padding: '8px 16px',
//             background: '#3b82f6',
//             color: 'white',
//             border: 'none',
//             borderRadius: 6,
//             cursor: 'pointer',
//             fontWeight: 500,
//             alignSelf: 'flex-end'
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

// src/components/Recommendations.tsx
import { useQuery } from '@apollo/client/react'
import { useState } from 'react'  // ← Enlever useEffect
import { gql } from '@apollo/client'

const GET_RECOMMENDATIONS = gql`
  query GetRecommendations($token: String!, $limit: Int, $minScore: Float) {
    recommandations(token: $token, input: { limit: $limit, minScore: $minScore }) {
      id
      titre
      prix
      adresse
      surface
      chambres
      lat
      lon
      score
      source
      distanceKm
    }
  }
`

interface Recommendation {
  id: string
  titre: string
  prix: number
  adresse: string
  surface: number
  chambres: number
  lat: number
  lon: number
  score: number
  source: string
  distanceKm: number | null
}

const SOURCE_CONFIG = {
  PROCHE: { label: '📍 Proximité', color: '#10b981', emoji: '📍' },
  SIMILAIRE_A: { label: '🔄 Similaire', color: '#3b82f6', emoji: '🔄' },
  AMENAGEMENT: { label: '🏠 Équipements', color: '#8b5cf6', emoji: '🏠' },
  COLLABORATIF: { label: '👥 Populaire', color: '#f59e0b', emoji: '👥' },
  PAGERANK: { label: '⭐ Tendance', color: '#ec4899', emoji: '⭐' }
}

export default function Recommendations() {
  const token = localStorage.getItem('token')
  
  // ✅ États utilisés pour la requête (ne changent QUE au clic sur Actualiser)
  const [limit, setLimit] = useState(12)
  const [minScore, setMinScore] = useState(30)
  
  // ✅ États temporaires pour les inputs (changent à chaque frappe)
  const [tempLimit, setTempLimit] = useState(12)
  const [tempMinScore, setTempMinScore] = useState(30)

  const { data, loading, error, refetch } = useQuery(GET_RECOMMENDATIONS, {
    variables: { token, limit, minScore },
    skip: !token
  })

  // ❌ SUPPRIMER le useEffect qui causait l'auto-actualisation

  if (!token) {
    return <div style={{ padding: 20, textAlign: 'center' }}>
      <p>Vous devez être connecté pour voir les recommandations.</p>
    </div>
  }

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>
      <p>⏳ Chargement des recommandations personnalisées...</p>
    </div>
  }

  if (error) {
    return <div style={{ padding: 20, textAlign: 'center', color: '#ef4444' }}>
      <p>❌ Erreur : {error.message}</p>
    </div>
  }

  const recommendations: Recommendation[] = data?.recommandations || []

  // Grouper par source
  const groupedBySource = recommendations.reduce((acc, reco) => {
    if (!acc[reco.source]) acc[reco.source] = []
    acc[reco.source].push(reco)
    return acc
  }, {} as Record<string, Recommendation[]>)

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 20 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          ✨ Recommandations personnalisées
        </h1>
        <p style={{ color: '#6b7280', fontSize: 16 }}>
          {recommendations.length} propriétés sélectionnées pour vous
        </p>
      </div>

      {/* Filtres */}
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        marginBottom: 24,
        padding: 16,
        background: '#f9fafb',
        borderRadius: 8,
        alignItems: 'flex-end'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Nombre de résultats
          </label>
          <input 
            type="number" 
            value={tempLimit}
            onChange={(e) => setTempLimit(Number(e.target.value))}
            min={1}
            max={50}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              width: 100
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Score minimum
          </label>
          <input 
            type="number" 
            value={tempMinScore}
            onChange={(e) => setTempMinScore(Number(e.target.value))}
            min={0}
            max={100}
            step={5}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              width: 100
            }}
          />
        </div>

        <button
          onClick={() => {
            // ✅ Met à jour les vraies valeurs utilisées par la requête
            setLimit(tempLimit)
            setMinScore(tempMinScore)
          }}
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 500,
            height: '40px'
          }}
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Stats par source */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 32
      }}>
        {Object.entries(groupedBySource).map(([source, items]) => {
          const config = SOURCE_CONFIG[source as keyof typeof SOURCE_CONFIG]
          return (
            <div 
              key={source}
              style={{
                padding: 16,
                background: 'white',
                border: `2px solid ${config?.color || '#d1d5db'}`,
                borderRadius: 8,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>
                {config?.emoji || '📌'}
              </div>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
                {items.length}
              </div>
              <div style={{ color: '#6b7280', fontSize: 14 }}>
                {config?.label || source}
              </div>
            </div>
          )
        })}
      </div>

      {/* Liste des recommandations */}
      {recommendations.length === 0 ? (
        <div style={{ 
          padding: 40, 
          textAlign: 'center',
          background: '#f9fafb',
          borderRadius: 8
        }}>
          <p style={{ fontSize: 18, color: '#6b7280' }}>
            Aucune recommandation disponible. Commencez par aimer des propriétés ! ❤️
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 24
        }}>
          {recommendations.map((reco) => {
            const config = SOURCE_CONFIG[reco.source as keyof typeof SOURCE_CONFIG]
            return (
              <div 
                key={reco.id}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onClick={() => window.location.hash = `#/propriete/${reco.id}`}
              >
                {/* Badge source */}
                <div style={{
                  background: config?.color || '#d1d5db',
                  color: 'white',
                  padding: '8px 16px',
                  fontWeight: 600,
                  fontSize: 14
                }}>
                  {config?.emoji} {config?.label || reco.source}
                </div>

                {/* Contenu */}
                <div style={{ padding: 20 }}>
                  <h3 style={{ 
                    fontSize: 18, 
                    fontWeight: 700, 
                    marginBottom: 12,
                    color: '#111827'
                  }}>
                    {reco.titre}
                  </h3>

                  <div style={{ 
                    fontSize: 24, 
                    fontWeight: 700, 
                    color: '#8b5cf6',
                    marginBottom: 12
                  }}>
                    {reco.prix.toLocaleString('fr-MA')} MAD
                  </div>

                  <div style={{ 
                    color: '#6b7280', 
                    fontSize: 14,
                    marginBottom: 12
                  }}>
                    📍 {reco.adresse}
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: 12, 
                    fontSize: 14,
                    marginBottom: 12
                  }}>
                    <span>📐 {reco.surface}m²</span>
                    <span>🛏️ {reco.chambres} ch.</span>
                    {reco.distanceKm !== null && (
                      <span>📍 {reco.distanceKm}km</span>
                    )}
                  </div>

                  {/* Score de pertinence */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: '#f3f4f6',
                    borderRadius: 6
                  }}>
                    <div style={{
                      flex: 1,
                      height: 8,
                      background: '#e5e7eb',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${reco.score}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${config?.color || '#3b82f6'}, ${config?.color || '#8b5cf6'})`,
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <span style={{ 
                      fontWeight: 700, 
                      fontSize: 14,
                      color: config?.color || '#111827'
                    }}>
                      {reco.score}/100
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
