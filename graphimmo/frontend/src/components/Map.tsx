import L from 'leaflet'
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

const customMarkerIcon = L.divIcon({
  html: `<img src="/free-location-pin-icon-2965-thumb.png" class="inner-pin-img" />`,
  className: 'custom-png-container', // On ne met plus l'animation ici
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -45],
});

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
      {/* HEADER SECTION */}
<Box sx={{ 
  mb: 6, 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  gap: 25, // Espace important entre le texte et le logo
  flexDirection: { xs: 'column-reverse', md: 'row' } 
}}>
  
  {/* TEXTES (À GAUCHE, CENTRÉS ENTRE EUX) */}
  <Stack sx={{ textAlign: 'center' }}>
    <Typography 
      variant="h3" 
      sx={{ 
        fontWeight: 900, 
        lineHeight: 1.2,
        background: 'linear-gradient(135deg, #0F172A 0%, #4F46E5 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: 'Roboto',
        letterSpacing: "-1px",
        fontSize: { xs: '1.8rem', md: '2.8rem' }
      }}
    >
      GraphImmo - Carte Immobilière
    </Typography>
    <Typography 
      variant="h6" 
      sx={{ 
        color: 'text.secondary',
        fontWeight: 400,
        fontFamily: 'Roboto',
        mt: 1, // Petit espace sous le titre
        fontSize: { xs: '1rem', md: '1.2rem' }
      }}
    >
      Explorez et trouvez la propriété de vos rêves
    </Typography>
  </Stack>

  {/* LOGO (À DROITE) */}
  <Box 
    component="img"
    src="/graphimmo.png" 
    alt="Logo GraphImmo"
    sx={{ 
      height: { xs: 70, md: 130 }, 
      width: 'auto',
      flexShrink: 0
    }} 
  />
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
  preferCanvas={true} // Utilise le GPU pour le rendu
  style={{ height: "100%", width: "100%" }} 
  attributionControl={false}
  zoomControl={false} // Optionnel: pour un look plus épuré
>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            <MarkerClusterGroup chunkedLoading>
              {data?.proprietesFiltrees?.map((p) => (
                <Marker key={p.id} position={[p.lat, p.lon]} icon={customMarkerIcon}>
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
