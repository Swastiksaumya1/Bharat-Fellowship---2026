# 📂 Project Structure

Complete file structure of the MGNREGA Performance Tracker project.

```
mgnrega-performance-tracker/
│
├── 📄 README.md                      # Main documentation
├── 📄 QUICK_START.md                 # 5-minute setup guide
├── 📄 SUBMISSION_GUIDE.md            # Fellowship submission instructions
├── 📄 API_DOCUMENTATION.md           # Complete API reference
├── 📄 PROJECT_SUMMARY.md             # Project overview
├── 📄 CHECKLIST.md                   # Submission checklist
├── 📄 STRUCTURE.md                   # This file
│
├── 🐳 docker-compose.yml             # Multi-container orchestration
├── 📄 .env.example                   # Environment variables template
├── 📄 .gitignore                     # Git ignore rules
│
├── 🧪 test-api.sh                    # API test script (Linux/Mac)
├── 🧪 test-api.bat                   # API test script (Windows)
│
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD
│
├── 📱 client/                        # REACT FRONTEND
│   │
│   ├── 📄 package.json               # Frontend dependencies
│   ├── 📄 vite.config.js             # Vite configuration
│   ├── 📄 tailwind.config.js         # Tailwind CSS config
│   ├── 📄 postcss.config.js          # PostCSS config
│   ├── 🐳 Dockerfile                 # Frontend container
│   ├── 📄 .dockerignore              # Docker ignore rules
│   ├── 📄 index.html                 # HTML entry point
│   │
│   └── src/
│       ├── 📄 main.jsx               # React entry point
│       ├── 📄 App.jsx                # Main app component
│       ├── 📄 index.css              # Global styles (Tailwind)
│       │
│       └── components/
│           ├── 📄 DistrictSelector.jsx    # State/District picker
│           ├── 📄 LocationDetector.jsx    # Auto-location feature
│           └── 📄 Stats.jsx               # Data visualization
│
└── 🖥️  server/                       # EXPRESS BACKEND
    │
    ├── 📄 package.json               # Backend dependencies
    ├── 🐳 Dockerfile                 # Backend container
    ├── 📄 .dockerignore              # Docker ignore rules
    │
    └── src/
        ├── 📄 server.js              # Express app entry point
        │
        ├── controllers/
        │   └── 📄 performanceController.js   # Business logic
        │
        ├── models/
        │   └── 📄 Performance.js             # MongoDB schema
        │
        └── routes/
            └── 📄 performance.js             # API routes
```

## 📊 File Count Summary

| Category          | Count | Description                           |
|-------------------|-------|---------------------------------------|
| Documentation     | 7     | README, guides, API docs              |
| Configuration     | 8     | Docker, Vite, Tailwind, package.json  |
| Frontend Code     | 5     | React components and entry points     |
| Backend Code      | 4     | Express server, controllers, models   |
| Test Scripts      | 2     | API testing scripts                   |
| CI/CD             | 1     | GitHub Actions workflow               |
| **Total**         | **27**| **Complete project files**            |

## 🎯 Key Files Explained

### Root Level

#### Documentation Files
- **README.md**: Main project documentation with setup and deployment instructions
- **QUICK_START.md**: Get started in 5 minutes
- **SUBMISSION_GUIDE.md**: Step-by-step fellowship submission guide
- **API_DOCUMENTATION.md**: Complete API reference with examples
- **PROJECT_SUMMARY.md**: High-level project overview
- **CHECKLIST.md**: Complete submission checklist
- **STRUCTURE.md**: This file - project structure reference

#### Configuration Files
- **docker-compose.yml**: Orchestrates MongoDB, backend, and frontend containers
- **.env.example**: Template for environment variables
- **.gitignore**: Prevents committing sensitive files

#### Test Scripts
- **test-api.sh**: Bash script to test API endpoints (Linux/Mac)
- **test-api.bat**: Batch script to test API endpoints (Windows)

### Frontend (`client/`)

#### Configuration
- **package.json**: Dependencies (React, Recharts, Tailwind)
- **vite.config.js**: Vite dev server and build configuration
- **tailwind.config.js**: Tailwind CSS customization
- **postcss.config.js**: PostCSS plugins configuration
- **Dockerfile**: Container definition for frontend
- **.dockerignore**: Files to exclude from Docker build

#### Source Code
- **index.html**: HTML entry point with root div
- **src/main.jsx**: React app initialization
- **src/App.jsx**: Main application component with routing and state
- **src/index.css**: Global styles and Tailwind imports

#### Components
- **DistrictSelector.jsx**: 
  - State and district dropdown selectors
  - 28+ states with 200+ districts
  - "Show Data" button with loading state
  
- **LocationDetector.jsx**:
  - Auto-detect user location button
  - Browser geolocation API integration
  - OpenStreetMap reverse geocoding
  - Error handling for denied permissions
  
- **Stats.jsx**:
  - Data visualization with Recharts
  - Summary metric cards
  - Bar charts for worker distribution
  - Line charts for wage trends
  - Detailed data table
  - Raw JSON viewer

### Backend (`server/`)

#### Configuration
- **package.json**: Dependencies (Express, Mongoose, Axios)
- **Dockerfile**: Container definition for backend
- **.dockerignore**: Files to exclude from Docker build

