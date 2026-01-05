// // src/pages/Search.tsx
// import { gql } from "@apollo/client"
// import { useLazyQuery } from "@apollo/client/react"
// import { useState } from "react"
// import ProprieteCard from "../components/ProprieteCard"

// const RECHERCHE_LOCALISATION = gql`
//   query RechercheLocalisation($commune: String, $quartierId: String, $lat: Float, $lon: Float, $rayonKm: Float) {
//     rechercheLocalisation(commune: $commune, quartierId: $quartierId, lat: $lat, lon: $lon, rayonKm: $rayonKm) {
//       id
//       titre
//       prix
//       adresse
//       surface
//       chambres
//       lat
//       lon
//     }
//   }
// `

// type Propriete = {
//   id: string
//   titre: string
//   prix: number
//   adresse: string
//   surface: number
//   chambres: number
//   lat: number
//   lon: number
// }

// type Data = { rechercheLocalisation: Propriete[] }
// type Vars = {
//   commune?: string | null
//   quartierId?: string | null
//   lat?: number | null
//   lon?: number | null
//   rayonKm?: number | null
// }

// export default function Search() {
//   const [commune, setCommune] = useState("")
//   const [quartierId, setQuartierId] = useState("")
//   const [lat, setLat] = useState("")
//   const [lon, setLon] = useState("")
//   const [rayonKm, setRayonKm] = useState("")

//   const [runSearch, { data, loading, error }] = useLazyQuery<Data, Vars>(RECHERCHE_LOCALISATION)

//   const onSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     runSearch({
//       variables: {
//         commune: commune || null,
//         quartierId: quartierId || null,
//         lat: lat ? Number(lat) : null,
//         lon: lon ? Number(lon) : null,
//         rayonKm: rayonKm ? Number(rayonKm) : null,
//       },
//     })
//   }

//   return (
//     <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
//       <h2>Recherche</h2>

//       <form onSubmit={onSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//         <input placeholder="Commune (ex: Casablanca)" value={commune} onChange={(e) => setCommune(e.target.value)} />
//         <input placeholder="Quartier ID (ex: LOC_AIN_DIAB)" value={quartierId} onChange={(e) => setQuartierId(e.target.value)} />

//         <input placeholder="Latitude (ex: 33.595)" value={lat} onChange={(e) => setLat(e.target.value)} />
//         <input placeholder="Longitude (ex: -7.667)" value={lon} onChange={(e) => setLon(e.target.value)} />

//         <input placeholder="Rayon (km) (ex: 5)" value={rayonKm} onChange={(e) => setRayonKm(e.target.value)} />

//         <button type="submit" style={{ gridColumn: "1 / -1" }}>
//           Rechercher
//         </button>
//       </form>

//       {loading && <div style={{ marginTop: 16 }}>Chargement...</div>}
//       {error && <div style={{ marginTop: 16, color: "crimson" }}>{error.message}</div>}

//       <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
//         {data?.rechercheLocalisation?.map((p) => (
//           <ProprieteCard key={p.id} id={p.id} />
//         ))}
//       </div>
//     </div>
//   )
// }




// import { gql } from "@apollo/client"
// import { useLazyQuery } from "@apollo/client/react"
// import { useState } from "react"
// import ProprieteCard from "../components/ProprieteCard"

// // TES 2 QUERIES
// const RECHERCHE_LOCALISATION = gql`
//   query RechercheLocalisation($commune: String, $quartierId: String, $lat: Float, $lon: Float, $rayonKm: Float) {
//     rechercheLocalisation(commune: $commune, quartierId: $quartierId, lat: $lat, lon: $lon, rayonKm: $rayonKm) {
//       id titre prix adresse surface chambres lat lon
//     }
//   }
// `

// const TRI_FILTRAGE = gql`
//   query TriFiltrage($prixMin: Float, $prixMax: Float, $surfaceMin: Float, $chambresMin: Int, $tri: TriPropriete!, $ordre: OrdreType!) {
//     proprietesFiltreesTriees(prixMin: $prixMin, prixMax: $prixMax, surfaceMin: $surfaceMin, chambresMin: $chambresMin, tri: $tri, ordre: $ordre) {
//       id titre prix adresse surface chambres lat lon
//     }
//   }
// `

// type Propriete = {
//   id: string
//   titre: string
//   prix: number
//   adresse: string
//   surface: number
//   chambres: number
//   lat: number
//   lon: number
// }

// export default function Search() {
//   const [onglet, setOnglet] = useState("localisation")

//   // TES ÉTATS LOCALISATION (EXACTS)
//   const [commune, setCommune] = useState("Casablanca")
//   const [quartierId, setQuartierId] = useState("")
//   const [lat, setLat] = useState(33.5731)
//   const [lon, setLon] = useState(-7.5898)
//   const [rayonKm, setRayonKm] = useState(10)

