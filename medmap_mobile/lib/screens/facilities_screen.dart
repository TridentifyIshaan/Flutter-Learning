import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/facilities_provider.dart';
import '../providers/location_provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/facility_card.dart';

class FacilitiesScreen extends StatefulWidget {
  const FacilitiesScreen({Key? key}) : super(key: key);

  @override
  State<FacilitiesScreen> createState() => _FacilitiesScreenState();
}

class _FacilitiesScreenState extends State<FacilitiesScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<FacilitiesProvider>().loadFacilities();
      context.read<LocationProvider>().getCurrentLocation();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('MedMap'),
        elevation: 1,
        backgroundColor: const Color(0xFF0C1118),
        actions: [
          Consumer<AuthProvider>(
            builder: (context, authProvider, _) {
              if (authProvider.isAuthenticated) {
                return Padding(
                  padding: const EdgeInsets.only(right: 16),
                  child: Center(
                    child: Text(
                      authProvider.user?.fullName.split(' ').first ?? 'User',
                      style: const TextStyle(
                        color: Color(0xFFE8F0F7),
                        fontSize: 14,
                      ),
                    ),
                  ),
                );
              }
              return const SizedBox();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              onChanged: (value) {
                if (value.isEmpty) {
                  context.read<FacilitiesProvider>().clearFilters();
                } else {
                  context.read<FacilitiesProvider>().searchFacilities(value);
                }
              },
              decoration: InputDecoration(
                hintText: 'Search facilities...',
                hintStyle: const TextStyle(color: Color(0xFF445566)),
                prefixIcon: const Icon(Icons.search, color: Color(0xFF445566)),
                filled: true,
                fillColor: const Color(0xFF161E28),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: Color(0xFF1E2D3D)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: Color(0xFF1E2D3D)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: const BorderSide(color: Color(0xFF00D4AA)),
                ),
              ),
              style: const TextStyle(color: Color(0xFFE8F0F7)),
            ),
          ),
          // Facilities list
          Expanded(
            child: Consumer3<FacilitiesProvider, LocationProvider,
                WaitTimesProvider>(
              builder: (context, facilitiesProvider, locationProvider,
                  waitTimesProvider, _) {
                if (facilitiesProvider.isLoading) {
                  return const Center(
                    child: CircularProgressIndicator(
                      valueColor:
                          AlwaysStoppedAnimation<Color>(Color(0xFF00D4AA)),
                    ),
                  );
                }

                if (facilitiesProvider.error != null) {
                  return Center(
                    child: Text(
                      'Error: ${facilitiesProvider.error}',
                      style: const TextStyle(color: Color(0xFFFF4D6A)),
                    ),
                  );
                }

                final facilities = facilitiesProvider.facilities;

                if (facilities.isEmpty) {
                  return const Center(
                    child: Text(
                      'No facilities found',
                      style: TextStyle(color: Color(0xFF8FA3B8)),
                    ),
                  );
                }

                return ListView.builder(
                  itemCount: facilities.length,
                  itemBuilder: (context, index) {
                    final facility = facilities[index];
                    final waitTime =
                        waitTimesProvider.getWaitTimeForFacility(facility.id);

                    return FacilityCard(
                      name: facility.name,
                      type: facility.type,
                      address: facility.address,
                      rating: facility.rating,
                      waitTime: waitTime?.waitTimeMinutes ?? facility.currentWaitTime,
                      isOpen: facility.isOpen,
                      onTap: () {
                        // Navigate to facility detail screen
                      },
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// Placeholder for WaitTimesProvider access
class WaitTimesProvider extends ChangeNotifier {
  Map<int, dynamic> _waitTimes = {};

  dynamic getWaitTimeForFacility(int facilityId) {
    return _waitTimes[facilityId];
  }
}
