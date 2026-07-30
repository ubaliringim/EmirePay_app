import 'package:flutter/material.dart';

class NetworkProvider {
  final String label;
  final String name;
  final Color color;

  const NetworkProvider({
    required this.label,
    required this.name,
    required this.color,
  });
}

const List<NetworkProvider> networkProviders = [
  NetworkProvider(label: 'M', name: 'MTN', color: Color(0xFFE8A400)),
  NetworkProvider(label: 'A', name: 'Airtel', color: Color(0xFFE0334F)),
  NetworkProvider(label: 'G', name: 'Glo', color: Color(0xFF2FA968)),
  NetworkProvider(label: '9', name: '9mob', color: Color(0xFF1B8A4E)),
];
