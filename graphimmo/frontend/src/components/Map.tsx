// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   AttributionControl,
// } from 'react-leaflet'
// import { useLazyQuery } from '@apollo/client/react'
// import { gql } from '@apollo/client'
// import { Icon } from 'leaflet'
// import 'leaflet/dist/leaflet.css'
// import { useEffect, useState } from 'react'
// import type { FormEvent } from 'react'
// import MarkerClusterGroup from 'react-leaflet-cluster'
// import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
// import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
// import { Link } from 'react-router-dom'

// interface Propriete {
//   id: string
//   titre: string
//   prix: number
//   adresse: string
//   lat: number
//   lon: number
//   surface: number
//   chambres: number
// }

// const GET_PROPRIETES = gql`
//   query ProprieteFiltrees(
//     $prixMin: Float
//     $prixMax: Float
//     $surfaceMin: Int
//     $chambresMin: Int
//     $amenagementTypes: [String!]
//   ) {
//     proprietesFiltrees(
//       prixMin: $prixMin
//       prixMax: $prixMax
//       surfaceMin: $surfaceMin
//       chambresMin: $chambresMin
//       amenagementTypes: $amenagementTypes
//     ) {
//       id
//       titre
//       prix
//       adresse
//       lat
//       lon
//       surface
//       chambres
//     }
//   }
// `

// const markerIcon = new Icon({
//   iconUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// })

// const AMENAGEMENT_CHOICES = [
//   { label: 'Piscine', value: 'Piscine' },
//   { label: 'Garage', value: 'Garage' },
//   { label: 'Jardin', value: 'Jardin' },
//   { label: 'Ascenseur', value: 'Ascenseur' },
//   { label: 'Terrasse', value: 'Terrasse' },
// ] as const

// export default function ProprietesMap() {
//   // inputs
//   const [prixMinInput, setPrixMinInput] = useState<string>('')
//   const [prixMaxInput, setPrixMaxInput] = useState<string>('')
//   const [surfaceMinInput, setSurfaceMinInput] = useState<string>('')
//   const [chambresMinInput, setChambresMinInput] = useState<string>('')

//   // équipements (multi-checkbox)
//   const [amenagementsSelected, setAmenagementsSelected] = useState<string[]>([])

//   const [runQuery, { data, loading, error }] = useLazyQuery<{
//     proprietesFiltrees: Propriete[]
//   }>(GET_PROPRIETES)

//   useEffect(() => {
//     runQuery()
//   }, [runQuery])

//   const toggleAmenagement = (value: string) => {
//     setAmenagementsSelected((prev) =>
//       prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
//     )
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     const prixMin = prixMinInput ? Number(prixMinInput) : undefined
//     const prixMax = prixMaxInput ? Number(prixMaxInput) : undefined
//     const surfaceMin = surfaceMinInput ? Number(surfaceMinInput) : undefined
//     const chambresMin = chambresMinInput ? Number(chambresMinInput) : undefined

//     const amenagementTypes =
//       amenagementsSelected.length > 0 ? amenagementsSelected : undefined

//     runQuery({
//       variables: { prixMin, prixMax, surfaceMin, chambresMin, amenagementTypes },
//     })
//   }

//   const handleClear = () => {
//     setPrixMinInput('')
//     setPrixMaxInput('')
//     setSurfaceMinInput('')
//     setChambresMinInput('')
//     setAmenagementsSelected([])
//     runQuery()
//   }

