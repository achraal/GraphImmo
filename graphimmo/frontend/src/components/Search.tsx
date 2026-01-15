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
//   const { searchState, setSearchState } = useSearchContext()
  
//   // === TOUS LES ÉTATS (UNE SEULE FOIS) ===
//   const [commune, setCommune] = useState(searchState.formData?.commune || "")
//   const [quartierId, setQuartierId] = useState(searchState.formData?.quartierId || "")
//   const [latLoc, setLatLoc] = useState(searchState.formData?.latLoc || "")
//   const [lonLoc, setLonLoc] = useState(searchState.formData?.lonLoc || "")
//   const [rayonKmLoc, setRayonKmLoc] = useState(searchState.formData?.rayonKmLoc || "")
  
//   const [tri, setTri] = useState<"PERTINENCE" | "PRIX" | "DATE_DEPOT">(
//     searchState.formData?.tri || "PERTINENCE"
//   )
//   const [ordre, setOrdre] = useState<"DESC" | "ASC">(
//     searchState.formData?.ordre || "DESC"
//   )
//   const [limit, setLimit] = useState(searchState.formData?.limit || "20")
//   const [modeActif, setModeActif] = useState<ModeActif>(searchState.modeActif || 'aucun')

//   // === QUERIES ===
//   const [runLoc, { data: dataLoc, loading: loadingLoc, error: errorLoc }] = 
//     useLazyQuery<{ rechercheLocalisation: Propriete[] }>(RECHERCHE_LOCALISATION)

//   const [runTri, { data: dataTri, loading: loadingTri, error: errorTri }] = 
//     useLazyQuery<{ proprietesTriees: Propriete[] }>(PROPRIETES_TRIEE)

//   // === useEffect 1: RESTAURATION AU MONTAGE ===
//   useEffect(() => {
//     if (searchState.modeActif === 'localisation' && searchState.formData?.variables) {
//       runLoc({ variables: searchState.formData.variables })
//     } else if (searchState.modeActif === 'tri' && searchState.formData?.variables) {
//       runTri({ variables: searchState.formData.variables })
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   // === useEffect 2: SAUVEGARDER RÉSULTATS LOCALISATION ===
//   useEffect(() => {
//     if (dataLoc?.rechercheLocalisation && modeActif === 'localisation') {
//       setSearchState({
//         modeActif: 'localisation',
//         results: dataLoc.rechercheLocalisation,
//         formData: { 
//           commune, quartierId, latLoc, lonLoc, rayonKmLoc,
//           variables: {
//             commune: commune || null,
//             quartierId: quartierId || null,
//             lat: latLoc ? Number(latLoc) : null,
//             lon: lonLoc ? Number(lonLoc) : null,
//             rayonKm: rayonKmLoc ? Number(rayonKmLoc) : null,
//           }
//         }
//       })
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dataLoc])

//   // === useEffect 3: SAUVEGARDER RÉSULTATS TRI ===
//   useEffect(() => {
//     if (dataTri?.proprietesTriees && modeActif === 'tri') {
//       setSearchState({
//         modeActif: 'tri',
//         results: dataTri.proprietesTriees,
//         formData: { 
//           tri, ordre, limit,
//           variables: { tri, ordre, limit: Number(limit) }
//         }
//       })
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dataTri])

//   // === FORMULAIRE LOCALISATION ===
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
//     // ❌ ENLEVER setSearchState d'ici - il est maintenant dans useEffect
//   }

//   // === FORMULAIRE TRI ===
//   const onSubmitTri = (e: React.FormEvent) => {
//     e.preventDefault()
//     setModeActif('tri')
//     runTri({
//       variables: { tri, ordre, limit: Number(limit) },
//     })
//   }

//   // === RESET ===
//   const handleReset = () => {
//     setCommune(''); setQuartierId(''); setLatLoc(''); setLonLoc(''); setRayonKmLoc('')
//     setTri('PERTINENCE'); setOrdre('DESC'); setLimit('20')
//     setModeActif('aucun')
    
    
//     setSearchState({
//       modeActif: 'aucun',
//       results: [],
//       formData: {}
//     })
//   }

//   // === RÉSULTATS ===
//   const loading = loadingLoc || loadingTri
//   const error = errorLoc || errorTri
  
  
//   const results = searchState.results.length > 0 
//     ? searchState.results 
//     : modeActif === 'localisation' ? (dataLoc?.rechercheLocalisation ?? [])
//     : modeActif === 'tri' ? (dataTri?.proprietesTriees ?? [])
//     : []

