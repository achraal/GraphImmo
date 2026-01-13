import React, { useState, useCallback, useMemo, useTransition } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

const GET_TOP_PROPRIETES = gql`
  query TopProprietesCompletes($limit: Int!) {
    topProprietesCompletes(limit: $limit) {
      id
      titre
      prix
      adresse
      surface
      chambres
      description
      lat
      lon
      photos { url angle }
      localisation { 
        id 
        commune 
        prixM2 
        region 
        securite 
      }
      amenagements { 
        id 
        type 
        qualite 
      }
      agence { 
        id 
        nom 
        email 
        adresse 
        telephone 
      }
      dateDepot
      prixM2Local
    }
  }
`;

const COMPARAISON_PROPRIETES = gql`
  query ComparaisonProprietes($input: ComparaisonInput!) {
    comparaisonProprietes(input: $input) {
      proprietes {
        id titre prix prixM2 surface chambres adresse localisation
        amenagements { type qualite }
        photos
      }
      similaires {
        id titre prix adresse surface chambres score source distanceKm
      }
    }
  }
`;

// INTERFACES COMPLÈTES
// interface LocalisationComplete {
//   id: string;
//   commune: string;
//   prixM2: number;
//   region?: string;
//   securite?: string;
// }

// interface AgenceComplete {
//   id: string;
//   nom: string;
//   email: string;
//   adresse?: string;
//   telephone?: string;
// }

// interface ProprieteComplete {
//   id: string;
//   titre: string;
//   prix: number;
//   adresse: string;
//   surface: number;
//   chambres: number;
//   description?: string;
//   lat?: number;
//   lon?: number;
//   photos?: { url: string; angle: string }[];
//   localisation?: LocalisationComplete;
//   amenagements?: { id: string; type: string; qualite: string }[];
//   agence?: AgenceComplete;
//   dateDepot?: string;
//   prixM2Local?: number;
// }

// interface ResultatComparaison {
//   proprietes: {
//     id: string;
//     titre: string;
//     prix: number;
//     prixM2?: number;
//     surface: number;
//     chambres: number;
//     adresse: string;
//     localisation?: string;
//     amenagements: { type: string; qualite: string }[];
//     photos: string[];
//   }[];
//   similaires: {
//     id: string;
//     titre: string;
//     prix: number;
//     adresse: string;
//     surface: number;
//     chambres: number;
//     score: number;
//     source: string;
//     distanceKm?: number;
//   }[];
// }

// interface ProprieteAvecDonnees extends ProprieteComplete {
//   photoUrl: string;
//   hasPhoto: boolean;
//   cleanAmenagements: string[];
//   isSelected: boolean;
// }

