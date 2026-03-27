import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../services/location_service.dart';

class LocationProvider extends ChangeNotifier {
  final LocationService _locationService;

  Position? _currentPosition;
  bool _isTracking = false;
  bool _isLoading = false;
  String? _error;

  LocationProvider(this._locationService);

  // Getters
  Position? get currentPosition => _currentPosition;
  bool get isTracking => _isTracking;
  bool get isLoading => _isLoading;
  String? get error => _error;

  double? get latitude => _currentPosition?.latitude;
  double? get longitude => _currentPosition?.longitude;

  // Get current location once
  Future<void> getCurrentLocation() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final position = await _locationService.getCurrentLocation();
      _currentPosition = position;
      if (position == null) {
        _error = 'Unable to determine current location';
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Start tracking location
  Future<void> startLocationTracking() async {
    _isTracking = true;
    notifyListeners();

    try {
      _locationService.getLocationStream().listen((position) {
        _currentPosition = position;
        notifyListeners();
      }, onError: (error) {
        _error = error.toString();
        _isTracking = false;
        notifyListeners();
      });
    } catch (e) {
      _error = e.toString();
      _isTracking = false;
      notifyListeners();
    }
  }

  // Stop tracking
  void stopLocationTracking() {
    _isTracking = false;
    notifyListeners();
  }

  // Calculate distance to a point
  double? getDistanceTo(double latitude, double longitude) {
    if (_currentPosition == null) return null;
    return _locationService.calculateDistance(
      _currentPosition!.latitude,
      _currentPosition!.longitude,
      latitude,
      longitude,
    );
  }
}
