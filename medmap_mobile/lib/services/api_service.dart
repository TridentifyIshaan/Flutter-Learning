import 'package:medmap_mobile/models/facility.dart';
import 'package:medmap_mobile/models/wait_time.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/config.dart';

class APIService {
  final http.Client _client;
  String? _authToken;

  APIService({http.Client? client}) : _client = client ?? http.Client();

  void setAuthToken(String token) {
    _authToken = token;
  }

  void clearAuthToken() {
    _authToken = null;
  }

  Map<String, String> _getHeaders({bool authenticated = false}) {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (authenticated && _authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }

    return headers;
  }

  Future<T> _get<T>(String endpoint, T Function(dynamic) parser) async {
    try {
      final response = await _client
          .get(
            Uri.parse('${APIConfig.baseUrl}$endpoint'),
            headers: _getHeaders(),
          )
          .timeout(APIConfig.connectionTimeout);

      if (response.statusCode == 200) {
        return parser(jsonDecode(response.body));
      } else {
        throw Exception('API Error: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<T> _post<T>(
    String endpoint,
    Map<String, dynamic> body,
    T Function(dynamic) parser, {
    bool authenticated = false,
  }) async {
    try {
      final response = await _client
          .post(
            Uri.parse('${APIConfig.baseUrl}$endpoint'),
            headers: _getHeaders(authenticated: authenticated),
            body: jsonEncode(body),
          )
          .timeout(APIConfig.connectionTimeout);

      if (response.statusCode == 200 || response.statusCode == 201) {
        return parser(jsonDecode(response.body));
      } else {
        throw Exception('API Error: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      rethrow;
    }
  }

  // Facilities
  Future<List<Facility>> getFacilities({
    String? type,
    String? specialty,
    bool? isOpen,
  }) async {
    String endpoint = APIConfig.facilitiesGetAll;
    final params = <String, String?>{};

    if (type != null) params['type'] = type;
    if (specialty != null) params['specialty'] = specialty;
    if (isOpen != null) params['isOpen'] = isOpen.toString();

    if (params.isNotEmpty) {
      final queryString = params.entries
          .where((e) => e.value != null)
          .map((e) => '${e.key}=${e.value}')
          .join('&');
      endpoint += '?$queryString';
    }

    return _get(endpoint, (data) {
      final list = data is List ? data : [data];
      return list.map((item) => Facility.fromJson(item)).toList();
    });
  }

  Future<Facility> getFacilityById(int id) async {
    return _get('${APIConfig.facilitiesGetAll}/$id', (data) {
      return Facility.fromJson(data);
    });
  }

  Future<List<Facility>> searchFacilities(String query, {int limit = 10}) async {
    final endpoint = '${APIConfig.facilitiesSearch}?q=$query&limit=$limit';
    return _get(endpoint, (data) {
      final list = data is List ? data : [data];
      return list.map((item) => Facility.fromJson(item)).toList();
    });
  }

  Future<List<Facility>> getNearbyFacilities(
    double latitude,
    double longitude, {
    double radiusKm = 10,
    int limit = 20,
  }) async {
    return _post(
      APIConfig.facilitiesNearby,
      {
        'latitude': latitude,
        'longitude': longitude,
        'radiusKm': radiusKm,
        'limit': limit,
      },
      (data) {
        final list = data is List ? data : [data];
        return list.map((item) => Facility.fromJson(item)).toList();
      },
    );
  }

  // Wait Times
  Future<List<WaitTime>> getAllWaitTimes() async {
    return _get(APIConfig.waitTimesGetAll, (data) {
      final list = data is List ? data : [data];
      return list.map((item) => WaitTime.fromJson(item)).toList();
    });
  }

  Future<WaitTime> getWaitTimeByFacility(int facilityId) async {
    return _get(
      '${APIConfig.waitTimesGetByFacility}/$facilityId',
      (data) => WaitTime.fromJson(data),
    );
  }

  // Auth
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String fullName,
    String userType = 'patient',
    String? phone,
  }) async {
    final response = await _post(
      APIConfig.authRegister,
      {
        'email': email,
        'password': password,
        'fullName': fullName,
        'userType': userType,
        'phone': phone,
      },
      (data) => data,
    );

    if (response['token'] != null) {
      setAuthToken(response['token']);
    }

    return response;
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await _post(
      APIConfig.authLogin,
      {'email': email, 'password': password},
      (data) => data,
    );

    if (response['token'] != null) {
      setAuthToken(response['token']);
    }

    return response;
  }
}
