class APIConfig {
  static const String baseUrl = 'http://localhost:3000';
  static const String apiVersion = '/api/v1';
  static const String wsUrl = 'ws://localhost:3002';
  
  // Endpoints
  static const String authRegister = '$apiVersion/auth/register';
  static const String authLogin = '$apiVersion/auth/login';
  static const String authProfile = '$apiVersion/auth/profile';
  
  static const String facilitiesGetAll = '$apiVersion/facilities';
  static const String facilitiesSearch = '$apiVersion/facilities/search/query';
  static const String facilitiesNearby = '$apiVersion/facilities/nearby';
  static const String facilitiesNearest = '$apiVersion/facilities/nearest';
  
  static const String waitTimesGetAll = '$apiVersion/wait-times';
  static const String waitTimesGetByFacility = '$apiVersion/wait-times/facility';
  
  static const String mobileUnitsGetAll = '$apiVersion/mobile-units';
  static const String mobileUnitsUpdateLocation = '$apiVersion/mobile-units';
  
  static const String routingDirections = '$apiVersion/routing/directions';
  static const String routingIsochrone = '$apiVersion/routing/isochrone';
  
  // Timeouts
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  
  // WebSocket reconnect
  static const Duration wsReconnectDelay = Duration(seconds: 3);
  static const int wsMaxReconnectAttempts = 5;
}

class AppConfig {
  static const String appName = 'MedMap';
  static const String appVersion = '1.0.0';
  
  // Location tracking
  static const int locationUpdateIntervalSeconds = 5;
  static const double locationDistanceFilterMeters = 10;
  
  // Wait times
  static const int waitTimesRefreshIntervalSeconds = 30;
  
  // Map
  static const double defaultZoom = 12.0;
  static const double facilitySearchRadiusKm = 10;
}

class ThemeConfig {
  // Colors from index.html
  static const bgVoid = 0xFF080C10;
  static const bgDeep = 0xFF0C1118;
  static const bgPanel = 0xFF111820;
  static const bgCard = 0xFF161E28;
  static const bgHover = 0xFF1C2736;
  static const border = 0xFF1E2D3D;
  static const borderHi = 0xFF2A3F56;
  static const teal = 0xFF00D4AA;
  static const tealDim = 0xFF00A882;
  static const amber = 0xFFF5A623;
  static const red = 0xFFFF4D6A;
  static const blue = 0xFF4D9FFF;
  static const purple = 0xFFA78BFA;
  static const textBright = 0xFFE8F0F7;
  static const textMain = 0xFF8FA3B8;
  static const textMuted = 0xFF445566;
  static const textFaint = 0xFF2A3A4A;
}
