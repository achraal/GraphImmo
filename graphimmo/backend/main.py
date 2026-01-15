from neo4j import GraphDatabase
import strawberry
from strawberry.fastapi import GraphQLRouter
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
import secrets
from passlib.context import CryptContext
from fastapi.security import HTTPBearer
from fastapi import HTTPException
from fastapi import Depends
from typing import Optional, List
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
load_dotenv()

# Connexion Neo4j (adapte avec tes creds Graphimmo)
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI"),
    auth=(os.getenv("NEO4J_USER"), os.getenv("NEO4J_PASSWORD"))
)
SECRET_KEY = os.getenv("SECRET_KEY")


#SECRET_KEY = secrets.token_hex(32)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 10080))  

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@strawberry.type
class Propriete:
    id: str
    titre: str
    prix: float
    adresse: str
    description: str
    surface: int
    chambres: int
    lat: float
    lon: float
    date_depot: str | None = None # dateAjout de la relation GERE

@strawberry.type
class Photo:
    angle: str  # facade/interieur/cuisine
    url: str | None = None

@strawberry.type
class Amenagement:
    id: str | None = None
    type: str | None = None # piscine/garage
    qualite: str | None = None

@strawberry.type
class Localisation:
    id: str
    commune: str
    region: str
    prix_m2: float
    securite: str

@strawberry.type
class Agence:
    id: str
    nom: str
    adresse: str
    email: str
    telephone: str | None = None
    

@strawberry.type
class ProprieteDetail:
    id: str
    titre: str
    prix: float
    adresse: str
    description: str
    surface: int
    chambres: int
    lat: float
    lon: float
    
    # Photos avec angle
    photos: list[Photo]
    
    # Aménagements complets
    amenagements: list[Amenagement]
    
    # Localisation complète
    localisation: Localisation | None
    
    # Agence complète
    agence: Agence | None
    
    # Propriétés des relations
    date_depot: str | None  # de la relation GERE
    prix_m2_local: float | None  # de la relation DANSQUARTIER

@strawberry.type
class VisiteNode:
    id: str
    date_visite: str
    impression: Optional[str] = None
    prix_propose: Optional[float] = None

@strawberry.type
class Favori:
    propriete_id: str
    date_ajout: str
    note: Optional[str] = None

@strawberry.type
class DashboardPersonnel:
    favoris: list[Favori]
    visites: list[VisiteNode]
    nb_favoris: int
    nb_visites: int


@strawberry.enum
class TriPropriete(Enum):
    PRIX = "PRIX"
    DATE_DEPOT = "DATE_DEPOT"  
    PERTINENCE = "PERTINENCE"


@strawberry.enum
class OrdreType(Enum):
    ASC = "ASC"
    DESC = "DESC"


@strawberry.type
class User:
    id: str
    nom: str
    prenom: str
    email: str
    role: str  # ACHETEUR | AGENT
    budget: Optional[float] = None
    surface_min: Optional[int] = None
    preferences_location: Optional[str] = None
    ville_prefs: Optional[List[str]] = None
    created_at: Optional[str] = None  #

@strawberry.input
class UserCreateInput:
    nom: str
    prenom: str
    email: str
    password: str
    budget: Optional[float] = None
    surface_min: Optional[int] = None
    preferences_location: Optional[str] = None
    ville_prefs: Optional[List[str]] = None

@strawberry.input
class UserUpdateInput:  # Pour profil
    budget: Optional[float] = None
    surface_min: Optional[int] = None
    preferences_location: Optional[str] = None
    ville_prefs: Optional[List[str]] = None

@strawberry.type
class Recommandation:
    id: str
    titre: str
    prix: float
    adresse: str
    surface: int
    chambres: int
    lat: float
    lon: float
    score: float      # Score personnalisé 0-100
    source: str       # "SIMILAIRE_A", "COLLABORATIF", "PAGERANK"
    distance_km: float | None  # De PROCHE_DE si existe

@strawberry.input
class RecommandationsInput:
    limit: int = 12
    min_score: float = 30.0

@strawberry.input
class ComparaisonInput:
    propriete_ids: list[str]  # Jusqu'à 3 IDs

@strawberry.type
class AmenagementSimple:
    type: Optional[str] = None 
    qualite: Optional[str] = None

@strawberry.type
class ComparaisonPropriete:
    id: str
    titre: str
    prix: float
    prix_m2: float | None
    surface: int
    chambres: int
    adresse: str
    localisation: str | None  # commune
    amenagements: list[AmenagementSimple]
    photos: list[str]  # URLs des photos facade

@strawberry.type
class ComparaisonResult:
    proprietes: list[ComparaisonPropriete]
    similaires: list[Recommandation]  # Réutilise le type existant

@strawberry.type 
class StatsMarche:
    prixMoyen: float
    prixMedian: float
    nbProprietes: int
    tendancePrix7j: float  # Variation % sur 7 jours

@strawberry.type
class PerformancePropriete:
    id: str
    titre: str
    nbVisites: int
    nbFavoris: int
    prix: float

@strawberry.type 
class StatsAgent:
    totalProprietes: int
    prixMoyenProprietes: float
    totalVisites: int
    totalFavoris: int
    statsMarche: StatsMarche
    performances: list[PerformancePropriete]

@strawberry.enum
class StatutVisite(str, Enum):
    EN_ATTENTE = "en_attente"
    ACCEPTEE = "acceptee"
    REFUSEE = "refusee"

@strawberry.type
class DemandeVisite:
    id: str  # f"DV{secrets.token_hex(8).upper()}"
    date_souhaitee: str  # "2026-01-20"
    propriete_id: str
    heure: str  # "14:00"
    statut: StatutVisite
    date_creation: str
    message: Optional[str]
    propriete_titre: str

@strawberry.input
class DemandeVisiteInput:
    propriete_id: str
    date_souhaitee: str
    heure: str
    message: Optional[str]
    propriete_titre: Optional[str] = None

@strawberry.type
class HistoriqueDemandes:
    demandes: List[DemandeVisite]
    nb_demandes: int


@strawberry.type
class NotificationAgent:
    id: str
    type: str
    date: str
    lu: bool
    message: str
    propriete_id: str
    propriete_titre: str
    user_id: str
    user_nom: str
    demandeid: str
    date_souhaitee: str
    heure: str

@strawberry.type
class NotificationsAgent:
    notifications: List[NotificationAgent]
    nb_non_lues: int

@strawberry.type
class HistoriqueDemandesAgent:
    demandes: List[DemandeVisite]

@strawberry.type
class NotificationUser:
    id: str
    type: str
    date: str
    lu: bool
    message: str
    propriete_id: str
    propriete_titre: str
    agent_nom: str
    demandeid: str
    nouveau_statut: str

@strawberry.type
class NotificationsUser:
    notifications: List[NotificationUser]
    nb_non_lues: int

