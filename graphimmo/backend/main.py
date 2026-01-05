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

# Connexion Neo4j (adapte avec tes creds Graphimmo)
driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "megustacolombiana"))

SECRET_KEY = secrets.token_hex(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# def get_password_hash(password: str) -> str:
#     return pwd_context.hash(password)
# def get_password_hash(password: str) -> str:
#     # Fix bcrypt 4.1+ : tronque à 72 bytes
#     pwd_bytes = password.encode('utf-8')[:72]
#     return pwd_context.hash(pwd_bytes.decode('utf-8', errors='ignore'))

# def verify_password(plain: str, hashed: str) -> bool:
#     plain_trunc = plain.encode('utf-8')[:72].decode('utf-8')
#     return pwd_context.verify(plain_trunc, hashed)

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
    url: str

@strawberry.type
class Amenagement:
    id: str
    type: str  # piscine/garage
    qualite: str

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


@strawberry.enum
class TriPropriete(Enum):
    PRIX = "PRIX"
    DATE_DEPOT = "DATE_DEPOT"  # ← CORRIGÉ !
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
    @strawberry.field  # ← RÉTABLIE ICI
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
    def propriete_detail(self, id: str) -> ProprieteDetail | None:
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
    def update_profil(self, input: UserUpdateInput, token: Optional[str] = None) -> User:
        # TODO: JWT validation + user_id extraction (simplifié)
        user_id = "USER001"  # À remplacer par JWT decode
        with driver.session() as session:
            updates = {k: v for k, v in input.__dict__.items() if v is not None}
            result = session.run("""
                MATCH (u:User {id: $user_id})
                SET u += $updates, u.updated_at = datetime()
                RETURN u.id AS id, u.nom AS nom, u.prenom AS prenom, u.email AS email, 
                u.role AS role, u.budget AS budget, u.surface_min AS surface_min,
                u.preferences_location AS preferences_location, u.ville_prefs AS ville_prefs
            """, user_id=user_id, updates=updates)
            return User(**dict(result.single()["u"]))

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
