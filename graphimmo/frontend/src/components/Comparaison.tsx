// import React, { useState, useCallback, useMemo, useTransition } from 'react';
// import { useParams } from 'react-router-dom';
// import { useQuery, useLazyQuery } from '@apollo/client/react';
// import { gql } from '@apollo/client';

// const GET_TOP_PROPRIETES = gql`
//   query TopProprietesCompletes($limit: Int!) {
//     topProprietesCompletes(limit: $limit) {
//       id
//       titre
//       prix
//       adresse
//       surface
//       chambres
//       description
//       lat
//       lon
//       photos { url angle }
//       localisation { 
//         id 
//         commune 
//         prixM2 
//         region 
//         securite 
//       }
//       amenagements { 
//         id 
//         type 
//         qualite 
//       }
//       agence { 
//         id 
//         nom 
//         email 
//         adresse 
//         telephone 
//       }
//       dateDepot
//       prixM2Local
//     }
//   }
// `;

// const COMPARAISON_PROPRIETES = gql`
//   query ComparaisonProprietes($input: ComparaisonInput!) {
//     comparaisonProprietes(input: $input) {
//       proprietes {
//         id titre prix prixM2 surface chambres adresse localisation
//         amenagements { type qualite }
//         photos
//       }
//       similaires {
//         id titre prix adresse surface chambres score source distanceKm
//       }
//     }
//   }
// `;

// const ComparaisonPage: React.FC = () => {
//   const [selectedProps, setSelectedProps] = useState<ProprieteComplete[]>([]);
//   const [showComparison, setShowComparison] = useState(false);
//   const [comparisonResult, setComparisonResult] = useState<ResultatComparaison | null>(null);
//   const [limit, setLimit] = useState<number>(9);
//   const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
//   // TRANSITIONS REACT 18 POUR FLUIDITÉ MAXIMALE
//   const [isPending, startTransition] = useTransition();

//   const { loading, error, data } = useQuery(GET_TOP_PROPRIETES, { 
//     variables: { limit },
//     skip: showComparison
//   });
//   const [comparaisonProprietes] = useLazyQuery(COMPARAISON_PROPRIETES);

//   const proprietes = data?.topProprietesCompletes || [];

//   // FONCTIONS MEMOÏSÉES (évite recréation à chaque render)
//   const getPhotoUrl = useCallback((prop: ProprieteComplete): string => {
//     if (prop.photos?.length > 0) {
//       const facadePhoto = prop.photos.find(p => p.angle?.toLowerCase().includes('facade'));
//       return facadePhoto?.url || prop.photos[0].url;
//     }
//     return '';
//   }, []);

//   const hasValidPhoto = useCallback((prop: ProprieteComplete): boolean => {
//     return prop.photos && prop.photos.length > 0;
//   }, []);

//   const getCleanAmenagements = useCallback((
//     amenagements?: { id: string; type: string; qualite: string }[]
//   ): string[] => {
//     if (!amenagements || amenagements.length === 0) return [];
    
//     return amenagements
//       .filter(amen => amen.type && amen.type.trim() !== '')
//       .map(amen => {
//         const qualite = amen.qualite && amen.qualite.trim() !== '' ? `(${amen.qualite.trim()})` : '';
//         return `${amen.type.trim()} ${qualite}`.trim();
//       })
//       .filter(Boolean);
//   }, []);

//   // SELECTION OPTIMISÉE AVEC TRANSITION NON-BLOQUANTE
//   const toggleSelection = useCallback((prop: ProprieteComplete) => {
//     startTransition(() => {
//       const isSelected = selectedProps.find(p => p.id === prop.id);
//       if (isSelected) {
//         setSelectedProps(prev => prev.filter(p => p.id !== prop.id));
//       } else if (selectedProps.length < 3) {
//         setSelectedProps(prev => [...prev, prop]);
//       }
//     });
//   }, [selectedProps.length]);

//   // PRÉ-CALCUL DES DONNÉES POUR CHAQUE PROPRIÉTÉ
//   const proprietesWithData = useMemo((): ProprieteAvecDonnees[] => {
//     return proprietes.map((prop: ProprieteComplete) => ({
//       ...prop,
//       photoUrl: getPhotoUrl(prop),
//       hasPhoto: hasValidPhoto(prop),
//       cleanAmenagements: getCleanAmenagements(prop.amenagements),
//       isSelected: selectedProps.find(p => p.id === prop.id) !== undefined
//     }));
//   }, [proprietes, selectedProps.map(p => p.id).join(','), getPhotoUrl, hasValidPhoto, getCleanAmenagements]);

