import 'package:flutter/material.dart';

import '../../state/biometric_controller.dart';
import '../../theme/app_theme.dart';
import 'biometric_login_screen.dart';
import 'change_password_screen.dart';
import 'change_pin_screen.dart';
import 'sessions_screen.dart';

class SecurityPinScreen extends StatefulWidget {
  const SecurityPinScreen({super.key});

  @override
  State<SecurityPinScreen> createState() => _SecurityPinScreenState();
}

class _SecurityPinScreenState extends State<SecurityPinScreen> {
  bool _securityAlerts = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Security & PIN')),
      body: ListView(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
        children: [
          _sectionLabel('Transaction PIN'),
          _card([
            _navRow(
              Icons.pin_rounded,
              AppColors.dataBg,
              AppColors.dataFg,
              'Change PIN',
              'Update your 4-digit transaction PIN',
              () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const ChangePinScreen()),
              ),
            ),
          ]),
          const SizedBox(height: 20),
          _sectionLabel('Password'),
          _card([
            _navRow(
              Icons.lock_outline_rounded,
              AppColors.electricityBg,
              AppColors.electricityFg,
              'Change Password',
              'Update your login password',
              () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const ChangePasswordScreen()),
              ),
            ),
          ]),
          const SizedBox(height: 20),
          _sectionLabel('Login & Devices'),
          _card([
            _navRow(
              Icons.devices_rounded,
              AppColors.cableBg,
              AppColors.cableFg,
              'Active Sessions',
              'Manage devices signed in to your account',
              () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const SessionsScreen()),
              ),
            ),
            _divider(),
            ValueListenableBuilder<bool>(
              valueListenable: BiometricController.enabled,
              builder: (context, enabled, _) => _navRow(
                Icons.fingerprint_rounded,
                AppColors.airtimeBg,
                AppColors.airtimeFg,
                'Biometric Login',
                enabled ? 'On — used for sign-in and payments' : 'Off',
                () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const BiometricLoginScreen()),
                ),
              ),
            ),
          ]),
          const SizedBox(height: 20),
          _sectionLabel('Alerts'),
          _card([
            _switchRow(
              Icons.shield_outlined,
              AppColors.bettingBg,
              AppColors.primary,
              'Security Alerts',
              'Get notified of suspicious account activity',
              _securityAlerts,
              (v) => setState(() => _securityAlerts = v),
            ),
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
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(children: children),
      );

  Widget _divider() => const Divider(height: 1, indent: 16, endIndent: 16);

  Widget _navRow(IconData icon, Color bg, Color fg, String title, String subtitle, VoidCallback onTap) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
        child: Icon(icon, color: fg, size: 18),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
      trailing: const Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary),
    );
  }

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