// return (
//   <div
//     style={{
//       borderRadius: '12px',
//       overflow: 'hidden',
//       boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)',
//       border: '1px solid #e5e7eb',
//     }}
//   >
//     {/* Barre de filtres - TOUJOURS visible */}
//     <div style={{ padding: '12px', background: '#f9fafb' }}>
//       <form
//         onSubmit={handleSubmit as (e: FormEvent) => void}
//         style={{
//           display: 'flex',
//           gap: '8px',
//           alignItems: 'center',
//           flexWrap: 'wrap',
//         }}
//       >
//         {/* TOUS VOS INPUTS/CHECKBOX/BUTTONS INCHANGÉS - copiez-les ici */}
//         <label style={{ marginRight: '8px' }}>
//           Prix min :
//           <input
//             type="number"
//             value={prixMinInput}
//             onChange={(e) => setPrixMinInput(e.target.value)}
//             style={{ marginLeft: '4px', width: '140px' }}
//           />
//         </label>
//         {/* PRIX MAX */}
//   <label style={{ marginRight: '8px' }}>
//     Prix max :
//     <input
//       type="number"
//       value={prixMaxInput}
//       onChange={(e) => setPrixMaxInput(e.target.value)}
//       style={{ marginLeft: '4px', width: '140px' }}
//     />
//   </label>

//   {/* SURFACE MIN */}
//   <label style={{ marginRight: '8px' }}>
//     Surface min :
//     <input
//       type="number"
//       value={surfaceMinInput}
//       onChange={(e) => setSurfaceMinInput(e.target.value)}
//       style={{ marginLeft: '4px', width: '140px' }}
//     />
//   </label>

//   {/* CHAMBRES MIN */}
//   <label style={{ marginRight: '8px' }}>
//     Chambres min :
//     <input
//       type="number"
//       value={chambresMinInput}
//       onChange={(e) => setChambresMinInput(e.target.value)}
//       style={{ marginLeft: '4px', width: '120px' }}
//     />
//   </label>

//   {/* ÉQUIPEMENTS */}
//   <div style={{
//     display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
//     padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white'
//   }}>
//     <span style={{ fontSize: '13px', color: '#374151' }}>Équipements :</span>
//     {AMENAGEMENT_CHOICES.map((a) => (
//       <label key={a.value} style={{ fontSize: '13px', color: '#111827' }}>
//         <input
//           type="checkbox"
//           checked={amenagementsSelected.includes(a.value)}
//           onChange={() => toggleAmenagement(a.value)}
//           style={{ marginRight: '6px' }}
//         />
//         {a.label}
//       </label>
//     ))}
//   </div>
//   {/* BOUTONS */}
//   <button
//     type="submit"
//     style={{
//       padding: '6px 12px', borderRadius: '6px', border: 'none',
//       backgroundColor: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '14px'
//     }}
//   >
//     Rechercher
//   </button>

//   <button
//     type="button"
//     onClick={handleClear}
//     style={{
//       padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db',
//       backgroundColor: 'white', color: '#374151', cursor: 'pointer', fontSize: '14px'
//     }}
//   >
//     Réinitialiser
//   </button>
//         {/* ... COPIEZ TOUS LES AUTRES LABELS/BUTTONS ICI (identique) ... */}
//         <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
//           {loading ? 'Recherche en cours...' : `${data?.proprietesFiltrees?.length || 0} résultat(s)`}
//         </span>
//       </form>
//     </div>

//     {/* Carte + overlays - TOUJOURS visible */}
//     <div style={{ position: 'relative', height: '520px' }}>
//       <MapContainer
//         center={[33.58, -7.6]}
//         zoom={13}
//         style={{ height: '100%', width: '100%' }}
//         scrollWheelZoom={true}
//         attributionControl={false}
//       >
//         <TileLayer
//           url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
//           attribution="&copy; OpenStreetMap contributors &copy; CARTO"
//         />
//         <AttributionControl prefix={false} />
//         <MarkerClusterGroup chunkedLoading>
//           {data?.proprietesFiltrees?.map((p) => (
//             <Marker key={p.id} position={[p.lat, p.lon]} icon={markerIcon}>
//               {/* VOTRE POPUP INCHANGÉE */}
//               <Popup>
//                 <div style={{ minWidth: '200px' }}>
//                   <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1e3a8a' }}>
//                     {p.titre}
//                   </h3>
//                   <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#111827' }}>
//                     <b>Prix :</b> {p.prix.toLocaleString('fr-MA')} MAD
//                   </p>
//                   <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}>
//                     <b>Surface :</b> {p.surface} m² · {p.chambres} ch
//                   </p>
//                   <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#6b7280' }}>
//                     {p.adresse}
//                   </p>
//                   <Link
//                     to={`/propriete/${p.id}`}
//                     style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'underline' }}
//                   >
//                     Voir fiche propriété
//                   </Link>
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MarkerClusterGroup>
//       </MapContainer>