//   // MEMO DES FONCTIONS CRITIQUES
//   const lancerComparaison = useCallback(async () => {
//     if (selectedProps.length === 3) {
//       try {
//         const result = await comparaisonProprietes({
//           variables: { input: { proprieteIds: selectedProps.map(p => p.id) } },
//         });
//         setComparisonResult(result.data!.comparaisonProprietes);
//         setShowComparison(true);
//       } catch (error) {
//         console.error('Erreur:', error);
//       }
//     }
//   }, [selectedProps.map(p => p.id).join(','), comparaisonProprietes]);

//   const handleRetour = useCallback(() => {
//     setShowComparison(false);
//     setSelectedProps([]);
//     setComparisonResult(null);
//     setImageErrors(new Set());
//     setLimit(9);
//   }, []);

//   // STYLES OPTIMISÉS (pré-calculés)
//   const getCardStyle = useCallback((isSelected: boolean) => ({
//     border: isSelected ? '3px solid #1976d2' : '1px solid #ddd',
//     borderRadius: '12px',
//     overflow: 'hidden',
//     cursor: 'pointer',
//     background: 'white',
//     position: 'relative',
//     minHeight: '560px',
//     display: 'flex',
//     flexDirection: 'column' as const,
//     transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
//     transform: isSelected ? 'scale(1.02)' : 'scale(1)',
//     boxShadow: isSelected ? '0 8px 25px rgba(25,118,210,0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
//   }), []);

//   if (loading) return <div>Chargement des propriétés...</div>;
//   if (error) return <div>Erreur: {error.message}</div>;

//   return (
//     <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
//       {/* ANIMATIONS CSS OPTIMISÉES */}
//       <style jsx>{`
//         @keyframes popIn {
//           0% { 
//             transform: scale(0) rotate(-180deg); 
//             opacity: 0; 
//           }
//           50% { 
//             transform: scale(1.2) rotate(0deg); 
//             opacity: 0.8; 
//           }
//           100% { 
//             transform: scale(1) rotate(0deg); 
//             opacity: 1; 
//           }
//         }
//         @keyframes selectPulse {
//           0% { 
//             transform: scale(1); 
//             box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
//           }
//           50% { 
//             transform: scale(1.03); 
//             box-shadow: 0 12px 35px rgba(25,118,210,0.25); 
//           }
//           100% { 
//             transform: scale(1.02); 
//             box-shadow: 0 8px 25px rgba(25,118,210,0.15); 
//           }
//         }
//         .selected-card {
//           animation: selectPulse 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
//         }
//         .selection-badge {
//           transform: scale(0);
//           animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s forwards;
//         }
//       `}</style>

//       <h1>Comparer des propriétés</h1>
      
//       {!showComparison && (
//         <div style={{ 
//           marginBottom: '30px', padding: '20px', background: '#f8f9fa', 
//           borderRadius: '12px', border: '2px solid #e9ecef',
//           display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap'
//         }}>
//           <label style={{ fontWeight: '600', color: '#333', minWidth: '120px' }}>
//             Nombre de propriétés:
//           </label>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//             <input
//               type="number"
//               min="3"
//               max="50"
//               value={limit}
//               onChange={(e) => setLimit(Math.max(3, Math.min(50, parseInt(e.target.value) || 9)))}
//               style={{
//                 width: '80px', padding: '12px 8px', border: '2px solid #ddd',
//                 borderRadius: '8px', fontSize: '16px', textAlign: 'center', fontWeight: '600'
//               }}
//             />
//             <span style={{ color: '#666', fontSize: '14px' }}>
//               (3-50, actuel: {proprietes.length})
//             </span>
//           </div>
//           {limit !== 9 && (
//             <button
//               onClick={() => setLimit(9)}
//               style={{
//                 padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none',
//                 borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
//               }}
//             >
//               Défaut (9)
//             </button>
//           )}
//         </div>
//       )}

//       <div style={{ marginBottom: '30px', fontSize: '18px', color: '#666' }}>
//         Sélectionnées: {selectedProps.length}/3
//       </div>

//       {!showComparison ? (
//         <>
//           <p style={{ marginBottom: '30px', fontSize: '16px', color: '#555' }}>
//             Sélectionnez 3 propriétés à comparer ({proprietes.length} disponibles)
//           </p>

//           <div style={{ 
//             display: 'grid', 
//             gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
//             gap: '20px', alignItems: 'start'
//           }}>
//             {proprietesWithData.map((prop: ProprieteAvecDonnees) => (
//               <div 
//                 key={prop.id}
//                 className={prop.isSelected ? 'selected-card' : ''}
//                 style={getCardStyle(prop.isSelected)}
//                 onClick={() => toggleSelection(prop as ProprieteComplete)}
//               >
//                 {prop.isSelected && (
//                   <div className="selection-badge" style={{ 
//                     position: 'absolute' as const, top: '12px', right: '12px',
//                     background: 'rgba(25,118,210,0.98)', color: 'white', 
//                     padding: '8px 14px', borderRadius: '50%', fontWeight: 'bold' as const, 
//                     zIndex: 10, fontSize: '18px', minWidth: '36px', height: '36px',
//                     display: 'flex', alignItems: 'center' as const, justifyContent: 'center' as const,
//                     boxShadow: '0 4px 12px rgba(25,118,210,0.4)'
//                   }}>
//                     ✓
//                   </div>
//                 )}
                