//   return (
//     <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>
//       {/* CONTROLE MODES */}
//       <div style={{ marginBottom: 16, padding: 12, background: '#f0f9ff', borderRadius: 8, borderLeft: '4px solid #0ea5e9' }}>
//         <strong>Mode actuel: </strong>
//         <span style={{ 
//           color: modeActif === 'localisation' ? '#059669' : 
//                 modeActif === 'tri' ? '#dc2626' : '#6b7280',
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
import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Sort as SortIcon,
  DeleteOutline as ResetIcon,
  Search as SearchIcon,
  Map as MapIcon
} from "@mui/icons-material";
import { useSearchContext } from '../contexts/SearchContext';
import ProprieteCard from "../components/ProprieteCard";

const RECHERCHE_LOCALISATION = gql`
  query RechercheLocalisation($commune: String, $quartierId: String, $lat: Float, $lon: Float, $rayonKm: Float) {
    rechercheLocalisation(commune: $commune, quartierId: $quartierId, lat: $lat, lon: $lon, rayonKm: $rayonKm) {
      id titre prix adresse surface chambres lat lon
    }
  }
`;

const PROPRIETES_TRIEE = gql`
  query ProprietesTriees($tri: TriPropriete, $ordre: OrdreType, $limit: Int) {
    proprietesTriees(tri: $tri, ordre: $ordre, limit: $limit) {
      id titre prix adresse surface chambres lat lon
    }
  }
`;

type Propriete = { id: string; titre: string; prix: number; adresse: string; surface: number; chambres: number; lat: number; lon: number; };
type ModeActif = 'aucun' | 'localisation' | 'tri';

