import 'dart:async';

import 'package:flutter/material.dart';

class PromoBannerData {
  final IconData icon;
  final String title;
  final String subtitle;
  final String actionLabel;
  final List<Color> colors;

  const PromoBannerData({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.actionLabel,
    required this.colors,
  });
}

const promoBanners = [
  PromoBannerData(
    icon: Icons.school_rounded,
    title: 'Pay School Fees',
    subtitle: 'Fast, secure & easy',
    actionLabel: 'Pay Now',
    colors: [Color(0xFF2FA968), Color(0xFF0F5132)],
  ),
  PromoBannerData(
    icon: Icons.wifi_rounded,
    title: 'Buy Data, Save 10%',
    subtitle: 'On all bundles this week',
    actionLabel: 'Buy Data',
    colors: [Color(0xFF4C7DF2), Color(0xFF2F55C4)],
  ),
  PromoBannerData(
    icon: Icons.lightbulb_rounded,
    title: 'Top up Electricity',
    subtitle: 'Pay any disco in seconds',
    actionLabel: 'Top Up',
    colors: [Color(0xFFF2994A), Color(0xFFE08A00)],
  ),
];

class PromoBannerCarousel extends StatefulWidget {
  const PromoBannerCarousel({super.key});

  @override
  State<PromoBannerCarousel> createState() => _PromoBannerCarouselState();
}

class _PromoBannerCarouselState extends State<PromoBannerCarousel> {
  final _controller = PageController();
  int _index = 0;
  Timer? _autoScrollTimer;

  @override
  void initState() {
    super.initState();
    _autoScrollTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      final nextIndex = (_index + 1) % promoBanners.length;
      _controller.animateToPage(
        nextIndex,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    });
  }

  @override
  void dispose() {
    _autoScrollTimer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 110,
          child: PageView.builder(
            controller: _controller,
            itemCount: promoBanners.length,
            onPageChanged: (i) => setState(() => _index = i),
            itemBuilder: (context, i) {
              final banner = promoBanners[i];
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 2),
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: banner.colors),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Icon(banner.icon, color: Colors.white),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            banner.title,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            banner.subtitle,
                            style: const TextStyle(color: Colors.white70, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: banner.colors.last,
                        minimumSize: Size.zero,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 10,
                        ),
                      ),
                      onPressed: () {},
                      child: Text(banner.actionLabel),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(promoBanners.length, (i) {
            final active = i == _index;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: active ? 18 : 6,
              height: 6,
              decoration: BoxDecoration(
                color: active ? Colors.black87 : Colors.black26,
                borderRadius: BorderRadius.circular(3),
              ),
            );
          }),
        ),
      ],
    );
  }
}