//   // ÉTATS FILTRES
//   const [prixMin, setPrixMin] = useState(1000000)
//   const [prixMax, setPrixMax] = useState(3000000)
//   const [surfaceMin, setSurfaceMin] = useState(100)
//   const [chambresMin, setChambresMin] = useState(0)
//   const [tri, setTri] = useState("PERTINENCE")
//   const [ordre, setOrdre] = useState("DESC")

//   // TES 2 QUERIES
//   const [runLocalisation, { data: dataLoc, loading: loadingLoc, error: errorLoc }] = 
//     useLazyQuery<{ rechercheLocalisation: Propriete[] }>(RECHERCHE_LOCALISATION)
//   const [runFiltres, { data: dataFiltres, loading: loadingFiltres, error: errorFiltres }] = 
//     useLazyQuery<{ proprietesFiltreesTriees: Propriete[] }>(TRI_FILTRAGE)

//   const onSubmitLocalisation = (e) => {
//     e.preventDefault()
//     runLocalisation({ variables: { commune: commune || null, quartierId: quartierId || null, lat, lon, rayonKm } })
//   }

//   const onSubmitFiltres = (e) => {
//     e.preventDefault()
//     runFiltres({ variables: { prixMin, prixMax, surfaceMin, chambresMin, tri, ordre } })
//   }

//   const proprietes = onglet === "localisation" ? dataLoc?.rechercheLocalisation : dataFiltres?.proprietesFiltreesTriees
//   const loading = onglet === "localisation" ? loadingLoc : loadingFiltres
//   const error = onglet === "localisation" ? errorLoc : errorFiltres

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>🔍 Recherche Immobilière</h1>

//       {/* ONGLETS SIMPLES */}
//       <div>
//         <button onClick={() => setOnglet("localisation")}>Localisation</button>
//         <button onClick={() => setOnglet("filtres")}>Filtres/Tri</button>
//       </div>

//       {/* TES FORMULAIRES (EXACTS + MINIMAL) */}
//       {onglet === "localisation" && (
//         <form onSubmit={onSubmitLocalisation}>
//           <input placeholder="Commune" value={commune} onChange={(e) => setCommune(e.target.value)} />
//           <input placeholder="Quartier ID" value={quartierId} onChange={(e) => setQuartierId(e.target.value)} />
//           <input type="number" placeholder="Lat" value={lat} onChange={(e) => setLat(Number(e.target.value))} />
//           <input type="number" placeholder="Lon" value={lon} onChange={(e) => setLon(Number(e.target.value))} />
//           <input type="number" placeholder="Rayon km" value={rayonKm} onChange={(e) => setRayonKm(Number(e.target.value))} />
//           <button type="submit">{loading ? "Chargement..." : "Rechercher"}</button>
//         </form>
//       )}

//       {onglet === "filtres" && (
//         <form onSubmit={onSubmitFiltres}>
//           <input type="number" placeholder="Prix min" value={prixMin} onChange={(e) => setPrixMin(Number(e.target.value))} />
//           <input type="number" placeholder="Prix max" value={prixMax} onChange={(e) => setPrixMax(Number(e.target.value))} />
//           <input type="number" placeholder="Surface min" value={surfaceMin} onChange={(e) => setSurfaceMin(Number(e.target.value))} />
//           <input type="number" placeholder="Chambres min" value={chambresMin} onChange={(e) => setChambresMin(Number(e.target.value))} />
//           <select value={tri} onChange={(e) => setTri(e.target.value)}>
//             <option value="PERTINENCE">Pertinence</option>
//             <option value="PRIX">Prix</option>
//             <option value="DATE_AJOUT">Date ajout</option>
//           </select>
//           <select value={ordre} onChange={(e) => setOrdre(e.target.value)}>
//             <option value="DESC">DESC</option>
//             <option value="ASC">ASC</option>
//           </select>
//           <button type="submit">{loading ? "Chargement..." : "Filtrer/Trier"}</button>
//         </form>
//       )}

//       {/* TES RÉSULTATS */}
//       {loading && <div>Chargement...</div>}
//       {error && <div>Erreur: {error.message}</div>}
//       <div>
//         {proprietes?.map((p) => (
//           <ProprieteCard key={p.id} id={p.id} />
//         ))}
//       </div>
//     </div>
//   )
// }


import { gql } from "@apollo/client"
import { useLazyQuery } from "@apollo/client/react"
import { useState } from "react"
import ProprieteCard from "../components/ProprieteCard"

const RECHERCHE_LOCALISATION = gql`
  query RechercheLocalisation($commune: String, $quartierId: String, $lat: Float, $lon: Float, $rayonKm: Float) {
    rechercheLocalisation(commune: $commune, quartierId: $quartierId, lat: $lat, lon: $lon, rayonKm: $rayonKm) {
      id titre prix adresse surface chambres lat lon
    }
  }
`

// NOUVELLE QUERY SIMPLIFIÉE POUR LE TRI
const PROPRIETES_TRIEE = gql`
  query ProprietesTriees($tri: TriPropriete, $ordre: OrdreType, $limit: Int) {
    proprietesTriees(tri: $tri, ordre: $ordre, limit: $limit) {
      id titre prix adresse surface chambres lat lon
    }
  }
`

type Propriete = {
  id: string
  titre: string
  prix: number
  adresse: string
  surface: number
  chambres: number
  lat: number
  lon: number
}

export default function Search() {
  // === FORMULAIRE 1: LOCALISATION ===
  const [commune, setCommune] = useState("")
  const [quartierId, setQuartierId] = useState("")
  const [latLoc, setLatLoc] = useState("")
  const [lonLoc, setLonLoc] = useState("")
  const [rayonKmLoc, setRayonKmLoc] = useState("")

  const [runLoc, { data: dataLoc, loading: loadingLoc, error: errorLoc }] = 
    useLazyQuery<{ rechercheLocalisation: Propriete[] }>(RECHERCHE_LOCALISATION)

  const onSubmitLoc = (e: React.FormEvent) => {
    e.preventDefault()
    runLoc({
      variables: {
        commune: commune || null,
        quartierId: quartierId || null,
        lat: latLoc ? Number(latLoc) : null,
        lon: lonLoc ? Number(lonLoc) : null,
        rayonKm: rayonKmLoc ? Number(rayonKmLoc) : null,
      },
    })
  }

  // === FORMULAIRE 2: TRI SEUL ===
  const [tri, setTri] = useState("PERTINENCE")
  const [ordre, setOrdre] = useState("DESC")
  const [limit, setLimit] = useState("20")

  // CHANGEMENT ICI : nouvelle query simplifiée
  const [runTri, { data: dataTri, loading: loadingTri, error: errorTri }] = 
    useLazyQuery<{ proprietesTriees: Propriete[] }>(PROPRIETES_TRIEE)

  const onSubmitTri = (e: React.FormEvent) => {
    e.preventDefault()
    runTri({
      variables: {
        tri: tri as any,  // TypeScript workaround
        ordre: ordre as any,
        limit: Number(limit),
      },
    })
  }

  // === RÉSULTATS ===
  const loading = loadingLoc || loadingTri
  const error = errorLoc || errorTri
  const results = dataTri?.proprietesTriees ?? dataLoc?.rechercheLocalisation ?? []

  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
      <h2>🔍 Recherche Immobilière</h2>

      {/* DEUX FORMULAIRES VERTICAUX */}
      <div style={{ display: "grid", gap: 24 }}>
        
        {/* FORMULAIRE 1: LOCALISATION */}
        <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <h3>📍 Recherche par localisation</h3>
          <form onSubmit={onSubmitLoc} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input placeholder="Commune (ex: Casablanca)" value={commune} onChange={(e) => setCommune(e.target.value)} />
            <input placeholder="Quartier ID (ex: LOC_AIN_DIAB)" value={quartierId} onChange={(e) => setQuartierId(e.target.value)} />
            <input placeholder="Latitude (ex: 33.595)" value={latLoc} onChange={(e) => setLatLoc(e.target.value)} />
            <input placeholder="Longitude (ex: -7.667)" value={lonLoc} onChange={(e) => setLonLoc(e.target.value)} />
            <input placeholder="Rayon (km) (ex: 5)" value={rayonKmLoc} onChange={(e) => setRayonKmLoc(e.target.value)} />
            <button type="submit" style={{ gridColumn: "1 / -1" }}>Rechercher localisation</button>
          </form>
        </section>

        {/* FORMULAIRE 2: TRI SIMPLIFIÉ */}
        <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <h3>🔄 Tri propriétés</h3>
          <form onSubmit={onSubmitTri} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <select value={tri} onChange={(e) => setTri(e.target.value)}>
              <option value="PRIX">💰 Prix</option>
              <option value="DATE_DEPOT">📅 Date ajout</option>
              <option value="PERTINENCE">⭐ Pertinence</option>
            </select>
            <select value={ordre} onChange={(e) => setOrdre(e.target.value)}>
              <option value="DESC">🔽 Descendant</option>
              <option value="ASC">🔼 Ascendant</option>
            </select>
            <input placeholder="Limit (20)" value={limit} onChange={(e) => setLimit(e.target.value)} style={{ gridColumn: "1 / -1" }} />
            <button type="submit" style={{ gridColumn: "1 / -1" }}>Trier</button>
          </form>
        </section>

      </div>

      {/* STATUS + RÉSULTATS */}
      {loading && <div style={{ marginTop: 16 }}>Chargement...</div>}
      {error && <div style={{ marginTop: 16, color: "crimson" }}>{error.message}</div>}

      <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
        {results.map((p) => (
          <ProprieteCard key={p.id} id={p.id} />
        ))}
      </div>
    </div>
  )
}