const ComparaisonPage: React.FC = () => {
  const [selectedProps, setSelectedProps] = useState<ProprieteComplete[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ResultatComparaison | null>(null);
  const [limit, setLimit] = useState<number>(9);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  // TRANSITIONS REACT 18 POUR FLUIDITÉ MAXIMALE
  const [isPending, startTransition] = useTransition();

  const { loading, error, data } = useQuery(GET_TOP_PROPRIETES, { 
    variables: { limit },
    skip: showComparison
  });
  const [comparaisonProprietes] = useLazyQuery(COMPARAISON_PROPRIETES);

  const proprietes = data?.topProprietesCompletes || [];

  // FONCTIONS MEMOÏSÉES (évite recréation à chaque render)
  const getPhotoUrl = useCallback((prop: ProprieteComplete): string => {
    if (prop.photos?.length > 0) {
      const facadePhoto = prop.photos.find(p => p.angle?.toLowerCase().includes('facade'));
      return facadePhoto?.url || prop.photos[0].url;
    }
    return '';
  }, []);

  const hasValidPhoto = useCallback((prop: ProprieteComplete): boolean => {
    return prop.photos && prop.photos.length > 0;
  }, []);

  const getCleanAmenagements = useCallback((
    amenagements?: { id: string; type: string; qualite: string }[]
  ): string[] => {
    if (!amenagements || amenagements.length === 0) return [];
    
    return amenagements
      .filter(amen => amen.type && amen.type.trim() !== '')
      .map(amen => {
        const qualite = amen.qualite && amen.qualite.trim() !== '' ? `(${amen.qualite.trim()})` : '';
        return `${amen.type.trim()} ${qualite}`.trim();
      })
      .filter(Boolean);
  }, []);

  // SELECTION OPTIMISÉE AVEC TRANSITION NON-BLOQUANTE
  const toggleSelection = useCallback((prop: ProprieteComplete) => {
    startTransition(() => {
      const isSelected = selectedProps.find(p => p.id === prop.id);
      if (isSelected) {
        setSelectedProps(prev => prev.filter(p => p.id !== prop.id));
      } else if (selectedProps.length < 3) {
        setSelectedProps(prev => [...prev, prop]);
      }
    });
  }, [selectedProps.length]);

  // PRÉ-CALCUL DES DONNÉES POUR CHAQUE PROPRIÉTÉ
  const proprietesWithData = useMemo((): ProprieteAvecDonnees[] => {
    return proprietes.map((prop: ProprieteComplete) => ({
      ...prop,
      photoUrl: getPhotoUrl(prop),
      hasPhoto: hasValidPhoto(prop),
      cleanAmenagements: getCleanAmenagements(prop.amenagements),
      isSelected: selectedProps.find(p => p.id === prop.id) !== undefined
    }));
  }, [proprietes, selectedProps.map(p => p.id).join(','), getPhotoUrl, hasValidPhoto, getCleanAmenagements]);

  // MEMO DES FONCTIONS CRITIQUES
  const lancerComparaison = useCallback(async () => {
    if (selectedProps.length === 3) {
      try {
        const result = await comparaisonProprietes({
          variables: { input: { proprieteIds: selectedProps.map(p => p.id) } },
        });
        setComparisonResult(result.data!.comparaisonProprietes);
        setShowComparison(true);
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  }, [selectedProps.map(p => p.id).join(','), comparaisonProprietes]);

  const handleRetour = useCallback(() => {
    setShowComparison(false);
    setSelectedProps([]);
    setComparisonResult(null);
    setImageErrors(new Set());
    setLimit(9);
  }, []);

  // STYLES OPTIMISÉS (pré-calculés)
  const getCardStyle = useCallback((isSelected: boolean) => ({
    border: isSelected ? '3px solid #1976d2' : '1px solid #ddd',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'white',
    position: 'relative',
    minHeight: '560px',
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isSelected ? '0 8px 25px rgba(25,118,210,0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
  }), []);

  if (loading) return <div>Chargement des propriétés...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      {/* ANIMATIONS CSS OPTIMISÉES */}
      <style jsx>{`
        @keyframes popIn {
          0% { 
            transform: scale(0) rotate(-180deg); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.2) rotate(0deg); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 1; 
          }
        }
        @keyframes selectPulse {
          0% { 
            transform: scale(1); 
            box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
          }
          50% { 
            transform: scale(1.03); 
            box-shadow: 0 12px 35px rgba(25,118,210,0.25); 
          }
          100% { 
            transform: scale(1.02); 
            box-shadow: 0 8px 25px rgba(25,118,210,0.15); 
          }
        }
        .selected-card {
          animation: selectPulse 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
        }
        .selection-badge {
          transform: scale(0);
          animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s forwards;
        }
      `}</style>

      <h1>Comparer des propriétés</h1>
      
      {!showComparison && (
        <div style={{ 
          marginBottom: '30px', padding: '20px', background: '#f8f9fa', 
          borderRadius: '12px', border: '2px solid #e9ecef',
          display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap'
        }}>
          <label style={{ fontWeight: '600', color: '#333', minWidth: '120px' }}>
            Nombre de propriétés:
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="number"
              min="3"
              max="50"
              value={limit}
              onChange={(e) => setLimit(Math.max(3, Math.min(50, parseInt(e.target.value) || 9)))}
              style={{
                width: '80px', padding: '12px 8px', border: '2px solid #ddd',
                borderRadius: '8px', fontSize: '16px', textAlign: 'center', fontWeight: '600'
              }}
            />
            <span style={{ color: '#666', fontSize: '14px' }}>
              (3-50, actuel: {proprietes.length})
            </span>
          </div>
          {limit !== 9 && (
            <button
              onClick={() => setLimit(9)}
              style={{
                padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none',
                borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
              }}
            >
              Défaut (9)
            </button>
          )}
        </div>
      )}

      <div style={{ marginBottom: '30px', fontSize: '18px', color: '#666' }}>
        Sélectionnées: {selectedProps.length}/3
      </div>

      {!showComparison ? (
        <>
          <p style={{ marginBottom: '30px', fontSize: '16px', color: '#555' }}>
            Sélectionnez 3 propriétés à comparer ({proprietes.length} disponibles)
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
            gap: '20px', alignItems: 'start'
          }}>
            {proprietesWithData.map((prop: ProprieteAvecDonnees) => (
              <div 
                key={prop.id}
                className={prop.isSelected ? 'selected-card' : ''}
                style={getCardStyle(prop.isSelected)}
                onClick={() => toggleSelection(prop as ProprieteComplete)}
              >
                {prop.isSelected && (
                  <div className="selection-badge" style={{ 
                    position: 'absolute' as const, top: '12px', right: '12px',
                    background: 'rgba(25,118,210,0.98)', color: 'white', 
                    padding: '8px 14px', borderRadius: '50%', fontWeight: 'bold' as const, 
                    zIndex: 10, fontSize: '18px', minWidth: '36px', height: '36px',
                    display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const,
                    boxShadow: '0 4px 12px rgba(25,118,210,0.4)'
                  }}>
                    ✓
                  </div>
                )}
                
                <div style={{ 
                  width: '100%', height: '220px', position: 'relative', 
                  background: '#f5f5f5', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  {prop.hasPhoto && (
                    <img 
                      src={prop.photoUrl} 
                      alt={prop.titre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        setImageErrors(prev => new Set(prev).add(prop.id));
                      }}
                    />
                  )}
                  
                  {!prop.hasPhoto && (
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(0,0,0,0.8)', color: 'white',
                      padding: '16px 24px', borderRadius: '12px',
                      fontSize: '15px', fontWeight: '600', textAlign: 'center',
                      zIndex: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                      📷 Pas de photo disponible
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '24px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', lineHeight: '1.3', color: '#333' }}>
                    {prop.titre}
                  </h3>
                  
                  {prop.description && (
                    <p style={{ 
                      margin: '0 0 12px 0', color: '#666', fontSize: '14px', lineHeight: '1.4',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {prop.description}
                    </p>
                  )}
                  
                  <p style={{ margin: '0 0 15px 0', color: '#555', fontSize: '14px' }}>
                    {prop.adresse}
                  </p>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: '#1976d2' }}>
                      {prop.prix.toLocaleString()} MAD
                    </div>
                    {prop.prixM2Local && (
                      <div style={{ fontSize: '15px', color: '#666', fontWeight: '500' }}>
                        📊 {prop.prixM2Local.toFixed(0)} MAD/m² (local)
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '18px', fontSize: '15px', color: '#555', marginBottom: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      📏 {prop.surface} m²
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      🛏️ {prop.chambres} ch.
                    </span>
                  </div>
                  
                  {prop.localisation && (
                    <div style={{ 
                      marginBottom: '10px', padding: '8px 12px', 
                      background: 'rgba(25,118,210,0.05)', borderRadius: '6px', fontSize: '13px'
                    }}>
                      <div style={{ fontWeight: '600', color: '#1976d2', marginBottom: '2px' }}>
                        {prop.localisation.commune}
                      </div>
                      {prop.localisation.prixM2 && <div>💰 {prop.localisation.prixM2.toFixed(0)} MAD/m²</div>}
                      {prop.localisation.region && <div>🌍 {prop.localisation.region}</div>}
                      {prop.localisation.securite && <div>🔒 {prop.localisation.securite}</div>}
                    </div>
                  )}
                  
                  {prop.agence && (
                    <div style={{ 
                      marginBottom: '12px', padding: '6px 10px',
                      background: 'rgba(76,175,80,0.08)', borderRadius: '6px', fontSize: '13px'
                    }}>
                      🏢 {prop.agence.nom}
                      {prop.agence.email && (
                        <div style={{ color: '#2e7d32', fontSize: '12px' }}>
                          📧 {prop.agence.email}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {prop.cleanAmenagements.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ fontSize: '14px', color: '#333', marginBottom: '6px', display: 'block' }}>
                        🚿 Équipements:
                      </strong>
                      <div style={{ 
                        display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '13px' 
                      }}>
                        {prop.cleanAmenagements.slice(0, 4).map((amen, i) => (
                          <span key={i} style={{
                            padding: '4px 8px', background: '#e8f5e8', borderRadius: '10px',
                            color: '#2e7d32', fontWeight: '500', fontSize: '12px'
                          }}>
                            {amen}
                          </span>
                        ))}
                        {prop.cleanAmenagements.length > 4 && (
                          <span style={{ color: '#888', fontSize: '12px' }}>
                            +{prop.cleanAmenagements.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {prop.dateDepot && (
                    <div style={{ 
                      fontSize: '13px', color: '#888', fontStyle: 'italic', textAlign: 'right',
                      marginTop: 'auto'
                    }}>
                      📅 {new Date(prop.dateDepot).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '50px', textAlign: 'center' }}>
            <button 
              onClick={lancerComparaison}
              disabled={selectedProps.length !== 3}
              style={{
                padding: '18px 40px', fontSize: '18px', fontWeight: '600',
                background: selectedProps.length === 3 ? '#1976d2' : '#ccc',
                color: 'white', border: 'none', borderRadius: '10px',
                cursor: selectedProps.length === 3 ? 'pointer' : 'not-allowed',
                boxShadow: selectedProps.length === 3 ? '0 4px 12px rgba(25,118,210,0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              👥 Comparer les {selectedProps.length}/3 propriétés
            </button>

            {selectedProps.length > 0 && (
              <div style={{ marginTop: '25px' }}>
                <h4 style={{ marginBottom: '15px', color: '#333' }}>Sélectionnées:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                  {selectedProps.map(prop => (
                    <div 
                      key={prop.id}
                      style={{
                        padding: '10px 16px', background: '#e3f2fd', borderRadius: '25px',
                        cursor: 'pointer', border: '2px solid #1976d2', fontSize: '14px',
                        fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px'
                      }}
                      onClick={() => setSelectedProps(prev => prev.filter(p => p.id !== prop.id))}
                    >
                      {prop.titre.length > 25 ? prop.titre.slice(0, 25) + '...' : prop.titre}
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1976d2' }}>×</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <button 
              onClick={handleRetour}
              style={{
                padding: '12px 24px', background: '#666', color: 'white', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '500',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >← Retour</button>
            <h2 style={{ margin: 0 }}>Résultats de comparaison</h2>
          </div>

          {comparisonResult && (
            <>
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '25px', color: '#333' }}>📊 Propriétés comparées</h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${comparisonResult.proprietes.length}, minmax(380px, 1fr))`,
                  gap: '20px' 
                }}>
                  {comparisonResult.proprietes.map((prop, index) => {
                    const fullProp = selectedProps.find(p => p.id === prop.id) || (prop as ProprieteComplete);
                    const photoUrl = getPhotoUrl(fullProp);
                    const hasPhoto = hasValidPhoto(fullProp);
                    const cleanAmenagements = getCleanAmenagements(prop.amenagements as any);
                    
                    return (
                      <div key={prop.id} style={{
                        border: '3px solid #1976d2', borderRadius: '12px', overflow: 'hidden',
                        background: 'white', minHeight: '560px', display: 'flex', flexDirection: 'column',
                        position: 'relative', boxShadow: '0 4px 20px rgba(25,118,210,0.2)'
                      }}>
                        <div style={{
                          position: 'absolute', top: '12px', left: '12px', zIndex: 10,
                          width: '40px', height: '40px', background: '#1976d2', color: 'white',
                          borderRadius: '50%', display: 'flex', alignItems: 'center', 
                          justifyContent: 'center', fontSize: '18px', fontWeight: 'bold'
                        }}>
                          {index + 1}
                        </div>
                        
                        <div style={{ width: '100%', height: '220px', position: 'relative', background: '#f5f5f5' }}>
                          {hasPhoto && (
                            <img 
                              src={photoUrl} 
                              alt={fullProp.titre}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                setImageErrors(prev => { const n = new Set(prev); n.add(fullProp.id); return n; });
                              }}
                              onLoad={() => setImageErrors(prev => { const n = new Set(prev); n.delete(fullProp.id); return n; })}
                            />
                          )}
                          
                          {!hasPhoto && (
                            <div style={{
                              position: 'absolute', top: '50%', left: '50%', 
                              transform: 'translate(-50%, -50%)',
                              background: 'rgba(0,0,0,0.8)', color: 'white',
                              padding: '16px 24px', borderRadius: '12px',
                              fontSize: '15px', fontWeight: '600', textAlign: 'center',
                              zIndex: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }}>
                              📷 Pas de photo disponible
                            </div>
                          )}
                        </div>
                        
                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '20px', lineHeight: '1.3', color: '#333' }}>
                            {fullProp.titre}
                          </h4>
                          
                          {fullProp.description && (
                            <p style={{ 
                              margin: '0 0 12px 0', color: '#666', fontSize: '14px', lineHeight: '1.4',
                              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {fullProp.description}
                            </p>
                          )}
                          
                          <p style={{ margin: '0 0 15px 0', color: '#555', fontSize: '14px' }}>
                            {fullProp.adresse}
                          </p>
                          
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1976d2' }}>
                              {fullProp.prix.toLocaleString()} MAD
                            </div>
                            {fullProp.prixM2Local && (
                              <div style={{ fontSize: '15px', color: '#666', fontWeight: '500' }}>
                                📊 {fullProp.prixM2Local.toFixed(0)} MAD/m² (local)
                              </div>
                            )}
                            {prop.prixM2 && (
                              <div style={{ fontSize: '15px', color: '#888' }}>
                                📈 {prop.prixM2.toFixed(0)} MAD/m²
                              </div>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '18px', fontSize: '15px', color: '#555', marginBottom: '10px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              📏 {fullProp.surface} m²
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              🛏️ {fullProp.chambres} ch.
                            </span>
                          </div>
                          
                          {fullProp.localisation && (
                            <div style={{ 
                              marginBottom: '10px', padding: '8px 12px', 
                              background: 'rgba(25,118,210,0.05)', borderRadius: '6px', fontSize: '13px'
                            }}>
                              <div style={{ fontWeight: '600', color: '#1976d2', marginBottom: '2px' }}>
                                {fullProp.localisation.commune}
                              </div>
                              {fullProp.localisation.prixM2 && <div>💰 {fullProp.localisation.prixM2.toFixed(0)} MAD/m²</div>}
                              {fullProp.localisation.region && <div>🌍 {fullProp.localisation.region}</div>}
                              {fullProp.localisation.securite && <div>🔒 {fullProp.localisation.securite}</div>}
                            </div>
                          )}
                          
                          {fullProp.agence && (
                            <div style={{ 
                              marginBottom: '12px', padding: '6px 10px', 
                              background: 'rgba(76,175,80,0.08)', borderRadius: '6px', fontSize: '13px'
                            }}>
                              🏢 {fullProp.agence.nom}
                              {fullProp.agence.email && (
                                <div style={{ color: '#2e7d32', fontSize: '12px' }}>
                                  📧 {fullProp.agence.email}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {cleanAmenagements.length > 0 && (
                            <div style={{ marginBottom: '12px' }}>
                              <strong style={{ fontSize: '14px', color: '#333', marginBottom: '6px', display: 'block' }}>
                                🚿 Équipements:
                              </strong>
                              <div style={{ 
                                display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' 
                              }}>
                                {cleanAmenagements.map((amen, i) => (
                                  <span key={i} style={{
                                    padding: '4px 8px', background: '#e8f5e8', borderRadius: '12px',
                                    fontSize: '12px', color: '#2e7d32', fontWeight: '500'
                                  }}>
                                    {amen}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {fullProp.dateDepot && (
                            <div style={{ 
                              fontSize: '13px', color: '#888', fontStyle: 'italic', textAlign: 'right',
                              marginTop: 'auto'
                            }}>
                              📅 {new Date(fullProp.dateDepot).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {comparisonResult.similaires.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: '25px', color: '#333' }}>
                    🎯 Propriétés similaires ({comparisonResult.similaires.length})
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                    gap: '20px' 
                  }}>
                    {comparisonResult.similaires.map((sim) => (
                      <div key={sim.id} style={{ 
                        border: '2px solid #e8f5e8', borderRadius: '12px',
                        padding: '20px', background: '#f8fff8', transition: 'all 0.2s'
                      }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                      }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>{sim.titre}</h4>
                        <p style={{ margin: '0 0 15px 0', color: '#666' }}>{sim.adresse}</p>
                        <div style={{ 
                          fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#2e7d32'
                        }}>
                          {sim.prix.toLocaleString()} MAD
                        </div>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '15px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            ⭐ Score: <span style={{ color: '#4caf50', fontWeight: '700' }}>{sim.score.toFixed(1)}%</span>
                          </span>
                          <span>{sim.surface} m² | {sim.chambres} ch.</span>
                        </div>
                        {sim.distanceKm && (
                          <p style={{ marginTop: '10px', color: '#888', fontSize: '14px' }}>
                            📍 {sim.distanceKm.toFixed(1)} km
                          </p>
                        )}
                        <div style={{ 
                          marginTop: '12px', padding: '8px 12px', background: 'rgba(76,175,80,0.1)',
                          borderRadius: '6px', fontSize: '13px', color: '#2e7d32'
                        }}>
                          Source: {sim.source}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default ComparaisonPage;