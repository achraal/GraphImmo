// src/components/ProprieteDetail.tsx
import { useQuery} from '@apollo/client/react'
import { gql} from '@apollo/client'
import { useParams } from 'react-router-dom'

const GET_PROPRIETE_DETAIL = gql`
  query ProprieteComplete($id: String!) {
    proprieteDetail(id: $id) {
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

export default function ProprieteDetail() {
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useQuery(GET_PROPRIETE_DETAIL, {
    variables: { id: id || '' },
    skip: !id,
  })

  if (loading) return <div>Chargement détails...</div>
  if (error || !data?.proprieteDetail) 
    return <div>Propriété introuvable ou erreur</div>

  const prop = data.proprieteDetail

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      {/* En-tête */}
      <h1 style={{ color: '#1e3a8a', marginBottom: '16px' }}>{prop.titre}</h1>
      
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
      {prop.photos.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2>Photos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
            {prop.photos.map((photo, i) => (
              <img 
                key={`${prop.id}-${i}`}
                src={photo.url} 
                alt={`Photo ${photo.angle}`}
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
      {prop.amenagements.length > 0 && (
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
    </div>
  )
}
