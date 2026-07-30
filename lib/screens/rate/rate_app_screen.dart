import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';

class RateAppScreen extends StatefulWidget {
  const RateAppScreen({super.key});

  @override
  State<RateAppScreen> createState() => _RateAppScreenState();
}

class _RateAppScreenState extends State<RateAppScreen> {
  int _rating = 0;
  final _feedbackCtrl = TextEditingController();
  bool _submitted = false;

  @override
  void dispose() {
    _feedbackCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    if (_rating >= 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Thanks! Redirecting you to the app store...')),
      );
    }
    setState(() => _submitted = true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Rate the App')),
      body: Padding(
        padding: EdgeInsets.fromLTRB(20, 24, 20, 24 + MediaQuery.of(context).padding.bottom),
        child: _submitted ? _thankYouView() : _ratingView(),
      ),
    );
  }

  Widget _ratingView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          width: 88,
          height: 88,
          margin: const EdgeInsets.only(bottom: 20),
          decoration: BoxDecoration(color: AppColors.electricityBg, shape: BoxShape.circle),
          alignment: Alignment.center,
          child: const Icon(Icons.emoji_emotions_outlined, color: AppColors.electricityFg, size: 42),
        ),
        const Text(
          'Enjoying EmirePay?',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        const Text(
          'Let us know how we\'re doing. Your feedback helps us improve.',
          textAlign: TextAlign.center,
          style: TextStyle(color: AppColors.textSecondary),
        ),
        const SizedBox(height: 28),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(5, (i) {
            final filled = i < _rating;
            return IconButton(
              iconSize: 40,
              onPressed: () => setState(() => _rating = i + 1),
              icon: Icon(
                filled ? Icons.star_rounded : Icons.star_border_rounded,
                color: filled ? const Color(0xFFF2C94C) : AppColors.textSecondary,
              ),
            );
          }),
        ),
        if (_rating > 0 && _rating <= 3) ...[
          const SizedBox(height: 20),
          const Text('Tell us how we can improve', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 10),
          TextField(
            controller: _feedbackCtrl,
            maxLines: 4,
            decoration: const InputDecoration(
              hintText: 'What went wrong, or what could be better?',
              alignLabelWithHint: true,
            ),
          ),
        ],
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: _rating > 0 ? _submit : null,
          child: Text(_rating >= 4 ? 'Rate on App Store' : 'Submit Feedback'),
        ),
      ],
    );
  }

  Widget _thankYouView() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(color: AppColors.success.withValues(alpha: 0.12), shape: BoxShape.circle),
          alignment: Alignment.center,
          child: Container(
            width: 70,
            height: 70,
            decoration: const BoxDecoration(color: AppColors.success, shape: BoxShape.circle),
            child: const Icon(Icons.favorite_rounded, color: Colors.white, size: 34),
          ),
        ),
        const SizedBox(height: 24),
        const Text('Thank You!', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text(
          _rating >= 4
              ? 'We appreciate your support in rating EmirePay.'
              : 'Thanks for your feedback — we\'ll use it to make EmirePay better.',
          textAlign: TextAlign.center,
          style: const TextStyle(color: AppColors.textSecondary),
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Done'),
        ),
      ],
    );
  }
}
