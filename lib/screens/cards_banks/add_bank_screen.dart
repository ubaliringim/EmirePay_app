import 'package:flutter/material.dart';

import '../../models/bank.dart';
import '../../theme/app_theme.dart';

class AddBankScreen extends StatefulWidget {
  const AddBankScreen({super.key});

  @override
  State<AddBankScreen> createState() => _AddBankScreenState();
}

class _AddBankScreenState extends State<AddBankScreen> {
  String? _bank;
  final _accountCtrl = TextEditingController();
  bool _verifying = false;
  String? _resolvedName;

  @override
  void initState() {
    super.initState();
    _accountCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _accountCtrl.dispose();
    super.dispose();
  }

  Future<void> _verify() async {
    if (_bank == null || _accountCtrl.text.trim().length < 10 || _verifying) return;
    setState(() {
      _verifying = true;
      _resolvedName = null;
    });
    await Future.delayed(const Duration(milliseconds: 800));
    if (!mounted) return;
    setState(() {
      _verifying = false;
      _resolvedName = 'MANNIR AHMAD';
    });
  }

  void _addBank() {
    Navigator.of(context).pop({
      'bank': _bank,
      'account': _accountCtrl.text.trim(),
      'name': _resolvedName,
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Add Bank Account')),
      body: SingleChildScrollView(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 24 + MediaQuery.of(context).padding.bottom),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Select Bank', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
              child: DropdownButtonHideUnderline(
                child: DropdownButtonFormField<String>(
                  initialValue: _bank,
                  isExpanded: true,
                  icon: const Icon(Icons.keyboard_arrow_down_rounded),
                  decoration: const InputDecoration(hintText: 'Choose your bank'),
                  items: nigerianBanks.map((b) => DropdownMenuItem(value: b, child: Text(b))).toList(),
                  onChanged: (value) => setState(() {
                    _bank = value;
                    _resolvedName = null;
                  }),
                ),
              ),
            ),
            const SizedBox(height: 24),
            const Text('Account Number', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _accountCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        hintText: 'Enter 10-digit account number',
                        border: InputBorder.none,
                        filled: false,
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: _verifying
                        ? const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 12),
                            child: SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)),
                          )
                        : TextButton(
                            onPressed: (_bank == null || _accountCtrl.text.trim().length < 10) ? null : _verify,
                            child: const Text('Verify'),
                          ),
                  ),
                ],
              ),
            ),
            if (_resolvedName != null) ...[
              const SizedBox(height: 16),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: const Color(0xFFDCF3E2), borderRadius: BorderRadius.circular(16)),
                child: Row(
                  children: [
                    const Icon(Icons.verified_user_rounded, color: AppColors.success),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Account Verified', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.success)),
                          Text(_resolvedName!, style: const TextStyle(fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _resolvedName != null ? _addBank : null,
              icon: const Icon(Icons.account_balance_rounded, size: 18),
              label: const Text('Add Bank Account'),
            ),
          ],
        ),
      ),
    );
  }
}
