import 'package:flutter/material.dart';

class BettingPlatform {
  final String name;
  final IconData icon;
  final Color color;

  const BettingPlatform({
    required this.name,
    required this.icon,
    required this.color,
  });
}

const List<BettingPlatform> bettingPlatforms = [
  BettingPlatform(name: 'Bet9ja', icon: Icons.sports_soccer_rounded, color: Color(0xFF2FA968)),
  BettingPlatform(name: 'SportyBet', icon: Icons.sports_rounded, color: Color(0xFFE0334F)),
  BettingPlatform(name: '1xBet', icon: Icons.casino_rounded, color: Color(0xFF2F6FE0)),
  BettingPlatform(name: 'BetKing', icon: Icons.sports_esports_rounded, color: Color(0xFF2B2F2E)),
];
