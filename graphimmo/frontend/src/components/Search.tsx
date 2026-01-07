// import { gql } from "@apollo/client"
// import { useLazyQuery } from "@apollo/client/react"
// import { useState, useEffect } from "react"
// import ProprieteCard from "../components/ProprieteCard"
// import { useSearchContext } from '../contexts/SearchContext'

// const RECHERCHE_LOCALISATION = gql`
//   query RechercheLocalisation($commune: String, $quartierId: String, $lat: Float, $lon: Float, $rayonKm: Float) {
//     rechercheLocalisation(commune: $commune, quartierId: $quartierId, lat: $lat, lon: $lon, rayonKm: $rayonKm) {
//       id titre prix adresse surface chambres lat lon
//     }
//   }
// `

// const PROPRIETES_TRIEE = gql`
//   query ProprietesTriees($tri: TriPropriete, $ordre: OrdreType, $limit: Int) {
//     proprietesTriees(tri: $tri, ordre: $ordre, limit: $limit) {
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

// type ModeActif = 'aucun' | 'localisation' | 'tri'

// export default function Search() {
//   // === FORMULAIRE 1: LOCALISATION ===
//   const { searchState, setSearchState } = useSearchContext()
//   //const [commune, setCommune] = useState("")
//   const [commune, setCommune] = useState(searchState.formData?.commune || "")
//   const [quartierId, setQuartierId] = useState(searchState.formData?.quartierId || "")
//   const [latLoc, setLatLoc] = useState(searchState.formData?.latLoc || "")
//   const [lonLoc, setLonLoc] = useState(searchState.formData?.lonLoc || "")
//   const [rayonKmLoc, setRayonKmLoc] = useState(searchState.formData?.rayonKmLoc || "")

//     // ÉTATS TRI - ⚠️ AJOUTEZ CECI (initialisés depuis contexte)
//   const [tri, setTri] = useState<"PERTINENCE" | "PRIX" | "DATE_DEPOT">(
//     searchState.formData?.tri || "PERTINENCE"
//   )
//   const [ordre, setOrdre] = useState<"DESC" | "ASC">(
//     searchState.formData?.ordre || "DESC"
//   )
//   const [limit, setLimit] = useState(searchState.formData?.limit || "20")
//   const [modeActif, setModeActif] = useState<ModeActif>(searchState.modeActif || 'aucun')


//   const [runLoc, { data: dataLoc, loading: loadingLoc, error: errorLoc }] = 
//     useLazyQuery<{ rechercheLocalisation: Propriete[] }>(RECHERCHE_LOCALISATION)

//   const onSubmitLoc = (e: React.FormEvent) => {
//     e.preventDefault()
//     setModeActif('localisation')
//     const variables: any = {}
//     if (commune) variables.commune = commune
//     if (quartierId) variables.quartierId = quartierId
//     if (latLoc) variables.lat = Number(latLoc)
//     if (lonLoc) variables.lon = Number(lonLoc)
//     if (rayonKmLoc) variables.rayonKm = Number(rayonKmLoc)
    
//     runLoc({ variables })
//     setSearchState({
//       modeActif: 'localisation',
//       results: dataLoc?.rechercheLocalisation || [],
//       formData: { commune, quartierId, latLoc, lonLoc, rayonKmLoc, variables }
//     })
//   }

//   // === FORMULAIRE 2: TRI SEUL ===
//   const [tri, setTri] = useState<"PERTINENCE" | "PRIX" | "DATE_DEPOT">("PERTINENCE")
//   const [ordre, setOrdre] = useState<"DESC" | "ASC">("DESC")
//   const [limit, setLimit] = useState("20")
//   const [modeActif, setModeActif] = useState<ModeActif>('aucun')

//   const [runTri, { data: dataTri, loading: loadingTri, error: errorTri }] = 
//     useLazyQuery<{ proprietesTriees: Propriete[] }>(PROPRIETES_TRIEE)

//   const onSubmitTri = (e: React.FormEvent) => {
//     e.preventDefault()
//     setModeActif('tri')
//     runTri({
//       variables: {
//         tri,
//         ordre,
//         limit: Number(limit),
//       },
//     })
//   }

  
//     useEffect(() => {
//     // Restaurer la recherche depuis le contexte
//   if (searchState.modeActif === 'localisation' && searchState.formData?.variables) {
//     runLoc({ variables: searchState.formData.variables })
//   } else if (searchState.modeActif === 'tri' && searchState.formData?.variables) {
//     runTri({ variables: searchState.formData.variables })
//   }
//   }, [])