#### Source Code
- **src/server.js**: 
  - Express app initialization
  - MongoDB connection
  - Middleware setup (CORS, JSON)
  - Route registration
  - Error handling
  - Health check endpoint

#### Controllers
- **performanceController.js**:
  - `getPerformance()`: Main API endpoint logic
  - `getCachedDistricts()`: List cached districts
  - Cache checking (24-hour duration)
  - data.gov.in API integration
  - Fallback to stale cache on error
  - Comprehensive error handling

#### Models
- **Performance.js**:
  - MongoDB schema definition
  - Fields: district, state, data, lastUpdated
  - Indexes for fast queries
  - Timestamps for tracking

#### Routes
- **performance.js**:
  - `GET /api/performance`: Get district data
  - `GET /api/performance/cached`: List cached districts
  - Route-controller mapping

### CI/CD (`.github/workflows/`)

- **ci.yml**:
  - Automated testing on push/PR
  - Backend syntax validation
  - Frontend build verification
  - Docker image build tests
  - Runs on GitHub Actions

## 📦 Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "recharts": "^2.10.0"
}
```

### Frontend Dev Dependencies
```json
{
  "@vitejs/plugin-react": "^4.2.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32",
  "tailwindcss": "^3.3.6",
  "vite": "^5.0.0"
}
```

### Backend Dependencies
```json
{
  "axios": "^1.6.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "mongoose": "^8.0.0"
}
```

### Backend Dev Dependencies
```json
{
  "nodemon": "^3.0.1"
}
```

## 🔧 Configuration Files Explained

### docker-compose.yml
- Defines 3 services: mongo, server, client
- Sets up networking between containers
- Mounts volumes for MongoDB persistence
- Exposes ports: 27017 (MongoDB), 5000 (backend), 5173 (frontend)

### .env.example
- Template for environment variables
- Required: MONGO_URI, DATA_GOV_API_KEY, DATA_GOV_RESOURCE_ID
- Optional: NODE_ENV, PORT

### vite.config.js
- Configures Vite dev server
- Enables React plugin
- Sets host to 0.0.0.0 for Docker
- Enables polling for file watching

### tailwind.config.js
- Configures Tailwind CSS
- Sets content paths for purging
- Extends default theme

## 📝 Lines of Code

| File                          | Lines | Purpose                        |
|-------------------------------|-------|--------------------------------|
| performanceController.js      | ~150  | Backend business logic         |
| Stats.jsx                     | ~250  | Data visualization             |
| DistrictSelector.jsx          | ~120  | State/district selection       |
| App.jsx                       | ~150  | Main app component             |
| server.js                     | ~40   | Express server setup           |
| LocationDetector.jsx          | ~70   | Auto-location feature          |
| Performance.js                | ~25   | MongoDB schema                 |
| **Total Code**                | ~805  | **Actual application code**    |

## 🎨 Component Hierarchy

```
App.jsx
├── Header
│   ├── Title
│   └── LocationDetector
│       └── Auto-detect button
│
├── Main
│   ├── DistrictSelector
│   │   ├── State dropdown
│   │   ├── District dropdown
│   │   └── Show Data button
│   │
│   ├── Metadata display
│   │   ├── Source indicator
│   │   ├── Cache age
│   │   └── Warning messages
│   │
│   ├── Error display
│   ├── Loading spinner
│   │
│   └── Stats
│       ├── Metric Cards (4)
│       │   ├── Workers
│       │   ├── Wages
│       │   ├── Projects
│       │   └── Work Days
│       │
│       ├── Bar Chart (Workers)
│       ├── Line Chart (Wages)
│       ├── Data Table
│       └── Raw JSON viewer
│
└── Footer
    └── Credits
```

## 🔄 Data Flow

```
User Action (Select District)
    ↓
DistrictSelector Component
    ↓
App.jsx (fetchData function)
    ↓
HTTP GET Request
    ↓
Express Server (server.js)
    ↓
Performance Route (routes/performance.js)
    ↓
Performance Controller (controllers/performanceController.js)
    ↓
Check MongoDB Cache (models/Performance.js)
    ↓
    ├─→ Cache Hit (< 24h) → Return Cached Data
    │
    └─→ Cache Miss/Expired
        ↓
        Fetch from data.gov.in API
        ↓
        Update MongoDB Cache
        ↓
        Return Fresh Data
    ↓
JSON Response
    ↓
App.jsx (setData)
    ↓
Stats Component
    ↓
Recharts Visualization
    ↓
User Sees Charts
```

## 🚀 Build Process

### Development
```bash
docker-compose up --build
```
1. Builds MongoDB image
2. Builds server image (Node.js + Express)
3. Builds client image (Node.js + Vite)
4. Starts all containers
5. Hot-reload enabled for both frontend and backend

### Production Build

**Frontend:**
```bash
cd client
npm run build
# Creates optimized bundle in dist/
```

**Backend:**
```bash
cd server
npm install --production
# Ready to run with npm start
```

## 📊 File Sizes (Approximate)

| Category              | Size    |
|-----------------------|---------|
| Frontend bundle       | ~500 KB |
| Backend code          | ~50 KB  |
| node_modules (total)  | ~300 MB |
| Docker images (total) | ~1.5 GB |
| Documentation         | ~100 KB |

---

**This structure provides a complete, production-ready full-stack application! 🚀**

