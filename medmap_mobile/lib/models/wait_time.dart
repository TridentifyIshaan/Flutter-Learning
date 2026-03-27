import 'package:freezed_annotation/freezed_annotation.dart';

part 'wait_time.freezed.dart';
part 'wait_time.g.dart';

@freezed
class WaitTime with _$WaitTime {
  const factory WaitTime({
    required int id,
    required int facilityId,
    required int waitTimeMinutes,
    @Default('normal') String status, // 'normal', 'high', 'critical'
    @Default(0) int patientsWaiting,
    required DateTime createdAt,
  }) = _WaitTime;

  factory WaitTime.fromJson(Map<String, dynamic> json) =>
      _$WaitTimeFromJson(json);
}
