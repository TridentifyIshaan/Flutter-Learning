# MedMap — Clinical Routing Intelligence

**Full-stack healthcare facility routing application with real-time geolocation, smart facility discovery, and integrated mobile experience.**

## 🎯 Status: ✅ COMPLETE — All 5 Parts Implemented & Production-Ready

```
Part 1 ✅  Web Frontend (Leaflet map interface)
Part 2 ✅  REST API (Node.js + PostgreSQL + PostGIS)
Part 3 ✅  Real-time Server (WebSocket + OpenRouteService)
Part 4 ✅  Flutter Mobile App (Provider state management)
Part 5 ✅  IPFS Integration (Immutable records archiving)
```

## 📂 Project Structure

```
./
├── index.html                          # Part 1: Web frontend (Leaflet)
├── medmap-backend/                     # Parts 2-3-5: Node.js REST + WebSocket + IPFS
│   ├── src/
│   │   ├── config/                 # Database, JWT, environment
│   │   ├── db/migrations/          # Knex migrations (PostGIS schema)
│   │   ├── db/seeds/               # 18 facilities + test data
│   │   ├── routes/                 # REST endpoints
│   │   ├── services/               # Business logic (Auth, ORS, IPFS)
│   │   ├── middleware/             # Authentication, error handling
│   │   ├── server.js               # Express on :3000
│   │   └── realtime.js             # WebSocket on :3002
│   ├── docker-compose.yml          # PostgreSQL + Redis + backend
│   ├── package.json
│   ├── knexfile.js
│   └── README.md
│
└── medmap_mobile/                      # Part 4: Flutter cross-platform app
    ├── lib/
    │   ├── config/                 # API config, theme
    │   ├── models/                 # Data models (Freezed codegen)
    │   ├── services/               # API, Location, WebSocket
    │   ├── providers/              # State management (Provider)
    │   ├── screens/                # UI screens
    │   ├── widgets/                # Reusable components
    │   └── main.dart               # App entry
    ├── pubspec.yaml                # Flutter dependencies
    └── README.md
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Backend only
cd medmap-backend
cp .env.example .env
docker-compose up

# Runs: PostgreSQL, Redis, Node.js backend
# REST API:     http://localhost:3000
# WebSocket:    ws://localhost:3002
```

### Option 2: Local Setup

```bash
# Backend
cd medmap-backend
npm install
npm run db:migrate
npm run db:seed
npm run dev              # Terminal 1
npm run ws:dev           # Terminal 2

# Mobile
cd medmap_mobile
flutter pub get
flutter run

# Frontend (Browser)
open index.html
```

## 📋 What's Implemented

### Backend (medmap-backend/)

| Feature | Status |
|---|---|
| Express REST API with middleware | ✅ |
| PostgreSQL + PostGIS geospatial | ✅ |
| Knex.js database migrations | ✅ |
| JWT authentication | ✅ |
| Facilities API (search, filter, nearby) | ✅ |
| Wait times real-time API | ✅ |
| Mobile units GPS tracking | ✅ |
| OpenRouteService integration | ✅ |
| WebSocket server (30s/5s updates) | ✅ |
| IPFS Infura client | ✅ |
| Docker containerization | ✅ |

**See [medmap-backend/README.md](medmap-backend/README.md) for complete API docs and setup instructions.**

### Mobile App (medmap_mobile/)

| Feature | Status |
|---|---|
| Flutter project scaffold | ✅ |
| Freezed data models with codegen | ✅ |
| Provider state management | ✅ |
| APIService HTTP client | ✅ |
| LocationService (geolocator) | ✅ |
| WebSocketService real-time | ✅ |
| Authentication providers | ✅ |
| Login screen | ✅ |
| Facilities list screen | ✅ |
| Facility card widget | ✅ |
| Theme configuration | ✅ |

**See [medmap_mobile/README.md](medmap_mobile/README.md) for Flutter setup and features.**

### Frontend (index.html)

