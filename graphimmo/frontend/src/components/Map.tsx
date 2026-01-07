// src/components/Map.tsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  AttributionControl,
} from 'react-leaflet'
import { useLazyQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
import { Link } from 'react-router-dom'

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

const markerIcon = new Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const AMENAGEMENT_CHOICES = [
  { label: 'Piscine', value: 'Piscine' },
  { label: 'Garage', value: 'Garage' },
  { label: 'Jardin', value: 'Jardin' },
  { label: 'Ascenseur', value: 'Ascenseur' },
  { label: 'Terrasse', value: 'Terrasse' },
] as const

export default function ProprietesMap() {
  // inputs
  const [prixMinInput, setPrixMinInput] = useState<string>('')
  const [prixMaxInput, setPrixMaxInput] = useState<string>('')
  const [surfaceMinInput, setSurfaceMinInput] = useState<string>('')
  const [chambresMinInput, setChambresMinInput] = useState<string>('')

  // équipements (multi-checkbox)
  const [amenagementsSelected, setAmenagementsSelected] = useState<string[]>([])

  const [runQuery, { data, loading, error }] = useLazyQuery<{
    proprietesFiltrees: Propriete[]
  }>(GET_PROPRIETES)

  useEffect(() => {
    runQuery()
  }, [runQuery])

  const toggleAmenagement = (value: string) => {
    setAmenagementsSelected((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const prixMin = prixMinInput ? Number(prixMinInput) : undefined
    const prixMax = prixMaxInput ? Number(prixMaxInput) : undefined
    const surfaceMin = surfaceMinInput ? Number(surfaceMinInput) : undefined
    const chambresMin = chambresMinInput ? Number(chambresMinInput) : undefined

    const amenagementTypes =
      amenagementsSelected.length > 0 ? amenagementsSelected : undefined

    runQuery({
      variables: { prixMin, prixMax, surfaceMin, chambresMin, amenagementTypes },
    })
  }

  const handleClear = () => {
    setPrixMinInput('')
    setPrixMaxInput('')
    setSurfaceMinInput('')
    setChambresMinInput('')
    setAmenagementsSelected([])
    runQuery()
  }

return (
  <div
    style={{
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)',
      border: '1px solid #e5e7eb',
    }}
  >
    {/* Barre de filtres - TOUJOURS visible */}
    <div style={{ padding: '12px', background: '#f9fafb' }}>
      <form
        onSubmit={handleSubmit as (e: FormEvent) => void}
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* TOUS VOS INPUTS/CHECKBOX/BUTTONS INCHANGÉS - copiez-les ici */}
        <label style={{ marginRight: '8px' }}>
          Prix min :
          <input
            type="number"
            value={prixMinInput}
            onChange={(e) => setPrixMinInput(e.target.value)}
            style={{ marginLeft: '4px', width: '140px' }}
          />
        </label>
        {/* PRIX MAX */}
  <label style={{ marginRight: '8px' }}>
    Prix max :
    <input
      type="number"
      value={prixMaxInput}
      onChange={(e) => setPrixMaxInput(e.target.value)}
      style={{ marginLeft: '4px', width: '140px' }}
    />
  </label>

  {/* SURFACE MIN */}
  <label style={{ marginRight: '8px' }}>
    Surface min :
    <input
      type="number"
      value={surfaceMinInput}
      onChange={(e) => setSurfaceMinInput(e.target.value)}
      style={{ marginLeft: '4px', width: '140px' }}
    />
  </label>

  {/* CHAMBRES MIN */}
  <label style={{ marginRight: '8px' }}>
    Chambres min :
    <input
      type="number"
      value={chambresMinInput}
      onChange={(e) => setChambresMinInput(e.target.value)}
      style={{ marginLeft: '4px', width: '120px' }}
    />
  </label>

  {/* ÉQUIPEMENTS */}
  <div style={{
    display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
    padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white'
  }}>
    <span style={{ fontSize: '13px', color: '#374151' }}>Équipements :</span>
    {AMENAGEMENT_CHOICES.map((a) => (
      <label key={a.value} style={{ fontSize: '13px', color: '#111827' }}>
        <input
          type="checkbox"
          checked={amenagementsSelected.includes(a.value)}
          onChange={() => toggleAmenagement(a.value)}
          style={{ marginRight: '6px' }}
        />
        {a.label}
      </label>
    ))}
  </div>
  {/* BOUTONS */}
  <button
    type="submit"
    style={{
      padding: '6px 12px', borderRadius: '6px', border: 'none',
      backgroundColor: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '14px'
    }}
  >
    Rechercher
  </button>

  <button
    type="button"
    onClick={handleClear}
    style={{
      padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db',
      backgroundColor: 'white', color: '#374151', cursor: 'pointer', fontSize: '14px'
    }}
  >
    Réinitialiser
  </button>
        {/* ... COPIEZ TOUS LES AUTRES LABELS/BUTTONS ICI (identique) ... */}
        <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
          {loading ? 'Recherche en cours...' : `${data?.proprietesFiltrees?.length || 0} résultat(s)`}
        </span>
      </form>
    </div>

    {/* Carte + overlays - TOUJOURS visible */}
    <div style={{ position: 'relative', height: '520px' }}>
      <MapContainer
        center={[33.58, -7.6]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />
        <AttributionControl prefix={false} />
        <MarkerClusterGroup chunkedLoading>
          {data?.proprietesFiltrees?.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lon]} icon={markerIcon}>
              {/* VOTRE POPUP INCHANGÉE */}
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#1e3a8a' }}>
                    {p.titre}
                  </h3>
                  <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#111827' }}>
                    <b>Prix :</b> {p.prix.toLocaleString('fr-MA')} MAD
                  </p>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}>
                    <b>Surface :</b> {p.surface} m² · {p.chambres} ch
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#6b7280' }}>
                    {p.adresse}
                  </p>
                  <Link
                    to={`/propriete/${p.id}`}
                    style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'underline' }}
                  >
                    Voir fiche propriété
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* OVERLAYS - superposés sur la carte */}
      
      {/* Loading */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.95)',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          🔍 Recherche en cours...
        </div>
      )}

      {/* Aucune propriété */}
      {!loading && data && data.proprietesFiltrees.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.95)',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          <h3 style={{ margin: '0 0 8px', color: '#374151' }}>🏠 Aucune propriété trouvée</h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Essayez d'ajuster vos filtres
          </p>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            padding: '12px',
            maxWidth: '300px',
            zIndex: 1000,
          }}
        >
          Erreur: {error.message}
          <br />
          <button
            onClick={() => runQuery()}
            style={{
              marginTop: '4px',
              padding: '4px 8px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  </div>
  
)


  return (
    <div
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)',
        border: '1px solid #e5e7eb',
      }}
    >
      {/* Barre de filtres */}
      <div style={{ padding: '12px', background: '#f9fafb' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <label style={{ marginRight: '8px' }}>
            Prix min :
            <input
              type="number"
              value={prixMinInput}
              onChange={(e) => setPrixMinInput(e.target.value)}
              style={{ marginLeft: '4px', width: '140px' }}
            />
          </label>

          <label style={{ marginRight: '8px' }}>
            Prix max :
            <input
              type="number"
              value={prixMaxInput}
              onChange={(e) => setPrixMaxInput(e.target.value)}
              style={{ marginLeft: '4px', width: '140px' }}
            />
          </label>

          <label style={{ marginRight: '8px' }}>
            Surface min :
            <input
              type="number"
              value={surfaceMinInput}
              onChange={(e) => setSurfaceMinInput(e.target.value)}
              style={{ marginLeft: '4px', width: '140px' }}
            />
          </label>

          <label style={{ marginRight: '8px' }}>
            Chambres min :
            <input
              type="number"
              value={chambresMinInput}
              onChange={(e) => setChambresMinInput(e.target.value)}
              style={{ marginLeft: '4px', width: '120px' }}
            />
          </label>

          {/* équipements */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap',
              padding: '6px 8px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: 'white',
            }}
          >
            <span style={{ fontSize: '13px', color: '#374151' }}>
              Équipements :
            </span>
            {AMENAGEMENT_CHOICES.map((a) => (
              <label key={a.value} style={{ fontSize: '13px', color: '#111827' }}>
                <input
                  type="checkbox"
                  checked={amenagementsSelected.includes(a.value)}
                  onChange={() => toggleAmenagement(a.value)}
                  style={{ marginRight: '6px' }}
                />
                {a.label}
              </label>
            ))}
          </div>

          <button
            type="submit"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Rechercher
          </button>

          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Réinitialiser
          </button>

          <span
            style={{
              fontSize: '12px',
              color: '#6b7280',
              marginLeft: '8px',
            }}
          >
            {loading ? 'Recherche en cours...' : 'Résultats à jour'}
          </span>
        </form>
      </div>

      <MapContainer
        center={[33.58, -7.6]}
        zoom={13}
        style={{ height: '520px', width: '100%' }}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />
        <AttributionControl prefix={false} />
        <MarkerClusterGroup chunkedLoading>
          {data?.proprietesFiltrees.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lon]} icon={markerIcon}>
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h3
                    style={{
                      margin: '0 0 4px',
                      fontSize: '16px',
                      color: '#1e3a8a',
                    }}
                  >
                    {p.titre}
                  </h3>
                  <p
                    style={{
                      margin: '0 0 4px',
                      fontSize: '14px',
                      color: '#111827',
                    }}
                  >
                    <b>Prix :</b> {p.prix.toLocaleString('fr-MA')} MAD
                  </p>
                  <p
                    style={{
                      margin: '0 0 4px',
                      fontSize: '13px',
                      color: '#374151',
                    }}
                  >
                    <b>Surface :</b> {p.surface} m² · {p.chambres} ch
                  </p>
                  <p
                    style={{
                      margin: '0 0 8px',
                      fontSize: '12px',
                      color: '#6b7280',
                    }}
                  >
                    {p.adresse}
                  </p>

                  <Link
                    to={`/propriete/${p.id}`}
                    style={{
                      fontSize: '12px',
                      color: '#2563eb',
                      textDecoration: 'underline',
                    }}
                  >
                    Voir fiche propriété
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