//                 <div style={{ 
//                   width: '100%', height: '220px', position: 'relative', 
//                   background: '#f5f5f5', display: 'flex', alignItems: 'center', 
//                   justifyContent: 'center'
//                 }}>
//                   {prop.hasPhoto && (
//                     <img 
//                       src={prop.photoUrl} 
//                       alt={prop.titre}
//                       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                       onError={(e) => {
//                         e.currentTarget.style.display = 'none';
//                         setImageErrors(prev => new Set(prev).add(prop.id));
//                       }}
//                     />
//                   )}
                  
//                   {!prop.hasPhoto && (
//                     <div style={{
//                       position: 'absolute', top: '50%', left: '50%', 
//                       transform: 'translate(-50%, -50%)',
//                       background: 'rgba(0,0,0,0.8)', color: 'white',
//                       padding: '16px 24px', borderRadius: '12px',
//                       fontSize: '15px', fontWeight: '600', textAlign: 'center',
//                       zIndex: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
//                     }}>
//                       📷 Pas de photo disponible
//                     </div>
//                   )}
//                 </div>
                
//                 <div style={{ padding: '24px', flex: '1', display: 'flex', flexDirection: 'column' }}>
//                   <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', lineHeight: '1.3', color: '#333' }}>
//                     {prop.titre}
//                   </h3>
                  
//                   {prop.description && (
//                     <p style={{ 
//                       margin: '0 0 12px 0', color: '#666', fontSize: '14px', lineHeight: '1.4',
//                       display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
//                       overflow: 'hidden'
//                     }}>
//                       {prop.description}
//                     </p>
//                   )}
                  
//                   <p style={{ margin: '0 0 15px 0', color: '#555', fontSize: '14px' }}>
//                     {prop.adresse}
//                   </p>
                  
//                   <div style={{ marginBottom: '12px' }}>
//                     <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: '#1976d2' }}>
//                       {prop.prix.toLocaleString()} MAD
//                     </div>
//                     {prop.prixM2Local && (
//                       <div style={{ fontSize: '15px', color: '#666', fontWeight: '500' }}>
//                         📊 {prop.prixM2Local.toFixed(0)} MAD/m² (local)
//                       </div>
//                     )}
//                   </div>
                  
//                   <div style={{ display: 'flex', gap: '18px', fontSize: '15px', color: '#555', marginBottom: '10px' }}>
//                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                       📏 {prop.surface} m²
//                     </span>
//                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                       🛏️ {prop.chambres} ch.
//                     </span>
//                   </div>
                  
//                   {prop.localisation && (
//                     <div style={{ 
//                       marginBottom: '10px', padding: '8px 12px', 
//                       background: 'rgba(25,118,210,0.05)', borderRadius: '6px', fontSize: '13px'
//                     }}>
//                       <div style={{ fontWeight: '600', color: '#1976d2', marginBottom: '2px' }}>
//                         {prop.localisation.commune}
//                       </div>
//                       {prop.localisation.prixM2 && <div>💰 {prop.localisation.prixM2.toFixed(0)} MAD/m²</div>}
//                       {prop.localisation.region && <div>🌍 {prop.localisation.region}</div>}
//                       {prop.localisation.securite && <div>🔒 {prop.localisation.securite}</div>}
//                     </div>
//                   )}
                  
//                   {prop.agence && (
//                     <div style={{ 
//                       marginBottom: '12px', padding: '6px 10px',
//                       background: 'rgba(76,175,80,0.08)', borderRadius: '6px', fontSize: '13px'
//                     }}>
//                       🏢 {prop.agence.nom}
//                       {prop.agence.email && (
//                         <div style={{ color: '#2e7d32', fontSize: '12px' }}>
//                           📧 {prop.agence.email}
//                         </div>
//                       )}
//                     </div>
//                   )}
                  
//                   {prop.cleanAmenagements.length > 0 && (
//                     <div style={{ marginBottom: '12px' }}>
//                       <strong style={{ fontSize: '14px', color: '#333', marginBottom: '6px', display: 'block' }}>
//                         🚿 Équipements:
//                       </strong>
//                       <div style={{ 
//                         display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '13px' 
//                       }}>
//                         {prop.cleanAmenagements.slice(0, 4).map((amen, i) => (
//                           <span key={i} style={{
//                             padding: '4px 8px', background: '#e8f5e8', borderRadius: '10px',
//                             color: '#2e7d32', fontWeight: '500', fontSize: '12px'
//                           }}>
//                             {amen}
//                           </span>
//                         ))}
//                         {prop.cleanAmenagements.length > 4 && (
//                           <span style={{ color: '#888', fontSize: '12px' }}>
//                             +{prop.cleanAmenagements.length - 4}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   )}
                  
