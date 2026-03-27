import 'package:freezed_annotation/freezed_annotation.dart';

part 'mobile_unit.freezed.dart';
part 'mobile_unit.g.dart';

@freezed
class MobileUnit with _$MobileUnit {
  const factory MobileUnit({
    required int id,
    required int facilityId,
    required String facilityName,
    required String type,
    required double latitude,
    required double longitude,
    @Default(0) int heading,
    @Default(0) double speed,
    @Default('active') String status,
  }) = _MobileUnit;

  factory MobileUnit.fromJson(Map<String, dynamic> json) =>
      _$MobileUnitFromJson(json);
}