@strawberry.type
class Query:
    @strawberry.field
    async def proprietes_map(self) -> list[Propriete]:
        #async with driver.session() as session:
        with driver.session() as session:
            #result = await session.run(
            result = session.run(
                """
                MATCH (p:Propriete) 
                WHERE p.geo IS NOT NULL AND size(p.geo)=2
                RETURN p.id AS id, p.titre AS titre, p.prix AS prix, 
                    p.adresse AS adresse, p.description AS description,
                    p.surface AS surface, p.chambres AS chambres,
                    p.geo[0] AS lat, p.geo[1] AS lon
                """
            )
            return [Propriete(**record.data()) for record in result] 
    @strawberry.field 
    def proprietes_filtrees(
        self,
        prix_min: float | None = None,
        prix_max: float | None = None,
        surface_min: int | None = None,
        chambres_min: int | None = None,
        amenagement_types: list[str] | None = None,  # ex: ["piscine","garage"]
    ) -> list[Propriete]:
        with driver.session() as session:
            cypher = """
            MATCH (p:Propriete)
            WHERE p.geo IS NOT NULL AND size(p.geo) = 2
            """
            if prix_min is not None:
                cypher += " AND p.prix >= $prix_min"
            if prix_max is not None:
                cypher += " AND p.prix <= $prix_max"
            if surface_min is not None:
                cypher += " AND p.surface >= $surface_min"
            if chambres_min is not None:
                cypher += " AND p.chambres >= $chambres_min"


            # équipements (au moins 1 équipement parmi la liste)
            if amenagement_types:
                cypher += """
                AND EXISTS {
                MATCH (p)-[:POSSEDE_AMENAGEMENT]->(a:Amenagement)
                WHERE a.type IN $amenagement_types
                }
                """

            cypher += """
            RETURN p.id AS id, p.titre AS titre, p.prix AS prix,
                   p.adresse AS adresse, p.description AS description,
                   p.surface AS surface, p.chambres AS chambres,
                   p.geo[0] AS lat, p.geo[1] AS lon
            """
            result = session.run(
                cypher,
                prix_min=prix_min,
                prix_max=prix_max,
                surface_min=surface_min,
                chambres_min=chambres_min,
                amenagement_types=amenagement_types,
            )
            return [Propriete(**record.data()) for record in result] 
    
    @strawberry.field
    def propriete_detail(self, id: str, token: Optional[str] = None) -> ProprieteDetail | None:
        with driver.session() as session:
            # Propriété principale - EXTRAIRE LES PROPRIÉTÉS
            prop_result = session.run(
                """
                MATCH (p:Propriete {id: $id})
                WHERE p.geo IS NOT NULL AND size(p.geo) = 2
                RETURN p.id AS id, p.titre AS titre, p.prix AS prix,
                    p.adresse AS adresse, p.description AS description,
                    p.surface AS surface, p.chambres AS chambres,
                    p.geo[0] AS lat, p.geo[1] AS lon
                """,
                id=id
            )
            prop_record = prop_result.single()
            if not prop_record:
                return None
            
            # Maintenant c'est un dict, pas un Node !
            p_data = prop_record.data()
            
            # Photos
            photo_result = session.run(
                """
                MATCH (p:Propriete {id: $id})-[:APHOTO]->(ph:Photo)
                RETURN collect({url: ph.url, angle: ph.angle}) AS photos
                """,
                id=id
            )
            photos_data = photo_result.single()["photos"] or []
            photos = [Photo(url=ph["url"], angle=ph["angle"]) for ph in photos_data]
            
            # Aménagements
            amen_result = session.run(
                """
                MATCH (p:Propriete {id: $id})-[:POSSEDE_AMENAGEMENT]->(a:Amenagement)
                RETURN collect({id: a.id, type: a.type, qualite: a.qualite}) AS amenagements
                """,
                id=id
            )
            amen_data = amen_result.single()["amenagements"] or []
            amenagements = [Amenagement(id=a["id"], type=a["type"], qualite=a["qualite"]) for a in amen_data]
            
            # Localisation
            loc_result = session.run(
                """
                MATCH (p:Propriete {id: $id})-[dq:DANSQUARTIER]->(loc:Localisation)
                RETURN loc.id AS loc_id, loc.commune AS loc_commune, 
                    loc.region AS loc_region, loc.prix_m2 AS loc_prix_m2,
                    loc.securite AS loc_securite, dq.prix_m2_local AS prix_m2_local
                """,
                id=id
            )
            loc_record = loc_result.single()
            localisation = None
            prix_m2_local = None
            if loc_record:
                localisation = Localisation(
                    id=loc_record["loc_id"],
                    commune=loc_record["loc_commune"],
                    region=loc_record["loc_region"],
                    prix_m2=loc_record["loc_prix_m2"],
                    securite=loc_record["loc_securite"]
                )
                prix_m2_local = loc_record["prix_m2_local"]
            
            # Agence
            ag_result = session.run(
                """
                MATCH (ag:Agence)-[g:GERE]->(p:Propriete {id: $id})
                RETURN ag.id AS ag_id, ag.nom AS ag_nom, ag.adresse AS ag_adresse,
                    ag.email AS ag_email, ag.telephone AS ag_telephone,
                    g.date_depot AS date_depot
                """,
                id=id
            )
            ag_record = ag_result.single()
            agence = None
            date_depot = None
            if ag_record:
                agence = Agence(
                    id=ag_record["ag_id"],
                    nom=ag_record["ag_nom"],
                    adresse=ag_record["ag_adresse"],
                    email=ag_record["ag_email"],
                    telephone=ag_record["ag_telephone"]
                )
                date_depot = ag_record["date_depot"]
            # Dans propriete_detail, AVANT le RETURN final :
            if token:
                try:
                    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                    user_result = session.run(
                        "MATCH (u:User {email: $email}) RETURN u.id", 
                        email=payload["sub"]
                    ).single()
                    if user_result:
                        user_id = user_result["u.id"]  # USER770
                        user_num = user_id[4:]       # 770
                        
                        # Compteur visites USER
                        seq_result = session.run("""
                            MATCH (u:User {id: $user_id})-[:A_VISITE]->(v:Visite)
                            RETURN count(v) AS seq
                        """, user_id=user_id).single()
                        seq = seq_result["seq"] + 1
                        visite_id = f"U{user_num}_V{seq:03d}"  # U770_V001
                        
                        # CRÉATION DIRECTE (même session !)
                        session.run("""
                            MATCH (u:User {id: $user_id}), (p:Propriete {id: $prop_id})
                            MERGE (v:Visite {id: $visite_id})
                            ON CREATE SET 
                                v.dateVisite = date(),
                                v.impression = null,
                                v.prixPropose = null
                            MERGE (u)-[:A_VISITE]->(v)
                            MERGE (v)-[:CONCERNE]->(p)
                        """, user_id=user_id, prop_id=id, visite_id=visite_id)
                except: 
                    pass

            return ProprieteDetail(
                id=p_data["id"],
                titre=p_data["titre"],
                prix=float(p_data["prix"]),
                adresse=p_data["adresse"],
                description=p_data["description"],
                surface=int(p_data["surface"]),
                chambres=int(p_data["chambres"]),
                lat=float(p_data["lat"]),
                lon=float(p_data["lon"]),
                photos=photos,
                amenagements=amenagements,
                localisation=localisation,
                agence=agence,
                date_depot=date_depot,
                prix_m2_local=prix_m2_local
            )
    @strawberry.field
    def recherche_localisation(
        self,
        commune: str | None = None,       # ex: "Casablanca"
        quartier_id: str | None = None,   # ex: "LOC_AIN_DIAB"
        lat: float | None = None,         # ex: 33.58
        lon: float | None = None,         # ex: -7.6
        rayon_km: float | None = None,    # ex: 3
    ) -> list[Propriete]:
        with driver.session() as session:
            cypher = """
            MATCH (p:Propriete)
            WHERE p.geo IS NOT NULL AND size(p.geo)=2
            """

            # Commune / quartier (via DANSQUARTIER -> Localisation)
            if commune or quartier_id:
                cypher += """
                AND EXISTS {
                MATCH (p)-[:DANSQUARTIER]->(loc:Localisation)
                WHERE ($commune IS NULL OR toLower(loc.commune) = toLower($commune))
                    AND ($quartier_id IS NULL OR loc.id = $quartier_id)
                }
                """

            # Rayon (km -> mètres) avec point() + distance()
            if lat is not None and lon is not None and rayon_km is not None:
                cypher += """
                AND point.distance(
                point({latitude: p.geo[0], longitude: p.geo[1]}),
                point({latitude: $lat, longitude: $lon})
                ) <= ($rayon_km * 1000)
                """

            cypher += """
            RETURN p.id AS id, p.titre AS titre, p.prix AS prix,
                p.adresse AS adresse, p.description AS description,
                p.surface AS surface, p.chambres AS chambres,
                p.geo[0] AS lat, p.geo[1] AS lon
            """

            result = session.run(
                cypher,
                commune=commune,
                quartier_id=quartier_id,
                lat=lat,
                lon=lon,
                rayon_km=rayon_km,
            )
            return [Propriete(**record.data()) for record in result]
        
    @strawberry.field
    def proprietes_triees(
        self,
        tri: TriPropriete = TriPropriete.PERTINENCE,
        ordre: OrdreType = OrdreType.DESC,
        limit: int = 20,
    ) -> list[Propriete]:
        with driver.session() as session:
            direction = "DESC" if ordre == OrdreType.DESC else "ASC"
            
            cypher = f"""
            MATCH (p:Propriete)
            WHERE p.geo IS NOT NULL AND size(p.geo) = 2
            
            OPTIONAL MATCH (ag:Agence)-[g:GERE]->(p)
            
            WITH p, g,
                CASE $tri
                    WHEN 'PRIX' THEN coalesce(p.prix, 0)
                    WHEN 'DATE_DEPOT' THEN coalesce(g.date_depot, datetime('1970-01-01T00:00Z'))
                    WHEN 'PERTINENCE' THEN p.prix + (p.surface * 1000)
                END AS sort_value
            
            ORDER BY sort_value IS NULL, sort_value {direction}
            RETURN p.id AS id, p.titre AS titre, p.prix AS prix,
                p.adresse AS adresse, p.description AS description,
                p.surface AS surface, p.chambres AS chambres,
                p.geo[0] AS lat, p.geo[1] AS lon,
                g.date_depot AS date_depot 

            LIMIT $limit
            """
            result = session.run(cypher, tri=tri.value, limit=limit)
            return [Propriete(**record.data()) for record in result]
        
    @strawberry.field
    def utilisateurs(
        self, 
        limit: int = 50,
        role: Optional[str] = None  # None = tous, "AGENT" = agents, "ACHETEUR" = acheteurs
    ) -> list[User]:
        with driver.session() as session:
            cypher = """
            MATCH (u:User)
            """
            
            # Filtre role dynamique
            if role:
                cypher += f"WHERE toLower(u.role) = toLower($role)"
            
            cypher += """
            RETURN u.id AS id, u.nom AS nom, u.prenom AS prenom, 
                u.email AS email, u.role AS role, u.budget AS budget,
                u.surface_min AS surface_min, 
                u.preferences_location AS preferences_location,
                u.ville_prefs AS ville_prefs, u.created_at AS created_at
            LIMIT $limit
            """
            
            result = session.run(
                cypher,
                limit=limit,
                role=role
            )
            return [User(**record.data()) for record in result]
    @strawberry.field  # ← OBLIGATOIRE !
    def me(self, token: str) -> User | None:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email = payload["sub"]
            
            with driver.session() as session:
                result = session.run(
                    """
                    MATCH (u:User {email: $email})
                    RETURN 
                        u.id AS id,
                        u.nom AS nom,
                        u.prenom AS prenom,
                        u.email AS email,
                        u.role AS role,
                        u.budget AS budget,
                        u.surface_min AS surface_min,
                        u.preferences_location AS preferences_location,
                        u.ville_prefs AS ville_prefs,
                        u.created_at AS created_at
                    """,
                    email=email
                )
                record = result.single()
                if record:
                    return User(**record.data())  # ← .data() pas ["u"]
                return None
        except JWTError:
            return None
    @strawberry.field
    def est_favori(self, propriete_id: str, token: str) -> bool:
        """Vérifie si propriété en favoris"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            with driver.session() as session:
                result = session.run("""
                    MATCH (u:User {email: $email})-[r:AIME]->(p:Propriete {id: $prop_id})
                    RETURN count(r) > 0 AS is_favori
                """, email=payload["sub"], prop_id=propriete_id)
                return result.single()["is_favori"]
        except JWTError: return False

    @strawberry.field
    def dashboard_personnel(self, token: str) -> DashboardPersonnel | None:
        """Dashboard complet favoris + historique visites"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload["sub"]
            
            with driver.session() as session:
                user_result = session.run("MATCH (u:User {email: $email}) RETURN u.id AS id", email=user_email).single()
                if not user_result: return None
                user_id = user_result["id"]
                
                # Favoris AIME
                favoris_result = session.run("""
                    MATCH (u:User {id: $user_id})-[r:AIME]->(p:Propriete)
                    RETURN p.id AS propriete_id, r.date_ajout AS date_ajout, r.note AS note
                    ORDER BY r.date_ajout DESC
                """, user_id=user_id)
                favoris = [Favori(**r) for r in favoris_result]
                
                # Visites via A_VISITE → CONCERNE
                visites_result = session.run("""
                    MATCH (u:User {id: $user_id})-[:A_VISITE]->(v:Visite)-[:CONCERNE]->(p:Propriete)
                    RETURN v.id AS id, v.dateVisite AS date_visite, 
                        coalesce(v.impression, "") AS impression, 
                        v.prixPropose AS prix_propose
                    ORDER BY v.dateVisite DESC LIMIT 50

                """, user_id=user_id)
                visites = [VisiteNode(**r) for r in visites_result]
                
                return DashboardPersonnel(
                    favoris=favoris, visites=visites,
                    nb_favoris=len(favoris), nb_visites=len(visites)
                )
        except JWTError: return None
    @strawberry.field
    def recommandations(self, token: str, input: Optional[RecommandationsInput] = None) -> list[Recommandation]:
        """Recommandations intelligentes avec 3 sources"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload["sub"]

            if input is None:
                input = RecommandationsInput()
            
            with driver.session() as session:
                # 1. Récupérer infos utilisateur
                user_res = session.run("""
                    MATCH (u:User {email: $email})
                    RETURN u.id AS id, u.budget AS budget, u.surface_min AS surface_min
                """, email=user_email).single()
                
                if not user_res: 
                    return []
                
                user_id = user_res["id"]
                budget = user_res["budget"] or 0
                surface_min = user_res["surface_min"] or 0
                
                # 2. Requête de recommandations (SYNTAXE NEO4J 5.x)
                recos = session.run("""
                // Récupérer propriétés aimées/visitées
                MATCH (u:User {id: $user_id})
                CALL (u) {  // ← Variable scope explicite
                MATCH (u)-[:AIME]->(p:Propriete)
                RETURN p
                UNION
                MATCH (u)-[:A_VISITE]->(:Visite)-[:CONCERNE]->(p:Propriete)
                RETURN p
                }
                WITH u, collect(DISTINCT p) AS liked_props
                
                // 3 sources de recommandations
                CALL (u, liked_props) {  // ← Variable scope explicite
                // SIMILAIRE_A
                UNWIND liked_props AS p
                MATCH (p)-[sim:SIMILAIRE_A]->(p2:Propriete)
                WHERE NOT p2 IN liked_props 
                    AND p2.geo IS NOT NULL AND size(p2.geo) = 2
                RETURN p2, sim.scoreSimilarite * 35 AS score, 
                        'SIMILAIRE_A' AS source, null AS dist
                ORDER BY score DESC LIMIT 6
                
                UNION
                
                // PROCHE_DE
                UNWIND liked_props AS p
                MATCH (p)-[proche:PROCHE_DE]->(p2:Propriete)
                WHERE NOT p2 IN liked_props
                    AND p2.geo IS NOT NULL AND size(p2.geo) = 2
                RETURN p2, (1/(proche.distanceKm+1))*40 AS score, 
                        'PROCHE' AS source, proche.distanceKm AS dist
                ORDER BY score DESC LIMIT 6
                
                UNION
                
                // COLLABORATIF
                UNWIND liked_props AS p
                MATCH (p)<-[:AIME]-(u2:User)-[:AIME]->(p2:Propriete)
                WHERE u2 <> u AND NOT p2 IN liked_props
                    AND p2.geo IS NOT NULL AND size(p2.geo) = 2
                WITH p2, count(DISTINCT u2) AS nb_users
                RETURN p2, nb_users*8 AS score, 
                        'COLLABORATIF' AS source, null AS dist
                ORDER BY score DESC LIMIT 4
                }
                
                // Agrégation et personnalisation
                WITH p2, max(score) AS base_score, 
                    head(collect(source)) AS source, 
                    head(collect(dist)) AS dist
                ORDER BY base_score DESC
                LIMIT $limit
                
                RETURN p2.id AS id, p2.titre AS titre, p2.prix AS prix, 
                    p2.adresse AS adresse, p2.surface AS surface, 
                    p2.chambres AS chambres,
                    p2.geo[0] AS lat, p2.geo[1] AS lon,
                    round(base_score * 
                        (CASE WHEN p2.prix <= $budget*1.3 THEN 1.2 ELSE 0.8 END) *
                        (CASE WHEN p2.surface >= $surface_min THEN 1.1 ELSE 0.9 END), 1) AS score,
                    source, dist
                ORDER BY score DESC
                """, user_id=user_id, budget=budget, 
                    surface_min=surface_min, limit=input.limit)
                
                # 3. Conversion en objets Recommandation
                return [
                    Recommandation(
                        id=r["id"], 
                        titre=r["titre"], 
                        prix=float(r["prix"]),
                        adresse=r["adresse"], 
                        surface=int(r["surface"]),
                        chambres=int(r["chambres"]), 
                        lat=float(r["lat"]), 
                        lon=float(r["lon"]),
                        score=float(r["score"]), 
                        source=r["source"],
                        distance_km=float(r["dist"]) if r["dist"] is not None else None
                    ) for r in recos
                ]
                
        except jwt.ExpiredSignatureError:
            print("Token expiré")
            return []
        except Exception as e:
            print(f"Recommandations error: {e}")
            import traceback
            traceback.print_exc()
            return []
    @strawberry.field
    def comparaison_proprietes(self, input: ComparaisonInput) -> ComparaisonResult | None:
        if len(input.propriete_ids) > 3 or len(input.propriete_ids) < 2:
            raise HTTPException(status_code=400, detail="Sélectionnez 2 à 3 propriétés")
        
        with driver.session() as session:
            # Récupère les détails des propriétés sélectionnées
            props_result = session.run("""
                UNWIND $ids AS prop_id
                MATCH (p:Propriete {id: prop_id})
                OPTIONAL MATCH (p)-[:DANSQUARTIER]->(loc:Localisation)
                OPTIONAL MATCH (p)-[:POSSEDE_AMENAGEMENT]->(a:Amenagement)
                OPTIONAL MATCH (p)-[:APHOTO]->(ph:Photo)
                WITH p, loc, collect(DISTINCT {type: a.type, qualite: a.qualite}) AS amens,
                     collect(DISTINCT ph.url) AS photo_urls,
                     loc.commune AS commune
                RETURN p.id AS id, p.titre AS titre, p.prix AS prix,
                       coalesce(p.prix / p.surface * 1000, 0) AS prix_m2,
                       p.surface AS surface, p.chambres AS chambres,
                       p.adresse AS adresse, commune AS localisation,
                       amens, photo_urls
                ORDER BY p.titre
            """, ids=input.propriete_ids)
            
            proprietes = []
            for record in props_result:
                data = record.data()
                proprietes.append(ComparaisonPropriete(
                    id=data["id"],
                    titre=data["titre"],
                    prix=float(data["prix"]),
                    prix_m2=float(data["prix_m2"]) if data["prix_m2"] else None,
                    surface=int(data["surface"]),
                    chambres=int(data["chambres"]),
                    adresse=data["adresse"],
                    localisation=data["localisation"],
                    amenagements=[AmenagementSimple(**a) for a in data["amens"]],
                    photos=data["photo_urls"] or []
                ))
            
            if len(proprietes) != len(input.propriete_ids):
                return None
            
            # Suggestions similaires: moyenne des similarités aux sélectionnées
            # sim_result = session.run("""
            #     UNWIND $ids AS seed_id
            #     MATCH (seed:Propriete {id: seed_id})-[sim:SIMILAIRE_A|SIMILAIRE_PAR_AMENAGEMENT]->(cand:Propriete)
            #     WHERE NOT cand.id IN $ids
            #       AND cand.geo IS NOT NULL AND size(cand.geo)=2
            #     WITH cand, avg(sim.scoreSimilarite) AS avg_score,
            #          min(case sim WHEN 'PROCHE_DE' THEN sim.distanceKm END) AS min_dist
            #     RETURN cand.id AS id, cand.titre AS titre, cand.prix AS prix,
            #            cand.adresse AS adresse, cand.surface AS surface,
            #            cand.chambres AS chambres, cand.geo[0] AS lat, cand.geo[1] AS lon,
            #            avg_score * 100 AS score, 'SIMILAIRE' AS source,
            #            coalesce(min_dist, null) AS distance_km
            #     ORDER BY score DESC LIMIT 6
            # """, ids=input.propriete_ids)
            sim_result = session.run("""
            UNWIND $ids AS seed_id
            MATCH (seed:Propriete {id: seed_id})-[r:SIMILAIRE_A|SIMILAIRE_PAR_AMENAGEMENT]->(cand:Propriete)
            WHERE NOT cand.id IN $ids AND cand.geo IS NOT NULL AND size(cand.geo)=2
            WITH cand, 
                avg(CASE 
                    WHEN type(r) = 'SIMILAIRE_A' THEN coalesce(r.scoreSimilarite, 0)
                    WHEN type(r) = 'SIMILAIRE_PAR_AMENAGEMENT' THEN coalesce(r.scoreAmenagement, 0)
                    ELSE 0 
                END) AS avg_score
            WHERE avg_score > 0
            RETURN cand.id AS id, cand.titre AS titre, cand.prix AS prix, 
                cand.adresse AS adresse, cand.surface AS surface,
                cand.chambres AS chambres, cand.geo[0] AS lat, cand.geo[1] AS lon,
                avg_score * 100 AS score, 'SIMILAIRE' AS source, null AS distance_km
            ORDER BY score DESC LIMIT 6
        """, ids=input.propriete_ids)
            
            similaires = [
                Recommandation(
                    id=r["id"], titre=r["titre"], prix=float(r["prix"]),
                    adresse=r["adresse"], surface=int(r["surface"]),
                    chambres=int(r["chambres"]), lat=float(r["lat"]), lon=float(r["lon"]),
                    score=float(r["score"]), source=r["source"],
                    distance_km=float(r["distance_km"]) if r["distance_km"] else None
                ) for r in sim_result
            ]
            
            return ComparaisonResult(proprietes=proprietes, similaires=similaires)
    @strawberry.field
    def proprietes_completes(self, ids: list[str]) -> list[ProprieteDetail]:
        """Récupère TOUS les détails de plusieurs propriétés"""
        with driver.session() as session:
            result = session.run("""
            MATCH (p:Propriete)
            WHERE p.id IN $ids 
            AND p.geo IS NOT NULL AND size(p.geo) = 2
            
            // Photos VALIDES uniquement (url non null)
            OPTIONAL MATCH (p)-[:APHOTO]->(ph:Photo)
            WHERE ph.url IS NOT NULL
            
            // Aménagements VALIDES uniquement
            OPTIONAL MATCH (p)-[:POSSEDE_AMENAGEMENT]->(a:Amenagement)
            WHERE a.type IS NOT NULL AND a.qualite IS NOT NULL
            
            // Localisation
            OPTIONAL MATCH (p)-[dq:DANSQUARTIER]->(loc:Localisation)
            
            // Agence
            OPTIONAL MATCH (ag:Agence)-[g:GERE]->(p)
            
            RETURN 
                p.id AS id, p.titre AS titre, p.prix AS prix,
                p.adresse AS adresse, p.description AS description,
                p.surface AS surface, p.chambres AS chambres,
                p.geo[0] AS lat, p.geo[1] AS lon,
                
                // Photos sans doublons, url non null
                collect(DISTINCT {url: ph.url, angle: coalesce(ph.angle, 'inconnu')}) AS photos,
                
                // Aménagements sans doublons
                collect(DISTINCT {id: a.id, type: a.type, qualite: a.qualite}) AS amenagements,
                
                // Localisation
                loc.id AS loc_id, loc.commune AS loc_commune, 
                loc.region AS loc_region, loc.prix_m2 AS loc_prix_m2,
                loc.securite AS loc_securite, dq.prix_m2_local AS prix_m2_local,
                
                // Agence
                ag.id AS ag_id, ag.nom AS ag_nom, ag.adresse AS ag_adresse,
                ag.email AS ag_email, ag.telephone AS ag_telephone,
                g.date_depot AS date_depot
            ORDER BY p.id
            """, ids=ids)
            
            proprietes = []
            for record in result:
                data = record.data()
                
                # Photos (double vérif)
                photos = []
                for ph in data.get("photos", []):
                    if ph["url"]:
                        photos.append(Photo(url=ph["url"], angle=ph["angle"]))
                
                # Aménagements
                amenagements = [Amenagement(**a) for a in data.get("amenagements", [])]
                
                # Localisation
                localisation = None
                prix_m2_local = None
                if data["loc_id"]:
                    localisation = Localisation(
                        id=data["loc_id"], 
                        commune=data["loc_commune"] or "Inconnue",
                        region=data["loc_region"] or "Inconnue", 
                        prix_m2=float(data["loc_prix_m2"] or 0),
                        securite=data["loc_securite"] or "Inconnue"
                    )
                    prix_m2_local = data["prix_m2_local"]
                
                # Agence
                agence = None
                date_depot = None
                if data["ag_id"]:
                    agence = Agence(
                        id=data["ag_id"], 
                        nom=data["ag_nom"] or "Agence inconnue",
                        adresse=data["ag_adresse"] or "", 
                        email=data["ag_email"] or "",
                        telephone=data["ag_telephone"]
                    )
                    date_depot = data["date_depot"]
                
                proprietes.append(ProprieteDetail(
                    id=data["id"], titre=data["titre"], prix=float(data["prix"]),
                    adresse=data["adresse"], description=data["description"],
                    surface=int(data["surface"]), chambres=int(data["chambres"]),
                    lat=float(data["lat"]), lon=float(data["lon"]),
                    photos=photos, amenagements=amenagements,
                    localisation=localisation, agence=agence,
                    date_depot=date_depot, prix_m2_local=prix_m2_local
                ))
            
            return proprietes
    @strawberry.field
    def top_proprietes_completes(self, limit: int = 9) -> list[ProprieteDetail]:
        """Top propriétés complètes (sans ID, avec LIMIT)"""
        with driver.session() as session:
            result = session.run("""
            MATCH (p:Propriete)
            WHERE p.geo IS NOT NULL AND size(p.geo) = 2
            
            // Photos VALIDES uniquement
            OPTIONAL MATCH (p)-[:APHOTO]->(ph:Photo)
            WHERE ph.url IS NOT NULL
            
            // Aménagements VALIDES (id non null)
            OPTIONAL MATCH (p)-[:POSSEDE_AMENAGEMENT]->(a:Amenagement)
            WHERE a.type IS NOT NULL AND a.qualite IS NOT NULL AND a.id IS NOT NULL
            
            // Localisation
            OPTIONAL MATCH (p)-[dq:DANS_QUARTIER]->(loc:Localisation)
            
            // Agence
            OPTIONAL MATCH (ag:Agence)-[g:GERE]->(p)
            
            RETURN 
                p.id AS id, p.titre AS titre, p.prix AS prix,
                p.adresse AS adresse, p.description AS description,
                p.surface AS surface, p.chambres AS chambres,
                p.geo[0] AS lat, p.geo[1] AS lon,
                
                collect(DISTINCT {url: ph.url, angle: coalesce(ph.angle, 'inconnu')}) AS photos,
                
                collect(DISTINCT {id: a.id, type: a.type, qualite: a.qualite}) AS amenagements,
                
                loc.id AS loc_id, loc.commune AS loc_commune, 
                loc.region AS loc_region, loc.prix_m2 AS loc_prix_m2,
                loc.securite AS loc_securite, dq.prix_m2_local AS prix_m2_local,
                
                ag.id AS ag_id, ag.nom AS ag_nom, ag.adresse AS ag_adresse,
                ag.email AS ag_email, ag.telephone AS ag_telephone,
                g.date_depot AS date_depot
                
            ORDER BY p.prix ASC  // ← Ou date_depot DESC, etc.
            LIMIT $limit
            """, limit=limit)
            
            # Le reste identique (photos, amenagements, etc.)
            proprietes = []
            for record in result:
                data = record.data()
                
                photos = [Photo(url=ph["url"], angle=ph["angle"]) 
                        for ph in data.get("photos", []) if ph["url"]]
                
                amenagements = [Amenagement(**a) for a in data.get("amenagements", []) 
                            if a.get("id") is not None]
                
                # Localisation + Agence identiques
                localisation = None
                prix_m2_local = None
                if data["loc_id"]:
                    localisation = Localisation(
                        id=data["loc_id"], 
                        commune=data["loc_commune"] or "Inconnue",
                        region=data["loc_region"] or "Inconnue", 
                        prix_m2=float(data["loc_prix_m2"] or 0),
                        securite=data["loc_securite"] or "Inconnue"
                    )
                    prix_m2_local = data["prix_m2_local"]
                
                agence = None
                date_depot = None
                if data["ag_id"]:
                    agence = Agence(
                        id=data["ag_id"], nom=data["ag_nom"] or "Agence inconnue",
                        adresse=data["ag_adresse"] or "", email=data["ag_email"] or "",
                        telephone=data["ag_telephone"]
                    )
                    date_depot = data["date_depot"]
                
                proprietes.append(ProprieteDetail(
                    id=data["id"], titre=data["titre"], prix=float(data["prix"]),
                    adresse=data["adresse"], description=data["description"],
                    surface=int(data["surface"]), chambres=int(data["chambres"]),
                    lat=float(data["lat"]), lon=float(data["lon"]),
                    photos=photos, amenagements=amenagements,
                    localisation=localisation, agence=agence,
                    date_depot=date_depot, prix_m2_local=prix_m2_local
                ))
            
            return proprietes
    @strawberry.field
    def dashboard_agent(self, token: str) -> StatsAgent:
        """Dashboard AGENT robuste (gère 0 propriétés)"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            agent_id = payload['user_id']
            
            with driver.session() as session:
                # 1. Vérif agent + agences
                agent_check = session.run("""
                    MATCH (u:User {id: $agent_id})
                    OPTIONAL MATCH (a:Agence {id: $agent_id})
                    RETURN u.role AS role, count(a) AS nb_agences
                """, agent_id=agent_id).single()
                
                if not agent_check:
                    raise HTTPException(404, "Agent introuvable")
                if agent_check['role'] != 'AGENT':
                    raise HTTPException(403, "Role AGENT requis")

                # 2. Stats propriétés (0 si aucune)
                props_stats_res = session.run("""
                    MATCH (a:Agence {id: $agent_id})-[:GERE]->(p:Propriete)
                    
                    // Compter propriétés et prix moyen
                    WITH count(DISTINCT p) AS total_proprietes,
                        avg(coalesce(p.prix, 0)) AS prix_moyen_proprietes,
                        collect(DISTINCT p) AS props
                    
                    // Compter visites
                    UNWIND props AS p
                    OPTIONAL MATCH (v:Visite)-[:CONCERNE]->(p)
                    WITH total_proprietes, prix_moyen_proprietes, props,
                        count(DISTINCT v) AS total_visites
                    
                    // Compter favoris
                    UNWIND props AS p
                    OPTIONAL MATCH ()-[r:AIME]->(p)
                    
                    RETURN 
                        total_proprietes,
                        prix_moyen_proprietes,
                        total_visites,
                        count(r) AS total_favoris
                """, agent_id=agent_id)

                props_stats = props_stats_res.single()
                if not props_stats:
                    props_stats = {'total_proprietes': 0, 'prix_moyen_proprietes': 0, 
                                'total_visites': 0, 'total_favoris': 0}
                    
                # 3. Stats marché global (0 si aucune)
                marche_res = session.run("""
                    MATCH (p:Propriete)
                    
                    // Stats générales du marché
                    WITH count(p) AS nb_proprietes,
                        avg(p.prix) AS prix_moyen,
                        percentileDisc(p.prix, 0.5) AS prix_median
                    
                    // Prix moyen des propriétés déposées dans les 7 derniers jours
                    OPTIONAL MATCH (a:Agence)-[r:GERE]->(p_recent:Propriete)
                    WHERE r.date_depot >= date() - duration('P7D')
                    
                    WITH nb_proprietes, prix_moyen, prix_median,
                        avg(p_recent.prix) AS prix_moyen_7j,
                        count(p_recent) AS nb_recent
                    
                    RETURN 
                        nb_proprietes,
                        prix_moyen,
                        prix_median,
                        CASE 
                            WHEN nb_recent > 0 AND prix_moyen > 0
                            THEN round(((prix_moyen_7j - prix_moyen) / prix_moyen) * 100, 2)
                            ELSE 0.0 
                        END AS tendance_prix_7j
                """).single()


                if not marche_res:
                    marche_res = {'nb_proprietes': 0, 'prix_moyen': 0, 'prix_median': 0, 'tendance_prix_7j': 0}

                # 4. Performances (liste vide si 0)
                perfs_res = session.run("""
                    MATCH (a:Agence {id: $agent_id})-[:GERE]->(p:Propriete)
                    OPTIONAL MATCH (vis:User)-[:A_VISITE]->(:Visite)-[:CONCERNE]->(p)
                    OPTIONAL MATCH (fav:User)-[:AIME]->(p)
                    WITH p, 
                        count(DISTINCT vis) AS nb_visites,
                        count(DISTINCT fav) AS nb_favoris
                    RETURN 
                        p.id AS id, 
                        coalesce(p.titre, 'Sans titre') AS titre,
                        coalesce(p.prix, 0) AS prix,
                        nb_visites,
                        nb_favoris
                    ORDER BY nb_visites DESC
                    LIMIT 15
                """, agent_id=agent_id)


                performances = []
                for record in perfs_res:
                    data = record.data()
                    performances.append(PerformancePropriete(
                        id=data["id"], titre=data["titre"], prix=float(data["prix"]),
                        nbVisites=data["nb_visites"], nbFavoris=data["nb_favoris"]
                    ))

            return StatsAgent(
                totalProprietes=int(props_stats["total_proprietes"]),
                prixMoyenProprietes=float(props_stats["prix_moyen_proprietes"]),
                totalVisites=int(props_stats["total_visites"]),
                totalFavoris=int(props_stats["total_favoris"]),
                statsMarche=StatsMarche(
                    prixMoyen=float(marche_res["prix_moyen"]),
                    prixMedian=float(marche_res["prix_median"]),
                    nbProprietes=int(marche_res["nb_proprietes"]),
                    tendancePrix7j=float(marche_res["tendance_prix_7j"])
                ),
                performances=performances
            )
        except JWTError:
            raise HTTPException(401, "Token invalide")
        except Exception as e:
            print(f"DEBUG ERROR: {str(e)}")  # Console
            raise HTTPException(500, f"Dashboard: {str(e)}")
    @strawberry.field
    def historique_demandes(self, token: str) -> Optional[HistoriqueDemandes]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload['sub']
            
            with driver.session() as session:
                # 1. Récup user ID + DEBUG
                user_res = session.run(
                    "MATCH (u:User {email: $email}) RETURN u.id AS userid, u.email AS email",
                    email=user_email
                ).single()
                
                if not user_res:
                    print(f"User not found for email: {user_email}")  # DEBUG
                    return None
                    
                userid = user_res['userid']
                print(f"User found: {userid} for email: {user_res['email']}")  # DEBUG
                
                # 2. Vérifier les relations existantes
                debug_res = session.run(
                    "MATCH (u:User {id: $userid})-[r:DEMANDE_VISITE]->(p:Propriete) "
                    "RETURN count(r) AS count, collect(r.id) AS demande_ids",
                    userid=userid
                ).single()
                
                print(f"Found {debug_res['count']} demandes: {debug_res['demande_ids']}")  # DEBUG
                
                if debug_res['count'] == 0:
                    return HistoriqueDemandes(demandes=[], nbdemandes=0)
                
                # 3. Récup historique
                result = session.run("""
                    MATCH (u:User {id: $userid})-[r:DEMANDE_VISITE]->(p:Propriete)
                    RETURN 
                        r.id AS id,
                        r.datesouhaitee AS datesouhaitee,
                        r.heure AS heure,
                        r.statut AS statut,
                        r.datecreation AS datecreation,
                        r.message AS message,
                        p.id AS proprieteid,
                        p.titre AS propriete_titre
                    ORDER BY r.datecreation DESC
                    LIMIT 50
                """, userid=userid)
                
                demandes = []
                for record in result:
                    demandes.append(DemandeVisite(
                        id=record['id'],
                        date_souhaitee=record['datesouhaitee'],
                        propriete_id=record['proprieteid'],
                        heure=record['heure'],
                        statut=StatutVisite(record['statut']),
                        date_creation=record['datecreation'],
                        message=record['message'],
                        propriete_titre=record['propriete_titre']
                    ))
                
                return HistoriqueDemandes(
                    demandes=demandes,
                    nb_demandes=len(demandes)
                )
        except JWTError:
            return None
        except Exception as e:
            print(f"Error in historique_demandes: {e}")  # DEBUG
            return None

    # @strawberry.field
    # def notifications_agent(self, token: str) -> Optional[NotificationsAgent]:
    #     try:
    #         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    #         agent_email = payload['sub']
            
    #         with driver.session() as session:
    #             # 1. Récupérer l'ID de l'agent (qui est aussi l'ID de son agence)
    #             agent_res = session.run("""
    #                 MATCH (u:User {email: $email, role: 'AGENT'})
    #                 RETURN u.id AS agent_id
    #             """, email=agent_email).single()
                
    #             if not agent_res:
    #                 print(f"Agent not found: {agent_email}")
    #                 return NotificationsAgent(notifications=[], nb_non_lues=0)
                
    #             agent_id = agent_res['agent_id']  # "AGENT002"
    #             print(f"Agent ID (also Agence ID): {agent_id}")
                
    #             # 2. Récupérer notifications avec l'ID lisible
    #             result = session.run("""
    #                 MATCH (n:Notification)-[:POUR_AGENT]->(a:Agence {id: $agent_id})
    #                 OPTIONAL MATCH (u2:User {id: n.user_id})
    #                 RETURN 
    #                     n.id AS id,
    #                     n.type AS type,
    #                     toString(n.date) AS date,
    #                     n.lu AS lu,
    #                     n.message AS message,
    #                     n.propriete_id AS propriete_id,
    #                     n.propriete_titre AS propriete_titre,
    #                     n.user_id AS user_id,
    #                     COALESCE(u2.nom + ' ' + u2.prenom, n.user_nom, 'Utilisateur inconnu') AS user_nom,
    #                     n.demandeid AS demandeid,
    #                     n.date_souhaitee AS date_souhaitee,
    #                     n.heure AS heure
    #                 ORDER BY n.date DESC
    #                 LIMIT 50
    #             """, agent_id=agent_id)
                
    #             notifications = []
    #             for record in result:
    #                 notifications.append(NotificationAgent(
    #                     id=record['id'],
    #                     type=record['type'],
    #                     date=record['date'],
    #                     lu=record['lu'],
    #                     message=record['message'],
    #                     propriete_id=record['propriete_id'],
    #                     propriete_titre=record['propriete_titre'],
    #                     user_id=record['user_id'],
    #                     user_nom=record['user_nom'],
    #                     demandeid=record['demandeid'],
    #                     date_souhaitee=record['date_souhaitee'],
    #                     heure=record['heure']
    #                 ))
                
    #             nb_non_lues = len([n for n in notifications if not n.lu])
                
    #             print(f"Found {len(notifications)} notifications, {nb_non_lues} unread")
                
    #             return NotificationsAgent(
    #                 notifications=notifications,
    #                 nb_non_lues=nb_non_lues
    #             )
                
    #     except JWTError as e:
    #         print(f"JWT Error: {e}")
    #         return None
    #     except Exception as e:
    #         print(f"Error in notifications_agent: {e}")
    #         import traceback
    #         traceback.print_exc()
    #         return NotificationsAgent(notifications=[], nb_non_lues=0)
    @strawberry.field
    def notifications_agent(self, token: str) -> Optional[NotificationsAgent]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            agent_email = payload['sub']
            
            with driver.session() as session:
                # 1. Récupérer l'ID de l'agent (qui est aussi l'ID de son agence)
                agent_res = session.run("""
                    MATCH (u:User {email: $email, role: 'AGENT'})
                    RETURN u.id AS agent_id
                """, email=agent_email).single()
                
                if not agent_res:
                    print(f"Agent not found: {agent_email}")
                    return NotificationsAgent(notifications=[], nb_non_lues=0)
                
                agent_id = agent_res['agent_id']
                print(f"Agent ID (also Agence ID): {agent_id}")
                
                # 2. Récupérer UNIQUEMENT les notifications avec statut EN_ATTENTE
                result = session.run("""
                    MATCH (n:Notification)-[:POUR_AGENT]->(a:Agence {id: $agent_id})
                    MATCH (u:User)-[r:DEMANDE_VISITE {id: n.demandeid}]->(p:Propriete)
                    WHERE r.statut = 'en_attente'
                    OPTIONAL MATCH (u2:User {id: n.user_id})
                    RETURN 
                        n.id AS id,
                        n.type AS type,
                        toString(n.date) AS date,
                        n.lu AS lu,
                        n.message AS message,
                        n.propriete_id AS propriete_id,
                        n.propriete_titre AS propriete_titre,
                        n.user_id AS user_id,
                        COALESCE(u2.nom + ' ' + u2.prenom, n.user_nom, 'Utilisateur inconnu') AS user_nom,
                        n.demandeid AS demandeid,
                        n.date_souhaitee AS date_souhaitee,
                        n.heure AS heure
                    ORDER BY n.date DESC
                    LIMIT 50
                """, agent_id=agent_id)
                
                notifications = []
                for record in result:
                    notifications.append(NotificationAgent(
                        id=record['id'],
                        type=record['type'],
                        date=record['date'],
                        lu=record['lu'],
                        message=record['message'],
                        propriete_id=record['propriete_id'],
                        propriete_titre=record['propriete_titre'],
                        user_id=record['user_id'],
                        user_nom=record['user_nom'],
                        demandeid=record['demandeid'],
                        date_souhaitee=record['date_souhaitee'],
                        heure=record['heure']
                    ))
                
                nb_non_lues = len([n for n in notifications if not n.lu])
                
                print(f"Found {len(notifications)} notifications EN_ATTENTE, {nb_non_lues} unread")
                
                return NotificationsAgent(
                    notifications=notifications,
                    nb_non_lues=nb_non_lues
                )
                
        except JWTError as e:
            print(f"JWT Error: {e}")
            return None
        except Exception as e:
            print(f"Error in notifications_agent: {e}")
            import traceback
            traceback.print_exc()
            return NotificationsAgent(notifications=[], nb_non_lues=0)
    @strawberry.field
    def historique_demandes_agent(self, token: str) -> Optional[HistoriqueDemandesAgent]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            agent_email = payload['sub']
            
            with driver.session() as session:
                # Récupérer agent_id
                agent_res = session.run("""
                    MATCH (u:User {email: $email, role: 'AGENT'})
                    RETURN u.id AS agent_id
                """, email=agent_email).single()
                
                if not agent_res:
                    return None
                
                agent_id = agent_res['agent_id']
                
                # Récupérer TOUTES les demandes (acceptées, refusées, en attente)
                result = session.run("""
                    MATCH (a:Agence {id: $agent_id})-[:GERE]->(p:Propriete)
                        <-[d:DEMANDE_VISITE]-(u:User)
                    RETURN 
                        d.id AS id,
                        d.datesouhaitee AS datesouhaitee,
                        p.id AS proprieteid,
                        d.heure AS heure,
                        d.statut AS statut,
                        d.datecreation AS datecreation,
                        d.message AS message,
                        p.titre AS propriete_titre,
                        u.nom + ' ' + u.prenom AS user_nom
                    ORDER BY d.datecreation DESC
                    LIMIT 100
                """, agent_id=agent_id)
                
                demandes = []
                for record in result:
                    demandes.append(DemandeVisite(
                        id=record['id'],
                        date_souhaitee=record['datesouhaitee'],
                        propriete_id=record['proprieteid'],
                        heure=record['heure'],
                        statut=StatutVisite(record['statut']),
                        date_creation=str(record['datecreation']),
                        message=record['message'],
                        propriete_titre=record['propriete_titre']
                    ))
                
                return HistoriqueDemandesAgent(demandes=demandes)
                
        except Exception as e:
            print(f"Error: {e}")
            return None
    @strawberry.field
    def notifications_user(self, token: str) -> Optional[NotificationsUser]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload['sub']
            
            with driver.session() as session:
                # Récupérer user_id
                user_res = session.run("""
                    MATCH (u:User {email: $email})
                    RETURN u.id AS user_id
                """, email=user_email).single()
                
                if not user_res:
                    print(f"User not found: {user_email}")
                    return NotificationsUser(notifications=[], nb_non_lues=0)
                
                user_id = user_res['user_id']
                print(f"User ID: {user_id}")
                
                # Récupérer les notifications user
                result = session.run("""
                    MATCH (n:Notification)-[:POUR_USER]->(u:User {id: $user_id})
                    RETURN 
                        n.id AS id,
                        n.type AS type,
                        toString(n.date) AS date,
                        n.lu AS lu,
                        n.message AS message,
                        n.propriete_id AS propriete_id,
                        n.propriete_titre AS propriete_titre,
                        n.agent_nom AS agent_nom,
                        n.demandeid AS demandeid,
                        n.nouveau_statut AS nouveau_statut
                    ORDER BY n.date DESC
                    LIMIT 50
                """, user_id=user_id)
                
                notifications = []
                for record in result:
                    notifications.append(NotificationUser(
                        id=record['id'],
                        type=record['type'],
                        date=record['date'],
                        lu=record['lu'],
                        message=record['message'],
                        propriete_id=record['propriete_id'],
                        propriete_titre=record['propriete_titre'],
                        agent_nom=record['agent_nom'],
                        demandeid=record['demandeid'],
                        nouveau_statut=record['nouveau_statut']
                    ))
                
                nb_non_lues = len([n for n in notifications if not n.lu])
                
                print(f"Found {len(notifications)} notifications, {nb_non_lues} unread")
                
                return NotificationsUser(
                    notifications=notifications,
                    nb_non_lues=nb_non_lues
                )
                
        except JWTError as e:
            print(f"JWT Error: {e}")
            return None
        except Exception as e:
            print(f"Error in notifications_user: {e}")
            import traceback
            traceback.print_exc()
            return NotificationsUser(notifications=[], nb_non_lues=0)



        
