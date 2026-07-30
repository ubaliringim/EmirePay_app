import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class AppService {
  final String label;
  final IconData icon;
  final Color background;
  final Color foreground;

  const AppService({
    required this.label,
    required this.icon,
    required this.background,
    required this.foreground,
  });
}

const List<AppService> quickActionServices = [
  AppService(
    label: 'Airtime',
    icon: Icons.phone_android_rounded,
    background: AppColors.airtimeBg,
    foreground: AppColors.airtimeFg,
  ),
  AppService(
    label: 'Data',
    icon: Icons.wifi_rounded,
    background: AppColors.dataBg,
    foreground: AppColors.dataFg,
  ),
  AppService(
    label: 'Electricity',
    icon: Icons.lightbulb_rounded,
    background: AppColors.electricityBg,
    foreground: AppColors.electricityFg,
  ),
  AppService(
    label: 'Cable TV',
    icon: Icons.tv_rounded,
    background: AppColors.cableBg,
    foreground: AppColors.cableFg,
  ),
  AppService(
    label: 'Internet',
    icon: Icons.router_rounded,
    background: AppColors.internetBg,
    foreground: AppColors.internetFg,
  ),
  AppService(
    label: 'Water',
    icon: Icons.water_drop_rounded,
    background: AppColors.waterBg,
    foreground: AppColors.waterFg,
  ),
  AppService(
    label: 'Betting',
    icon: Icons.sports_esports_rounded,
    background: AppColors.bettingBg,
    foreground: AppColors.bettingFg,
  ),
  AppService(
    label: 'More',
    icon: Icons.grid_view_rounded,
    background: AppColors.moreBg,
    foreground: AppColors.moreFg,
  ),
];

const List<AppService> payBillsServices = [
  AppService(
    label: 'Electricity',
    icon: Icons.lightbulb_rounded,
    background: AppColors.electricityBg,
    foreground: AppColors.electricityFg,
  ),
  AppService(
    label: 'Cable TV',
    icon: Icons.tv_rounded,
    background: AppColors.cableBg,
    foreground: AppColors.cableFg,
  ),
  AppService(
    label: 'Internet',
    icon: Icons.router_rounded,
    background: AppColors.internetBg,
    foreground: AppColors.internetFg,
  ),
  AppService(
    label: 'Water',
    icon: Icons.water_drop_rounded,
    background: AppColors.waterBg,
    foreground: AppColors.waterFg,
  ),
];
