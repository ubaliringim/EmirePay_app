import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Shared "biometric login enabled" flag so More, Security & PIN, and the
/// app-launch lock gate all reflect the same state instead of keeping their
/// own local switch. Persisted per-account so the preference survives app
/// restarts but doesn't leak between different users on the same device.
class BiometricController {
  BiometricController._();

  static final ValueNotifier<bool> enabled = ValueNotifier(false);

  static String? get _prefsKey {
    final uid = FirebaseAuth.instance.currentUser?.uid;
    return uid == null ? null : 'biometric_enabled_$uid';
  }

  /// Loads the persisted preference for whoever is currently signed in.
  /// Call this once a Firebase session is known (e.g. on app launch, or
  /// right after sign-in/account creation succeeds).
  static Future<void> loadForCurrentUser() async {
    final key = _prefsKey;
    if (key == null) {
      enabled.value = false;
      return;
    }
    final prefs = await SharedPreferences.getInstance();
    enabled.value = prefs.getBool(key) ?? false;
  }

  static Future<void> setEnabled(bool value) async {
    enabled.value = value;
    final key = _prefsKey;
    if (key == null) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, value);
  }
}
