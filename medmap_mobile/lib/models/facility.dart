import 'package:freezed_annotation/freezed_annotation.dart';

part 'facility.freezed.dart';
part 'facility.g.dart';

@freezed
class Facility with _$Facility {
  const factory Facility({
    required int id,
    required String name,
    required String type, // 'hospital', 'clinic', 'mobile', 'pharma'
    required String address,
    required double latitude,
    required double longitude,
    required String phone,
    required String description,
    @Default([]) List<String> specialties,
    int? beds,
    @Default(4.0) double rating,
    @Default(true) bool isOpen,
    @Default(0) int currentWaitTime,
    int? distanceMeters,
  }) = _Facility;

  factory Facility.fromJson(Map<String, dynamic> json) =>
      _$FacilityFromJson(json);
}
