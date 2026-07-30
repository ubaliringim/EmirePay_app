import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Reusable numeric keypad used by PIN entry flows (Change PIN, Forgot PIN).
class PinKeypad extends StatelessWidget {
  final ValueChanged<String> onDigit;
  final VoidCallback onBackspace;

  const PinKeypad({super.key, required this.onDigit, required this.onBackspace});

  @override
  Widget build(BuildContext context) {
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', '⌫'],
    ];

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: rows.map((row) {
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: row.map((key) {
              if (key.isEmpty) return const SizedBox(width: 76, height: 60);
              final isBackspace = key == '⌫';
              return SizedBox(
                width: 76,
                height: 60,
                child: InkWell(
                  borderRadius: BorderRadius.circular(16),
                  onTap: () => isBackspace ? onBackspace() : onDigit(key),
                  child: Center(
                    child: isBackspace
                        ? const Icon(Icons.backspace_outlined, color: AppColors.textPrimary)
                        : Text(key, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w600)),
                  ),
                ),
              );
            }).toList(),
          ),
        );
      }).toList(),
    );
  }
}

/// Row of 4 PIN dots, filled as digits are entered.
class PinDots extends StatelessWidget {
  final int length;
  final int filled;
  final bool error;

  const PinDots({super.key, required this.length, required this.filled, this.error = false});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(length, (i) {
        final isFilled = i < filled;
        return Container(
          width: 18,
          height: 18,
          margin: const EdgeInsets.symmetric(horizontal: 8),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isFilled ? AppColors.primary : Colors.transparent,
            border: Border.all(
              color: error ? AppColors.danger : AppColors.primary,
              width: 1.5,
            ),
          ),
        );
      }),
    );
  }
}
