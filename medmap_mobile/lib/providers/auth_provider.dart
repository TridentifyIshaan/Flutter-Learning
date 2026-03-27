import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  final APIService _apiService;

  User? _user;
  bool _isLoading = false;
  String? _error;

  AuthProvider(this._apiService);

  // Getters
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  // Register
  Future<bool> register({
    required String email,
    required String password,
    required String fullName,
    String userType = 'patient',
    String? phone,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.register(
        email: email,
        password: password,
        fullName: fullName,
        userType: userType,
        phone: phone,
      );

      _user = User(
        id: response['user']['id'],
        email: response['user']['email'],
        fullName: response['user']['fullName'],
        userType: response['user']['userType'],
        phone: response['user']['phone'],
        token: response['token'],
      );

      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Login
  Future<bool> login({required String email, required String password}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.login(email: email, password: password);

      _user = User(
        id: response['user']['id'],
        email: response['user']['email'],
        fullName: response['user']['fullName'],
        userType: response['user']['userType'],
        phone: response['user']['phone'],
        token: response['token'],
      );

      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Logout
  void logout() {
    _user = null;
    _apiService.clearAuthToken();
    notifyListeners();
  }
}
