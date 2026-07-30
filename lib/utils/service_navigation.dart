import 'package:flutter/material.dart';

import '../screens/airtime/airtime_screen.dart';
import '../screens/betting/fund_betting_screen.dart';
import '../screens/cable/cable_tv_screen.dart';
import '../screens/data/data_screen.dart';
import '../screens/electricity/electricity_screen.dart';
import '../screens/internet/internet_screen.dart';
import '../screens/water/water_screen.dart';

void openService(BuildContext context, String label, {VoidCallback? onMore}) {
  switch (label) {
    case 'More':
      onMore?.call();
      return;
    case 'Airtime':
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const AirtimeScreen()),
      );
      return;
    case 'Data':
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const DataScreen()),
      );
      return;
    case 'Electricity':
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const ElectricityScreen()),
      );
      return;
    case 'Cable TV':
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const CableTvScreen()),
      );
      return;
    case 'Internet':
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const InternetScreen()),
      );
      return;
    case 'Water':
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const WaterScreen()),
      );
      return;
    case 'Betting':
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const FundBettingScreen()),
      );
      return;
    default:
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$label is coming soon')),
      );
  }
}
