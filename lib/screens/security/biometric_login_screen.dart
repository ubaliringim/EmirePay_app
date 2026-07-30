import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';

import '../../state/biometric_controller.dart';
import '../../theme/app_theme.dart';

enum _DeviceSupport { checking, supported, unsupported, noneEnrolled }

class BiometricLoginScreen extends StatefulWidget {
  const BiometricLoginScreen({super.key});

  @override
  State<BiometricLoginScreen> createState() => _BiometricLoginScreenState();
}

class _BiometricLoginScreenState extends State<BiometricLoginScreen> {
  final _localAuth = LocalAuthentication();
  _DeviceSupport _support = _DeviceSupport.checking;
  List<BiometricType> _available = const [];
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    _checkSupport();
  }

  Future<void> _checkSupport() async {
    try {
      final deviceSupported = await _localAuth.isDeviceSupported();
      final canCheck = await _localAuth.canCheckBiometrics;
      if (!deviceSupported) {
        setState(() => _support = _DeviceSupport.unsupported);
        return;
      }
      final available = await _localAuth.getAvailableBiometrics();
      setState(() {
        _available = available;
        _support = (canCheck && available.isNotEmpty) ? _DeviceSupport.supported : _DeviceSupport.noneEnrolled;
      });
    } catch (_) {
      setState(() => _support = _DeviceSupport.unsupported);
    }
  }

  String get _biometricLabel {
    if (_available.contains(BiometricType.face)) return 'Face ID';
    if (_available.contains(BiometricType.fingerprint)) return 'fingerprint';
    if (_available.contains(BiometricType.strong) || _available.contains(BiometricType.weak)) {
      return 'device biometrics';
    }
    return 'biometrics';
  }

  Future<void> _enable() async {
    setState(() => _busy = true);
    try {
      final authenticated = await _localAuth.authenticate(
        localizedReason: 'Confirm your identity to enable biometric login',
        biometricOnly: true,
      );
      if (authenticated) {
        await BiometricController.setEnabled(true);
        _showMessage('Biometric login enabled');
      }
    } catch (_) {
      _showMessage('Couldn\'t verify your biometrics — try again or use your PIN.');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _disable() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Turn off biometric login?'),
        content: const Text('You\'ll need to enter your PIN or password to sign in and approve payments.'),
        actions: [
          TextButton(onPressed: () => Navigator.of(context).pop(false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: AppColors.danger),
            child: const Text('Turn Off'),
          ),
        ],
      ),
    );
    if (confirmed == true) {
      await BiometricController.setEnabled(false);
      _showMessage('Biometric login turned off');
    }
  }

  void _showMessage(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Biometric Login')),
      body: ValueListenableBuilder<bool>(
        valueListenable: BiometricController.enabled,
        builder: (context, enabled, _) {
          return ListView(
            padding: EdgeInsets.fromLTRB(20, 24, 20, 24 + MediaQuery.of(context).padding.bottom),
            children: [
              Center(
                child: Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    color: AppColors.airtimeBg,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    enabled ? Icons.fingerprint_rounded : Icons.fingerprint_outlined,
                    color: AppColors.airtimeFg,
                    size: 48,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                enabled ? 'Biometric login is on' : 'Use your fingerprint or face',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                enabled
                    ? 'You can sign in and approve payments with $_biometricLabel. Your PIN still works as a backup.'
                    : 'Sign in and approve payments faster, without typing your PIN every time. Your PIN still works as a backup.',
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.textSecondary),
              ),
              const SizedBox(height: 28),
              _buildStateBody(enabled),
            ],
          );
        },
      ),
    );
  }

  Widget _buildStateBody(bool enabled) {
    switch (_support) {
      case _DeviceSupport.checking:
        return const Center(child: CircularProgressIndicator());
      case _DeviceSupport.unsupported:
        return _infoBanner(
          icon: Icons.block_rounded,
          text: 'This device doesn\'t support biometric authentication.',
        );
      case _DeviceSupport.noneEnrolled:
        return _infoBanner(
          icon: Icons.warning_amber_rounded,
          text: 'No fingerprint or face is set up on this device yet. '
              'Set one up in your phone\'s settings, then come back here.',
        );
      case _DeviceSupport.supported:
        return ElevatedButton(
          onPressed: _busy ? null : (enabled ? _disable : _enable),
          style: enabled
              ? ElevatedButton.styleFrom(backgroundColor: AppColors.danger)
              : null,
          child: _busy
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                )
              : Text(enabled ? 'Turn Off Biometric Login' : 'Enable Biometric Login'),
        );
    }
  }

  Widget _infoBanner({required IconData icon, required String text}) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.electricityBg,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppColors.electricityFg, size: 20),
          const SizedBox(width: 10),
          Expanded(child: Text(text, style: const TextStyle(color: AppColors.electricityFg))),
        ],
      ),
    );
  }
}
