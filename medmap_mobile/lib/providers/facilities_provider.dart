import 'package:flutter/material.dart';
import '../models/facility.dart';
import '../services/api_service.dart';

class FacilitiesProvider extends ChangeNotifier {
  final APIService _apiService;

  List<Facility> _facilities = [];
  List<Facility> _filteredFacilities = [];
  bool _isLoading = false;
  String? _error;
  String? _selectedType;
  String? _selectedSpecialty;

  FacilitiesProvider(this._apiService);

  // Getters
  List<Facility> get facilities => _filteredFacilities.isEmpty ? _facilities : _filteredFacilities;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String? get selectedType => _selectedType;
  String? get selectedSpecialty => _selectedSpecialty;

  // Load all facilities
  Future<void> loadFacilities() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _facilities = await _apiService.getFacilities();
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Search facilities
  Future<void> searchFacilities(String query) async {
    if (query.isEmpty) {
      _filteredFacilities = [];
      notifyListeners();
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      _filteredFacilities = await _apiService.searchFacilities(query);
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Filter by type
  void filterByType(String? type) {
    _selectedType = type;
    _applyFilters();
    notifyListeners();
  }

  // Filter by specialty
  void filterBySpecialty(String? specialty) {
    _selectedSpecialty = specialty;
    _applyFilters();
    notifyListeners();
  }

  void _applyFilters() {
    _filteredFacilities = _facilities.where((facility) {
      bool typeMatch = _selectedType == null || facility.type == _selectedType;
      bool specialtyMatch = _selectedSpecialty == null ||
          facility.specialties.contains(_selectedSpecialty);
      return typeMatch && specialtyMatch;
    }).toList();
  }

  // Clear filters
  void clearFilters() {
    _selectedType = null;
    _selectedSpecialty = null;
    _filteredFacilities = [];
    notifyListeners();
  }
}
