import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

enum TransactionDirection { in_, out }

class AppTransaction {
  final String title;
  final String subtitle;
  final double amount;
  final TransactionDirection direction;
  final String time;
  final String dateGroup;
  final IconData icon;
  final Color iconBg;
  final Color iconFg;
  final String status;
  final DateTime? createdAt;

  const AppTransaction({
    required this.title,
    required this.subtitle,
    required this.amount,
    required this.direction,
    required this.time,
    required this.dateGroup,
    required this.icon,
    required this.iconBg,
    required this.iconFg,
    this.status = 'Success',
    this.createdAt,
  });

  factory AppTransaction.fromJson(Map<String, dynamic> json) {
    final createdAt = DateTime.parse(json['created_at'] as String).toLocal();
    final style = _styleForType(json['type'] as String);
    return AppTransaction(
      title: json['title'] as String,
      subtitle: json['subtitle'] as String,
      amount: (json['amount'] as num).toDouble(),
      direction: json['direction'] == 'in'
          ? TransactionDirection.in_
          : TransactionDirection.out,
      time: _formatTime(createdAt),
      dateGroup: _formatDateGroup(createdAt),
      icon: style.$1,
      iconBg: style.$2,
      iconFg: style.$3,
      status: json['status'] as String,
      createdAt: createdAt,
    );
  }
}

(IconData, Color, Color) _styleForType(String type) {
  switch (type) {
    case 'airtime':
      return (
        Icons.phone_android_rounded,
        AppColors.airtimeBg,
        AppColors.airtimeFg,
      );
    case 'data':
      return (Icons.wifi_rounded, AppColors.dataBg, AppColors.dataFg);
    case 'electricity':
      return (
        Icons.lightbulb_rounded,
        AppColors.electricityBg,
        AppColors.electricityFg,
      );
    case 'cable':
      return (Icons.tv_rounded, AppColors.cableBg, AppColors.cableFg);
    case 'internet':
      return (Icons.router_rounded, AppColors.internetBg, AppColors.internetFg);
    default:
      return (Icons.receipt_long_rounded, AppColors.moreBg, AppColors.moreFg);
  }
}

String _formatTime(DateTime dt) {
  final hour12 = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
  final minute = dt.minute.toString().padLeft(2, '0');
  final period = dt.hour < 12 ? 'AM' : 'PM';
  return '$hour12:$minute $period';
}

const _monthAbbrev = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

String _formatDateGroup(DateTime dt) {
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final day = DateTime(dt.year, dt.month, dt.day);
  final diff = today.difference(day).inDays;
  if (diff == 0) return 'Today';
  if (diff == 1) return 'Yesterday';
  return '${dt.day} ${_monthAbbrev[dt.month - 1]}';
}