//       {/* OVERLAYS - superposés sur la carte */}
      
//       {/* Loading */}
//       {loading && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             background: 'rgba(255,255,255,0.95)',
//             padding: '24px',
//             borderRadius: '12px',
//             textAlign: 'center',
//             boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
//             zIndex: 1000,
//           }}
//         >
//           🔍 Recherche en cours...
//         </div>
//       )}

//       {/* Aucune propriété */}
//       {!loading && data && data.proprietesFiltrees.length === 0 && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             background: 'rgba(255,255,255,0.95)',
//             padding: '24px',
//             borderRadius: '12px',
//             textAlign: 'center',
//             boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
//             zIndex: 1000,
//           }}
//         >
//           <h3 style={{ margin: '0 0 8px', color: '#374151' }}>🏠 Aucune propriété trouvée</h3>
//           <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
//             Essayez d'ajuster vos filtres
//           </p>
//         </div>
//       )}

//       {/* Erreur */}
//       {error && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '20px',
//             right: '20px',
//             background: '#fef2f2',
//             border: '1px solid #fecaca',
//             borderRadius: '8px',
//             color: '#dc2626',
//             padding: '12px',
//             maxWidth: '300px',
//             zIndex: 1000,
//           }}
//         >
//           Erreur: {error.message}
//           <br />
//           <button
//             onClick={() => runQuery()}
//             style={{
//               marginTop: '4px',
//               padding: '4px 8px',
//               background: '#dc2626',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontSize: '12px',
//             }}
//           >
//             Réessayer
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
  
// )


//   return (
//     <div
//       style={{
//         borderRadius: '12px',
//         overflow: 'hidden',
//         boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)',
//         border: '1px solid #e5e7eb',
//       }}
//     >
//       {/* Barre de filtres */}
//       <div style={{ padding: '12px', background: '#f9fafb' }}>
//         <form
//           onSubmit={handleSubmit}
//           style={{
//             display: 'flex',
//             gap: '8px',
//             alignItems: 'center',
//             flexWrap: 'wrap',
//           }}
//         >
//           <label style={{ marginRight: '8px' }}>
//             Prix min :
//             <input
//               type="number"
//               value={prixMinInput}
//               onChange={(e) => setPrixMinInput(e.target.value)}
//               style={{ marginLeft: '4px', width: '140px' }}
//             />
//           </label>

//           <label style={{ marginRight: '8px' }}>
//             Prix max :
//             <input
//               type="number"
//               value={prixMaxInput}
//               onChange={(e) => setPrixMaxInput(e.target.value)}
//               style={{ marginLeft: '4px', width: '140px' }}
//             />
//           </label>

//           <label style={{ marginRight: '8px' }}>
//             Surface min :
//             <input
//               type="number"
//               value={surfaceMinInput}
//               onChange={(e) => setSurfaceMinInput(e.target.value)}
//               style={{ marginLeft: '4px', width: '140px' }}
//             />
//           </label>

//           <label style={{ marginRight: '8px' }}>
//             Chambres min :
//             <input
//               type="number"
//               value={chambresMinInput}
//               onChange={(e) => setChambresMinInput(e.target.value)}
//               style={{ marginLeft: '4px', width: '120px' }}
//             />
//           </label>

