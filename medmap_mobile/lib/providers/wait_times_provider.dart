import 'package:flutter/material.dart';
import '../models/wait_time.dart';
import '../services/api_service.dart';

class WaitTimesProvider extends ChangeNotifier {
  final APIService _apiService;

  Map<int, WaitTime> _waitTimes = {};
  bool _isLoading = false;
  String? _error;

  WaitTimesProvider(this._apiService);

  // Getters
  Map<int, WaitTime> get waitTimes => _waitTimes;
  bool get isLoading => _isLoading;
  String? get error => _error;

  WaitTime? getWaitTimeForFacility(int facilityId) {
    return _waitTimes[facilityId];
  }

  // Load all wait times
  Future<void> loadWaitTimes() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final waitTimes = await _apiService.getAllWaitTimes();
      _waitTimes = {for (var wt in waitTimes) wt.facilityId: wt};
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Load wait time for specific facility
  Future<void> loadWaitTimeForFacility(int facilityId) async {
    try {
      final waitTime = await _apiService.getWaitTimeByFacility(facilityId);
      _waitTimes[facilityId] = waitTime;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  // Update wait time from WebSocket
  void updateWaitTime(WaitTime waitTime) {
    _waitTimes[waitTime.facilityId] = waitTime;
    notifyListeners();
  }

  // Update multiple wait times
  void updateMultipleWaitTimes(List<WaitTime> waitTimes) {
    for (var wt in waitTimes) {
      _waitTimes[wt.facilityId] = wt;
    }
    notifyListeners();
  }
}
