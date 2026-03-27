import 'package:flutter/material.dart';

class FacilityCard extends StatelessWidget {
  final String name;
  final String type;
  final String address;
  final double rating;
  final int waitTime;
  final bool isOpen;
  final VoidCallback onTap;

  const FacilityCard({
    Key? key,
    required this.name,
    required this.type,
    required this.address,
    required this.rating,
    required this.waitTime,
    required this.isOpen,
    required this.onTap,
  }) : super(key: key);

  Color get typeColor {
    switch (type) {
      case 'hospital':
        return const Color(0xFFFF4D6A);
      case 'clinic':
        return const Color(0xFF4D9FFF);
      case 'mobile':
        return const Color(0xFF00D4AA);
      case 'pharma':
        return const Color(0xFFF5A623);
      default:
        return const Color(0xFF8FA3B8);
    }
  }

  Color get waitTimeColor {
    if (waitTime < 20) return const Color(0xFF4ADE80);
    if (waitTime < 45) return const Color(0xFFF5A623);
    return const Color(0xFFFF4D6A);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF161E28),
          border: Border.all(color: const Color(0xFF1E2D3D)),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: typeColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: typeColor),
                  ),
                  child: const Icon(Icons.location_on),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFE8F0F7),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        type.toUpperCase(),
                        style: const TextStyle(
                          fontSize: 11,
                          color: Color(0xFF445566),
                        ),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '★ $rating',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFF5A623),
                      ),
                    ),
                    if (!isOpen)
                      const Text(
                        '● Closed',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFFFF4D6A),
                        ),
                      ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              address,
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF8FA3B8),
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: waitTimeColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: waitTimeColor.withOpacity(0.3)),
              ),
              child: Text(
                '⏱ $waitTime min wait',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: waitTimeColor,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