| Feature | Status |
|---|---|
| Leaflet.js interactive map | ✅ |
| CartoDB Dark Theme | ✅ |
| 18 facilities with emoji markers | ✅ |
| User geolocation | ✅ |
| Real-time facility filtering | ✅ |
| Search across name/address | ✅ |
| Wait-time color coding | ✅ |
| Facility details panel | ✅ |
| Mobile unit animation | ✅ |

## 🏗️ Architecture

### Tech Stack

**Backend**
- Runtime: Node.js 18+ (LTS)
- Framework: Express.js 4.18+
- Database: PostgreSQL 12+ with PostGIS
- Cache: Redis 7
- Real-time: WebSocket (ws library)
- Containerization: Docker & Docker Compose
- Code Gen: Knex.js migrations

**Mobile**
- Framework: Flutter 3.10+
- Language: Dart 3.0+
- State: Provider 6.0+
- Maps: flutter_map (Leaflet fork)
- Location: geolocator
- HTTP: http + dio

**Frontend**
- Library: Leaflet.js 1.9+
- Tiles: CartoDB Dark
- Icons: Emoji
- Styling: CSS-in-JS

### Geospatial Database

**PostGIS Queries**

```sql
-- Find facilities within 10km radius
SELECT * FROM facilities 
WHERE ST_DWithin(geometry, point, distance_in_meters) = true;

-- Calculate distance
SELECT ST_Distance(geometry, point) / 1000 AS km FROM facilities;

-- Find nearest
SELECT * FROM facilities 
ORDER BY ST_Distance(geometry, point) 
LIMIT 1;

-- Spatial index
CREATE INDEX idx_facilities_geo ON facilities USING GIST(geometry);
```

**Tables**
- `facilities` — 18 healthcare centers with GEOGRAPHY(POINT)
- `wait_times` — Historical and current wait times
- `mobile_units` — Real-time GPS locations
- `routes` — Saved user routes
- `facility_archives` — IPFS hashes for immutable records
- `users` — Authentication & profiles

### Real-time Architecture

**WebSocket Broadcasts** (from `src/realtime.js`)
- **Wait Times**: Every 30 seconds to all subscribers
- **Mobile GPS**: Every 5 seconds to location subscribers
- **Heartbeat**: Ping/pong every 30 seconds

**Subscription Model**
```json
// Subscribe
{ "type": "wait-times", "action": "subscribe" }
{ "type": "mobile-units", "action": "subscribe" }
{ "type": "facility", "action": "subscribe", "facilityId": 1 }

// Receive updates
{ "type": "wait-times-update", "timestamp": "...", "data": [...] }
```

## 🔑 API Endpoints

### Authentication
```
POST   /api/v1/auth/register      Create account
POST   /api/v1/auth/login         Login
GET    /api/v1/auth/profile       Get profile (🔒 token)
PUT    /api/v1/auth/profile       Update profile (🔒 token)
```

### Facilities (Geospatial)
```
GET    /api/v1/facilities                      All facilities
GET    /api/v1/facilities/:id                  Single facility
GET    /api/v1/facilities/search/query?q=...   Search
POST   /api/v1/facilities/nearby               Radius search
POST   /api/v1/facilities/nearest              Find closest
GET    /api/v1/facilities/type/:type           Filter by type
GET    /api/v1/facilities/stats/all            Statistics
```

### Wait Times
```
GET    /api/v1/wait-times                      All current
GET    /api/v1/wait-times/facility/:id         Single facility
GET    /api/v1/wait-times/facility/:id/history Wait history
POST   /api/v1/wait-times                      Create/update (🔒 token)
GET    /api/v1/wait-times/high-wait/list       Alert facilities
```

### Mobile Units
```
GET    /api/v1/mobile-units                    All active
GET    /api/v1/mobile-units/:id                Single unit
PUT    /api/v1/mobile-units/:id/location       Update GPS (🔒 token)
PUT    /api/v1/mobile-units/:id/status         Update status (🔒 token)
```

