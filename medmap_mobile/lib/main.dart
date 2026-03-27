import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/facilities_provider.dart';
import 'providers/location_provider.dart';
import 'providers/theme_provider.dart';
import 'providers/wait_times_provider.dart';
import 'services/api_service.dart';
import 'services/location_service.dart';
import 'screens/login_screen.dart';
import 'screens/facilities_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MedMapApp());
}

class MedMapApp extends StatelessWidget {
  const MedMapApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // Services
        Provider<APIService>(create: (_) => APIService()),
        Provider<LocationService>(create: (_) => LocationService()),

        // Providers
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(
          create: (context) => AuthProvider(context.read<APIService>()),
        ),
        ChangeNotifierProvider(
          create: (context) => FacilitiesProvider(context.read<APIService>()),
        ),
        ChangeNotifierProvider(
          create: (context) => LocationProvider(context.read<LocationService>()),
        ),
        ChangeNotifierProvider(
          create: (context) => WaitTimesProvider(context.read<APIService>()),
        ),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) {
          return MaterialApp(
            title: 'MedMap',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.darkTheme(),
            home: Consumer<AuthProvider>(
              builder: (context, authProvider, _) {
                if (authProvider.isAuthenticated) {
                  return const FacilitiesScreen();
                }
                return const LoginScreen();
              },
            ),
            routes: {
              '/login': (context) => const LoginScreen(),
              '/facility': (context) => const FacilitiesScreen(),
            },
          );
        },
      ),
    );
  }
}
