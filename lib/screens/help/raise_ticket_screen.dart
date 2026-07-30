import 'dart:math';

import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';

class RaiseTicketScreen extends StatefulWidget {
  const RaiseTicketScreen({super.key});

  @override
  State<RaiseTicketScreen> createState() => _RaiseTicketScreenState();
}

class _RaiseTicketScreenState extends State<RaiseTicketScreen> {
  static const _subjects = [
    'Wallet funding issue',
    'Failed transaction',
    'Account verification',
    'Bill payment dispute',
    'Other',
  ];

  String? _subject;
  final _descriptionCtrl = TextEditingController();
  bool _screenshotAttached = false;
  bool _submitted = false;
  String _reference = '';

  @override
  void initState() {
    super.initState();
    _descriptionCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _descriptionCtrl.dispose();
    super.dispose();
  }

  bool get _canSubmit => _subject != null && _descriptionCtrl.text.trim().length >= 10;

  void _submit() {
    final rand = Random();
    setState(() {
      _reference = 'TCK-${100000 + rand.nextInt(899999)}';
      _submitted = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Raise a Ticket')),
      body: _submitted ? _successView() : _formView(),
    );
  }

  Widget _formView() {
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Subject', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          Container(
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
            child: DropdownButtonHideUnderline(
              child: DropdownButtonFormField<String>(
                initialValue: _subject,
                isExpanded: true,
                icon: const Icon(Icons.keyboard_arrow_down_rounded),
                decoration: const InputDecoration(hintText: 'What is this about?'),
                items: _subjects.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                onChanged: (value) => setState(() => _subject = value),
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Text('Description', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
          const SizedBox(height: 12),
          TextField(
            controller: _descriptionCtrl,
            maxLines: 6,
            decoration: const InputDecoration(
              hintText: 'Describe the issue in detail...',
              alignLabelWithHint: true,
            ),
          ),
          const SizedBox(height: 16),
          OutlinedButton.icon(
            onPressed: () => setState(() => _screenshotAttached = !_screenshotAttached),
            icon: Icon(_screenshotAttached ? Icons.check_circle_rounded : Icons.attach_file_rounded, size: 18),
            label: Text(_screenshotAttached ? 'Screenshot attached' : 'Attach Screenshot'),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: _canSubmit ? _submit : null,
            child: const Text('Submit Ticket'),
          ),
        ],
      ),
    );
  }

  Widget _successView() {
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(20, 32, 20, 24 + MediaQuery.of(context).padding.bottom),
      child: Column(
        children: [
          Container(
            width: 110,
            height: 110,
            decoration: BoxDecoration(color: AppColors.success.withValues(alpha: 0.12), shape: BoxShape.circle),
            alignment: Alignment.center,
            child: Container(
              width: 76,
              height: 76,
              decoration: const BoxDecoration(color: AppColors.success, shape: BoxShape.circle),
              child: const Icon(Icons.check_rounded, color: Colors.white, size: 38),
            ),
          ),
          const SizedBox(height: 24),
          const Text('Ticket Submitted', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text(
            "Our support team will get back to you within 24 hours.",
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.textSecondary),
          ),
          const SizedBox(height: 20),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Reference', style: TextStyle(color: AppColors.textSecondary)),
                Text(_reference, style: const TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }
}
