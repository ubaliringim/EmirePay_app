import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';

import '../../theme/app_theme.dart';
import '../home/home_shell.dart';
import '../onboarding_screen.dart';

/// Shown at app launch instead of HomeShell when the signed-in user has
/// biometric login turned on. Gates access to their already-authenticated
/// session behind a fingerprint/face check, with a password fallback.
class BiometricLockScreen extends StatefulWidget {
  const BiometricLockScreen({super.key});

  @override
  State<BiometricLockScreen> createState() => _BiometricLockScreenState();
}

class _BiometricLockScreenState extends State<BiometricLockScreen> {
  final _localAuth = LocalAuthentication();
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _authenticate());
  }

  Future<void> _authenticate() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final authenticated = await _localAuth.authenticate(
        localizedReason: 'Unlock EmirePay',
        biometricOnly: true,
      );
      if (!mounted) return;
      if (authenticated) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const HomeShell()),
          (route) => false,
        );
      } else {
        setState(() => _error = 'Authentication cancelled.');
      }
    } catch (_) {
      if (mounted) setState(() => _error = "Couldn't verify your biometrics.");
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _usePasswordInstead() async {
    await FirebaseAuth.instance.signOut();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const OnboardingScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  color: AppColors.airtimeBg,
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.fingerprint_rounded, color: AppColors.airtimeFg, size: 48),
              ),
              const SizedBox(height: 24),
              const Text(
                'EmirePay is locked',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                _error ?? 'Confirm your fingerprint or face to continue.',
                textAlign: TextAlign.center,
                style: TextStyle(color: _error != null ? AppColors.danger : AppColors.textSecondary),
              ),
              const SizedBox(height: 28),
              ElevatedButton.icon(
                onPressed: _busy ? null : _authenticate,
                icon: _busy
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Icon(Icons.fingerprint_rounded, size: 18),
                label: Text(_busy ? 'Checking...' : 'Try Again'),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: _busy ? null : _usePasswordInstead,
                child: const Text('Use password instead'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
