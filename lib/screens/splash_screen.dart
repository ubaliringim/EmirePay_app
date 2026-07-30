import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../state/biometric_controller.dart';
import 'home/home_shell.dart';
import 'onboarding_screen.dart';
import 'security/biometric_lock_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  bool _lit = false;

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) setState(() => _lit = true);
    });
    Future.delayed(const Duration(milliseconds: 3000), () async {
      final signedIn = FirebaseAuth.instance.currentUser != null;
      if (signedIn) {
        await BiometricController.loadForCurrentUser();
      }
      if (!mounted) return;

      final Widget destination;
      if (!signedIn) {
        destination = const OnboardingScreen();
      } else if (BiometricController.enabled.value) {
        destination = const BiometricLockScreen();
      } else {
        destination = const HomeShell();
      }

      Navigator.of(
        context,
      ).pushReplacement(MaterialPageRoute(builder: (_) => destination));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6F1),
      body: Stack(
        children: [
          Positioned(
            top: -60,
            right: -40,
            child: _softCircle(220, const Color(0xFFCDEBDA)),
          ),
          Positioned(
            top: 160,
            left: -60,
            child: _softCircle(160, const Color(0xFFDBF0E4)),
          ),
          Center(
            child: AnimatedOpacity(
              opacity: _lit ? 1 : 0.35,
              duration: const Duration(milliseconds: 900),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Emire',
                        style: TextStyle(
                          fontSize: 32,
                          fontFamily: 'serif',
                          fontWeight: FontWeight.w600,
                          color: _lit ? const Color(0xFF0F5132) : Colors.white,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Icon(
                        Icons.router_rounded,
                        color: _lit ? const Color(0xFF0F5132) : Colors.white,
                        size: 26,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 900),
              child: _Skyline(key: ValueKey(_lit), lit: _lit),
            ),
          ),
        ],
      ),
    );
  }

  Widget _softCircle(double size, Color color) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(shape: BoxShape.circle, color: color),
    );
  }
}

class _Skyline extends StatelessWidget {
  final bool lit;

  const _Skyline({super.key, required this.lit});

  @override
  Widget build(BuildContext context) {
    final heights = [110.0, 80.0, 150.0, 220.0, 160.0, 90.0, 130.0, 70.0];
    final dim = const Color(0xFFBFE0CD);
    final bright = const Color(0xFF2E9463);
    final tallest = 220.0;

    return SizedBox(
      width: double.infinity,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (lit)
            const Padding(
              padding: EdgeInsets.only(bottom: 6),
              child: Icon(
                Icons.wifi_rounded,
                color: Color(0xFF2E9463),
                size: 22,
              ),
            ),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.center,
              children: heights.map((h) {
                final isTallest = h == tallest;
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 2),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 4,
                        height: isTallest ? 24 : 12,
                        color: lit ? bright : dim,
                      ),
                      Container(
                        width: 46,
                        height: h,
                        decoration: BoxDecoration(
                          color: isTallest && lit
                              ? bright
                              : (lit ? bright.withValues(alpha: 0.55) : dim),
                          borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(4),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