@strawberry.type
class Mutation:
    @strawberry.mutation
    def register(self, input: UserCreateInput) -> str:
        with driver.session() as session:
            if session.run("MATCH (u:User {email: $email}) RETURN count(u)", email=input.email).single()["count(u)"] > 0:
                raise HTTPException(status_code=400, detail="Email déjà utilisé")
            
            user_id = f"USER{secrets.randbelow(999):03d}"
            session.run("""
                CREATE (u:User {
                    id: $id, nom: $nom, prenom: $prenom, email: $email,
                    password: $password, role: 'ACHETEUR', created_at: datetime(),
                    budget: $budget, surface_min: $surface_min,
                    preferences_location: $preferences_location,
                    ville_prefs: $ville_prefs
                })
            """, id=user_id, nom=input.nom, prenom=input.prenom, email=input.email,
                password=get_password_hash(input.password),
                budget=getattr(input, 'budget', None), surface_min=getattr(input, 'surface_min', None),
                preferences_location=getattr(input, 'preferences_location', None),
                ville_prefs=getattr(input, 'ville_prefs', []) or None)
            
            return create_access_token({"sub": input.email})
    @strawberry.mutation
    def update_profil(self, input: UserUpdateInput, token: str) -> User:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload["sub"]
        
        with driver.session() as session:
            result = session.run(
                "MATCH (u:User {email: $email}) RETURN u.id AS id",
                email=email
            )
            record = result.single()
            if not record:
                raise HTTPException(status_code=404, detail="User introuvable")

            user_id = record["id"]

            
            updates = {k: v for k, v in input.__dict__.items() if v is not None}
            result = session.run("""
                MATCH (u:User {id: $user_id})
                SET u += $updates, u.updated_at = datetime()
                RETURN 
                    u.id AS id, u.nom AS nom, u.prenom AS prenom, u.email AS email, 
                    u.role AS role, u.budget AS budget, u.surface_min AS surface_min,
                    u.preferences_location AS preferences_location, u.ville_prefs AS ville_prefs
            """, user_id=user_id, updates=updates)
            
            record = result.single()
            return User(**record.data())
    @strawberry.mutation
    def login(self, email: str, password: str) -> str:
        with driver.session() as session:
            result = session.run(
                "MATCH (u:User {email: $email}) RETURN u",
                email=email
            )
            record = result.single()
            if not record or not verify_password(password, record["u"]["password"]):
                raise HTTPException(status_code=401, detail="Identifiants invalides")
            return create_access_token({"sub": email, "user_id": record["u"]["id"]})
    @strawberry.mutation
    def ajouter_favori(self, propriete_id: str, token: str,note: Optional[str] = None) -> bool:
        """Relation AIME User → Propriete"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload["sub"]
            
            with driver.session() as session:
                user_result = session.run("MATCH (u:User {email: $email}) RETURN u.id AS id", email=user_email).single()
                if not user_result: raise HTTPException(404, "User introuvable")
                
                result = session.run("""
                    MATCH (u:User {id: $user_id}), (p:Propriete {id: $prop_id})
                    MERGE (u)-[r:AIME {date_ajout: datetime(), note: $note}]->(p)
                    RETURN count(r) > 0 AS created
                """, user_id=user_result["id"], prop_id=propriete_id, note=note)
                
                return result.single()["created"]
        except JWTError: raise HTTPException(401, "Token invalide")
    @strawberry.mutation
    def retirer_favori(self, propriete_id: str, token: str) -> bool:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload["sub"]
            
            with driver.session() as session:
                user_result = session.run("MATCH (u:User {email: $email}) RETURN u.id AS id", email=user_email).single()
                if not user_result: raise HTTPException(404, "User introuvable")
                
                result = session.run("""
                    MATCH (u:User {id: $user_id})-[r:AIME]->(p:Propriete {id: $prop_id})
                    DELETE r
                    RETURN count(r) > 0 AS deleted
                """, user_id=user_result["id"], prop_id=propriete_id)
                
                return result.single()["deleted"]
        except JWTError: raise HTTPException(401, "Token invalide")
    @strawberry.mutation
    def marquer_visite(self, propriete_id: str, token: str, impression: Optional[str] = None, prix_propose: Optional[float] = None) -> bool:
        """Crée (:Visite) + A_VISITE + CONCERNE"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload["sub"]
            
            with driver.session() as session:
                user_result = session.run("MATCH (u:User {email: $email}) RETURN u.id AS id", email=user_email).single()
                if not user_result: raise HTTPException(404, "User introuvable")
                user_id = user_result["id"]
                
                visite_id = f"VISITE_{secrets.token_hex(8).upper()}"
                
                result = session.run("""
                    MATCH (u:User {id: $user_id}), (p:Propriete {id: $prop_id})
                    MERGE (v:Visite {id: $visite_id})
                    ON CREATE SET 
                        v.dateVisite = date(),
                        v.impression = $impression,
                        v.prixPropose = $prix_propose
                    MERGE (u)-[:A_VISITE]->(v)
                    MERGE (v)-[:CONCERNE]->(p)
                    RETURN true AS created
                """, user_id=user_id, prop_id=propriete_id, visite_id=visite_id,
                    impression=impression, prix_propose=prix_propose)
                
                return result.single()["created"]
        except JWTError: raise HTTPException(401, "Token invalide")
    @strawberry.mutation
    def creer_demande_visite(self, input: DemandeVisiteInput, token: str) -> bool:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload['sub']
        
        with driver.session() as session:
            user_res = session.run(
                "MATCH (u:User {email: $email}) RETURN u.id AS userid", 
                email=user_email
            ).single()
            
            if not user_res: 
                raise HTTPException(404, "User introuvable")
            
            userid = user_res['userid']
            
            # Récupérer titre propriété
            prop_res = session.run("""
                MATCH (p:Propriete {id: $propid})
                RETURN p.titre AS titre, p.id AS propid
            """, propid=input.propriete_id).single()
            
            if not prop_res: 
                raise HTTPException(404, "Propriété introuvable")
            
            # Créer demande_id
            prop_titre = prop_res['titre'].replace(' ', '-').replace('/', '-').upper()[:20]
            date_suffix = input.date_souhaitee.replace('-', '')
            demande_id = f"DV-{prop_res['propid']}-{prop_titre}-{date_suffix}"
            
            # Vérifier unicité
            existing = session.run(
                "MATCH ()-[r:DEMANDE_VISITE {id: $demandeid}]->() RETURN count(r) AS cnt", 
                demandeid=demande_id
            ).single()
            
            if existing['cnt'] > 0: 
                raise HTTPException(409, "Demande existe déjà")
            
            # MERGE relation
            session.run("""
                MATCH (u:User {id: $userid}), (p:Propriete {id: $propid})
                MERGE (u)-[r:DEMANDE_VISITE {id: $demandeid}]->(p)
                ON CREATE SET 
                    r.datesouhaitee = $datesouhaitee, 
                    r.heure = $heure, 
                    r.statut = 'en_attente', 
                    r.datecreation = datetime(), 
                    r.message = $message
                RETURN r
            """, userid=userid, propid=input.propriete_id, demandeid=demande_id,
                datesouhaitee=input.date_souhaitee, heure=input.heure, 
                message=input.message)
            
            # Notification avec ID lisible
            user_nom_res = session.run(
                "MATCH (u:User {id: $userid}) RETURN u.nom + ' ' + u.prenom AS user_nom", 
                userid=userid
            ).single()
            user_nom = user_nom_res['user_nom'] or 'Anonyme'
            
            # Générer timestamp pour ID unique
            from datetime import datetime
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            notif_id = f"NOTIF-NDV-{demande_id}-{timestamp}"

            session.run("""
                MATCH (p:Propriete {id: $propid})<-[:GERE]-(a:Agence),
                    (u:User {id: $userid})
                CREATE (n:Notification {
                    id: $notif_id,
                    type: 'nouvelle_demande_visite',
                    date: datetime(),
                    lu: false,
                    message: $message,
                    propriete_id: $propid,
                    propriete_titre: $proptitre,
                    user_id: $userid,
                    user_nom: $usernom,
                    demandeid: $demandeid,
                    date_souhaitee: $datesouhaitee,
                    heure: $heure
                })-[:POUR_AGENT]->(a)
            """, notif_id=notif_id, propid=input.propriete_id, 
                proptitre=prop_res['titre'], userid=userid, usernom=user_nom, 
                demandeid=demande_id, datesouhaitee=input.date_souhaitee, 
                heure=input.heure,
                message=f"Demande {demande_id} pour {prop_res['titre']}")

        return True         
    # @strawberry.mutation
    # def update_statut_demande(self, demandeid: str, statut: StatutVisite, token: str) -> bool:
    #     try:
    #         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    #         agent_email = payload['sub']
            
    #         with driver.session() as session:
    #             # 1. Récupérer l'ID de l'agent (= ID de son agence)
    #             agent_res = session.run("""
    #                 MATCH (u:User {email: $email, role: 'AGENT'})
    #                 RETURN u.id AS agent_id
    #             """, email=agent_email).single()
                
    #             if not agent_res:
    #                 raise HTTPException(403, "Agent non autorisé")
                
    #             agent_id = agent_res['agent_id']
    #             print(f"Agent {agent_id} updating demande {demandeid}")
                
    #             # 2. Vérifier autorisation + update statut
    #             res = session.run("""
    #                 MATCH (a:Agence {id: $agent_id})-[:GERE]->(p:Propriete)
    #                     <-[r:DEMANDE_VISITE {id: $demandeid}]-(u:User)
    #                 SET r.statut = $statut
    #                 RETURN count(r) AS updated, u.id AS user_id, 
    #                     p.id AS prop_id, p.titre AS prop_titre
    #             """, agent_id=agent_id, demandeid=demandeid, 
    #                 statut=statut.value).single()
                
    #             if res['updated'] == 0:
    #                 raise HTTPException(404, "Demande introuvable ou non autorisée pour votre agence")
                
    #             # 3. Créer notification pour l'utilisateur avec ID lisible
    #             from datetime import datetime
    #             timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    #             notif_id = f"NOTIF-UPD-{demandeid}-{timestamp}"
                
    #             user_id = res['user_id']
    #             session.run("""
    #                 MATCH (agent:User {id: $agent_id}),
    #                     (u:User {id: $user_id})
    #                 CREATE (n:Notification {
    #                     id: $notif_id,
    #                     type: 'update_demande_visite',
    #                     date: datetime(),
    #                     lu: false,
    #                     message: $message,
    #                     propriete_id: $prop_id,
    #                     propriete_titre: $prop_titre,
    #                     demandeid: $demandeid,
    #                     agent_nom: agent.nom + ' ' + COALESCE(agent.prenom, ''),
    #                     nouveau_statut: $statut
    #                 })-[:POUR_USER]->(u)
    #             """, notif_id=notif_id, agent_id=agent_id, user_id=user_id,
    #                 prop_id=res['prop_id'], prop_titre=res['prop_titre'],
    #                 demandeid=demandeid,
    #                 message=f"Votre demande {demandeid} est maintenant '{statut.value}'",
    #                 statut=statut.value)
                
    #             print(f"Demande {demandeid} updated to {statut.value}, notification {notif_id} created")
            
    #         return True
            
    #     except JWTError:
    #         raise HTTPException(401, "Token invalide")
    #     except HTTPException:
    #         raise
    #     except Exception as e:
    #         print(f"Error in update_statut_demande: {e}")
    #         import traceback
    #         traceback.print_exc()
    #         raise HTTPException(500, "Erreur serveur")
    @strawberry.mutation
    def update_statut_demande(self, demandeid: str, statut: StatutVisite, token: str) -> bool:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            agent_email = payload['sub']
            
            with driver.session() as session:
                # 1. Récupérer l'ID de l'agent (= ID de son agence)
                agent_res = session.run("""
                    MATCH (u:User {email: $email, role: 'AGENT'})
                    RETURN u.id AS agent_id
                """, email=agent_email).single()
                
                if not agent_res:
                    raise HTTPException(403, "Agent non autorisé")
                
                agent_id = agent_res['agent_id']
                print(f"Agent {agent_id} updating demande {demandeid}")
                
                # 2. Vérifier autorisation + update statut
                res = session.run("""
                    MATCH (a:Agence {id: $agent_id})-[:GERE]->(p:Propriete)
                        <-[r:DEMANDE_VISITE {id: $demandeid}]-(u:User)
                    SET r.statut = $statut
                    RETURN count(r) AS updated, u.id AS user_id, 
                        p.id AS prop_id, p.titre AS prop_titre
                """, agent_id=agent_id, demandeid=demandeid, 
                    statut=statut.value).single()
                
                if res['updated'] == 0:
                    raise HTTPException(404, "Demande introuvable ou non autorisée pour votre agence")
                
                # 3. MARQUER LA NOTIFICATION AGENT COMME LUE (version simplifiée)
                notif_update = session.run("""
                    MATCH (n:Notification {demandeid: $demandeid, type: 'nouvelle_demande_visite'})
                    SET n.lu = true
                    RETURN count(n) AS updated
                """, demandeid=demandeid).single()
                
                print(f"Notifications marked as read: {notif_update['updated']}")
                
                # 4. Créer notification pour l'utilisateur avec ID lisible
                from datetime import datetime
                timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
                notif_id = f"NOTIF-UPD-{demandeid}-{timestamp}"
                
                user_id = res['user_id']
                session.run("""
                    MATCH (agent:User {id: $agent_id}),
                        (u:User {id: $user_id})
                    CREATE (n:Notification {
                        id: $notif_id,
                        type: 'update_demande_visite',
                        date: datetime(),
                        lu: false,
                        message: $message,
                        propriete_id: $prop_id,
                        propriete_titre: $prop_titre,
                        demandeid: $demandeid,
                        agent_nom: agent.nom + ' ' + COALESCE(agent.prenom, ''),
                        nouveau_statut: $statut
                    })-[:POUR_USER]->(u)
                """, notif_id=notif_id, agent_id=agent_id, user_id=user_id,
                    prop_id=res['prop_id'], prop_titre=res['prop_titre'],
                    demandeid=demandeid,
                    message=f"Votre demande {demandeid} est maintenant '{statut.value}'",
                    statut=statut.value)
                
                print(f"Demande {demandeid} updated to {statut.value}, {notif_update['updated']} notification(s) marked as read")
            
            return True
            
        except JWTError:
            raise HTTPException(401, "Token invalide")
        except HTTPException:
            raise
        except Exception as e:
            print(f"Error in update_statut_demande: {e}")
            import traceback
            traceback.print_exc()
            raise HTTPException(500, "Erreur serveur")
    # Mutation pour marquer comme lu
    @strawberry.mutation
    def marquer_notification_lue(self, notification_id: str, token: str) -> bool:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload['sub']
            
            with driver.session() as session:
                # Récupérer user_id
                user_res = session.run("""
                    MATCH (u:User {email: $email})
                    RETURN u.id AS user_id
                """, email=user_email).single()
                
                if not user_res:
                    return False
                
                user_id = user_res['user_id']
                
                # Marquer comme lu
                result = session.run("""
                    MATCH (n:Notification {id: $notif_id})-[:POUR_USER]->(u:User {id: $user_id})
                    SET n.lu = true
                    RETURN count(n) AS updated
                """, notif_id=notification_id, user_id=user_id).single()
                
                print(f"Notification {notification_id} marked as read: {result['updated'] > 0}")
                return result['updated'] > 0
                
        except Exception as e:
            print(f"Error marking notification as read: {e}")
            return False

    # Mutation pour marquer TOUTES comme lues
    @strawberry.mutation
    def marquer_toutes_notifications_lues(self, token: str) -> bool:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload['sub']
            
            with driver.session() as session:
                user_res = session.run("""
                    MATCH (u:User {email: $email})
                    RETURN u.id AS user_id
                """, email=user_email).single()
                
                if not user_res:
                    return False
                
                user_id = user_res['user_id']
                
                result = session.run("""
                    MATCH (n:Notification)-[:POUR_USER]->(u:User {id: $user_id})
                    WHERE n.lu = false
                    SET n.lu = true
                    RETURN count(n) AS updated
                """, user_id=user_id).single()
                
                print(f"Marked {result['updated']} notifications as read")
                return True
                
        except Exception as e:
            print(f"Error: {e}")
            return False






# Schema FINAL
schema = strawberry.Schema(query=Query, mutation=Mutation)

graphql_app = GraphQLRouter(schema)

app = FastAPI()
# CORS pour autoriser le frontend Vite
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(graphql_app, prefix="/graphql")
