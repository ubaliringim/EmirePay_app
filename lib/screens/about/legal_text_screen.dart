import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';

class LegalTextScreen extends StatelessWidget {
  final String title;
  final String body;

  const LegalTextScreen({super.key, required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: Text(title)),
      body: SingleChildScrollView(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
        child: Text(body, style: const TextStyle(height: 1.6, color: AppColors.textPrimary)),
      ),
    );
  }
}
