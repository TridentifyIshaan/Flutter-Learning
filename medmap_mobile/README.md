# MedMap Mobile App

Flutter mobile application for real-time healthcare facility routing with geolocation tracking.

## Features

- 🔍 Facility search with geospatial filtering
- 📍 Real-time location tracking
- ⏱ Live wait time updates via WebSocket
- 🗺️ Interactive map visualization (flutter_map)
- 🧭 Routing to nearby facilities
- 🔐 User authentication (JWT)
- 📱 Responsive UI design

## Getting Started

### Prerequisites

- Flutter 3.10+
- Dart 3.0+
- Android/iOS development environment
- Running backend API (see medmap-backend)

### Installation

```bash
# Clone repository
cd medmap_mobile

# Install dependencies
flutter pub get

# Generate required files
flutter pub run build_runner build

# Run on emulator/device
flutter run

# Run with Chrome (web)
flutter run -d chrome
```

### Configuration

Update API endpoints in `lib/config/config.dart` if backend is running on different host:

```dart
static const String baseUrl = 'http://your-api-host:3000';
static const String wsUrl = 'ws://your-api-host:3002';
```

## Project Structure

```
lib/
├── config/          # API & app configuration, theme
├── models/          # Data models (Facility, WaitTime, etc.)
├── services/        # API, Location, WebSocket services
├── providers/       # Provider state management
├── screens/         # App screens (Login, Facilities, etc.)
├── widgets/         # Reusable widgets
└── main.dart        # App entry point
```

## Key Dependencies

- **provider** — State management
- **flutter_map** — Map rendering (Leaflet fork)
- **geolocator** — Device geolocation
- **web_socket_channel** — WebSocket real-time updates
- **http/dio** — HTTP client
- **freezed_annotation** — Code generation for models

## Development

### Run tests

```bash
flutter test
flutter test integration_test/
```

### Format code

```bash
dart format lib/
```

### Lint

```bash
flutter analyze
```

### Generate models

```bash
flutter pub run build_runner watch
```

## API Integration

The app connects to:

- **REST API**: `http://localhost:3000/api/v1`
- **WebSocket**: `ws://localhost:3002`

### Authentication Flow

1. Login/Register → Get JWT token
2. Store token in AuthProvider
3. Pass token in Authorization header for protected endpoints
4. WebSocket connections inherit JWT from HTTP client

### Real-time Updates

The app subscribes to WebSocket channels for:
- `wait-times` — Facility wait time updates (30s cadence)
- `mobile-units` — Mobile unit GPS locations (5s cadence)
- `facility-{id}` — Updates for specific facility

## Building for Release

### iOS

```bash
flutter build ios --release
xcode build archive and upload
```

### Android

```bash
flutter build apk --release
flutter build appbundle --release # For Play Store
```

### Web

```bash
flutter build web --release
# Deploy build/web to web server
```

## Troubleshooting

### Geolocation denied

- Ensure location permissions are granted in app settings
- Check `android/app/src/main/AndroidManifest.xml` for permission declarations

### Cannot connect to API

- Verify backend is running on correct host:port
- Check `lib/config/config.dart` API endpoints
- Ensure firewall allows connections

### WebSocket disconnects

- App automatically reconnects with exponential backoff
- Check console for reconnection logs
- Verify WebSocket server is running on port 3002

## License

ISC
