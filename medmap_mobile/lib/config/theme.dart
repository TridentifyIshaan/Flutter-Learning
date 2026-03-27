import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData darkTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: const Color(0xFF080C10),
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF0C1118),
        elevation: 0,
        centerTitle: true,
      ),
      backgroundColor: const Color(0xFF080C10),
      primaryColor: const Color(0xFF00D4AA),
      colorScheme: const ColorScheme.dark(
        primary: Color(0xFF00D4AA),
        secondary: Color(0xFFF5A623),
        error: Color(0xFFFF4D6A),
      ),
    );
  }
}