export default function Search() {
  const { searchState, setSearchState } = useSearchContext();
  const [activeTab, setActiveTab] = useState(searchState.modeActif === 'tri' ? 1 : 0);

  // --- ÉTATS DES FORMULAIRES ---
  const [commune, setCommune] = useState(searchState.formData?.commune || "");
  const [quartierId, setQuartierId] = useState(searchState.formData?.quartierId || "");
  const [latLoc, setLatLoc] = useState(searchState.formData?.latLoc || "");
  const [lonLoc, setLonLoc] = useState(searchState.formData?.lonLoc || "");
  const [rayonKmLoc, setRayonKmLoc] = useState(searchState.formData?.rayonKmLoc || "");
  
  const [tri, setTri] = useState<"PERTINENCE" | "PRIX" | "DATE_DEPOT">(searchState.formData?.tri || "PERTINENCE");
  const [ordre, setOrdre] = useState<"DESC" | "ASC">(searchState.formData?.ordre || "DESC");
  const [limit, setLimit] = useState(searchState.formData?.limit || "20");
  const [modeActif, setModeActif] = useState<ModeActif>(searchState.modeActif || 'aucun');

  // --- QUERIES ---
  const [runLoc, { data: dataLoc, loading: loadingLoc, error: errorLoc }] = useLazyQuery(RECHERCHE_LOCALISATION);
  const [runTri, { data: dataTri, loading: loadingTri, error: errorTri }] = useLazyQuery(PROPRIETES_TRIEE);

  // Restauration au montage
  useEffect(() => {
    if (searchState.modeActif === 'localisation' && searchState.formData?.variables) {
      runLoc({ variables: searchState.formData.variables });
    } else if (searchState.modeActif === 'tri' && searchState.formData?.variables) {
      runTri({ variables: searchState.formData.variables });
    }
  }, []);

  // Sauvegarde Localisation
  useEffect(() => {
    if (dataLoc?.rechercheLocalisation && modeActif === 'localisation') {
      setSearchState({
        modeActif: 'localisation',
        results: dataLoc.rechercheLocalisation,
        formData: { commune, quartierId, latLoc, lonLoc, rayonKmLoc, variables: { commune: commune || null, quartierId: quartierId || null, lat: latLoc ? Number(latLoc) : null, lon: lonLoc ? Number(lonLoc) : null, rayonKm: rayonKmLoc ? Number(rayonKmLoc) : null }}
      });
    }
  }, [dataLoc]);

  // Sauvegarde Tri
  useEffect(() => {
    if (dataTri?.proprietesTriees && modeActif === 'tri') {
      setSearchState({
        modeActif: 'tri',
        results: dataTri.proprietesTriees,
        formData: { tri, ordre, limit, variables: { tri, ordre, limit: Number(limit) }}
      });
    }
  }, [dataTri]);

  const onSubmitLoc = (e: React.FormEvent) => {
    e.preventDefault();
    setModeActif('localisation');
    runLoc({ variables: { commune: commune || null, quartierId: quartierId || null, lat: latLoc ? Number(latLoc) : null, lon: lonLoc ? Number(lonLoc) : null, rayonKm: rayonKmLoc ? Number(rayonKmLoc) : null }});
  };

  const onSubmitTri = (e: React.FormEvent) => {
    e.preventDefault();
    setModeActif('tri');
    runTri({ variables: { tri, ordre, limit: Number(limit) }});
  };

  const handleReset = () => {
    setCommune(''); setQuartierId(''); setLatLoc(''); setLonLoc(''); setRayonKmLoc('');
    setTri('PERTINENCE'); setOrdre('DESC'); setLimit('20');
    setModeActif('aucun');
    setSearchState({ modeActif: 'aucun', results: [], formData: {} });
  };

  const results = searchState.results;
  const loading = loadingLoc || loadingTri;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* HEADER SECTION */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Recherche
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Trouvez le bien idéal selon vos critères précis
          </Typography>
        </Box>
        <Tooltip title="Réinitialiser les filtres">
          <IconButton onClick={handleReset} sx={{ color: 'error.main', bgcolor: 'error.light', '&:hover': { bgcolor: '#fee2e2' } }}>
            <ResetIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* TABS FOR MODES */}
      <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, n) => setActiveTab(n)} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<LocationIcon />} label="Par Localisation" sx={{ fontWeight: 600 }} />
          <Tab icon={<SortIcon />} label="Par Tri & Filtres" sx={{ fontWeight: 600 }} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 ? (
            <form onSubmit={onSubmitLoc}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" label="Commune" placeholder="Casablanca" value={commune} onChange={(e) => setCommune(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" label="ID Quartier" value={quartierId} onChange={(e) => setQuartierId(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth size="small" label="Latitude" value={latLoc} onChange={(e) => setLatLoc(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth size="small" label="Longitude" value={lonLoc} onChange={(e) => setLonLoc(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth size="small" label="Rayon (km)" value={rayonKmLoc} onChange={(e) => setRayonKmLoc(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" type="submit" startIcon={<SearchIcon />} sx={{ py: 1.2 }}>
                    Rechercher dans cette zone
                  </Button>
                </Grid>
              </Grid>
            </form>
          ) : (
            <form onSubmit={onSubmitTri}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Trier par</InputLabel>
                    <Select label="Trier par" value={tri} onChange={(e) => setTri(e.target.value as any)}>
                      <MenuItem value="PERTINENCE">Pertinence</MenuItem>
                      <MenuItem value="PRIX">Prix</MenuItem>
                      <MenuItem value="DATE_DEPOT">Date d'ajout</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Ordre</InputLabel>
                    <Select label="Ordre" value={ordre} onChange={(e) => setOrdre(e.target.value as any)}>
                      <MenuItem value="DESC">Descendant</MenuItem>
                      <MenuItem value="ASC">Ascendant</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth size="small" label="Limite" type="number" value={limit} onChange={(e) => setLimit(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" color="secondary" type="submit" startIcon={<SortIcon />} sx={{ py: 1.2 }}>
                    Appliquer le tri
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
      </Paper>

      {/* RESULTS STATUS */}
      {loading && (
        <Box textAlign="center" py={4}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }} color="text.secondary">Recherche des meilleurs biens...</Typography>
        </Box>
      )}

      {errorLoc || errorTri ? (
        <Alert severity="error" sx={{ mb: 3 }}>{errorLoc?.message || errorTri?.message}</Alert>
      ) : null}

      {/* LIST OF RESULTS */}
      <Stack spacing={2}>
        {!loading && results.length > 0 && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 1 }}>
            {results.length} propriétés trouvées
          </Typography>
        )}
        
        {results.map((p) => (
          <ProprieteCard key={p.id} id={p.id} />
        ))}

        {!loading && results.length === 0 && modeActif !== 'aucun' && (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, bgcolor: 'background.default' }}>
            <MapIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Aucune propriété trouvée</Typography>
            <Typography variant="body2" color="text.disabled">Essayez d'élargir votre zone de recherche ou de changer les filtres.</Typography>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}