//                   {prop.dateDepot && (
//                     <div style={{ 
//                       fontSize: '13px', color: '#888', fontStyle: 'italic', textAlign: 'right',
//                       marginTop: 'auto'
//                     }}>
//                       📅 {new Date(prop.dateDepot).toLocaleDateString('fr-FR')}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div style={{ marginTop: '50px', textAlign: 'center' }}>
//             <button 
//               onClick={lancerComparaison}
//               disabled={selectedProps.length !== 3}
//               style={{
//                 padding: '18px 40px', fontSize: '18px', fontWeight: '600',
//                 background: selectedProps.length === 3 ? '#1976d2' : '#ccc',
//                 color: 'white', border: 'none', borderRadius: '10px',
//                 cursor: selectedProps.length === 3 ? 'pointer' : 'not-allowed',
//                 boxShadow: selectedProps.length === 3 ? '0 4px 12px rgba(25,118,210,0.3)' : 'none',
//                 transition: 'all 0.2s'
//               }}
//             >
//               👥 Comparer les {selectedProps.length}/3 propriétés
//             </button>

//             {selectedProps.length > 0 && (
//               <div style={{ marginTop: '25px' }}>
//                 <h4 style={{ marginBottom: '15px', color: '#333' }}>Sélectionnées:</h4>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
//                   {selectedProps.map(prop => (
//                     <div 
//                       key={prop.id}
//                       style={{
//                         padding: '10px 16px', background: '#e3f2fd', borderRadius: '25px',
//                         cursor: 'pointer', border: '2px solid #1976d2', fontSize: '14px',
//                         fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px'
//                       }}
//                       onClick={() => setSelectedProps(prev => prev.filter(p => p.id !== prop.id))}
//                     >
//                       {prop.titre.length > 25 ? prop.titre.slice(0, 25) + '...' : prop.titre}
//                       <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1976d2' }}>×</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </>
//       ) : (
//         <div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
//             <button 
//               onClick={handleRetour}
//               style={{
//                 padding: '12px 24px', background: '#666', color: 'white', border: 'none',
//                 borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '500',
//                 display: 'flex', alignItems: 'center', gap: '8px'
//               }}
//             >← Retour</button>
//             <h2 style={{ margin: 0 }}>Résultats de comparaison</h2>
//           </div>

//           {comparisonResult && (
//             <>
//               <div style={{ marginBottom: '40px' }}>
//                 <h3 style={{ marginBottom: '25px', color: '#333' }}>📊 Propriétés comparées</h3>
//                 <div style={{ 
//                   display: 'grid', 
//                   gridTemplateColumns: `repeat(${comparisonResult.proprietes.length}, minmax(380px, 1fr))`,
//                   gap: '20px' 
//                 }}>
//                   {comparisonResult.proprietes.map((prop, index) => {
//                     const fullProp = selectedProps.find(p => p.id === prop.id) || (prop as ProprieteComplete);
//                     const photoUrl = getPhotoUrl(fullProp);
//                     const hasPhoto = hasValidPhoto(fullProp);
//                     const cleanAmenagements = getCleanAmenagements(prop.amenagements as any);
                    
//                     return (
//                       <div key={prop.id} style={{
//                         border: '3px solid #1976d2', borderRadius: '12px', overflow: 'hidden',
//                         background: 'white', minHeight: '560px', display: 'flex', flexDirection: 'column',
//                         position: 'relative', boxShadow: '0 4px 20px rgba(25,118,210,0.2)'
//                       }}>
//                         <div style={{
//                           position: 'absolute', top: '12px', left: '12px', zIndex: 10,
//                           width: '40px', height: '40px', background: '#1976d2', color: 'white',
//                           borderRadius: '50%', display: 'flex', alignItems: 'center', 
//                           justifyContent: 'center', fontSize: '18px', fontWeight: 'bold'
//                         }}>
//                           {index + 1}
//                         </div>
                        
//                         <div style={{ width: '100%', height: '220px', position: 'relative', background: '#f5f5f5' }}>
//                           {hasPhoto && (
//                             <img 
//                               src={photoUrl} 
//                               alt={fullProp.titre}
//                               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                               onError={(e) => {
//                                 e.currentTarget.style.display = 'none';
//                                 setImageErrors(prev => { const n = new Set(prev); n.add(fullProp.id); return n; });
//                               }}
//                               onLoad={() => setImageErrors(prev => { const n = new Set(prev); n.delete(fullProp.id); return n; })}
//                             />
//                           )}
                          