### Routing
```
POST   /api/v1/routing/directions              Get route (OpenRouteService)
POST   /api/v1/routing/isochrone               Reachable area
POST   /api/v1/routing/save                    Save route (🔒 token)
GET    /api/v1/routing/user/history            User routes (🔒 token)
```

See [medmap-backend/README.md](medmap-backend/README.md) for detailed endpoint docs and examples.

---

## 🧪 Testing

### Backend

```bash
cd medmap-backend

# Run tests
npm test

# Test with coverage
npm test -- --coverage

# Lint
npm run lint
```

### Mobile

```bash
cd medmap_mobile

# Unit tests
flutter test

# Integration tests  
flutter test integration_test/
```

### Manual API Testing

```bash
# Get all facilities
curl http://localhost:3000/api/v1/facilities

# Search nearby
curl -X POST http://localhost:3000/api/v1/facilities/nearby \
  -H "Content-Type: application/json" \
  -d '{"latitude": 28.5672, "longitude": 77.2100, "radiusKm": 10}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "patient@example.com", "password": "password123"}'
```

---

## 🔐 Environment Variables

Create `.env` in `medmap-backend/`:

```bash
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=medmap_db
DB_USER=medmap_user
DB_PASSWORD=your_secure_password

# Server
NODE_ENV=development
REST_PORT=3000
WS_PORT=3002

# JWT
JWT_SECRET=your-very-secret-key-min-32-chars
JWT_EXPIRY=24h

# OpenRouteService (free tier)
ORS_API_KEY=your_ors_api_key

# IPFS (Infura)
IPFS_PROJECT_ID=your_infura_project_id
IPFS_PROJECT_SECRET=your_infura_project_secret

# Redis
REDIS_URL=redis://redis:6379

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:8080
```

---

## 📊 Sample Data

### 18 Facilities Seeded

| Name | Type | Lat | Lng | Beds | Rating | Specialty |
|---|---|---|---|---|---|---|
| AIIMS New Delhi | Hospital | 28.5672 | 77.2100 | 2478 | 4.8 | Emergency, Cardiology, Neurology |
| Apollo Clinic Saket | Clinic | 28.5213 | 77.2040 | - | 4.5 | General, Cardiology, Gynaecology |
| Mobile Unit Alpha | Mobile | 28.6315 | 77.2167 | - | 4.6 | Emergency, General |
| MedPlus Pharmacy | Pharma | 28.5640 | 77.2410 | - | 4.1 | General |
| ... (14 more) | | | | | | |

Auto-seeded on first `docker-compose up` or `npm run db:seed`.

---

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t medmap-backend .

# Run container
docker run -d \
  --name medmap \
  -e DB_HOST=postgres \
  -e DB_PASSWORD=secure_password \
  -p 3000:3000 \
  -p 3002:3002 \
  medmap-backend
```

### Production Checklist

- [ ] Update `JWT_SECRET` to 32+ random characters
- [ ] Configure `DB_PASSWORD` with strong credential
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS with production domain
- [ ] Set up PostgreSQL daily backups
- [ ] Monitor application logs (PM2, systemd)
- [ ] Configure rate limiting
- [ ] Set up CI/CD pipeline (GitHub Actions)

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check Docker containers
docker ps -a

# View logs
docker logs medmap-postgres
docker logs medmap-backend

# Restart
docker-compose down
docker-compose up
```

### Database connection error

```bash
# Verify PostgreSQL is running
psql -h localhost -U medmap_user -d medmap_db

# Check migrations applied
docker exec medmap-backend npm run db:migrate
```

### Flutter app can't connect

```bash
# Verify backend running
curl http://localhost:3000/health

# Update config
# Edit: medmap_mobile/lib/config/config.dart
# Update: APIConfig.baseUrl
```

### WebSocket disconnects

```bash
# Check WebSocket server
netstat -tulpn | grep 3002

# Verify ws:// not blocked by firewall
```

---

## 📝 License

ISC

---

**Repository**: https://github.com/TridentifyIshaan/Flutter-Learning  
**Created**: March 2026  
**Maintainer**: TridentifyIshaan  
**Status**: Production-Ready ✅