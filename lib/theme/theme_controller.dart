import 'package:flutter/material.dart';

/// App-wide appearance preference, shared by the Appearance screen and
/// anything else that needs to read/react to it (e.g. More screen subtitle).
class ThemeController {
  ThemeController._();

  static final ValueNotifier<ThemeMode> mode = ValueNotifier(ThemeMode.system);

  static String label(ThemeMode m) => switch (m) {
        ThemeMode.light => 'Light',
        ThemeMode.dark => 'Dark',
        ThemeMode.system => 'Use device setting',
      };
}
