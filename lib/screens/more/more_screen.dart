import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../../state/biometric_controller.dart';
import '../../theme/app_theme.dart';
import '../../theme/theme_controller.dart';
import '../../widgets/profile_avatar.dart';
import '../about/about_screen.dart';
import '../appearance/appearance_screen.dart';
import '../cards_banks/cards_banks_screen.dart';
import '../help/help_center_screen.dart';
import '../notifications/notifications_screen.dart';
import '../onboarding_screen.dart';
import '../profile/profile_screen.dart';
import '../rate/rate_app_screen.dart';
import '../refer/refer_earn_screen.dart';
import '../security/biometric_login_screen.dart';
import '../security/security_pin_screen.dart';

class MoreScreen extends StatefulWidget {
  const MoreScreen({super.key});

  @override
  State<MoreScreen> createState() => _MoreScreenState();
}

class _MoreScreenState extends State<MoreScreen> {
  bool _notifications = true;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: EdgeInsets.fromLTRB(
          20,
          16,
          20,
          24 + MediaQuery.of(context).padding.bottom,
        ),
        children: [
          const Text(
            'More',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          InkWell(
            onTap: () => _openScreen(const ProfileScreen()),
            borderRadius: BorderRadius.circular(18),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
              ),
              child: Row(
                children: [
                  const ProfileAvatar(radius: 24),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          FirebaseAuth.instance.currentUser?.displayName
                                      ?.trim()
                                      .isNotEmpty ==
                                  true
                              ? FirebaseAuth.instance.currentUser!.displayName!
                                    .trim()
                              : 'EmirePay User',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          FirebaseAuth.instance.currentUser?.email ?? '',
                          style: const TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.bettingBg,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.edit_rounded,
                      size: 16,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          _sectionLabel('Account'),
          _card([
            _navRow(
              Icons.person_outline_rounded,
              AppColors.bettingBg,
              AppColors.primary,
              'Profile',
              onTap: () => _openScreen(const ProfileScreen()),
            ),
            _divider(),
            _navRow(
              Icons.lock_outline_rounded,
              AppColors.dataBg,
              AppColors.dataFg,
              'Security & PIN',
              onTap: () => _openScreen(const SecurityPinScreen()),
            ),
            _divider(),
            _navRow(
              Icons.credit_card_rounded,
              AppColors.electricityBg,
              AppColors.electricityFg,
              'Cards & Banks',
              onTap: () => _openScreen(const CardsBanksScreen()),
            ),
          ]),
          const SizedBox(height: 20),
          _sectionLabel('Preferences'),
          _card([
            _switchRow(
              Icons.notifications_none_rounded,
              AppColors.cableBg,
              AppColors.cableFg,
              'Notifications',
              _notifications,
              (v) => setState(() => _notifications = v),
              onTap: () => _openScreen(const NotificationsScreen()),
            ),
            _divider(),
            ValueListenableBuilder<bool>(
              valueListenable: BiometricController.enabled,
              builder: (context, enabled, _) => _navRow(
                Icons.fingerprint_rounded,
                AppColors.airtimeBg,
                AppColors.airtimeFg,
                'Biometric Login',
                subtitle: enabled ? 'On' : 'Off',
                onTap: () => _openScreen(const BiometricLoginScreen()),
              ),
            ),
            _divider(),
            ValueListenableBuilder<ThemeMode>(
              valueListenable: ThemeController.mode,
              builder: (context, mode, _) => _navRow(
                Icons.dark_mode_outlined,
                AppColors.bettingBg,
                AppColors.primary,
                'Appearance',
                subtitle: ThemeController.label(mode),
                onTap: () => _openScreen(const AppearanceScreen()),
              ),
            ),
          ]),
          const SizedBox(height: 20),
          _sectionLabel('Support'),
          _card([
            _navRow(
              Icons.help_outline_rounded,
              AppColors.dataBg,
              AppColors.dataFg,
              'Help Center',
              onTap: () => _openScreen(const HelpCenterScreen()),
            ),
            _divider(),
            _navRow(
              Icons.card_giftcard_rounded,
              AppColors.bettingBg,
              AppColors.primary,
              'Refer & Earn',
              onTap: () => _openScreen(const ReferEarnScreen()),
            ),
            _divider(),
            _navRow(
              Icons.star_border_rounded,
              AppColors.electricityBg,
              AppColors.electricityFg,
              'Rate the App',
              onTap: () => _openScreen(const RateAppScreen()),
            ),
            _divider(),
            _navRow(
              Icons.info_outline_rounded,
              AppColors.moreBg,
              AppColors.moreFg,
              'About',
              onTap: () => _openScreen(const AboutScreen()),
            ),
          ]),
          const SizedBox(height: 20),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
            ),
            child: ListTile(
              onTap: _confirmLogout,
              leading: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: AppColors.danger.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.logout_rounded,
                  color: AppColors.danger,
                  size: 18,
                ),
              ),
              title: const Text(
                'Log Out',
                style: TextStyle(
                  color: AppColors.danger,
                  fontWeight: FontWeight.w600,
                ),
              ),
              trailing: const Icon(
                Icons.chevron_right_rounded,
                color: AppColors.danger,
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Center(
            child: Text(
              'EmirePay v1.0.0',
              style: TextStyle(color: AppColors.textSecondary),
            ),
          ),
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

  void _openScreen(Widget screen) {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => screen));
  }

  Future<void> _confirmLogout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Log Out'),
        content: const Text(
          'Are you sure you want to log out of your EmirePay account?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: AppColors.danger),
            child: const Text('Log Out'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await FirebaseAuth.instance.signOut();
      if (!mounted) return;
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const OnboardingScreen()),
        (route) => false,
      );
    }
  }

  Widget _navRow(
    IconData icon,
    Color bg,
    Color fg,
    String title, {
    String? subtitle,
    VoidCallback? onTap,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: fg, size: 18),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      subtitle: subtitle != null
          ? Text(subtitle, style: const TextStyle(fontSize: 12))
          : null,
      trailing: const Icon(
        Icons.chevron_right_rounded,
        color: AppColors.textSecondary,
      ),
    );
  }

  Widget _switchRow(
    IconData icon,
    Color bg,
    Color fg,
    String title,
    bool value,
    ValueChanged<bool> onChanged, {
    String? subtitle,
    VoidCallback? onTap,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: fg, size: 18),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      subtitle: subtitle != null ? Text(subtitle) : null,
      trailing: Switch(
        value: value,
        activeThumbColor: AppColors.primary,
        onChanged: onChanged,
      ),
    );
  }
}
