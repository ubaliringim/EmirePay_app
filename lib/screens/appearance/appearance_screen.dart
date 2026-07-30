import 'package:flutter/material.dart';

import '../../theme/theme_controller.dart';

class AppearanceScreen extends StatelessWidget {
  const AppearanceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Appearance')),
      body: ValueListenableBuilder<ThemeMode>(
        valueListenable: ThemeController.mode,
        builder: (context, mode, _) {
          return ListView(
            padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
            children: [
              Text(
                'Choose how EmirePay looks on this device.',
                style: TextStyle(color: scheme.onSurfaceVariant),
              ),
              const SizedBox(height: 20),
              Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).cardTheme.color,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Column(
                  children: [
                    _option(context, ThemeMode.light, Icons.light_mode_rounded, 'Light',
                        'Bright background, always on', mode),
                    const Divider(height: 1, indent: 16, endIndent: 16),
                    _option(context, ThemeMode.dark, Icons.dark_mode_rounded, 'Dark',
                        'Dimmed colors, easier at night', mode),
                    const Divider(height: 1, indent: 16, endIndent: 16),
                    _option(context, ThemeMode.system, Icons.smartphone_rounded, 'Use device setting',
                        'Matches your phone\'s theme automatically', mode),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              _PreviewCard(mode: mode),
            ],
          );
        },
      ),
    );
  }

  Widget _option(
    BuildContext context,
    ThemeMode value,
    IconData icon,
    String title,
    String subtitle,
    ThemeMode current,
  ) {
    final selected = value == current;
    final scheme = Theme.of(context).colorScheme;
    return ListTile(
      onTap: () => ThemeController.mode.value = value,
      leading: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: scheme.primary.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: scheme.primary, size: 18),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
      trailing: Icon(
        selected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
        color: selected ? scheme.primary : scheme.outline,
      ),
    );
  }
}

class _PreviewCard extends StatelessWidget {
  final ThemeMode mode;

  const _PreviewCard({required this.mode});

  @override
  Widget build(BuildContext context) {
    final resolvedDark = mode == ThemeMode.dark ||
        (mode == ThemeMode.system && MediaQuery.platformBrightnessOf(context) == Brightness.dark);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: resolvedDark ? const Color(0xFF14201A) : Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Theme.of(context).colorScheme.outlineVariant),
      ),
      child: Row(
        children: [
          Icon(Icons.wallet_rounded, color: Theme.of(context).colorScheme.primary),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Preview',
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    color: resolvedDark ? Colors.white : Colors.black87,
                  ),
                ),
                Text(
                  resolvedDark ? 'Dark appearance' : 'Light appearance',
                  style: TextStyle(
                    fontSize: 12,
                    color: resolvedDark ? Colors.white70 : Colors.black54,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
