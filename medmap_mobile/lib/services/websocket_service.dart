import 'package:web_socket_channel/web_socket_channel.dart';
import 'dart:async';
import 'dart:convert';
import '../config/config.dart';

typedef WSMessageCallback = void Function(Map<String, dynamic>);

class WebSocketService {
  late WebSocketChannel _channel;
  StreamController<Map<String, dynamic>>? _messageController;
  bool _isConnected = false;
  int _reconnectAttempts = 0;
  Timer? _reconnectTimer;
  StreamSubscription? _streamSubscription;

  bool get isConnected => _isConnected;

  Future<void> connect() async {
    try {
      _channel = WebSocketChannel.connect(Uri.parse(APIConfig.wsUrl));
      _isConnected = true;
      _reconnectAttempts = 0;

      _messageController ??= StreamController<Map<String, dynamic>>.broadcast();

      _streamSubscription = _channel.stream.listen(
        (message) {
          try {
            final data = jsonDecode(message);
            _messageController?.add(data);
          } catch (e) {
            print('Error parsing WS message: $e');
          }
        },
        onError: (error) {
          print('WebSocket error: $error');
          _isConnected = false;
          _attemptReconnect();
        },
        onDone: () {
          print('WebSocket connection closed');
          _isConnected = false;
          _attemptReconnect();
        },
      );

      print('✅ WebSocket connected');
    } catch (e) {
      print('Error connecting to WebSocket: $e');
      _isConnected = false;
      _attemptReconnect();
    }
  }

  void _attemptReconnect() {
    if (_reconnectAttempts >= APIConfig.wsMaxReconnectAttempts) {
      print('Max reconnect attempts reached');
      return;
    }

    _reconnectAttempts++;
    print('Attempting to reconnect... (attempt $_reconnectAttempts)');

    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(APIConfig.wsReconnectDelay, connect);
  }

  void subscribe(String type, {int? facilityId}) {
    if (!_isConnected) {
      print('WebSocket not connected');
      return;
    }

    final message = {
      'type': type,
      'action': 'subscribe',
      if (facilityId != null) 'facilityId': facilityId,
    };

    _channel.sink.add(jsonEncode(message));
    print('📍 Subscribed to $type');
  }

  void unsubscribe(String type, {int? facilityId}) {
    if (!_isConnected) return;

    final message = {
      'type': type,
      'action': 'unsubscribe',
      if (facilityId != null) 'facilityId': facilityId,
    };

    _channel.sink.add(jsonEncode(message));
  }

  Stream<Map<String, dynamic>> get messages {
    _messageController ??= StreamController<Map<String, dynamic>>.broadcast();
    return _messageController!.stream;
  }

  void disconnect() {
    _reconnectTimer?.cancel();
    _streamSubscription?.cancel();
    _channel.sink.close();
    _messageController?.close();
    _isConnected = false;
    print('WebSocket disconnected');
  }
}
