import 'package:geolocator/geolocator.dart';
import '../config/config.dart';

class LocationService {
  static final LocationService _instance = LocationService._internal();

  factory LocationService() {
    return _instance;
  }

  LocationService._internal();

  Future<bool> requestLocationPermission() async {
    final status = await Geolocator.checkPermission();

    if (status == LocationPermission.denied) {
      final permissionStatus = await Geolocator.requestPermission();
      return permissionStatus == LocationPermission.whileInUse ||
          permissionStatus == LocationPermission.always;
    }

    if (status == LocationPermission.deniedForever) {
      // Open app settings
      await Geolocator.openLocationSettings();
      return false;
    }

    return true;
  }

  Future<Position?> getCurrentLocation() async {
    try {
      final hasPermission = await requestLocationPermission();
      if (!hasPermission) return null;

      return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.best,
        forceAndroidLocationManager: true,
      );
    } catch (e) {
      print('Error getting current location: $e');
      return null;
    }
  }

  Stream<Position> getLocationStream() {
    return Geolocator.getPositionStream(
      locationSettings: LocationSettings(
        accuracy: LocationAccuracy.best,
        distanceFilter: AppConfig.locationDistanceFilterMeters.toInt(),
        timeLimit: Duration(seconds: AppConfig.locationUpdateIntervalSeconds),
      ),
    );
  }

  double calculateDistance(
    double lat1,
    double lon1,
    double lat2,
    double lon2,
  ) {
    return Geolocator.distanceBetween(lat1, lon1, lat2, lon2);
  }
}
