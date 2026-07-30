import 'package:flutter/material.dart';

import '../theme/app_theme.dart';
import 'auth/create_account_screen.dart';
import 'auth/sign_in_screen.dart';

class _OnboardSlide {
  final IconData icon;
  final String title;
  final String subtitle;

  const _OnboardSlide({
    required this.icon,
    required this.title,
    required this.subtitle,
  });
}

const _slides = [
  _OnboardSlide(
    icon: Icons.bolt_rounded,
    title: 'Pay bills in seconds',
    subtitle:
        'Electricity, cable TV, water and more — settled instantly from your phone.',
  ),
  _OnboardSlide(
    icon: Icons.wifi_rounded,
    title: 'Buy airtime & data instantly',
    subtitle: 'Top up any network in seconds, with no hidden fees.',
  ),
  _OnboardSlide(
    icon: Icons.shield_rounded,
    title: 'Bank-grade security',
    subtitle: 'Your money and data are protected with advanced encryption.',
  ),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _index = 0;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6F1),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      children: [
                        const SizedBox(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              'Emire',
                              style: TextStyle(
                                fontSize: 24,
                                fontFamily: 'serif',
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF0F5132),
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.router_rounded,
                              color: Color(0xFF0F5132),
                              size: 20,
                            ),
                          ],
                        ),
                        const Text(
                          'Trusted Fast And Reliable',
                          style: TextStyle(
                            fontSize: 11,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(
                      height: 260,
                      child: PageView.builder(
                        controller: _controller,
                        itemCount: _slides.length,
                        onPageChanged: (i) => setState(() => _index = i),
                        itemBuilder: (context, i) {
                          final slide = _slides[i];
                          return Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 32),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  width: 72,
                                  height: 72,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFDBF0E4),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Icon(
                                    slide.icon,
                                    color: AppColors.primary,
                                    size: 34,
                                  ),
                                ),
                                const SizedBox(height: 28),
                                Text(
                                  slide.title,
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  slide.subtitle,
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                    fontSize: 15,
                                    color: AppColors.textSecondary,
                                    height: 1.4,
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                    Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(_slides.length, (i) {
                            final active = i == _index;
                            return AnimatedContainer(
                              duration: const Duration(milliseconds: 250),
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                              width: active ? 22 : 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: active
                                    ? AppColors.primary
                                    : AppColors.primary.withValues(alpha: 0.25),
                                borderRadius: BorderRadius.circular(4),
                              ),
                            );
                          }),
                        ),
                        const SizedBox(height: 28),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          child: Column(
                            children: [
                              ElevatedButton.icon(
                                onPressed: () => Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => const SignInScreen(),
                                  ),
                                ),
                                icon: const Icon(Icons.login_rounded, size: 18),
                                label: const Text('Login'),
                              ),
                              const SizedBox(height: 12),
                              OutlinedButton(
                                onPressed: () => Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => const CreateAccountScreen(),
                                  ),
                                ),
                                child: const Text('Create Account'),
                              ),
                              const SizedBox(height: 16),
                              const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.lock_rounded,
                                    size: 14,
                                    color: AppColors.textSecondary,
                                  ),
                                  SizedBox(width: 6),
                                  Text(
                                    'Secured by advanced encryption',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