//                           {!hasPhoto && (
//                             <div style={{
//                               position: 'absolute', top: '50%', left: '50%', 
//                               transform: 'translate(-50%, -50%)',
//                               background: 'rgba(0,0,0,0.8)', color: 'white',
//                               padding: '16px 24px', borderRadius: '12px',
//                               fontSize: '15px', fontWeight: '600', textAlign: 'center',
//                               zIndex: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
//                             }}>
//                               📷 Pas de photo disponible
//                             </div>
//                           )}
//                         </div>
                        
//                         <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
//                           <h4 style={{ margin: '0 0 8px 0', fontSize: '20px', lineHeight: '1.3', color: '#333' }}>
//                             {fullProp.titre}
//                           </h4>
                          
//                           {fullProp.description && (
//                             <p style={{ 
//                               margin: '0 0 12px 0', color: '#666', fontSize: '14px', lineHeight: '1.4',
//                               display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
//                               overflow: 'hidden'
//                             }}>
//                               {fullProp.description}
//                             </p>
//                           )}
                          
//                           <p style={{ margin: '0 0 15px 0', color: '#555', fontSize: '14px' }}>
//                             {fullProp.adresse}
//                           </p>
                          
//                           <div style={{ marginBottom: '12px' }}>
//                             <div style={{ fontSize: '24px', fontWeight: '700', color: '#1976d2' }}>
//                               {fullProp.prix.toLocaleString()} MAD
//                             </div>
//                             {fullProp.prixM2Local && (
//                               <div style={{ fontSize: '15px', color: '#666', fontWeight: '500' }}>
//                                 📊 {fullProp.prixM2Local.toFixed(0)} MAD/m² (local)
//                               </div>
//                             )}
//                             {prop.prixM2 && (
//                               <div style={{ fontSize: '15px', color: '#888' }}>
//                                 📈 {prop.prixM2.toFixed(0)} MAD/m²
//                               </div>
//                             )}
//                           </div>
                          
//                           <div style={{ display: 'flex', gap: '18px', fontSize: '15px', color: '#555', marginBottom: '10px' }}>
//                             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                               📏 {fullProp.surface} m²
//                             </span>
//                             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                               🛏️ {fullProp.chambres} ch.
//                             </span>
//                           </div>
                          
//                           {fullProp.localisation && (
//                             <div style={{ 
//                               marginBottom: '10px', padding: '8px 12px', 
//                               background: 'rgba(25,118,210,0.05)', borderRadius: '6px', fontSize: '13px'
//                             }}>
//                               <div style={{ fontWeight: '600', color: '#1976d2', marginBottom: '2px' }}>
//                                 {fullProp.localisation.commune}
//                               </div>
//                               {fullProp.localisation.prixM2 && <div>💰 {fullProp.localisation.prixM2.toFixed(0)} MAD/m²</div>}
//                               {fullProp.localisation.region && <div>🌍 {fullProp.localisation.region}</div>}
//                               {fullProp.localisation.securite && <div>🔒 {fullProp.localisation.securite}</div>}
//                             </div>
//                           )}
                          
//                           {fullProp.agence && (
//                             <div style={{ 
//                               marginBottom: '12px', padding: '6px 10px', 
//                               background: 'rgba(76,175,80,0.08)', borderRadius: '6px', fontSize: '13px'
//                             }}>
//                               🏢 {fullProp.agence.nom}
//                               {fullProp.agence.email && (
//                                 <div style={{ color: '#2e7d32', fontSize: '12px' }}>
//                                   📧 {fullProp.agence.email}
//                                 </div>
//                               )}
//                             </div>
//                           )}
                          
//                           {cleanAmenagements.length > 0 && (
//                             <div style={{ marginBottom: '12px' }}>
//                               <strong style={{ fontSize: '14px', color: '#333', marginBottom: '6px', display: 'block' }}>
//                                 🚿 Équipements:
//                               </strong>
//                               <div style={{ 
//                                 display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' 
//                               }}>
//                                 {cleanAmenagements.map((amen, i) => (
//                                   <span key={i} style={{
//                                     padding: '4px 8px', background: '#e8f5e8', borderRadius: '12px',
//                                     fontSize: '12px', color: '#2e7d32', fontWeight: '500'
//                                   }}>
//                                     {amen}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
                          