//           {/* équipements */}
//           <div
//             style={{
//               display: 'flex',
//               gap: '10px',
//               alignItems: 'center',
//               flexWrap: 'wrap',
//               padding: '6px 8px',
//               border: '1px solid #e5e7eb',
//               borderRadius: '8px',
//               background: 'white',
//             }}
//           >
//             <span style={{ fontSize: '13px', color: '#374151' }}>
//               Équipements :
//             </span>
//             {AMENAGEMENT_CHOICES.map((a) => (
//               <label key={a.value} style={{ fontSize: '13px', color: '#111827' }}>
//                 <input
//                   type="checkbox"
//                   checked={amenagementsSelected.includes(a.value)}
//                   onChange={() => toggleAmenagement(a.value)}
//                   style={{ marginRight: '6px' }}
//                 />
//                 {a.label}
//               </label>
//             ))}
//           </div>

//           <button
//             type="submit"
//             style={{
//               padding: '6px 12px',
//               borderRadius: '6px',
//               border: 'none',
//               backgroundColor: '#2563eb',
//               color: 'white',
//               cursor: 'pointer',
//               fontSize: '14px',
//             }}
//           >
//             Rechercher
//           </button>

//           <button
//             type="button"
//             onClick={handleClear}
//             style={{
//               padding: '6px 12px',
//               borderRadius: '6px',
//               border: '1px solid #d1d5db',
//               backgroundColor: 'white',
//               color: '#374151',
//               cursor: 'pointer',
//               fontSize: '14px',
//             }}
//           >
//             Réinitialiser
//           </button>

//           <span
//             style={{
//               fontSize: '12px',
//               color: '#6b7280',
//               marginLeft: '8px',
//             }}
//           >
//             {loading ? 'Recherche en cours...' : 'Résultats à jour'}
//           </span>
//         </form>
//       </div>

//       <MapContainer
//         center={[33.58, -7.6]}
//         zoom={13}
//         style={{ height: '520px', width: '100%' }}
//         scrollWheelZoom={true}
//         attributionControl={false}
//       >
//         <TileLayer
//           url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
//           attribution="&copy; OpenStreetMap contributors &copy; CARTO"
//         />
//         <AttributionControl prefix={false} />
//         <MarkerClusterGroup chunkedLoading>
//           {data?.proprietesFiltrees.map((p) => (
//             <Marker key={p.id} position={[p.lat, p.lon]} icon={markerIcon}>
//               <Popup>
//                 <div style={{ minWidth: '200px' }}>
//                   <h3
//                     style={{
//                       margin: '0 0 4px',
//                       fontSize: '16px',
//                       color: '#1e3a8a',
//                     }}
//                   >
//                     {p.titre}
//                   </h3>
//                   <p
//                     style={{
//                       margin: '0 0 4px',
//                       fontSize: '14px',
//                       color: '#111827',
//                     }}
//                   >
//                     <b>Prix :</b> {p.prix.toLocaleString('fr-MA')} MAD
//                   </p>
//                   <p
//                     style={{
//                       margin: '0 0 4px',
//                       fontSize: '13px',
//                       color: '#374151',
//                     }}
//                   >
//                     <b>Surface :</b> {p.surface} m² · {p.chambres} ch
//                   </p>
//                   <p
//                     style={{
//                       margin: '0 0 8px',
//                       fontSize: '12px',
//                       color: '#6b7280',
//                     }}
//                   >
//                     {p.adresse}
//                   </p>

//                   <Link
//                     to={`/propriete/${p.id}`}
//                     style={{
//                       fontSize: '12px',
//                       color: '#2563eb',
//                       textDecoration: 'underline',
//                     }}
//                   >
//                     Voir fiche propriété
//                   </Link>
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MarkerClusterGroup>
//       </MapContainer>
//     </div>
//   )
// }
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  AttributionControl,
} from "react-leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import "react-leaflet-cluster/dist/assets/MarkerCluster.css"
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css"

