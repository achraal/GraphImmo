// src/components/ProprieteCard.tsx
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import { Link } from "react-router-dom"

const GET_CARD = gql`
  query CardPropriete($id: String!) {
    proprieteDetail(id: $id) {
      id
      titre
      prix
      adresse
      surface
      chambres
      photos { url angle }
    }
  }
`

type Photo = { url: string; angle: string }
type Data = { proprieteDetail: null | { id: string; titre: string; prix: number; adresse: string; surface: number; chambres: number; photos: Photo[] } }
type Vars = { id: string }

export default function ProprieteCard({ id }: { id: string }) {
  const { data, loading } = useQuery<Data, Vars>(GET_CARD, { variables: { id } })

  if (loading) return <div style={{ border: "1px solid #e5e7eb", padding: 12 }}>Chargement {id}...</div>
  const p = data?.proprieteDetail
  if (!p) return null

  const cover = p.photos?.[0]?.url

  return (
    <div style={{ display: "flex", gap: 12, border: "1px solid #e5e7eb", padding: 12, borderRadius: 8 }}>
      <div style={{ width: 160, height: 110, background: "#f3f4f6", flex: "0 0 auto", overflow: "hidden", borderRadius: 6 }}>
        {cover ? <img src={cover} alt={p.titre} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{p.titre}</div>
        <div>{p.prix} MAD</div>
        <div>{p.surface} m² • {p.chambres} chambres</div>
        <div style={{ color: "#6b7280" }}>{p.adresse}</div>

        <Link to={`/propriete/${p.id}`} style={{ display: "inline-block", marginTop: 8 }}>
          Voir détails
        </Link>
      </div>
    </div>
  )
}