//                           {fullProp.dateDepot && (
//                             <div style={{ 
//                               fontSize: '13px', color: '#888', fontStyle: 'italic', textAlign: 'right',
//                               marginTop: 'auto'
//                             }}>
//                               📅 {new Date(fullProp.dateDepot).toLocaleDateString('fr-FR')}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {comparisonResult.similaires.length > 0 && (
//                 <div>
//                   <h3 style={{ marginBottom: '25px', color: '#333' }}>
//                     🎯 Propriétés similaires ({comparisonResult.similaires.length})
//                   </h3>
//                   <div style={{ 
//                     display: 'grid', 
//                     gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
//                     gap: '20px' 
//                   }}>
//                     {comparisonResult.similaires.map((sim) => (
//                       <div key={sim.id} style={{ 
//                         border: '2px solid #e8f5e8', borderRadius: '12px',
//                         padding: '20px', background: '#f8fff8', transition: 'all 0.2s'
//                       }} onMouseEnter={(e) => {
//                         e.currentTarget.style.transform = 'translateY(-2px)';
//                         e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
//                       }} onMouseLeave={(e) => {
//                         e.currentTarget.style.transform = 'translateY(0)';
//                         e.currentTarget.style.boxShadow = 'none';
//                       }}>
//                         <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>{sim.titre}</h4>
//                         <p style={{ margin: '0 0 15px 0', color: '#666' }}>{sim.adresse}</p>
//                         <div style={{ 
//                           fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#2e7d32'
//                         }}>
//                           {sim.prix.toLocaleString()} MAD
//                         </div>
//                         <div style={{ display: 'flex', gap: '20px', fontSize: '15px' }}>
//                           <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                             ⭐ Score: <span style={{ color: '#4caf50', fontWeight: '700' }}>{sim.score.toFixed(1)}%</span>
//                           </span>
//                           <span>{sim.surface} m² | {sim.chambres} ch.</span>
//                         </div>
//                         {sim.distanceKm && (
//                           <p style={{ marginTop: '10px', color: '#888', fontSize: '14px' }}>
//                             📍 {sim.distanceKm.toFixed(1)} km
//                           </p>
//                         )}
//                         <div style={{ 
//                           marginTop: '12px', padding: '8px 12px', background: 'rgba(76,175,80,0.1)',
//                           borderRadius: '6px', fontSize: '13px', color: '#2e7d32'
//                         }}>
//                           Source: {sim.source}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
// export default ComparaisonPage;
import React, { useState, useCallback, useMemo, useTransition } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia,
  Button, TextField, Paper, Chip, Stack, Divider, Avatar,
  CircularProgress, Alert, Badge, IconButton, useTheme, Zoom
} from '@mui/material';
import {
  Compare as CompareIcon,
  DeleteSweep as ClearIcon,
  CheckCircle as SelectedIcon,
  LocationOn as LocIcon,
  SquareFoot as AreaIcon,
  Hotel as BedIcon,
  ArrowBack as BackIcon,
  AutoAwesome as AiIcon,
  VerifiedUser as SecurityIcon,
  EuroSymbol as PriceIcon
} from '@mui/icons-material';

// --- REQUÊTES GRAPHQL ---
const GET_TOP_PROPRIETES = gql`
  query TopProprietesCompletes($limit: Int!) {
    topProprietesCompletes(limit: $limit) {
      id titre prix adresse surface chambres description lat lon
      photos { url angle }
      localisation { commune prixM2 region securite }
      amenagements { type qualite }
      agence { nom email adresse telephone }
      dateDepot prixM2Local
    }
  }
`;

const COMPARAISON_PROPRIETES = gql`
  query ComparaisonProprietes($input: ComparaisonInput!) {
    comparaisonProprietes(input: $input) {
      proprietes {
        id titre prix prixM2 surface chambres adresse localisation
        amenagements { type qualite }
      }
      similaires { id titre prix adresse surface chambres score source distanceKm }
    }
  }
`;