//   const handleReset = () => {
//     setCommune(''); setQuartierId(''); setLatLoc(''); setLonLoc(''); setRayonKmLoc('')
//     setTri('PERTINENCE'); setOrdre('DESC'); setLimit('20')
//     setModeActif('aucun')
//   }

//   // === RÉSULTATS ===
//   const loading = loadingLoc || loadingTri
//   const error = errorLoc || errorTri
//   const results = 
//     modeActif === 'localisation' ? (dataLoc?.rechercheLocalisation ?? []) :
//     modeActif === 'tri' ? (dataTri?.proprietesTriees ?? []) :
//     []

//   return (
//     <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
//       {/* CONTROLE MODES */}
//       <div style={{ marginBottom: 16, padding: 12, background: '#f0f9ff', borderRadius: 8, borderLeft: '4px solid #0ea5e9' }}>
//         <strong>Mode actuel: </strong>
//         <span style={{ 
//           color: modeActif === 'localisation' ? '#059669' : 
//                     modeActif === 'tri' ? '#dc2626' : '#6b7280',
//           fontWeight: 600 
//         }}>
//           {modeActif === 'localisation' ? '📍 Localisation' : 
//           modeActif === 'tri' ? '🔄 Tri' : '😐 Aucun'}
//         </span>
//         <button onClick={handleReset} 
//           style={{ 
//             marginLeft: 16, padding: '8px 16px', background: '#ef4444', color: 'white', 
//             border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: 14 
//           }}>
//           🗑️ Réinitialiser tout
//         </button>
//       </div>

//       <h2>🔍 Recherche Immobilière</h2>

//       {/* DEUX FORMULAIRES VERTICAUX */}
//       <div style={{ display: "grid", gap: 24 }}>
        
//         {/* FORMULAIRE 1: LOCALISATION */}
//         <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
//           <h3>📍 Recherche par localisation</h3>
//           <form onSubmit={onSubmitLoc} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//             <input placeholder="Commune (ex: Casablanca)" value={commune} onChange={(e) => setCommune(e.target.value)} />
//             <input placeholder="Quartier ID (ex: LOC_AIN_DIAB)" value={quartierId} onChange={(e) => setQuartierId(e.target.value)} />
//             <input placeholder="Latitude (ex: 33.595)" value={latLoc} onChange={(e) => setLatLoc(e.target.value)} />
//             <input placeholder="Longitude (ex: -7.667)" value={lonLoc} onChange={(e) => setLonLoc(e.target.value)} />
//             <input placeholder="Rayon (km) (ex: 5)" value={rayonKmLoc} onChange={(e) => setRayonKmLoc(e.target.value)} />
//             <button type="submit" style={{ gridColumn: "1 / -1" }}>Rechercher localisation</button>
//           </form>
//         </section>

//         {/* FORMULAIRE 2: TRI SIMPLIFIÉ */}
//         <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
//           <h3>🔄 Tri propriétés</h3>
//           <form onSubmit={onSubmitTri} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//             <select value={tri} onChange={(e) => setTri(e.target.value as "PERTINENCE" | "PRIX" | "DATE_DEPOT")}>
//               <option value="PRIX">💰 Prix</option>
//               <option value="DATE_DEPOT">📅 Date ajout</option>
//               <option value="PERTINENCE">⭐ Pertinence</option>
//             </select>
//             <select value={ordre} onChange={(e) => setOrdre(e.target.value as "DESC" | "ASC")}>
//               <option value="DESC">🔽 Descendant</option>
//               <option value="ASC">🔼 Ascendant</option>
//             </select>
//             <input placeholder="Limit (20)" value={limit} onChange={(e) => setLimit(e.target.value)} style={{ gridColumn: "1 / -1" }} />
//             <button type="submit" style={{ gridColumn: "1 / -1" }}>Trier</button>
//           </form>
//         </section>

//       </div>

//       {/* STATUS AMELIORE */}
//       {loading && (
//         <div style={{ marginTop: 16, padding: 16, textAlign: 'center', background: '#ecfdf5', borderRadius: 8 }}>
//           🔄 <strong>{modeActif}</strong> en cours...
//         </div>
//       )}
//       {error && (
//         <div style={{ marginTop: 16, color: 'crimson', padding: 16, borderRadius: 8, background: '#fef2f2' }}>
//           Erreur <strong>{modeActif}</strong>: {error.message}
//           <button onClick={handleReset} 
//             style={{ marginLeft: 12, padding: '6px 12px', background: '#dc2626', color: 'white', 
//                     border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
//             Reset
//           </button>
//         </div>
//       )}
//       {!loading && results.length === 0 && modeActif !== 'aucun' && (
//         <div style={{ marginTop: 16, color: '#6b7280', textAlign: 'center', padding: 16, background: '#f8fafc' }}>
//           Aucun résultat en mode <strong>{modeActif}</strong>
//         </div>
//       )}