import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
  Chip,
  CircularProgress,
  Container,
  alpha,
  Paper,
  Divider,
} from "@mui/material"
import {
  Search as SearchIcon,
  RestartAlt as RestartAltIcon,
  Bed as BedIcon,
  SquareFoot as SquareFootIcon,
  ChevronRight as ChevronRightIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material"

import { gql } from "@apollo/client"
import { useLazyQuery } from "@apollo/client/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// --- Types & GraphQL ---
interface Propriete {
  id: string
  titre: string
  prix: number
  adresse: string
  lat: number
  lon: number
  surface: number
  chambres: number
}

const GET_PROPRIETES = gql`
  query ProprieteFiltrees(
    $prixMin: Float
    $prixMax: Float
    $surfaceMin: Int
    $chambresMin: Int
    $amenagementTypes: [String!]
  ) {
    proprietesFiltrees(
      prixMin: $prixMin
      prixMax: $prixMax
      surfaceMin: $surfaceMin
      chambresMin: $chambresMin
      amenagementTypes: $amenagementTypes
    ) {
      id
      titre
      prix
      adresse
      lat
      lon
      surface
      chambres
    }
  }
`

// --- Configuration Icone Leaflet (Standard Robuste) ---
const markerIcon = new Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const AMENAGEMENT_CHOICES = [
  "Piscine",
  "Garage",
  "Jardin",
  "Ascenseur",
  "Terrasse",
]

export default function ProprietesMap() {
  const [filters, setFilters] = useState({
    prixMin: "",
    prixMax: "",
    surfaceMin: "",
    chambresMin: "",
  })

  const [amenagements, setAmenagements] = useState<string[]>([])

  const [runQuery, { data, loading }] = useLazyQuery<{
    proprietesFiltrees: Propriete[]
  }>(GET_PROPRIETES)

  useEffect(() => {
    runQuery()
  }, [runQuery])

  const handleSearch = () => {
    runQuery({
      variables: {
        prixMin: filters.prixMin ? Number(filters.prixMin) : undefined,
        prixMax: filters.prixMax ? Number(filters.prixMax) : undefined,
        surfaceMin: filters.surfaceMin ? Number(filters.surfaceMin) : undefined,
        chambresMin: filters.chambresMin ? Number(filters.chambresMin) : undefined,
        amenagementTypes: amenagements.length > 0 ? amenagements : undefined,
      },
    })
  }

  const handleReset = () => {
    setFilters({
      prixMin: "",
      prixMax: "",
      surfaceMin: "",
      chambresMin: "",
    })
    setAmenagements([])
    runQuery()
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* HEADER SECTION - TEXTES CORRIGÉS */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 900, 
            mb: 1,
            background: 'linear-gradient(135deg, #0F172A 0%, #4F46E5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Roboto',
            letterSpacing: "-1px"
          }}
        >
          GraphImmo - Carte Immobilière
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 400,
            fontFamily: 'Roboto'
          }}
        >
          Explorez et trouvez la propriété de vos rêves
        </Typography>
      </Box>

      {/* MAIN CARD CONTAINER */}
      <Card sx={{ borderRadius: 4, boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "none", overflow: 'hidden' }}>
        
        {/* FILTERS PANEL */}
        <CardContent sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider", bgcolor: "#F8FAFC" }}>
          <Stack spacing={3}>
            
            {/* INPUTS ROW */}
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ gap: 2 }}>
              <TextField
                label="Prix Min (MAD)" size="small" type="number"
                value={filters.prixMin}
                onChange={(e) => setFilters({ ...filters, prixMin: e.target.value })}
                sx={{ width: { xs: '100%', sm: 160 }, bgcolor: 'white' }}
              />
              <TextField
                label="Prix Max (MAD)" size="small" type="number"
                value={filters.prixMax}
                onChange={(e) => setFilters({ ...filters, prixMax: e.target.value })}
                sx={{ width: { xs: '100%', sm: 160 }, bgcolor: 'white' }}
              />
              <TextField
                label="Surf. Min (m²)" size="small" type="number"
                value={filters.surfaceMin}
                onChange={(e) => setFilters({ ...filters, surfaceMin: e.target.value })}
                sx={{ width: { xs: '100%', sm: 140 }, bgcolor: 'white' }}
              />
              <TextField
                label="Chambres Min" size="small" type="number"
                value={filters.chambresMin}
                onChange={(e) => setFilters({ ...filters, chambresMin: e.target.value })}
                sx={{ width: { xs: '100%', sm: 140 }, bgcolor: 'white' }}
              />

              <Box sx={{ flexGrow: 1 }} />

              <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Button 
                  fullWidth
                  variant="outlined" 
                  startIcon={<RestartAltIcon />} 
                  onClick={handleReset} 
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  Reset
                </Button>
                <Button 
                  fullWidth
                  variant="contained" 
                  startIcon={<SearchIcon />} 
                  onClick={handleSearch} 
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none', 
                    fontWeight: 600,
                    bgcolor: '#4F46E5', 
                    '&:hover': { bgcolor: '#3730A3' } 
                  }}
                >
                  Rechercher
                </Button>
              </Stack>
            </Stack>

            <Divider />

            {/* CHIPS ROW (AMENAGEMENTS) */}
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
              <Typography variant="body2" fontWeight={700} color="text.secondary">Équipements :</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {AMENAGEMENT_CHOICES.map((a) => (
                  <Chip
                    key={a}
                    label={a}
                    clickable
                    onClick={() =>
                      setAmenagements((prev) =>
                        prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
                      )
                    }
                    color={amenagements.includes(a) ? "primary" : "default"}
                    variant={amenagements.includes(a) ? "filled" : "outlined"}
                    sx={{ fontWeight: 500, borderRadius: '8px' }}
                  />
                ))}
              </Stack>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#4F46E5' }}>
                {loading ? <CircularProgress size={16} /> : `${data?.proprietesFiltrees?.length || 0} propriétés trouvées`}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>

        {/* MAP VIEW */}
        <Box sx={{ height: "65vh", position: "relative" }}>
          <MapContainer 
            center={[33.58, -7.6]} 
            zoom={12} 
            style={{ height: "100%", width: "100%" }} 
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            <MarkerClusterGroup chunkedLoading>
              {data?.proprietesFiltrees?.map((p) => (
                <Marker key={p.id} position={[p.lat, p.lon]} icon={markerIcon}>
                  <Popup minWidth={250}>
                    <Box sx={{ p: 0.5 }}>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#1E293B', mb: 0.5 }}>
                        {p.titre}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#4F46E5', fontWeight: 700, mb: 1 }}>
                        {p.prix.toLocaleString("fr-MA")} MAD
                      </Typography>
                      
                      <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <SquareFootIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>{p.surface} m²</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>{p.chambres} Ch.</Typography>
                        </Box>
                      </Stack>

                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                        {p.adresse}
                      </Typography>

                      <Divider sx={{ my: 1 }} />
                      
                      <Button 
                        component={Link} 
                        to={`/propriete/${p.id}`}
                        fullWidth 
                        size="small" 
                        variant="contained" 
                        endIcon={<ChevronRightIcon />}
                        sx={{ 
                          mt: 0.5, 
                          textTransform: 'none', 
                          borderRadius: 1.5, 
                          bgcolor: '#0F172A',
                          '&:hover': { bgcolor: '#1E293B' }
                        }}
                      >
                        Fiche complète
                      </Button>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>

          {/* LOADING OVERLAY */}
          {loading && (
            <Box sx={{ 
              position: "absolute", inset: 0, zIndex: 1000,
              display: "flex", alignItems: "center", justifyContent: "center", 
              background: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)" 
            }}>
              <CircularProgress thickness={5} sx={{ color: '#4F46E5' }} />
            </Box>
          )}

          {/* EMPTY STATE */}
          {!loading && data?.proprietesFiltrees?.length === 0 && (
            <Paper sx={{ 
              position: "absolute", top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
              p: 4, textAlign: 'center', zIndex: 1000, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" 
            }}>
              <LocationOnIcon sx={{ fontSize: 48, color: alpha('#4F46E5', 0.2), mb: 2 }} />
              <Typography variant="h6" fontWeight={700}>Aucun résultat</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ajustez vos filtres pour voir plus de biens.
              </Typography>
              <Button size="small" variant="outlined" onClick={handleReset}>Effacer tout</Button>
            </Paper>
          )}
        </Box>
      </Card>
    </Container>
  )
}