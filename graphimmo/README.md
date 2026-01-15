# GraphImmo - Real Estate Mapping Platform

A full-stack web application for exploring, comparing, and managing real estate properties using a Neo4j graph database. Built with a Python FastAPI backend and a React TypeScript frontend with interactive mapping features.

## Project Overview

GraphImmo is a comprehensive real estate platform that enables users to:
- Browse properties on an interactive map
- Search and filter properties by various criteria
- Compare multiple properties side-by-side
- View detailed property information with photos and amenities
- Manage property visit requests (for buyers and agents)
- Access personalized recommendations
- Manage agent/buyer profiles and analytics

## Tech Stack

### Backend
- **Framework**: FastAPI 0.128.0
- **Database**: Neo4j 6.0.3 (Graph Database)
- **GraphQL**: Strawberry GraphQL 0.288.1
- **Authentication**: JWT tokens with Argon2 password hashing
- **API Security**: HTTP Bearer tokens, CORS middleware
- **Runtime**: Uvicorn

### Frontend
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS
- **UI Library**: Material-UI (MUI)
- **Mapping**: Leaflet, react-leaflet, MapLibre GL
- **API Client**: Apollo Client 4.0.11
- **Routing**: React Router DOM 7.11.0

## Project Structure

```
graphimmo/
├── backend/
│   ├── main.py              # FastAPI server with GraphQL router
│   ├── requirements.txt      # Python dependencies
│   ├── test.py             # Test file
│   └── __pycache__/        # Python cache
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── AnalyticsAgent.tsx       # Agent analytics dashboard
│   │   │   ├── Comparaison.tsx          # Property comparison
│   │   │   ├── Dashboard.tsx            # Main dashboard
│   │   │   ├── DemandesVisite.tsx       # Visit requests
│   │   │   ├── Filtres.tsx              # Search filters
│   │   │   ├── HistoriqueDemandesAgent.tsx # Agent request history
│   │   │   ├── Login.tsx                # Login page
│   │   │   ├── Map.tsx                  # Interactive property map
│   │   │   ├── Navbar.tsx               # Navigation bar
│   │   │   ├── NotificationsUser.tsx    # User notifications
│   │   │   ├── Profil.tsx               # User profile
│   │   │   ├── ProprieteCard.tsx        # Property card
│   │   │   ├── ProprieteDetail.tsx      # Property detail view
│   │   │   ├── Recommendations.tsx      # Property recommendations
│   │   │   ├── Register.tsx             # Registration page
│   │   │   └── Search.tsx               # Search interface
│   │   ├── contexts/        # React contexts
│   │   │   └── SearchContext.tsx        # Global search state
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useUserRole.ts           # User role management
│   │   ├── utils/           # Utility functions
│   │   │   └── formatters.tsx           # Data formatting utilities
│   │   ├── App.tsx          # Main app component
│   │   ├── main.tsx         # React entry point
│   │   ├── App.css          # App styles
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS config
│   ├── postcss.config.js    # PostCSS config
│   ├── eslint.config.js     # ESLint configuration
│   ├── tsconfig.json        # TypeScript config
│   ├── tsconfig.app.json    # TypeScript app config
│   ├── tsconfig.node.json   # TypeScript node config
│   └── README.md            # Frontend README
├── .env                     # Environment variables
└── README.md               # This file
```

## Features

### For All Users
- 🗺️ Interactive property map with clustering
- 🔍 Advanced search and filtering
- 📊 Property comparison tool
- 📋 Detailed property information with photos
- 📍 Location-based recommendations

### For Buyers
- ❤️ Wishlist and favorites
- 📅 Visit request management
- 📬 Notifications for new properties
- 💬 Agent contact

### For Agents
- 📈 Analytics dashboard
- 🏠 Property management
- 📞 Visit request history
- 👥 Client management

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+ and npm
- Neo4j database instance
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create a Python virtual environment**:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file** in the project root:
   ```env
   NEO4J_URI=bolt://localhost:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=your_password
   SECRET_KEY=your_secret_key_here
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   ```

5. **Run the backend server**:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`
   GraphQL endpoint: `http://localhost:8000/graphql`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Lint code**:
   ```bash
   npm run lint
   ```

## API Documentation

### GraphQL Endpoints

The backend uses Strawberry GraphQL for API queries. Key types include:

- **Propriete**: Property listing with basic information
- **ProprieteDetail**: Extended property information with related data
- **Amenagement**: Property amenities (pool, garage, etc.)
- **Localisation**: Location information and area statistics
- **Agence**: Real estate agency information
- **Photo**: Property photos with angles (facade, interior, kitchen)

### Authentication

- Register: `POST /register`
- Login: `POST /login` (returns JWT token)
- Token stored in localStorage for client-side persistence

## Environment Configuration

Create a `.env` file in the project root with:

```env
# Neo4j Database
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# JWT Configuration
SECRET_KEY=your_secret_key_generate_with_secrets_token_hex
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days

# Frontend (if needed)
VITE_API_URL=http://localhost:8000
```

## Database Schema (Neo4j)

The graph database contains the following node types:
- **Propriete**: Real estate properties
- **Amenagement**: Property amenities
- **Localisation**: Geographic areas/regions
- **Agence**: Real estate agencies
- **Utilisateur**: User accounts

Relationships include:
- `GERE`: Agency manages property
- `LOCALISE`: Property located in area
- `POSSEDE`: Property has amenities
- `FAVORISE`: User favorites/wishlists

## Authentication & Authorization

- JWT-based authentication
- Argon2 password hashing
- Role-based access control (Admin, Agent, Buyer)
- Token expiration and refresh mechanisms

## Available Scripts

### Backend
```bash
python main.py  # Run development server
python test.py  # Run tests
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint code checking
npm run preview  # Preview production build
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run lint and tests
4. Commit with clear messages
5. Push and create a pull request

## License

This project is part of an educational course on NoSQL & Big Data with Neo4j.

## Support & Contact

For issues or questions, please open an issue in the repository or contact the development team.

---

**Last Updated**: January 2026