//       <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
//         {results.map((p) => (
//           <ProprieteCard key={p.id} id={p.id} />
//         ))}
//       </div>
//     </div>
//   )
// }
import { gql } from "@apollo/client"
import { useLazyQuery } from "@apollo/client/react"
import { useState, useEffect } from "react"
import ProprieteCard from "../components/ProprieteCard"
import { useSearchContext } from '../contexts/SearchContext'

const RECHERCHE_LOCALISATION = gql`
  query RechercheLocalisation($commune: String, $quartierId: String, $lat: Float, $lon: Float, $rayonKm: Float) {
    rechercheLocalisation(commune: $commune, quartierId: $quartierId, lat: $lat, lon: $lon, rayonKm: $rayonKm) {
      id titre prix adresse surface chambres lat lon
    }
  }
`

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

type ModeActif = 'aucun' | 'localisation' | 'tri'

export default function Search() {
  const { searchState, setSearchState } = useSearchContext()
  
  // === TOUS LES ÉTATS (UNE SEULE FOIS) ===
  const [commune, setCommune] = useState(searchState.formData?.commune || "")
  const [quartierId, setQuartierId] = useState(searchState.formData?.quartierId || "")
  const [latLoc, setLatLoc] = useState(searchState.formData?.latLoc || "")
  const [lonLoc, setLonLoc] = useState(searchState.formData?.lonLoc || "")
  const [rayonKmLoc, setRayonKmLoc] = useState(searchState.formData?.rayonKmLoc || "")
  
  const [tri, setTri] = useState<"PERTINENCE" | "PRIX" | "DATE_DEPOT">(
    searchState.formData?.tri || "PERTINENCE"
  )
  const [ordre, setOrdre] = useState<"DESC" | "ASC">(
    searchState.formData?.ordre || "DESC"
  )
  const [limit, setLimit] = useState(searchState.formData?.limit || "20")
  const [modeActif, setModeActif] = useState<ModeActif>(searchState.modeActif || 'aucun')

  // === QUERIES ===
  const [runLoc, { data: dataLoc, loading: loadingLoc, error: errorLoc }] = 
    useLazyQuery<{ rechercheLocalisation: Propriete[] }>(RECHERCHE_LOCALISATION)

  const [runTri, { data: dataTri, loading: loadingTri, error: errorTri }] = 
    useLazyQuery<{ proprietesTriees: Propriete[] }>(PROPRIETES_TRIEE)

  // === useEffect 1: RESTAURATION AU MONTAGE ===
  useEffect(() => {
    if (searchState.modeActif === 'localisation' && searchState.formData?.variables) {
      runLoc({ variables: searchState.formData.variables })
    } else if (searchState.modeActif === 'tri' && searchState.formData?.variables) {
      runTri({ variables: searchState.formData.variables })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // === useEffect 2: SAUVEGARDER RÉSULTATS LOCALISATION ===
  useEffect(() => {
    if (dataLoc?.rechercheLocalisation && modeActif === 'localisation') {
      setSearchState({
        modeActif: 'localisation',
        results: dataLoc.rechercheLocalisation,
        formData: { 
          commune, quartierId, latLoc, lonLoc, rayonKmLoc,
          variables: {
            commune: commune || null,
            quartierId: quartierId || null,
            lat: latLoc ? Number(latLoc) : null,
            lon: lonLoc ? Number(lonLoc) : null,
            rayonKm: rayonKmLoc ? Number(rayonKmLoc) : null,
          }
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoc])

  // === useEffect 3: SAUVEGARDER RÉSULTATS TRI ===
  useEffect(() => {
    if (dataTri?.proprietesTriees && modeActif === 'tri') {
      setSearchState({
        modeActif: 'tri',
        results: dataTri.proprietesTriees,
        formData: { 
          tri, ordre, limit,
          variables: { tri, ordre, limit: Number(limit) }
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTri])

  // === FORMULAIRE LOCALISATION ===
  const onSubmitLoc = (e: React.FormEvent) => {
    e.preventDefault()
    setModeActif('localisation')
    
    const variables: any = {}
    if (commune) variables.commune = commune
    if (quartierId) variables.quartierId = quartierId
    if (latLoc) variables.lat = Number(latLoc)
    if (lonLoc) variables.lon = Number(lonLoc)
    if (rayonKmLoc) variables.rayonKm = Number(rayonKmLoc)
    
    runLoc({ variables })
    // ❌ ENLEVER setSearchState d'ici - il est maintenant dans useEffect
  }

  // === FORMULAIRE TRI ===
  const onSubmitTri = (e: React.FormEvent) => {
    e.preventDefault()
    setModeActif('tri')
    runTri({
      variables: { tri, ordre, limit: Number(limit) },
    })
  }

  // === RESET ===
  const handleReset = () => {
    setCommune(''); setQuartierId(''); setLatLoc(''); setLonLoc(''); setRayonKmLoc('')
    setTri('PERTINENCE'); setOrdre('DESC'); setLimit('20')
    setModeActif('aucun')
    
    // ✅ AJOUTER CECI
    setSearchState({
      modeActif: 'aucun',
      results: [],
      formData: {}
    })
  }

  // === RÉSULTATS ===
  const loading = loadingLoc || loadingTri
  const error = errorLoc || errorTri
  
  // ✅ MODIFIER CECI - Utiliser contexte en priorité
  const results = searchState.results.length > 0 
    ? searchState.results 
    : modeActif === 'localisation' ? (dataLoc?.rechercheLocalisation ?? [])
    : modeActif === 'tri' ? (dataTri?.proprietesTriees ?? [])
    : []

  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
      {/* CONTROLE MODES */}
      <div style={{ marginBottom: 16, padding: 12, background: '#f0f9ff', borderRadius: 8, borderLeft: '4px solid #0ea5e9' }}>
        <strong>Mode actuel: </strong>
        <span style={{ 
          color: modeActif === 'localisation' ? '#059669' : 
                modeActif === 'tri' ? '#dc2626' : '#6b7280',
          fontWeight: 600 
        }}>
          {modeActif === 'localisation' ? '📍 Localisation' : 
          modeActif === 'tri' ? '🔄 Tri' : '😐 Aucun'}
        </span>
        <button onClick={handleReset} 
          style={{ 
            marginLeft: 16, padding: '8px 16px', background: '#ef4444', color: 'white', 
            border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: 14 
          }}>
          🗑️ Réinitialiser tout
        </button>
      </div>

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
            <select value={tri} onChange={(e) => setTri(e.target.value as "PERTINENCE" | "PRIX" | "DATE_DEPOT")}>
              <option value="PRIX">💰 Prix</option>
              <option value="DATE_DEPOT">📅 Date ajout</option>
              <option value="PERTINENCE">⭐ Pertinence</option>
            </select>
            <select value={ordre} onChange={(e) => setOrdre(e.target.value as "DESC" | "ASC")}>
              <option value="DESC">🔽 Descendant</option>
              <option value="ASC">🔼 Ascendant</option>
            </select>
            <input placeholder="Limit (20)" value={limit} onChange={(e) => setLimit(e.target.value)} style={{ gridColumn: "1 / -1" }} />
            <button type="submit" style={{ gridColumn: "1 / -1" }}>Trier</button>
          </form>
        </section>

      </div>

      {/* STATUS AMELIORE */}
      {loading && (
        <div style={{ marginTop: 16, padding: 16, textAlign: 'center', background: '#ecfdf5', borderRadius: 8 }}>
          🔄 <strong>{modeActif}</strong> en cours...
        </div>
      )}
      {error && (
        <div style={{ marginTop: 16, color: 'crimson', padding: 16, borderRadius: 8, background: '#fef2f2' }}>
          Erreur <strong>{modeActif}</strong>: {error.message}
          <button onClick={handleReset} 
            style={{ marginLeft: 12, padding: '6px 12px', background: '#dc2626', color: 'white', 
                    border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Reset
          </button>
        </div>
      )}
      {!loading && results.length === 0 && modeActif !== 'aucun' && (
        <div style={{ marginTop: 16, color: '#6b7280', textAlign: 'center', padding: 16, background: '#f8fafc' }}>
          Aucun résultat en mode <strong>{modeActif}</strong>
        </div>
      )}

      <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
        {results.map((p) => (
          <ProprieteCard key={p.id} id={p.id} />
        ))}
      </div>
    </div>
  )
}
