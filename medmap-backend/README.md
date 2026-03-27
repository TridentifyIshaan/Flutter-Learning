# MedMap Backend API

Production-ready REST API and WebSocket server for real-time geolocation healthcare routing.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+ with PostGIS extension
- Docker & Docker Compose (recommended)

### Setup with Docker

```bash
cd medmap-backend

# Copy environment template
cp .env.example .env

# Start all services (PostgreSQL, Redis, Backend)
docker-compose up

# In another terminal, run migrations and seeds
docker exec medmap-backend npm run db:migrate
docker exec medmap-backend npm run db:seed
```

### Setup without Docker

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Ensure PostgreSQL + PostGIS is running locally
# Then run migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Start development server
npm run dev

# In another terminal, start WebSocket server
npm run ws:dev
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (requires token)
- `PUT /api/v1/auth/profile` - Update user profile (requires token)

### Facilities
- `GET /api/v1/facilities` - Get all facilities
- `GET /api/v1/facilities/:id` - Get facility by ID
- `GET /api/v1/facilities/search/query?q=...` - Search facilities
- `POST /api/v1/facilities/nearby` - Find nearby facilities (within radius)
- `POST /api/v1/facilities/nearest` - Find nearest facility
- `GET /api/v1/facilities/type/:type` - Get facilities by type
- `GET /api/v1/facilities/stats/all` - Get facility statistics

### Wait Times
- `GET /api/v1/wait-times` - Get all latest wait times
- `GET /api/v1/wait-times/facility/:id` - Get wait time for facility
- `GET /api/v1/wait-times/facility/:id/history` - Get wait time history
- `GET /api/v1/wait-times/facility/:id/average` - Get average wait time
- `POST /api/v1/wait-times` - Create/update wait time (requires token)
- `GET /api/v1/wait-times/high-wait/list` - Get high wait time facilities

### Mobile Units
- `GET /api/v1/mobile-units` - Get all mobile units
- `GET /api/v1/mobile-units/:id` - Get mobile unit by ID
- `PUT /api/v1/mobile-units/:id/location` - Update location (requires token)
- `PUT /api/v1/mobile-units/:id/status` - Update status (requires token)

### Routing
- `POST /api/v1/routing/directions` - Get route between two points
- `POST /api/v1/routing/isochrone` - Get reachable area within time
- `POST /api/v1/routing/save` - Save route (requires token)
- `GET /api/v1/routing/user/history` - Get user's saved routes (requires token)

## WebSocket Connection

Connect to `ws://localhost:3002`

### Subscribe to Updates
```json
{ "type": "wait-times", "action": "subscribe" }
{ "type": "mobile-units", "action": "subscribe" }
{ "type": "facility", "action": "subscribe", "facilityId": 1 }
```

### Unsubscribe
```json
{ "type": "wait-times", "action": "unsubscribe" }
```

## Database Tables

- **users** - User accounts and authentication
- **facilities** - Healthcare facilities with PostGIS geometry
- **wait_times** - Historical and current wait times
- **mobile_units** - Mobile unit locations and status
- **routes** - Saved user routes
- **facility_archives** - IPFS-pinned facility records

## Environment Variables

See `.env.example` for all configuration options.

Key variables:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - PostgreSQL
- `REST_PORT` - REST API port (default: 3000)
- `WS_PORT` - WebSocket port (default: 3002)
- `JWT_SECRET` - Secret key for JWT tokens
- `ORS_API_KEY` - OpenRouteService API key for routing
- `IPFS_PROJECT_ID`, `IPFS_PROJECT_SECRET` - Infura IPFS credentials

## Development

```bash
# Run in development mode with auto-restart
npm run dev
npm run ws:dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint
```

## Testing API

Use Postman, curl, or VS Code REST Client:

```bash
# Get all facilities
curl http://localhost:3000/api/v1/facilities

# Find nearby facilities
curl -X POST http://localhost:3000/api/v1/facilities/nearby \\
  -H "Content-Type: application/json" \\
  -d '{"latitude": 28.5672, "longitude": 77.2100, "radiusKm": 10}'

# Get wait times
curl http://localhost:3000/api/v1/wait-times

# Get directions (requires ORS API key in .env)
curl -X POST http://localhost:3000/api/v1/routing/directions \\
  -H "Content-Type: application/json" \\
  -d '{"startLat": 28.5672, "startLng": 77.2100, "endLat": 28.6300, "endLng": 77.2200}'
```

## Production Deployment

1. Build Docker image: `docker build -t medmap-backend .`
2. Push to registry
3. Update environment variables in production
4. Use Docker Compose or Kubernetes for orchestration
5. Set up PostgreSQL backups
6. Configure CORS for production domain
7. Enable HTTPS/SSL

## License

ISC