const ComparaisonPage: React.FC = () => {
  const theme = useTheme();
  const [selectedProps, setSelectedProps] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);
  const [limit, setLimit] = useState<number>(9);
  const [isPending, startTransition] = useTransition();

  // Query initiale pour lister les biens [cite: 12]
  const { loading, error, data } = useQuery(GET_TOP_PROPRIETES, { 
    variables: { limit },
    skip: showComparison
  });

  // Query paresseuse pour la comparaison [cite: 13, 20]
  const [lancerComparaisonQuery, { loading: compLoading }] = useLazyQuery(COMPARAISON_PROPRIETES);

  // Gestion de la sélection avec transition React 18 
  const toggleSelection = useCallback((prop: any) => {
    startTransition(() => {
      const isSelected = selectedProps.find(p => p.id === prop.id);
      if (isSelected) {
        setSelectedProps(prev => prev.filter(p => p.id !== prop.id));
      } else if (selectedProps.length < 3) {
        setSelectedProps(prev => [...prev, prop]);
      }
    });
  }, [selectedProps]);

  const executerComparaison = async () => {
  if (selectedProps.length === 3) {
    try {
      const { data: res } = await lancerComparaisonQuery({
        variables: { input: { proprieteIds: selectedProps.map(p => p.id) } }
      });
      if (res) {
        // On enrichit les données reçues avec les photos des objets sélectionnés localement
        const enrichedProps = res.comparaisonProprietes.proprietes.map((p: any) => ({
          ...p,
          photo: selectedProps.find(sp => sp.id === p.id)?.photos?.[0]?.url
        }));
        
        setComparisonResult({ 
          ...res.comparaisonProprietes, 
          proprietes: enrichedProps 
        });
        setShowComparison(true);
      }
    } catch (err) {
      console.error("Erreur de comparaison:", err);
    }
  }
};

  const handleRetour = () => {
    setShowComparison(false);
    setSelectedProps([]);
    setComparisonResult(null);
  };

  if (loading) return <Box textAlign="center" py={20}><CircularProgress size={60} /><Typography sx={{ mt: 2 }}>Chargement des propriétés...</Typography></Box>;
  if (error) return <Container sx={{ py: 10 }}><Alert severity="error">{error.message}</Alert></Container>;

  const properties = data?.topProprietesCompletes || [];

  return (
    <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, md: 5 } }}>
      
      {!showComparison ? (
        <>
          {/* --- EN-TÊTE DE SÉLECTION --- */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" fontWeight={900} sx={{ letterSpacing: '-0.02em', mb: 2 }}>
              <CompareIcon sx={{ fontSize: 50, color: 'primary.main', mr: 2, verticalAlign: 'middle' }} />
              Comparateur <span style={{ color: theme.palette.primary.main }}>Pro</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 5 }}>
              Sélectionnez 3 biens immobiliers pour comparer les prix au m², les équipements et l'analyse de l'IA.
            </Typography>

            <Paper elevation={0} sx={{ 
              p: 2, bgcolor: '#f1f5f9', display: 'inline-flex', gap: 3, 
              alignItems: 'center', borderRadius: 5, border: '1px solid #e2e8f0', px: 4 
            }}>
              <TextField 
                label="Afficher" type="number" size="small"
                value={limit} onChange={(e) => setLimit(Number(e.target.value))}
                sx={{ width: 100, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
              />
              <Divider orientation="vertical" flexItem />
              <Typography variant="body2" fontWeight={700} color={selectedProps.length === 3 ? "success.main" : "text.secondary"}>
                {selectedProps.length} / 3 Sélectionnés
              </Typography>
              <Button 
                variant="contained" 
                disabled={selectedProps.length !== 3 || compLoading}
                onClick={executerComparaison}
                startIcon={compLoading ? <CircularProgress size={20} color="inherit" /> : <AiIcon />}
                sx={{ borderRadius: 3, px: 4, fontWeight: 800, textTransform: 'none', height: 45 }}
              >
                Comparer Maintenant
              </Button>
              <IconButton onClick={() => setSelectedProps([])} disabled={selectedProps.length === 0}>
                <ClearIcon />
              </IconButton>
            </Paper>
          </Box>

          {/* --- GRILLE DE SÉLECTION (CENTRÉE) --- */}
          <Grid container spacing={4} justifyContent="center">
            {properties.map((prop: any) => {
              const isSelected = selectedProps.some(p => p.id === prop.id);
              return (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={prop.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card 
                    onClick={() => toggleSelection(prop)}
                    sx={{ 
                      borderRadius: 7, cursor: 'pointer', position: 'relative', width: '100%', maxWidth: 380,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '2px solid',
                      borderColor: isSelected ? 'primary.main' : 'transparent',
                      transform: isSelected ? 'scale(1.03)' : 'none',
                      boxShadow: isSelected ? `0 20px 40px ${theme.palette.primary.main}20` : '0 4px 12px rgba(0,0,0,0.05)',
                      '&:hover': { borderColor: isSelected ? 'primary.main' : '#cbd5e1' }
                    }}
                  >
                    <Zoom in={isSelected}>
                      <Avatar sx={{ 
                        position: 'absolute', top: 15, right: 15, zIndex: 10, 
                        bgcolor: 'primary.main', boxShadow: 3, width: 40, height: 40 
                      }}>
                        <SelectedIcon />
                      </Avatar>
                    </Zoom>

                    <CardMedia
                      component="img" height="240"
                      image={prop.photos?.[0]?.url || 'https://via.placeholder.com/400x300?text=Image+Indisponible'}
                      sx={{ filter: isSelected ? 'none' : 'grayscale(0.3)' }}
                    />
                    
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={800} noWrap sx={{ mb: 1 }}>{prop.titre}</Typography>
                      <Typography variant="h4" color="primary" fontWeight={950} sx={{ mb: 2 }}>
                        {prop.prix.toLocaleString()} <span style={{ fontSize: '0.5em' }}>MAD</span>
                      </Typography>
                      
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                          <LocIcon fontSize="small" color="primary" />
                          <Typography variant="caption" noWrap fontWeight={500}>{prop.adresse}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Chip icon={<AreaIcon fontSize="small" />} label={`${prop.surface} m²`} size="small" variant="soft" />
                          <Chip icon={<BedIcon fontSize="small" />} label={`${prop.chambres} ch.`} size="small" variant="soft" />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        /* --- VUE COMPARAISON FINALE --- */
        <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
          <Button startIcon={<BackIcon />} onClick={handleRetour} sx={{ mb: 4, fontWeight: 800, color: 'text.primary' }}>
            Retour à la sélection
          </Button>

          <Typography variant="h3" fontWeight={950} sx={{ mb: 6, textAlign: 'center', letterSpacing: '-0.03em' }}>
            Analyse Comparative
          </Typography>

          <Grid container spacing={3} justifyContent="center" sx={{ mb: 10 }}>
            {comparisonResult?.proprietes.map((prop: any, idx: number) => (
              <Grid item xs={12} md={4} key={prop.id}>
                <Paper sx={{ borderRadius: 8, overflow: 'hidden', border: '2px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="220"
                  image={prop.photo || 'https://via.placeholder.com/400x300?text=Image+Indisponible'}
                  sx={{ filter: 'brightness(0.9)' }}
                />
                  <Box sx={{ p: 2.5, bgcolor: idx === 0 ? 'primary.main' : 'primary.dark', color: 'white', textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={900}>OPTION #{idx + 1}</Typography>
                  </Box>
                  
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight={900} sx={{ mb: 1, height: 60, overflow: 'hidden' }}>{prop.titre}</Typography>
                    <Typography variant="h3" color="primary" fontWeight={950} sx={{ mb: 4 }}>
                      {prop.prix.toLocaleString()} <Typography component="span" variant="h6">MAD</Typography>
                    </Typography>
                    
                    <Stack spacing={4}>
                      <Box>
                        <Typography variant="overline" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>📍 Localisation</Typography>
                        <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>{prop.localisation?.commune || 'Secteur Inconnu'}</Typography>
                        <Typography variant="body2" color="text.secondary">{prop.localisation?.region}</Typography>
                        {prop.localisation?.securite && (
                           <Chip icon={<SecurityIcon />} label={`Sécurité: ${prop.localisation.securite}`} size="small" sx={{ mt: 1.5 }} />
                        )}
                      </Box>
                      
                      <Box>
                        <Typography variant="overline" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>📊 Performance Prix</Typography>
                        <Box sx={{ mt: 1 }}>
                           <Typography variant="h5" fontWeight={800}>{prop.prixM2?.toFixed(0)} <span style={{ fontSize: '0.6em' }}>MAD/m²</span></Typography>
                           <Typography variant="caption" color="text.secondary">Moyenne locale: {prop.prixM2Local?.toFixed(0) || '---'} MAD</Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="overline" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>🚿 Équipements</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                          {prop.amenagements?.map((amen: any) => (
                            <Chip 
                              key={amen.type} 
                              label={amen.type} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontWeight: 600, borderRadius: 2 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* --- SECTION SIMILAIRES --- */}
          <Divider sx={{ mb: 8 }}>
            <Chip 
              icon={<AiIcon />} 
              label="ALTERNATIVES SUGGÉRÉES PAR L'IA" 
              sx={{ fontWeight: 900, px: 3, py: 2.5, borderRadius: 4, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }} 
            />
          </Divider>
          
          <Grid container spacing={3} justifyContent="center">
            {comparisonResult?.similaires.map((sim: any) => (
              <Grid item xs={12} sm={6} md={3} key={sim.id}>
                <Card sx={{ 
                  borderRadius: 6, position: 'relative', overflow: 'visible', // 'visible' pour laisser dépasser le badge
                  bgcolor: '#ffffff', border: '1px solid #f1f5f9', 
                  transition: '0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 }
                }}>
                  {/* Badge Match % flottant */}
                  <Box sx={{ 
                    position: 'absolute', top: -15, left: 20, bgcolor: 'secondary.main', 
                    color: 'white', px: 2, py: 0.5, borderRadius: 2, fontWeight: 900, fontSize: '0.8rem', zIndex: 2,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    {sim.score}% MATCH
                  </Box>

                  <CardContent sx={{ pt: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={800} noWrap sx={{ maxWidth: '70%' }}>
                        {sim.titre}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>
                        {sim.source}
                      </Typography>
                    </Box>

                    <Typography variant="h5" fontWeight={900} color="primary" sx={{ mb: 2 }}>
                      {sim.prix.toLocaleString()} <span style={{ fontSize: '0.6em' }}>MAD</span>
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip label={`${sim.surface} m²`} size="small" variant="outlined" sx={{ borderRadius: 1.5 }} />
                      <Chip label={`${sim.chambres} ch.`} size="small" variant="outlined" sx={{ borderRadius: 1.5 }} />
                    </Stack>

                    <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        📍 {sim.adresse.split(',')[0]}
                      </Typography>
                      {sim.distanceKm && (
                        <Typography variant="caption" fontWeight={700} color="secondary.main">
                          {sim.distanceKm.toFixed(1)} km
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ComparaisonPage;