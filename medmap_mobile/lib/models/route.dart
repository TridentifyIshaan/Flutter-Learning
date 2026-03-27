import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:latlong2/latlong.dart';

part 'route.freezed.dart';
part 'route.g.dart';

@freezed
class RouteInfo with _$RouteInfo {
  const factory RouteInfo({
    required int id,
    required double originLatitude,
    required double originLongitude,
    required double destinationLatitude,
    required double destinationLongitude,
    int? originFacilityId,
    int? destinationFacilityId,
    int? distanceMeters,
    int? durationSeconds,
    String? polyline,
  }) = _RouteInfo;

  factory RouteInfo.fromJson(Map<String, dynamic> json) =>
      _$RouteInfoFromJson(json);
}

@freezed
class DirectionResponse with _$DirectionResponse {
  const factory DirectionResponse({
    required int distance, // meters
    required int duration, // seconds
    required String polyline,
    Map<String, dynamic>? summary,
  }) = _DirectionResponse;

  factory DirectionResponse.fromJson(Map<String, dynamic> json) =>
      _$DirectionResponseFromJson(json);
}
