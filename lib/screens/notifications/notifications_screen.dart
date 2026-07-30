import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  bool _transactionAlerts = true;
  bool _securityAlerts = true;
  bool _promotions = false;
  bool _email = true;
  bool _sms = true;
  bool _push = true;
  bool _sound = true;
  bool _vibration = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Notifications')),
      body: ListView(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
        children: [
          _sectionLabel('What you get notified about'),
          _card([
            _switchRow(Icons.receipt_long_rounded, AppColors.electricityBg, AppColors.electricityFg,
                'Transaction Alerts', 'Every debit or credit on your wallet', _transactionAlerts,
                (v) => setState(() => _transactionAlerts = v)),
            _divider(),
            _switchRow(Icons.shield_outlined, AppColors.bettingBg, AppColors.primary,
                'Security Alerts', 'Sign-ins and suspicious activity', _securityAlerts,
                (v) => setState(() => _securityAlerts = v)),
            _divider(),
            _switchRow(Icons.local_offer_outlined, AppColors.cableBg, AppColors.cableFg,
                'Promotions & Offers', 'Discounts, cashback and new features', _promotions,
                (v) => setState(() => _promotions = v)),
          ]),
          const SizedBox(height: 20),
          _sectionLabel('How you get notified'),
          _card([
            _switchRow(Icons.mail_outline_rounded, AppColors.dataBg, AppColors.dataFg,
                'Email Notifications', 'manniru@gmail.com', _email, (v) => setState(() => _email = v)),
            _divider(),
            _switchRow(Icons.sms_outlined, AppColors.airtimeBg, AppColors.airtimeFg,
                'SMS Notifications', '0801 234 5678', _sms, (v) => setState(() => _sms = v)),
            _divider(),
            _switchRow(Icons.notifications_none_rounded, AppColors.moreBg, AppColors.moreFg,
                'Push Notifications', 'Alerts on this device', _push, (v) => setState(() => _push = v)),
          ]),
          const SizedBox(height: 20),
          _sectionLabel('Notification style'),
          _card([
            _switchRow(Icons.volume_up_outlined, AppColors.internetBg, AppColors.internetFg,
                'Sound', 'Play a sound for new notifications', _sound, (v) => setState(() => _sound = v)),
            _divider(),
            _switchRow(Icons.vibration_rounded, AppColors.waterBg, AppColors.waterFg,
                'Vibration', 'Vibrate for new notifications', _vibration, (v) => setState(() => _vibration = v)),
          ]),
        ],
      ),
    );
  }

  Widget _sectionLabel(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 10, left: 4),
        child: Text(text, style: const TextStyle(color: AppColors.textSecondary)),
      );

  Widget _card(List<Widget> children) => Container(
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18)),
        child: Column(children: children),
      );

  Widget _divider() => const Divider(height: 1, indent: 16, endIndent: 16);

  Widget _switchRow(
    IconData icon,
    Color bg,
    Color fg,
    String title,
    String subtitle,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return ListTile(
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
        child: Icon(icon, color: fg, size: 18),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
      trailing: Switch(
        value: value,
        activeThumbColor: AppColors.primary,
        onChanged: onChanged,
      ),
    );
  }
}
